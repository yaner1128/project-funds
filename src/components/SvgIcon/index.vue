<template>
  <div
    v-if="isExternalEvent"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-bind="$attrs"
  />
  <svg
    v-else 
    :class="svgClass" 
    aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
import { isExternal } from "@/utils";
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: false
    },
    className: {
      type: String,
      default: ""
    }
  },
  setup(props){
    const isExternalEvent = computed(() => {
      if (props.iconClass) {
        return isExternal(props.iconClass);
      }
      return ''
    })
    const iconName = computed(() => {
      return `#icon-${props.iconClass}`;
    })
    const svgClass = computed(() => {
      if (props.className) {
        return "svg-icon " + props.className;
      } else {
        return "svg-icon";
      }
    })
    const styleExternalIcon = computed(() => {
      return {
        mask: `url(${props.iconClass}) no-repeat 50% 50%`,
        "-webkit-mask": `url(${props.iconClass}) no-repeat 50% 50%`
      };
    })

    return {
      ...props, isExternalEvent, iconName, svgClass, styleExternalIcon
    }
  }
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
