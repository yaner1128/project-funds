<template>
  <div class="app-container">资产负债表(结转前)</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: 'beforeDebt',
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