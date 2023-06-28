<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :title="ledgerAccountCode + '&nbsp;&nbsp;'+ '科目核算辅助项'"
    width="600"
    @close="handleClose"
  >
    <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
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
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" @click.stop="editClick(row)">
            <el-icon class="el-icon--left"><EditPen /></el-icon>
          </el-button>
          <el-button link type="primary" @click.stop="deleteClick(row)">
            <el-icon class="el-icon--left"><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="addDialogVisible"
      append-to-body
      :title="isEdit?'编辑':'添加'"
      width="400"
      :close-on-click-modal="false"
      @close="closeClick"
      align-center
    >
      <el-form ref="formInlineRef" :model="formInline" :rules="rules" label-width="80px">
        <el-form-item label="助记码：" prop="code">
          <el-input v-model="formInline.code" placeholder="" />
        </el-form-item>
        <el-form-item label="辅助项名称：" prop="codeName">
          <el-input v-model="formInline.codeName" placeholder="" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeClick">取消</el-button>
          <el-button type="primary" @click="addSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确认</el-button>
        <el-button type="" @click="handleClose">退 出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "Auxiliary",
  props: {
    asId: {
      type: String
    }
  },
  setup(props, { emit }) {
    const formInlineRef = ref();
    const data = reactive({
      dialogVisible: false,
      ledgerAccountName: null,
      ledgerAccountCode: null,
      open: (row: any) => {
        if(!row.ledgerAccountName) {
          ElMessage.warning("请先选择会计科目");
          return;
        }
        data.ledgerAccountName = row.ledgerAccountName;
        data.ledgerAccountCode = row.ledgerAccountCode;
        data.dialogVisible = true;
      },
      tableData: [
        { id: 1, name: '测试1', code: '001' },
        { id: 2, name: '测试2', code: '002' },
        { id: 3, name: '测试3', code: '003' },
        { id: 4, name: '测试4', code: '005' }
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
      addDialogVisible: false,
      isEdit: false,
      formInline: {
        parentId: "0",
        type: "JOURNAL_ABS",
        code: "",
        codeName: ""
      },
      rules: {
        code: [{ required: true, message: "请输入助记码", trigger: "blur" }],
        codeName: [{ required: true, message: "请输入辅助项名称", trigger: "blur" }]
      },
      closeClick: () => {
        formInlineRef.value.resetFields();
        data.addDialogVisible = false;
      },
    });
    // 关闭
    const handleClose = () => {
      data.dialogVisible = false;
      data.transfereeSelected = {id: null};
    };
    // 提交
    const handleSubmit = () => {
      console.log(data.transfereeSelected);
      emit('putData', data.transfereeSelected);
      data.dialogVisible = false;
      data.transfereeSelected = {id: null};
    }

    return {
      ...toRefs(data),
      handleClose,
      handleSubmit,
      formInlineRef
    };
  },
});
</script>

<style lang="scss" scoped>
/deep/ .selectCol{
  background-color: #409EFF;
  color: #fff;
  .el-button{
    color: #fff;
  }
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
