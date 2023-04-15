<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="600px"
    title="修改状态"
    :before-close="resetForm"
  >
    <div class="dialog_container">
      <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="rules">
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="addForm.status">
            <el-radio v-for="item in statusOption" :key="item.code" :label="item.code" size="large">{{ item.codeName }}</el-radio>
          </el-radio-group>
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
import { ElMessage } from "element-plus";
import { addAccountLog, getAccountsStatus, updateAccounts } from "@/api/dsAccounts";

export default defineComponent({
  name: "editStatus",
  setup(props, { emit }) {
    const addFormRef = ref();
    const data = reactive({
      dialogFormVisible: false,
      accountCode: null,
      addForm: {
        status: '',
      },
      rules: {
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
      statusOption: []
    });
    // 打开弹窗
    const open = (accountCode: any, status: any) => {
      data.accountCode = accountCode;
      data.addForm.status = status;
      getAccountsStatus().then((res: any) => {
        data.statusOption = res.data;
        data.dialogFormVisible = true;
      })
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
          console.log('校验成功', data.addForm)
          const params = Object.assign({
            accountCode: data.accountCode
          }, data.addForm)
          updateAccounts(params).then((res: any) => {
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
/deep/ .el-input-number input{
  text-align: left;
}
</style>
