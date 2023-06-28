<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :title="accountCode + '&nbsp;&nbsp;'+ '科目核算辅助项'"
    width="600"
    @close="handleClose"
  >
    <el-table
      id="AuxiliaryID"
      :data="tableData"
      border
      :height="400"
      :row-class-name="transfereeRows"
      @row-click="transfereeClick"
    >
      <el-table-column prop="id" label="编 号" />
      <el-table-column prop="name" label="辅助项名称" />
      <el-table-column prop="code" label="助记码" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确认</el-button>
        <el-button type="primary" @click="handleClose">退 出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "Auxiliary",
  setup(props, { emit }) {
    const data = reactive({
      dialogVisible: false,
      accountName: null,
      accountCode: null,
      open: (row: any) => {
        data.accountName = row.accountName;
        data.accountCode = row.accountCode;
        data.dialogVisible = true;
      },
      tableData: [
        { id: 1, name: '测试1', code: '001' },
        { id: 2, name: '测试2', code: '002' },
        { id: 3, name: '测试3', code: '003' },
        { id: 4, name: '测试4', code: '004' }
      ],
      transfereeSelected: <any>{ id: '' },
      transfereeClick: (selection: any) => {
        if (data.transfereeSelected.id == selection.id) {
          data.transfereeSelected = {id: null};
          return;
        }
        data.transfereeSelected = selection;
      },
      transfereeRows: ({ row }: any) => {
        return data.transfereeSelected.id == row.id ? "selectCol" : "";
      },
    });
    // 关闭
    const handleClose = () => {
      data.dialogVisible = false;
      data.transfereeSelected = {id: null};
    };
    // 提交
    const handleSubmit = () => {
      data.dialogVisible = false;
      data.transfereeSelected = {id: null};
    }

    return {
      ...toRefs(data),
      handleClose,
      handleSubmit
    };
  },
});
</script>

<style lang="scss" scoped>
/deep/ .selectCol{
  background-color: #409EFF;
  color: #fff;
}
#AuxiliaryID {
  // 每行鼠标经过得样式
  /deep/.el-table__body tr:hover>td{
    background-color: transparent !important;
  }
  /deep/.el-table__body tr.current-row>td{
    background-color: transparent !important;
  }
}
</style>
