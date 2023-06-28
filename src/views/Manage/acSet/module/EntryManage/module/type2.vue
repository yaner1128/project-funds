<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    title="定义自动转账凭证会计分录 （方式二）"
    width="1100"
  >
    <el-form :inline="true" :model="formInline">
      <el-form-item label="分录号：">
        <el-input v-model="formInline.name" />
      </el-form-item>
      <el-form-item label="凭证类型：">
        <el-select v-model="formInline.name" placeholder="" disabled>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="自动转账分录名称：">
        <el-input v-model="formInline.name" placeholder="" />
      </el-form-item>
    </el-form>
    <vxe-table
      height="400"
      border
      show-overflow
      :data="tableData"
      :column-config="{resizable: true}"
      :edit-config="{trigger: 'click', mode: 'cell'}">
      <vxe-column type="seq" width="60" title="行号"></vxe-column>
      <vxe-column field="name" title="摘要" :edit-render="{autofocus: '.vxe-input--inner'}">
        <template #edit="{ row }">
          <vxe-input v-model="row.name" type="text" readonly @focus="selectRemark(row, 'name', remarkRef)"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="accountName" title="科目名称" :edit-render="{autofocus: '.vxe-input--inner'}">
        <template #edit="{ row }">
          <vxe-input v-model="row.accountName" type="text" readonly @focus="selectRemark(row, 'accountName', LedgerAccountRef)"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="departName" title="部门" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-select v-model="row.departName" transfer>
            <vxe-option v-for="item in departData" :key="item.value" :value="item.label" :label="'[' + item.value + '] '+item.label"></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="auxiliary" title="辅助项" :edit-render="{autofocus: '.vxe-input--inner'}">
        <template #edit="{ row }">
          <vxe-input v-model="row.auxiliary" type="text" readonly @focus="selectAuxiliary(row, auxiliaryRef)"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="type" title="借/贷" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-select v-model="row.type" transfer>
            <vxe-option value="借" label="借"></vxe-option>
            <vxe-option value="贷" label="贷"></vxe-option>
            <vxe-option value="两性" label="两性"></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="code" title="金额来源公式" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.code" type="text" readonly @focus="selectRemark(row, 'code', sourceAmountRef)"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="code" title="数量来源公式" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.code" type="text" readonly></vxe-input>
        </template>
      </vxe-column>
    </vxe-table>
    <!-- 摘要 -->
    <remarkVue ref="remarkRef" @putData="getRemarkData"></remarkVue>
    <!-- 科目 -->
    <LedgerAccountVue ref="LedgerAccountRef" @putData="getAccountData"></LedgerAccountVue>
    <!-- 辅助项 -->
    <auxiliary ref="auxiliaryRef"></auxiliary>
    <sourceAmount ref="sourceAmountRef"></sourceAmount>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary">存入</el-button>
        <el-button type="primary">退出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import LedgerAccountVue from "./LedgerAccount.vue";
import remarkVue from "./remark.vue";
import sourceAmount from "./sourceAmount.vue";
import auxiliary from './Auxiliary.vue'
import { ElMessage } from "element-plus";

export default defineComponent({
  name: 'type2',
  components: {
    remarkVue,
    LedgerAccountVue,
    auxiliary,
    sourceAmount
  },
  setup(){
    const remarkRef = ref();
    const LedgerAccountRef = ref();
    const auxiliaryRef = ref();
    const sourceAmountRef = ref();
    const data = reactive({
      dialogVisible: false,
      open: () => {
        data.dialogVisible = true;
      },
      formInline: {
        name: ''
      },
      departData: [
        { id: 1, value: '9953', label: '部门1' },
        { id: 2, value: '9954', label: '部门2' },
        { id: 3, value: '9955', label: '部门3' }
      ],
      tableData: [{}, {}],
      row: <any>{},
      prop: <any>null,
      selectRemark: (row: any, prop: any, formEl: any) => {
        data.row = row;
        data.prop = prop;
        formEl.open();
      },
      getRemarkData: (row: any) => {
        data.row[data.prop] = row[data.prop];
      },
      getAccountData: (row: any) => {
        data.row.accountName = row.label;
        data.row.accountCode = row.value;
      },
      selectAuxiliary: (row: any, formEl: any) => {
        if(!row.accountName) {
          ElMessage.warning('请先选择科目');
          return;
        }
        formEl.open(row);
      }
    })

    return {
      ...toRefs(data),
      remarkRef,
      LedgerAccountRef,
      auxiliaryRef,
      sourceAmountRef
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
