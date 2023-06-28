<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    title="定义自动转账凭证会计分录 （方式二）"
    width="1100"
    @close="quitEvent"
    :close-on-click-modal="false"
  >
    <el-form :inline="true" :model="formInline" :rules="rules" ref="formRef">
      <el-form-item label="分录号：">
        <el-input v-model="formInline.journalNumber" disabled />
      </el-form-item>
      <el-form-item label="凭证类型：">
        <el-select v-model="formInline.test" placeholder="" disabled>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="自动转账分录名称：" prop="name">
        <el-input v-model="formInline.name" placeholder="" />
      </el-form-item>
    </el-form>
    <el-button link type="primary" @click="addCell">新增行</el-button>
    <vxe-table
      ref="xTable"
      height="400"
      border
      show-overflow
      :data="tableData"
      :column-config="{ resizable: true }"
      :edit-rules="validRules"
      :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
    >
      <vxe-column type="seq" width="60" title="行号"></vxe-column>
      <vxe-column
        field="rulesAbs"
        title="摘要"
        :edit-render="{ autofocus: '.vxe-input--inner' }"
      >
        <template #edit="{ row }">
          <vxe-input
            v-model="row.rulesAbs"
            type="text"
            readonly
            @focus="selectRemark(row, remarkRef)"
          ></vxe-input>
        </template>
      </vxe-column>
      <vxe-column
        field="ledgerAccountName"
        title="科目名称"
        :edit-render="{ autofocus: '.vxe-input--inner' }"
      >
        <template #edit="{ row }">
          <vxe-input
            v-model="row.ledgerAccountName"
            type="text"
            readonly
            @focus="selectAccount(row, LedgerAccountRef)"
          ></vxe-input>
        </template>
      </vxe-column>
      <!-- <vxe-column field="auxiliary" title="辅助项" :edit-render="{autofocus: '.vxe-input--inner'}">
        <template #edit="{ row }">
          <vxe-input v-model="row.auxiliary" type="text" readonly @focus="selectAuxiliary(row, auxiliaryRef)"></vxe-input>
        </template>
      </vxe-column> -->
      <vxe-column field="rulesAmt" title="结转内容" :edit-render="{}">
        <template #default="{ row }">
          <span v-if="row.rulesAmt">{{ getRulesAmt(row.rulesAmt) }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.rulesAmt" transfer>
            <vxe-option v-for="item in option" :key="item.value" :label="item.value  + '. ' + item.label" :value="item.value"></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="rulesState" title="借/贷" :edit-render="{}">
        <template #default="{ row }">
          <span v-if="row.rulesState">{{
            row.rulesState == 1 ? "借" : row.rulesState == 2 ? "贷" : "平"
          }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.rulesState" transfer>
            <vxe-option value="1" label="借"></vxe-option>
            <vxe-option value="2" label="贷"></vxe-option>
            <vxe-option value="3" label="平"></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="carryAmtExp" title="金额来源公式" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input
            v-model="row.carryAmtExp"
            type="text"
            readonly
            @focus="setCarryAmtExp(row, sourceAmountRef)"
          ></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="carryNumberExp" title="数量来源公式" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.code" type="text" readonly></vxe-input>
        </template>
      </vxe-column>
    </vxe-table>
    <!-- 摘要 -->
    <remarkVue ref="remarkRef" @putData="getRemarkData"></remarkVue>
    <!-- 科目 -->
    <LedgerAccountVue
      ref="LedgerAccountRef"
      :accountSetCode="accountSetCode"
      @putData="getAccountData"
    ></LedgerAccountVue>
    <!-- 辅助项 -->
    <auxiliary ref="auxiliaryRef" :asId="asId" @putData="getAuxiliary"></auxiliary>
    <!-- 金额来源公式 -->
    <sourceAmount ref="sourceAmountRef" :asId="asId" :accountSetCode="accountSetCode" @putData="getCarryAmt"></sourceAmount>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitEvent">存入</el-button>
        <el-button type="" @click="quitEvent">退出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import LedgerAccountVue from "./LedgerAccount.vue";
import remarkVue from "./remark.vue";
import auxiliary from './Auxiliary.vue'
import sourceAmount from "./sourceAmount.vue";
import { ElMessage } from "element-plus";
import { getLastJournalNumber, addByTypeTwo, detailByTypeTwo, updateByTypeTwo } from "@/api/accountEntrie";

export default defineComponent({
  name: "type2",
  props: {
    asId: {
      type: String,
    },
    accountSetCode: {
      type: String
    }
  },
  components: {
    remarkVue,
    LedgerAccountVue,
    sourceAmount,
    auxiliary
  },
  setup(props, { emit }) {
    const remarkRef = ref();
    const LedgerAccountRef = ref();
    const sourceAmountRef = ref();
    const auxiliaryRef = ref();

    const xTable = ref();

    const data = reactive({
      dialogVisible: false,
      isEdit: false,
      formInline: <any>{
        journalType: 2,
        journalNumber: "",
        name: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入会计分录名称", trigger: "blur" },
        ],
      },
      validRules: {
        rulesAbs: [{ required: true, message: "请选择摘要" }],
      },
      open: (isEdit=false, id: any) => {
        data.isEdit = isEdit;
        data.dialogVisible = true;
        // 根据分录ID获取详情
        if(isEdit && id) {
          detailByTypeTwo({ id: id }).then((res: any) => {
            data.formInline = res.data;
            data.tableData = res.data.rules;
          })
        }else{
          // 根据账套Id 获取分录号
          getLastJournalNumber({ asId: props.asId }).then((res: any) => {
            data.formInline.journalNumber = res.data.lastNumber;
          });
        }
      },
      addCell: async () => {
        const $table = xTable.value;
        if ($table) {
          await $table.insertAt({}, 0);
        }
      },
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
      getRulesAmt: (val: any) => {
        const temp = data.option.filter((item: any) => {
          return item.value == val;
        })[0];
        return temp.value + '. ' + temp.label;
      },
      tableData: [],
      row: <any>{},
      // 摘要
      selectRemark: (row: any, formEl: any) => {
        data.row = row;
        formEl.open();
      },
      getRemarkData: (val: any) => {
        data.row.rulesAbs = val.codeName;
      },
      // 会计科目
      selectAccount: (row: any, formEl: any) => {
        data.row = row;
        formEl.open();
      },
      getAccountData: (val: any) => {
        data.row.ledgerAccountCode = val.ledgerAccountCode;
        data.row.ledgerAccountName = val.ledgerAccountName;
        data.row.aid = val.ledgerAccountId;
      },
      // 辅助项
      selectAuxiliary: (row: any, formEl: any) => {
        data.row = row;
        formEl.open({ ...row });
      },
      getAuxiliary: (val: any) => {
        console.log(val);
        data.row.auxiliary = val.name
      },
      // 金额来源公式
      setCarryAmtExp: (row: any, formEl: any) => {
        data.row = row;
        formEl.open();
      },
      getCarryAmt: (val: any) => {
        data.row.carryAmtExp = val;
      }
    });

    const formRef = ref();
    const submitEvent = async () => {
      const $table = xTable.value;
      await formRef.value.validate(async (valid: any, fields: any) => {
        if (valid) {
          const errMap = await $table.validate(true);
          if(errMap) {
            console.log(errMap);
            return;
          }
          data.formInline.rules = $table.getTableData().tableData;
          if(data.formInline.rules<=0) {
            ElMessage.warning("请至少插入一条数据");
            return;
          }
          if(!data.isEdit) {
            data.formInline.asId = props.asId;
            addByTypeTwo(data.formInline).then((res: any) => {
              if(res.code == 200) {
                ElMessage.success('新增成功');
                quitEvent();
                emit('quit');
              }
            })
          }else{
            // 编辑
            console.log(data.formInline);
            console.log(data.tableData);
            updateByTypeTwo(data.formInline).then((res: any) => {
              if(res.code == 200) {
                ElMessage.success('编辑成功');
                quitEvent();
                emit('quit');
              }
            })
          }
        }
      })
    }
    const quitEvent = () => {
      data.dialogVisible = false;
      formRef.value.resetFields();
      data.tableData = [];
    }

    return {
      ...toRefs(data),
      ...toRefs(props),
      xTable,
      remarkRef,
      formRef,
      LedgerAccountRef,
      sourceAmountRef,
      auxiliaryRef,
      submitEvent,
      quitEvent
    };
  },
});
</script>

<style lang="scss" scoped></style>
