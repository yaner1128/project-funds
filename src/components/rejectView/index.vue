<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="600px"
    title="拒绝"
    :before-close="resetForm"
  >
    <div class="dialog_container">
      <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="rules" label-position="top">
        <el-form-item label="拒绝理由：" prop="reason">
          <el-input v-model="addForm.reason" placeholder="请输入拒绝理由" :autosize="{ minRows: 10 }" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div style="text-align: right">
        <el-button @click="submitClick" type="primary">确认拒绝</el-button>
        <el-button @click="resetForm" link>取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { getProject } from "@/api/manage";
import Pagination from "@/components/Pagination/index.vue";
import { addAccountLog } from "@/api/dsAccounts";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "addView",
  components: {
    Pagination,
  },
  setup(props, { emit }) {
    const addFormRef = ref();
    const data = reactive({
      dialogFormVisible: false,
      certificateNumber: null,
      addForm: {
        reason: '',
      },
      rules: {
        reason: [{ required: true, message: "请输入拒绝理由", trigger: "blur" }],
      }
    });
    // 打开弹窗
    const open = (certificateNumber: any) => {
      data.certificateNumber = certificateNumber;
      data.dialogFormVisible = true;
    };
    // 关闭
    const resetForm = () => {
      addFormRef.value.resetFields();
      data.dialogFormVisible = false;
    };
    // 拒绝提交
    const submitClick = async() => {
      await addFormRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          emit('putData', data.addForm.reason)
          resetForm();
        }
      })
    };

    return {
      addFormRef,
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
