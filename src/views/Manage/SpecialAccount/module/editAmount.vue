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
        <el-form-item label="余额：" prop="modifyAmount">
          <el-input-number v-model="addForm.modifyAmount" :precision="2" :controls="false" placeholder="请输入修正余额" />
        </el-form-item>
        <el-form-item label="修改原因：" prop="remark">
          <el-input v-model="addForm.remark" placeholder="请输入修正原因" :autosize="{ minRows: 5 }" type="textarea" />
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
import { addAccountLog } from "@/api/dsAccounts";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "addView",
  setup(props, { emit }) {
    const addFormRef = ref();
    const data = reactive({
      dialogFormVisible: false,
      accountCode: null,
      addForm: {
        modifyAmount: null,
        remark: '',
      },
      tableData: [],
      pageObj: {
        page: 0,
        size: 10,
      },
      total: 0,
      rules: {
        modifyAmount: [{ required: true, message: "请输入修正金额", trigger: "blur" }],
        remark: [{ required: true, message: "请输入修正原因", trigger: "blur" }],
      }
    });
    // 打开弹窗
    const open = (accountCode: any) => {
      data.accountCode = accountCode;
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
          const params = Object.assign({
            accountCode: data.accountCode
          }, data.addForm)
          addAccountLog(params).then((res: any) => {
            if(res.code === 200) {
              ElMessage.success(res.message);
              resetForm();
              emit('reload')
            }else{
              ElMessage.warning(res.message);
            }
          })
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
/deep/ .el-input-number {
  width: 100%;
  input{
    text-align: left;
    width: 100%;
  }
}
</style>
