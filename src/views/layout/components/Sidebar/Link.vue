<template>
  <div v-if="isExternalLink(to)">
    <a :href="to" target="_blank">
      <slot />
    </a>
  </div>
  <div v-else>
    <router-link :to="to">
      <slot />
    </router-link>
  </div>
  <!-- <component :is="linkProps(to)" >
    <slot />
  </component> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { isExternal } from '@/utils'

export default defineComponent({
  name: 'Link',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const isExternalLink = (routePath: string) => {
      return isExternal(routePath)
    }
    const linkProps = (url: any) => {
      if (isExternalLink(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }

    return {
      ...props, linkProps, isExternalLink
    }
  }
})
</script>
