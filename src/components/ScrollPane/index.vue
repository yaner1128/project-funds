<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.prevent="handleScroll">
    <slot/>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
const tagAndTagSpacing = 4 // tagAndTagSpacing

export default defineComponent({
  name: 'ScrollPane',
  props: ['currentInstance'],
  setup (props) {
    const scrollContainer = ref<HTMLElement|any>()
    const data = reactive({
      left: 0,
      handleScroll: (e: { wheelDelta: number; deltaY: number }) => {
        const eventDelta = e.wheelDelta || -e.deltaY * 40
        const $scrollWrapper = scrollContainer.value.wrapRef
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
      },
      moveToTarget(currentTag: any) {
        const $container = scrollContainer.value.$el
        const $containerWidth = $container.offsetWidth
        const $scrollWrapper = scrollContainer.value.wrapRef
        const tagList = props.currentInstance.proxy.$refs.tag

        let firstTag = null
        let lastTag = null
        let prevTag = null
        let nextTag = null

        // find first tag and last tag
        if (tagList.length > 0) {
          firstTag = tagList[0]
          lastTag = tagList[tagList.length - 1]
        }

        // // find preTag and nextTag
        for (let i = 0; i < tagList.length; i++) {
          if (tagList[i] === currentTag) {
            if (i === 0) {
              nextTag = tagList[i].length > 1 && tagList[i + 1]
            } else if (i === tagList.length - 1) {
              prevTag = tagList[i].length > 1 && tagList[i - 1]
            } else {
              prevTag = tagList[i - 1]
              nextTag = tagList[i + 1]
            }
            break
          }
        }

        if (firstTag === currentTag) {
          $scrollWrapper.scrollLeft = 0
        } else if (lastTag === currentTag) {
          $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
        } else {
          // the tag's offsetLeft after of nextTag
          const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

          // the tag's offsetLeft before of prevTag
          const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

          if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
            $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
          } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
            $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
          }
        }
      }
    })
    const resData = toRefs(data)

    return {
      ...resData, scrollContainer
    }
  }
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  /deep/ {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 65px;
    }
  }
}
</style>
