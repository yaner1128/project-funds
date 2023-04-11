<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1000px"
    title="打印预览"
    :before-close="resetForm"
  >
    <div class="dialog_container">
      
    </div>
    <template #footer>
      <div style="text-align: right">
        <el-button @click="submitClick" type="primary">确认</el-button>
        <el-button @click="resetForm" link>取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { getProject } from "@/api/manage";
import Pagination from "@/components/Pagination/index.vue";

export default defineComponent({
  name: "printfView",
  components: {
    Pagination,
  },
  setup() {
    const data = reactive({
      dialogFormVisible: false,
    });
    // 打开弹窗
    const open = () => {
      data.dialogFormVisible = true;
    };
    // 关闭
    const resetForm = () => {
      data.dialogFormVisible = false;
    };
    // 打印
    const submitClick = async() => {
      
    };

    return {
      ...toRefs(data),
      open,
      resetForm,
      submitClick
    };
  },
});
</script>

<style lang="scss" scoped>
.scrollbar {
  height: calc(100vh - 173px);
}
</style>
