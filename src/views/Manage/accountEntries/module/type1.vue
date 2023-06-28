<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    title="定义自动转账凭证会计分录 （方式一）"
    width="800"
    @close="closeEvent"
  >
    <el-row :gutter="20">
      <el-col :span="11" class="left">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" style="width: 100%">
          <el-form-item label="分录号:">
            <el-input v-model="form.journalNumber" disabled />
          </el-form-item>
          <el-form-item label="分录名称:" prop="name">
            <el-input v-model="form.name" clearable />
          </el-form-item>
          <el-form-item label="凭证类型:">
            <el-select v-model="form.type" placeholder="" disabled>
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="凭证摘要:" prop="journalAbs">
            <el-input v-model="form.journalAbs" clearable />
          </el-form-item>
          <el-form-item label="凭证借方:" prop="dirState">
            <el-select v-model="form.dirState" placeholder="" clearable>
              <el-option label="1.转出方" value="1" />
              <el-option label="2.转入方" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="结转内容:" prop="carryDownType">
            <el-select v-model="form.carryDownType" placeholder="" clearable>
              <el-option v-for="item in option" :key="item.value" :label="item.value  + '. ' + item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="">
            <el-checkbox v-model="form.checked1" label="结转辅助项(仅结转已记账辅助项)" />
            <el-checkbox v-model="form.checked2" label="下级科目发生变化后自动增加" />
            <el-checkbox v-model="form.checked3" label="结账前判断是否已结转" />
          </el-form-item> -->
        </el-form>
        <div class="btnList">
          <!-- <el-button type="">转出方选中行过滤</el-button> -->
          <div style="display: flex; justify-content: space-between">
            <el-button type="primary" style="flex: 0 1 50%" @click="depositEvent">存入</el-button>
            <el-button type="" style="flex: 0 1 50%" @click="closeEvent">退出</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="13" class="right">
        <!-- 转出方 -->
        <div class="transferor">
          <el-table
            height="285"
            :data="transferorData"
            border
            :header-cell-style="{
              color: '#333',
            }"
            :row-class-name="selectRows"
            @row-click="handleSelectionChange"
          >
            <el-table-column label="转出方" align="center">
              <el-table-column prop="ledgerAccountCode" label="科目代码" />
              <el-table-column prop="ledgerAccountName" label="科目名称"/>
            </el-table-column>
          </el-table>
        </div>
        <!-- 转入方 -->
        <div class="transferee">
          <el-table
            :data="transferorData"
            border
            :header-cell-style="{
              color: '#333',
            }"
            height="210"
            :row-class-name="transfereeRows"
            @row-click="transfereeClick"
          >
            <el-table-column label="转入方" align="center">
              <el-table-column prop="ledgerAccountCode" label="科目代码" />
              <el-table-column prop="ledgerAccountName" label="科目名称"/>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { getLastJournalNumber, getLedgerAccountsList, addByTypeOne, detailByTypeOne, updateByTypeOne } from "@/api/accountEntrie";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "type1",
  props: {
    asId: {
      type: String
    },
    accountSetCode: {
      type: String
    }
  },
  setup(props, { emit }) {
    const data = reactive({
      dialogVisible: false,
      isEdit: false,
      form: <any>{
        journalType: 1, // 结转方式
        journalNumber: "",
        journalAbs: '', // 摘要
        dirState: '', // 凭证借方
        carryDownType: '', // 结转内容
        outAccounts: [], // 转出方
        inAccounts: [] // 转入方
      },
      rules: {
        name: [{ required: true, message: "请输入会计分录名称", trigger: "blur" }],
        dirState: [{ required: true, message: "请选择凭证借方", trigger: "change" }],
        carryDownType: [{ required: true, message: "请选择结转内容", trigger: "change" }],
      },
      open: (isEdit=false,id?: any) => {
        data.isEdit = isEdit;
        data.dialogVisible = true;
        // 会计科目
        getLedgerAccountsList({ accountSetCode: props.accountSetCode }).then((res: any) => {
          data.transferorData = res.data;
        })
        // 根据分录ID获取详情
        if(isEdit && id) {
          detailByTypeOne({ id: id }).then((res: any) => {
            data.form = res.data;
            // 转出方赋值
            data.selectRowsList = res.data.outAccounts.map((item: any) => {
              return item.ledgerAccountId;
            })
            // 转入方赋值
            data.transfereeSelected = res.data.inAccounts.ledgerAccountId;
          })
        }else{
          // 根据账套Id 获取分录号
          getLastJournalNumber({ asId: props.asId }).then((res: any) => {
            data.form.journalNumber = res.data.lastNumber;
          })
        }
      },
      transferorData: [], // 会计科目
      option: [
        { value: '1', label: '借方期初余额' },
        { value: '2', label: '贷方期初余额' },
        { value: '3', label: '借方期末余额' },
        { value: '4', label: '贷方期末余额' },
        { value: '5', label: '借方发生额' },
        { value: '6', label: '贷方发生额' },
        // { value: '7', label: '借方净额(借方发生-贷方发生)' },
        // { value: '8', label: '贷方净额(贷方发生-借方发生)' },
      ],
      selectRowsList: <any>[], // 已选转出方
      transfereeSelected: null, // 已选转入方
      // 选中的行改变颜色
      // 转出方
      selectRows: ({ row }: any) => {
        let isSelect = false;
        data.selectRowsList.map((item: any) => {
          if (item == row.ledgerAccountId) {
            isSelect = true;
          }
        });
        return isSelect ? "selectCol" : "";
      },
      // 选中数据
      handleSelectionChange: (selection: any) => {
        if(!data.selectRowsList.includes(selection.ledgerAccountId)) {
          data.selectRowsList.push(selection.ledgerAccountId);
          return;
        }
        data.selectRowsList.splice(data.selectRowsList.indexOf(selection.ledgerAccountId), 1)
      },
      // 转入方
      transfereeClick: (selection: any) => {
        if(data.transfereeSelected == selection.ledgerAccountId) {
          data.transfereeSelected = null;
          return;
        }
        data.transfereeSelected = selection.ledgerAccountId;
      },
      transfereeRows: ({ row }: any) => {
        return data.transfereeSelected == row.ledgerAccountId ? "selectCol" : "";
      },
    });
    // 存入
    const formRef = ref();
    const depositEvent = async () => {
      console.log(data.form)
      if(!data.selectRowsList || !Array.isArray(data.selectRowsList) || data.selectRowsList.length<=0) {
        ElMessage.warning('请选择转出方会计科目');
        return;
      }
      if(!data.transfereeSelected) {
        ElMessage.warning('请选择转入方会计科目');
        return;
      }
      // 转出方
      data.form.outAccounts = data.selectRowsList.map((item: any) => {
        return { ledgerAccountId: item }
      })
      // 转入方
      data.form.inAccounts = { ledgerAccountId: data.transfereeSelected };
      
      await formRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          // 新增
          if(!data.isEdit) {
            data.form.asId = props.asId;
            addByTypeOne(data.form).then((res: any) => {
              if(res.code == 200) {
                ElMessage.success('新增成功');
                closeEvent();
                emit('quit');
              }
            })
          }else{
            // 编辑
            console.log(data.form);
            updateByTypeOne(data.form).then((res: any) => {
              if(res.code == 200) {
                ElMessage.success('编辑成功');
                closeEvent();
                emit('quit');
              }
            })
          }
        }
      })
    }
    // 退出
    const closeEvent = () => {
      formRef.value.resetFields();
      data.dialogVisible = false;
      data.transfereeSelected = null;
      data.selectRowsList = [];
    }

    return {
      ...toRefs(data),
      closeEvent,
      formRef,
      depositEvent
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
  .el-form-item{
    margin-bottom: 30px;
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
.btnList {
  display: flex;
  width: 160px;
  flex-direction: column;
  margin-top: 15px;
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
