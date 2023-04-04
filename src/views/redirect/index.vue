<script lang="ts">
import { defineComponent, h, onBeforeUpdate } from 'vue'
import App from '@/App.vue'
import route from '@/router/routers'

export default defineComponent({
  setup(){
    const handleRoute = () => {
      const { params, query } = route.currentRoute.value
      let path = params.path
      if (params.path && Array.isArray(params.path)) {
        path = params.path.join('/')
      }
      route.replace({ path: '/' + path, query })
    }
    handleRoute()
    onBeforeUpdate(() =>{
      handleRoute()
    })
    
    return () => {
      return h(App)
    }
  }
})
</script>
