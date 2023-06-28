<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    title="定义数据来源公式"
    width="800"
    :close-on-click-modal="false"
  >
    <div class="header">
      <div style="width: 60px">公式&nbsp;=&nbsp;</div>
      <el-input type="textarea" id="content" v-model="value"></el-input>
    </div>
    <el-row :gutter="20">
      <el-col :span="11" class="left">
        <!-- 会计科目 -->
        <div class="transferor">
          <el-table
            height="390"
            :data="accountData"
            border
            :header-cell-style="{
              backgroundColor: '#f8f8f8',
              height: '30px',
              color: '#333',
            }"
            @row-click="accountSelect"
          >
            <el-table-column prop="ledgerAccountCode" label="科目代码" />
            <el-table-column prop="ledgerAccountName" label="科目名称" />
          </el-table>
        </div>
      </el-col>
      <el-col :span="13" class="right">
        <!-- 结转内容 -->
        <div class="transferee">
          <el-table
            :data="optionData"
            border
            :header-cell-style="{
              backgroundColor: '#f8f8f8',
              height: '30px',
              color: '#333',
            }"
            height="230"
            @row-click="insertContent"
            :show-header="false"
          >
            <el-table-column prop="value" label="结转内容" width="70" />
            <el-table-column prop="label" label="结转内容" />
          </el-table>
          <el-row :gutter="13">
            <el-col :span="11" class="left">
              <div style="margin-top: 30px">
                <el-button plain class="box-btn" @click="punctuateEvent('+')">+</el-button>
                <el-button plain class="box-btn" @click="punctuateEvent('x')">x</el-button>
                <el-button plain class="box-btn" @click="punctuateEvent('/')">/</el-button>
                <el-button plain class="box-btn" @click="punctuateEvent('(')">(</el-button>
                <el-button plain class="box-btn" @click="punctuateEvent('-')">-</el-button>
                <el-button plain class="box-btn" @click="punctuateEvent(')')">)</el-button>
              </div>
            </el-col>
            <el-col :span="13" class="right">
              <div class="btnList">
                <el-button type="primary" @click="depositEvent">确认</el-button>
                <el-button type="" @click="closeEvent">退出</el-button>
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
import { getLedgerAccountsList } from "@/api/accountEntrie";

export default defineComponent({
  name: "sourceAmount",
  props: {
    asId: {
      type: String,
    },
    accountSetCode: {
      type: String
    }
  },
  setup(props, { emit }) {
    const data = reactive({
      value: "",
      dialogVisible: false,
      accountData: [], // 会计科目
      optionData: [
        { value: "1", label: "借方期初余额" },
        { value: "2", label: "贷方期初余额" },
        { value: "3", label: "借方期末余额" },
        { value: "4", label: "贷方期末余额" },
        { value: "5", label: "借方发生额" },
        { value: "6", label: "贷方发生额" },
        { value: "7", label: "借方净额(借方发生-贷方发生)" },
        { value: "8", label: "贷方净额(贷方发生-借方发生)" },
      ],
      open: () => {
        data.dialogVisible = true;
        // 会计科目
        getLedgerAccountsList({ accountSetCode: props.accountSetCode }).then((res: any) => {
          data.accountData = res.data;
        });
      },
      accountSelect: (value: any) => {
        data.value += value.ledgerAccountCode + ',';
      },
      insertContent: (value: any) => {
        data.value += value.value;
      },
      punctuateEvent: (value: any) => {
        data.value += value;
      }
    });
    // 存入
    const depositEvent = () => {
      emit('putData', data.value)
      data.dialogVisible = false;
      data.value = "";
    };
    // 退出
    const closeEvent = () => {
      data.dialogVisible = false;
      data.value = "";
    };
    const checkInput = (e: any) => {
      e = e || event;
      if (e.keyCode != 8 && e.keyCode != 46) {
        // 不是删除
        if (e.preventDefault)
          e.preventDefault();
        else e.returnValue = false;
      }
    };

    return {
      ...toRefs(data),
      closeEvent,
      depositEvent,
      checkInput
    };
  },
});
</script>

<style lang="scss" scoped>
.left,
.right {
  display: flex;
  flex-direction: column;
  .title {
    text-align: center;
    background-color: #f0f0f0;
    padding: 3px;
    font-size: 15px;
    font-weight: 600;
  }
}
.left {
  justify-content: space-between;
}
.right {
  justify-content: space-between;
}
.transferor {
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
/deep/ .selectCol {
  background-color: #409eff;
  color: #fff;
}
/deep/ .el-table {
  // 每行鼠标经过得样式
  .el-table__body tr:hover > td {
    background-color: transparent !important;
  }
  .el-table__body tr.current-row > td {
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
