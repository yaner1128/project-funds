<script lang="ts">
import { defineComponent } from 'vue'
import { h } from 'vue'

export default defineComponent({
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return () => {
      const { icon, title } = props
      const vnodes: any[] = []

      // if (icon) {
      //   // vnodes.push(<svg-icon icon-class={icon}/>)
      //   vnodes.push(h('svg-icon', {'class': `${icon}`}))
      // }
      if (title) {
        vnodes.push(h('span', `${title}`))
      }
      return h('span', [vnodes])
    }
  }
})
</script>
