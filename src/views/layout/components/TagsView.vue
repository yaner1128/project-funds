<template>
  <div class="tags-view-container" ref="tagsBox">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" :currentInstance="currentInstance">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        :key="tag.path"
        tag="span"
        class="tags-view-item"
        @click.middle="closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag,$event)">
        {{ tag.title }}
      
        <el-icon v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"><close /></el-icon>
        <!-- <span v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" /> -->
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!(selectedTag.meta&&selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive, toRefs, onMounted, watch, nextTick, getCurrentInstance } from 'vue'
import ScrollPane from '@/components/ScrollPane/index.vue'
import path from 'path'
import { constantRouterMap } from '@/router/routers'
import { useStore } from 'vuex'
import route from '@/router/routers'
import { Close } from '@element-plus/icons-vue'

export default defineComponent({
  components: { ScrollPane, Close },
  setup(){
    const scrollPaneRef = ref<HTMLElement|any>()
    const $store = useStore()
    const data = reactive({
      currentInstance: ref<any>(getCurrentInstance()), 
      tagsBox: ref(),
      visible: false,
      top: 0,
      left: 0,
      affixTags: ref<any>([]),
      selectedTag: ref<any>({}),
      isActive: (curRoute: { path: any }) => {
        return curRoute.path === route.currentRoute.value.path
      },
      filterAffixTags: (routes: any[], basePath = '/') =>{
        let tags: any[] = []
        routes.forEach(route => {
          if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path)
            tags.push({
              fullPath: tagPath,
              path: tagPath,
              name: route.name,
              meta: { ...route.meta }
            })
          }
          if (route.children) {
            const tempTags = data.filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
              tags = [...tags, ...tempTags]
            }
          }
        })
        return tags
      },
      initTags: () => {
        const affixTags = data.affixTags = data.filterAffixTags(constantRouterMap)
        for (const tag of affixTags) {
          // Must have tag name
          if (tag.name) {
            $store.dispatch('addVisitedView', tag)
          }
        }
      },
      addViewTags: () => {
        const { name } = route.currentRoute.value
        if (name) {
          $store.dispatch('addView', route.currentRoute.value)
        }
        return false
      },
      moveToCurrentTag:() => {
        const tags = data.currentInstance.proxy.$refs.tag
        nextTick(() => {
          for (const tag of tags) {
            if (tag.to.path === route.currentRoute.value.path) {
              // data.currentInstance.proxy.$refs.scrollPane.moveToTarget(tag)
              scrollPaneRef.value.moveToTarget(tag)
              // when query is different then update
              if (tag.to.fullPath !== route.currentRoute.value.fullPath) {
                $store.dispatch('updateVisitedView', route.currentRoute.value)
              }

              break
            }
          }
        })
      },
      refreshSelectedTag: (view: { fullPath: any }) => {
        $store.dispatch('delCachedView', view).then(() => {
          const { fullPath } = view
          nextTick(() => {
            route.replace({
              path: '/redirect' + fullPath
            })
          })
        })
      },
      closeSelectedTag: (view: { path: any }) => {
        $store.dispatch('delView', view).then(({ visitedViews }) => {
          if (data.isActive(view)) {
            const latestView = visitedViews.slice(-1)[0]
            if (latestView) {
              route.push(latestView)
            } else {
              route.push('/')
            }
          }
        })
      },
      closeOthersTags: () => {
        route.push(data.selectedTag)
        $store.dispatch('delOthersViews', data.selectedTag).then(() => {
          data.moveToCurrentTag()
        })
      },
      closeAllTags: (view: { path: any }) => {
        $store.dispatch('delAllViews').then(({ visitedViews }) => {
          if (data.affixTags.some((tag: { path: any }) => tag.path === view.path)) {
            return
          }
          data.toLastView(visitedViews, view)
        })
      },
      toLastView: (visitedViews: any[], view: { path?: any; name?: any; fullPath?: any }) => {
        const latestView = visitedViews.slice(-1)[0]
        if (latestView) {
          route.push(latestView)
        } else {
          // now the default is to redirect to the home page if there is no tags-view,
          // you can adjust it according to your needs.
          if (view.name === '首页') {
            // to reload home page
            route.replace({ path: '/redirect' + view.fullPath })
          } else {
            route.push('/')
          }
        }
      },
      openMenu: (tag: any, e: { clientX: number; clientY: number }) => {
        const menuMinWidth = 105
        const offsetLeft = data.tagsBox.getBoundingClientRect().left // container margin left
        const offsetWidth = data.tagsBox.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX - offsetLeft + 15 // 15: margin right

        if (left > maxLeft) {
          data.left = maxLeft
        } else {
          data.left = left
        }
        data.top = e.clientY-60
        data.visible = true
        data.selectedTag = tag
      },
      closeMenu: () =>{
        data.visible = false
      }
    })
    const resData = toRefs(data)
    const tagList: any = computed(() => {
      return data.currentInstance.proxy.$refs.tag
    })
    const visitedViews: any = computed(() => {
      return $store.state.tagsView.visitedViews
    })

    onMounted(() => {
      data.initTags()
      data.addViewTags()
    })
    watch(() => data.visible, (value) => {
      if (value) {
        document.body.addEventListener('click', data.closeMenu)
      } else {
        document.body.removeEventListener('click', data.closeMenu)
      }
    })
    watch(() => route.currentRoute.value, () => {
      data.addViewTags()
      data.moveToCurrentTag()
    })

    return {
      ...resData, visitedViews, tagList, scrollPaneRef
    }
  }
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  height: 40px;
  width: 100%;
  background: rgba(232,244,255,0.1);
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  display: flex;
  align-items: center;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 25px;
      line-height: 25px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 11px;
      border-radius: 2px;
      padding: 0 15px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #fff;
        color: #1890ff;
        border: 1px solid #1890ff;
        // &::before {
        //   content: '';
        //   background: #fff;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 2px;
        // }
      }
      &:hover{
        color: #1890ff;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      display: inline-block;
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      svg {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>