<template>
  <div class="app-container">收支总表</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: 'incomeAndExp',
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