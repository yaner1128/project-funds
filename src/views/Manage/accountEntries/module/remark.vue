<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    title="摘要选择"
    width="500"
    :close-on-click-modal="false"
    @close="quitEvent"
  >
    <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
    <el-table
      id="remarkID"
      :data="tableData"
      border
      :height="400"
      :row-class-name="transfereeRows"
      @row-click="transfereeClick"
    >
      <el-table-column prop="code" label="助记码" width="90" />
      <el-table-column prop="codeName" label="摘要" />
      <el-table-column label="操作" width="90">
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
        <el-form-item label="摘要：" prop="codeName">
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
        <el-button type="primary" @click="submitEvent">确认</el-button>
        <el-button type="" @click="quitEvent">退出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { getProjectEleUnionTree, addProjectEleUnion, updateProjectEleUnion, deleteProjectEleUnion } from "@/api/codeManage";

export default defineComponent({
  name: "remark",
  setup(props, { emit }) {
    const formInlineRef = ref();
    const data = reactive({
      dialogVisible: false,
      open: () => {
        data.dialogVisible = true;
        getCodeData();
      },
      tableData: [],
      transfereeSelected: <any>{ codeId: '' },
      transfereeClick: (selection: any) => {
        if (data.transfereeSelected.codeId == selection.codeId) {
          data.transfereeSelected = {codeId: null};
          return;
        }
        data.transfereeSelected = selection;
      },
      transfereeRows: ({ row }: any) => {
        return data.transfereeSelected.codeId == row.codeId ? "selectCol" : "";
      },
      addDialogVisible: false,
      isEdit: false,
      formInline: {
        parentId: "0",
        type: "JOURNAL_ABS",
        abbreviation: "摘要",
        code: "",
        codeName: ""
      },
      rules: {
        code: [{ required: true, message: "请输入助记码", trigger: "blur" }],
        codeName: [{ required: true, message: "请输入摘要", trigger: "blur" }]
      },
      closeClick: () => {
        formInlineRef.value.resetFields();
        data.addDialogVisible = false;
      },
      addSubmit: async () => {
        await formInlineRef.value.validate((valid: any) => {
          if(valid) {
            if(!data.isEdit) {
              addProjectEleUnion(data.formInline).then((res: any) => {
                if(res.code == 200) {
                  ElMessage.success('新增成功');
                  formInlineRef.value.resetFields();
                  data.addDialogVisible = false;
                  getCodeData();
                }
              })
            }else{
              updateProjectEleUnion(data.formInline).then((res: any) => {
                if (res.code === 200) {
                  ElMessage.success(res.message);
                  formInlineRef.value.resetFields();
                  data.addDialogVisible = false;
                  getCodeData();
                }
              });
            }
          }
        })
      },
      editClick: (row: any) => {
        data.isEdit = true;
        data.formInline = { ...row };
        data.addDialogVisible = true;
      },
      deleteClick: (row: any) => {
        deleteProjectEleUnion({ ids: [row.codeId] }).then((res: any) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
            getCodeData();
          }
        });
      }
    });
    const getCodeData = () => {
      getProjectEleUnionTree({ type: 'JOURNAL_ABS' }).then((res: any) => {
        data.tableData = res.data;
      })
    }
    // 确认
    const submitEvent = () => {
      if(!data.transfereeSelected.code) {
        ElMessage.warning('请选择一个摘要');
        return;
      }
      emit('putData', data.transfereeSelected)
      data.dialogVisible = false;
    }
    // 取消
    const quitEvent = () => {
      data.dialogVisible = false;
      data.transfereeSelected = { code: null };
    }

    return {
      ...toRefs(data),
      submitEvent,
      quitEvent,
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
#remarkID {
  // 每行鼠标经过得样式
  /deep/.el-table__body tr:hover>td{
    background-color: transparent !important;
  }
  /deep/.el-table__body tr.current-row>td{
    background-color: transparent !important;
  }
}
</style>
