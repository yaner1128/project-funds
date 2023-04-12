<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1000px"
    title="会计科目"
    :before-close="resetForm"
  >
    <el-table :data="tableData" border>
      <el-table-column prop="ledgerAccountCode" label="会计科目编码" width="180" />
      <el-table-column prop="ledgerAccountName" label="会计科目名称" width="180" />
      <el-table-column prop="accountSetCode" label="账套编码" />
      <el-table-column prop="accountDirection" label="借贷方向" />
    </el-table>
    <template #footer>
      <div style="text-align: right">
        <el-button @click="resetForm" type="primary">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { simpleAccountingSubject } from "@/api/dsAccountSets";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "accountSub",
  components: {
    Pagination,
  },
  setup(props, { emit }) {
    const addFormRef = ref();
    const data = reactive({
      dialogFormVisible: false,
      accountSetCode: null,
      tableData: []
    });
    // 打开弹窗
    const open = (accountSetCode: any) => {
      data.accountSetCode = accountSetCode;
      simpleAccountingSubject({ accountSetCode: accountSetCode }).then(() => {

      })
      data.dialogFormVisible = true;
    };
    // 关闭
    const resetForm = () => {
      data.dialogFormVisible = false;
    };

    return {
      addFormRef,
      ...toRefs(data),
      open,
      resetForm
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
