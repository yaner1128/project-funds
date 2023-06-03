<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    title="定义自动转账凭证会计分录 （方式三）"
    width="800"
    :close-on-click-modal="false"
    @close="closeEvent"
  >
    <el-row :gutter="20">
      <el-col :span="11" class="left">
        <el-form :model="form" ref="formRef" label-width="100px" style="width: 100%">
          <el-form-item label="分录号:">
            <el-input v-model="form.name" clearable />
          </el-form-item>
          <el-form-item label="分录名称:">
            <el-input v-model="form.name" clearable />
          </el-form-item>
          <el-form-item label="凭证类型:">
            <el-select v-model="form.name" placeholder="" disabled>
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="凭证摘要:">
            <el-input v-model="form.name" clearable />
          </el-form-item>
          <el-form-item label="凭证借方:">
            <el-select v-model="form.name" placeholder="" clearable>
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="结转内容:">
            <el-select v-model="form.name" placeholder="" clearable>
              <el-option v-for="item in option" :key="item.value" :label="item.value  + '. ' + item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btnList">
          <el-button type="primary">转出方选中行过滤</el-button>
          <div style="display: flex; justify-content: space-between">
            <el-button type="primary" style="flex: 0 1 50%" @click="depositEvent">存入</el-button>
            <el-button type="primary" style="flex: 0 1 50%" @click="closeEvent">退出</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="13" class="right">
        <!-- 转出方 -->
        <div class="transferor">
          <div class="title">转出方</div>
          <el-table
            height="230"
            :data="transferorData"
            border
            :header-cell-style="{
              backgroundColor: '#f8f8f8',
              height: '30px',
              color: '#333',
            }"
            :row-class-name="selectRows"
            @row-click="handleSelectionChange"
          >
            <el-table-column prop="code" label="科目代码" />
            <el-table-column prop="name" label="科目名称"/>
          </el-table>
        </div>
        <!-- 转入方 -->
        <div class="transferee">
          <div class="title">转入方</div>
          <el-table
            :data="transfereeData"
            border
            :header-cell-style="{
              backgroundColor: '#f8f8f8',
              height: '30px',
              color: '#333',
            }"
            height="160"
            :row-class-name="transfereeRows"
            @row-click="transfereeClick"
          >
            <el-table-column prop="code" label="科目代码" />
            <el-table-column prop="name" label="科目名称"/>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button type="primary">存入</el-button>
        <el-button type="primary">退出</el-button>
      </span>
    </template> -->
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import voucherVue from "./voucher.vue";

export default defineComponent({
  name: "type3",
  components: {
    voucherVue
  },
  props: {
    accountSetCode: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const data = reactive({
      dialogVisible: false,
      open: () => {
        data.dialogVisible = true;
      },
      form: {
        name: ""
      },
      transferorData: [
        {code: '102', name: '银行存款'},
        {code: '10201', name: '工行(3925)'},
        {code: '1020101', name: '企业基本养老保险基金存款'},
        {code: '10203', name: '建行(0096)'},
        {code: '1020302', name: '失业保险基金存款'},
        {code: '1020303', name: '工伤保险基金存款'},
        {code: '1020304', name: '生育保险资金'},
      ],
      transfereeData: [
        {code: '102', name: '银行存款'},
        {code: '10201', name: '工行(3925)'},
        {code: '1020101', name: '企业基本养老保险基金存款'},
        {code: '10203', name: '建行(0096)'},
        {code: '1020302', name: '失业保险基金存款'},
      ],
      option: [
        { value: '1', label: '借方期初余额' },
        { value: '2', label: '贷方期初余额' },
        { value: '3', label: '借方期末余额' },
        { value: '4', label: '贷方期末余额' },
        { value: '5', label: '借方发生额' },
        { value: '6', label: '贷方发生额' },
        { value: '7', label: '借方净额(借方发生-贷方发生)' },
        { value: '8', label: '贷方净额(贷方发生-借方发生)' },
      ],
      selectRowsData: null,
      transfereeSelected: null,
      //选中的行改变颜色
      selectRows: ({ row }: any) => {
        return data.selectRowsData == row.code ? "selectCol" : "";
      },
      // 选中数据
      handleSelectionChange: (selection: any) => {
        if(data.selectRowsData == selection.code) {
          data.selectRowsData = null;
          return;
        }
        data.selectRowsData = selection.code;
      },
      transfereeClick: (selection: any) => {
        if(data.transfereeSelected == selection.code) {
          data.transfereeSelected = null;
          return;
        }
        data.transfereeSelected = selection.code;
      },
      transfereeRows: ({ row }: any) => {
        return data.transfereeSelected == row.code ? "selectCol" : "";
      },
    });
    // 存入
    const voucherRef = ref();
    const depositEvent = () => {
      voucherRef.value.open();
    }
    // 退出
    const formRef = ref();
    const closeEvent = () => {
      data.form = {
        name: ''
      }
      formRef.value.resetFields();
      data.dialogVisible = false;
      data.transfereeSelected = null;
      data.selectRowsData = null;
      emit('quit');
    }

    return {
      ...toRefs(data),
      closeEvent,
      formRef,
      depositEvent,
      voucherRef
    };
  },
});
</script>

<style lang="scss" scoped>
.left,.right{
  display: flex;
  flex-direction: column;
  .title{
    text-align: center;
    background-color: #f0f0f0;
    padding: 3px;
    font-size: 15px;
    font-weight: 600;
  }
}
.left{
  align-items: center;
}
.right{
  justify-content: space-between;
}
.transferor{
  margin-bottom: 5px;
}
.el-input,
.el-select {
  width: 240px;
}
.el-form-item {
  margin-bottom: 30px;
}
.btnList {
  display: flex;
  width: 160px;
  flex-direction: column;
  .el-button {
    margin-bottom: 5px;
  }
}
/deep/ .selectCol{
  background-color: #409EFF;
  color: #fff;
}
/deep/ .el-table {
  // 每行鼠标经过得样式
  .el-table__body tr:hover>td{
    background-color: transparent !important;
  }
  .el-table__body tr.current-row>td{
    background-color: transparent !important;
  }
}
</style>

