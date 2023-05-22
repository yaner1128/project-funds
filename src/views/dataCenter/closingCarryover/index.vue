<template>
  <div class="app-container">期末结转</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: 'closingCarryover',
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