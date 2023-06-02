<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    title="定义自动转账凭证会计分录 （方式三）"
    width="800"
  >
    333333333333
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary">存入</el-button>
        <el-button type="primary">退出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: 'type3',
  props: {
    accountSetCode: {
      type: String
    }
  },
  setup(){
    const data = reactive({
      dialogVisible: false,
      open: () => {
        data.dialogVisible = true;
      }
    })

    return {
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
