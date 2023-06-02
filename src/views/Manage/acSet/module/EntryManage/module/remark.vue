<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    title="摘要选择"
    width="500"
    :close-on-click-modal="false"
    @close="quitEvent"
  >
    <el-button type="primary" @click="addEvent">添加</el-button>
    <el-table
      id="remarkID"
      :data="tableData"
      border
      :height="400"
      :row-class-name="transfereeRows"
      @row-click="transfereeClick"
    >
      <el-table-column prop="code" label="助记码" />
      <el-table-column prop="name" label="摘要" />
    </el-table>
    <el-dialog
      v-model="addDialogVisible"
      append-to-body
      title="添加摘要"
      width="400"
      :close-on-click-modal="false"
      @close="closeClick"
      align-center
    >
      <el-form ref="formInlineRef" :model="formInline" label-width="70px">
        <el-form-item label="助记码：">
          <el-input v-model="formInline.code" placeholder="" />
        </el-form-item>
        <el-form-item label="摘要：">
          <el-input v-model="formInline.name" placeholder="" />
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
        <el-button type="primary" @click="quitEvent">退出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "remark",
  setup(props, { emit }) {
    const formInlineRef = ref();
    const data = reactive({
      dialogVisible: false,
      open: () => {
        data.dialogVisible = true;
      },
      tableData: [
        { code: "001", name: "税务征收保险费划转财政专户" },
        { code: "002", name: "国库拨机关养老保险基金" },
        { code: "003", name: "国库拨城乡居民养老补助" },
        { code: "004", name: "城乡居民医疗保险费收入" },
        { code: "005", name: "城乡居民医疗救助金" },
      ],
      transfereeSelected: <any>{ code: '' },
      transfereeClick: (selection: any) => {
        if (data.transfereeSelected.code == selection.code) {
          data.transfereeSelected = {code: null};
          return;
        }
        data.transfereeSelected = selection;
      },
      transfereeRows: ({ row }: any) => {
        return data.transfereeSelected.code == row.code ? "selectCol" : "";
      },
      addDialogVisible: false,
      formInline: {
        code: "",
        name: ""
      },
      closeClick: () => {
        data.formInline = {
          code: "",
          name: ""
        };
        formInlineRef.value.resetFields();
        data.addDialogVisible = false;
      },
      addSubmit: () => {
        // 插入新的数据
        formInlineRef.value.resetFields();
        data.addDialogVisible = false;
      }
    });
    // 添加
    const addEvent = () => {
      data.addDialogVisible = true;
    };
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
      data.transfereeSelected = {code: null};
    }

    return {
      ...toRefs(data),
      addEvent,
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
