<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="600px"
    title="添加账套"
    :before-close="resetForm"
  >
    <div class="dialog_container">
      <el-form ref="addFormRef" :model="addForm" label-width="120px" :rules="rules">
        <el-form-item label="账套会计年份：" prop="year">
          <el-date-picker v-model="addForm.year" type="year" value-format="YYYY" placeholder="请选择账套会计年份"/>
        </el-form-item>
        <el-form-item label="账套编码：" prop="accountSetCode">
          <el-input v-model="addForm.accountSetCode" placeholder="请输入账套编码" />
        </el-form-item>
        <el-form-item label="账套名称：" prop="accountSetName">
          <el-input v-model="addForm.accountSetName" placeholder="请输入账套名称" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="addForm.remark" placeholder="请输入备注" :autosize="{ minRows: 5 }" type="textarea" />
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
import Pagination from "@/components/Pagination/index.vue";
import { addAccountSets } from "@/api/dsAccountSets";
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
      addForm: {
        year: '',
        accountSetCode: '',
        accountSetName: '',
        remark: ''
      },
      rules: {
        year: [{ required: true, message: "请选择账套会计年份", trigger: "change" }],
        accountSetCode: [{ required: true, message: "请输入账套编号", trigger: "blur" }],
        accountSetName: [{ required: true, message: "请输入账套名称", trigger: "blur" }]
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
    // 添加专户
    const submitClick = async() => {
      await addFormRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          addAccountSets(data.addForm).then((res: any) => {
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
.el-select, .el-input{
  width: 430px;
}
</style>
