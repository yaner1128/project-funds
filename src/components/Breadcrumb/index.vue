<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <template v-for="(item,index) in levelList" >
        <el-breadcrumb-item v-if="item.meta.title" :key="item.path">
          <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
          <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
      </template>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watch } from 'vue'
import route from '@/router/routers'

export default defineComponent({
  name: 'Breadcrumb',
  setup() {
    const data = reactive({
      levelList: ref<any>([]),
      getBreadcrumb: () => {
        let matched:any = route.currentRoute.value.matched.filter((item: any) => {
          if (item.name) {
            return true
          }
        })
        const first = matched[0]
        if (first && first.name !== '首页') {
          matched = [{ path: '/dashboard', meta: { title: '首页' }}].concat(matched)
        }
        data.levelList = matched
      },
      pathCompile: (path: any) => {
        // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
        const { params } = route.currentRoute.value
        const pathToRegexp = require('path-to-regexp')
        var toPath = pathToRegexp.compile(path)
        return toPath(params)
      },
      handleLink: (item: { redirect: any; path: any }) => {
        const { redirect, path } = item
        if (redirect) {
          route.push(redirect)
          return
        }
        route.push(data.pathCompile(path))
      }
    })
    const resData = toRefs(data)

    watch(() => route.currentRoute.value, () => {
      data.getBreadcrumb()
    })
    data.getBreadcrumb()

    return {
      ...resData
    }
  }
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      // color: #62738a;
      cursor: text;
    }
  }
</style>
