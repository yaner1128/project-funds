<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    title="定义数据来源公式"
    width="800"
    :close-on-click-modal="false"
  >
    <div class="header">
      <div>公式&nbsp;=&nbsp;</div>
      <el-card class="box-card">
      </el-card>
    </div>
    <el-row :gutter="20">
      <el-col :span="11" class="left">
        <!-- 转出方 -->
        <div class="transferor">
          <el-table
            height="390"
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
      </el-col>
      <el-col :span="13" class="right">
        <!-- 转入方 -->
        <div class="transferee">
          <el-table
            :data="transfereeData"
            border
            :header-cell-style="{
              backgroundColor: '#f8f8f8',
              height: '30px',
              color: '#333',
            }"
            height="230"
            :row-class-name="transfereeRows"
            @row-click="transfereeClick"
          >
            <el-table-column prop="code" label="科目代码" />
            <el-table-column prop="name" label="科目名称"/>
          </el-table>
          <el-row :gutter="13">
            <el-col :span="11" class="left">
              <div style="margin-top: 30px;">
                <el-button plain class="box-btn">+</el-button>
                <el-button plain class="box-btn">x</el-button>
                <el-button plain class="box-btn">/</el-button>
                <el-button plain class="box-btn">(</el-button>
                <el-button plain class="box-btn">-</el-button>
                <el-button plain class="box-btn">)</el-button>
              </div>
            </el-col>
            <el-col :span="13" class="right">
              <div class="btnList">
                <el-button type="primary">确认</el-button>
                <el-button type="primary">退出</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import voucherVue from "./voucher.vue";

export default defineComponent({
  name: "sourceAmount",
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
    const closeEvent = () => {
      data.form = {
        name: ''
      }
      data.dialogVisible = false;
      data.transfereeSelected = null;
      data.selectRowsData = null;
      emit('quit');
    }

    return {
      ...toRefs(data),
      closeEvent,
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
  justify-content: space-between;
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
  margin: 40px auto;
  .el-button {
    margin: 0;
    margin-bottom: 10px;
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

.header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.box-card {
  width: 700px;
  height: 50px;
}

.box-btn {
  width: 70px;
  margin: 0 0 10px 10px;
}
</style>

