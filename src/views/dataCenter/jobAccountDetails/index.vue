<template>
  <div class="app-container">岗位账户明细表</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: 'jobAccountDetails',
  setup(){
    const data = reactive({

    })

    return {
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>