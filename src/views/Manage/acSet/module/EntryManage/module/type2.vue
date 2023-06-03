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
      <vxe-column field="code" title="科目名称" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.code" type="text" readonly @focus="selectRemark(row, 'code', LedgerAccountRef)"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="code" title="部门" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.code" type="text" readonly></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="code" title="辅助项" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.code" type="text" readonly></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="code" title="借/贷" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.code" type="text" readonly></vxe-input>
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
    <remarkVue ref="remarkRef" @putData="getRemarkData"></remarkVue>
    <LedgerAccountVue ref="LedgerAccountRef"></LedgerAccountVue>
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

export default defineComponent({
  name: 'type2',
  components: {
    remarkVue,
    LedgerAccountVue,
    sourceAmount
  },
  setup(){
    const remarkRef = ref();
    const LedgerAccountRef = ref();
    const sourceAmountRef = ref();
    const data = reactive({
      dialogVisible: false,
      open: () => {
        data.dialogVisible = true;
      },
      formInline: {
        name: ''
      },
      tableData: [{}],
      row: <any>{},
      prop: <any>null,
      selectRemark: (row: any, prop: any, formEl: any) => {
        data.row = row;
        data.prop = prop;
        formEl.open();
      },
      getRemarkData: (row: any) => {
        data.row[data.prop] = row[data.prop];
      }
    })

    return {
      ...toRefs(data),
      remarkRef,
      LedgerAccountRef,
      sourceAmountRef
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
