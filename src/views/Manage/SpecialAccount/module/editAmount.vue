<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="600px"
    title="余额修正"
    :before-close="resetForm"
  >
    <div class="dialog_container">
      <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="rules">
        <el-form-item label="余额：" prop="amount">
          <el-input v-model="addForm.amount" placeholder="" />
        </el-form-item>
        <el-form-item label="修改原因：" prop="reason">
          <el-input v-model="addForm.reason" placeholder="" type="textarea" />
        </el-form-item>
      </el-form>
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
  name: "addView",
  components: {
    Pagination,
  },
  setup() {
    const addFormRef = ref();
    const data = reactive({
      dialogFormVisible: false,
      addForm: {
        amount: '',
        reason: '',
      },
      tableData: [],
      pageObj: {
        page: 0,
        size: 10,
      },
      total: 0,
      rules: {
        amount: [{ required: true, message: "请输入修正金额", trigger: "blur" }],
        reason: [{ required: true, message: "请输入修正原因", trigger: "blur" }],
      }
    });
    // 打开弹窗
    const open = () => {
      data.dialogFormVisible = true;
    };
    // 关闭
    const resetForm = () => {
      addFormRef.value.resetFields();
      data.dialogFormVisible = false;
    };
    // 余额修正提交
    const submitClick = async() => {
      await addFormRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          console.log('校验成功')
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
