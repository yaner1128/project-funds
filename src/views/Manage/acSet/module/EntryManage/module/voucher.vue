<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    title="记账凭证"
    width="900"
    @close="handleClose"
  >
    <div class="info">
      <span>凭证类型：</span>
    </div>
    <div class="info">
      <span>&nbsp;&nbsp; 凭证号：0037</span>
      <span>2022年12月31日</span>
      <span>附单据 0 张</span>
    </div>
    <el-table
      id="voucherId"
      :data="tableData"
      border
      :header-cell-style="{
        backgroundColor: '#f8f8f8',
        height: '30px',
        color: '#333',
      }"
      max-height="500"
      :row-class-name="transfereeRows"
      @row-click="transfereeClick"
      show-summary
    >
      <el-table-column prop="code" label="摘要" />
      <el-table-column prop="name" label="科目"/>
      <el-table-column prop="amount1" label="借方"/>
      <el-table-column prop="amount2" label="贷方"/>
    </el-table>
    <div class="info">
      <span>记账：xxx</span>
      <span>审核：xxx</span>
      <span>出纳：xxx</span>
      <span>制单：xxx</span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :disabled="!transfereeSelected">当前行科目的明细账</el-button>
        <el-button type="primary">打 印</el-button>
        <el-button type="primary" @click="handleClose">退 出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: 'voucher',
  setup(){
    const data = reactive({
      dialogVisible: false,
      tableData: [
        { amount1: '1', id: 1 },
        { amount1: '2', id: 2 },
        { amount1: '3', id: 3 },
        { amount2: '1', id: 4 },
        { amount2: '2', id: 5 },
        { amount2: '3', id: 6 },
      ],
      transfereeSelected: null,
      open: () => {
        data.dialogVisible = true;
      },
      transfereeClick: (selection: any) => {
        if(data.transfereeSelected == selection.id) {
          data.transfereeSelected = null
          return;
        }
        data.transfereeSelected = selection.id;
      },
      transfereeRows: ({ row }: any) => {
        return data.transfereeSelected == row.id ? "selectCol" : "";
      },
    })

    const handleClose = () => {
      data.dialogVisible = false;
      data.transfereeSelected = null;
    }

    return {
      ...toRefs(data),
      handleClose
    }
  }
})
</script>

<style lang="scss" scoped>
.info{
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}
/deep/ .selectCol{
  background-color: #409EFF;
  color: #fff;
}

#voucherId{
  // 每行鼠标经过得样式
  /deep/ tr:hover>td{
    background-color: transparent !important;
  }
  /deep/ tr.current-row>td{
    background-color: transparent !important;
  }
}
</style>
