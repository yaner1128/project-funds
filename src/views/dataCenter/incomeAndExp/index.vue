<template>
  <div class="app-container">收支总表
    <div class="head-container">
      <el-form
        ref="ruleFormRef"
        :inline="true"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-dynamic"
      >
        <el-form-item prop="year">
          <el-date-picker v-model="ruleForm.year" type="year" value-format="YYYY" class="filter-item" placeholder="请选择年份"/>
        </el-form-item>
        <el-form-item prop="accountSetName">
          <el-input v-model="ruleForm.accountSetName" placeholder="请输入账套名称" class="filter-item" style="width: 200px" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="filter-item" @click="doQuery">
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div
      style="text-align: right; margin-right: 20px"
      :title="'点击切换单位'"
    >
      <span @click="unitConversion" class="unit-conversion">
        <el-icon><sort /></el-icon>
        单位：{{ isConversion ? "元" : "万元" }}
      </span>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      :header-cell-style="{ 'text-align': 'center' }"
      max-height="650px"
    >
      <el-table-column label="收入">
        <el-table-column prop="income" label="收入会计科目">
          <template #default="{ row }">
            <span>
              {{
                row.level === 2 ? "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + row.income
                    : (row.level === 3 ? "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + row.income
                    : row.income)
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="incomeValue"
          label="收入金额"
          align="right"
        >
          <template #default="{ row }">
            <span class="stateWarnColor">
              {{
                isConversion
                  ? numFormat(row.incomeValue)
                  : numFormat(numToTenThousand(row.incomeValue))
              }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="支出">
        <el-table-column prop="expend" label="支出会计科目" >
          <template #default="{ row }">
            <span>
              {{
                row.level === 2 ? "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + row.expend
                    : (row.level === 3 ? "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + row.expend
                    : row.expend)
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="expendValue"
          label="支出金额"
          align="right"
        >
          <template #default="{ row }">
            <span class="stateWarnColor">
              {{
                isConversion
                  ? numFormat(row.expendValue)
                  : numFormat(numToTenThousand(row.expendValue))
              }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { numFormat, numToTenThousand } from "@/utils/numFormat";

export default defineComponent({
  name: 'incomeAndExp',
  setup(){
    const ruleFormRef = ref();
    const data = reactive({
      loading: false,
      isConversion: true,
      tableData: <any>[],
      unitConversion: () => {
        data.isConversion = !data.isConversion;
      },
      ruleForm: {
        year: '',
        accountSetName: ''
      },
      rules: {
        year: [{ required: true, message: "请选择年度", trigger: "blur" }],
        accountSetName: [{ required: true, message: "请输入账套", trigger: "blur" }],
      }
    })

    const doQuery = async () => {
      await ruleFormRef.value.validate((valid: any) => {
        if (valid) {
        
        }
      });
    }

    return {
      ...toRefs(data),
      numFormat,
      numToTenThousand,
      doQuery,
      ruleFormRef
    }
  }
})
</script>

<style lang="scss" scoped>
/deep/ .el-form--inline .el-form-item {
  margin-right: 0px !important;
}
</style>