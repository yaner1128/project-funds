<template>
  <div class="app-container">资产负债表(年末结转)</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: 'afterDebt',
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