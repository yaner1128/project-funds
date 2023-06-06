<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="head-container">
      <el-form ref="formRef" :model="form" label-width="100px" :rules="rules" class="formClass">
        <el-form-item label="年度：" prop="year">
          <el-date-picker
            v-model="form.year"
            value-format="YYYY"
            type="year"
            :clearable="false"
            @change="changeYear"
            class="filter-item"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="起止月份：" prop="time">
          <el-date-picker
            v-model="form.time"
            type="monthrange"
            value-format="YYYY-MM"
            :default-value="defaultDate"
            :disabled-date="disabledDateFun"
            range-separator="To"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            class="filter-item"
            size="default"
          />
        </el-form-item>
        <el-form-item label="账套：" prop="accountSetName">
          <el-input
            v-model="form.accountSetName"
            placeholder="请选择账套"
            @click="selectAccount"
            class="filter-item"
            style="width: 200px"
          />
        </el-form-item>
      </el-form>
      <el-button type="primary" class="filter-item" @click="doSimpleQuery">
        <el-icon style="vertical-align: middle">
          <Search />
        </el-icon>
        搜索
      </el-button>
      <el-button class="filter-item" type="primary" @click="importBalance">
        <el-icon><Upload /></el-icon>
        科目余额导入
      </el-button>
    </div>
    <div class="box_wrap">
      <h2 class="tableTitle">科目余额表</h2>
      <!-- 分页 -->
      <Pagination :pageObj="pageObj" :total="total" @search="getData" />
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      :header-cell-style="{
        backgroundColor: '#f3f3f3',
        height: '38px',
        color: '#333',
      }"
      :height="maxHeight"
    >
      <el-table-column prop="ledgerAccountCode" label="科目代码" width="120" />
      <el-table-column prop="ledgerAccountName" label="科目名称" min-width="150" />
      <el-table-column prop="state" label="借/贷" width="100">
        <template #default="{ row }">
          {{
            row.state == 1 ? '借' : ( row.state == 2 ? '贷' : '平')
          }}
        </template>
      </el-table-column>
      <el-table-column prop="initialStageAmount" label="期初余额" min-width="120">
        <template #default="{ row }">
          <span class="stateWarnColor">
            {{
              numFormat(row.initialStageAmount)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="debtorAmount" label="借方发生" min-width="120">
        <template #default="{ row }">
          <span class="stateWarnColor">
            {{
              numFormat(row.debtorAmount)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="lenderAmount" label="贷方发生" min-width="120">
        <template #default="{ row }">
          <span class="stateWarnColor">
            {{
              numFormat(row.lenderAmount)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="aggregateDebtorAmount" label="借方累计" min-width="150">
        <template #default="{ row }">
          <span class="stateWarnColor">
            {{
              numFormat(row.aggregateDebtorAmount)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="aggregateLenderAmount" label="贷方累计" min-width="150">
        <template #default="{ row }">
          <span class="stateWarnColor">
            {{
              numFormat(row.aggregateLenderAmount)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="endingBalance" label="期末余额" min-width="150">
        <template #default="{ row }">
          <span class="stateWarnColor">
            {{
              numFormat(row.endingBalance)
            }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 科目余额导入 -->
    <balance-import-vue ref="balanceImport"></balance-import-vue>
    <!-- 账套选择 -->
    <select-account-vue ref="selectAccountRef" @selected="getSelected"></select-account-vue>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, nextTick } from "vue";
import { ElMessage } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";
import balanceImportVue from "./module/balanceImport.vue";
import { formatDate } from "@/utils/date";
import selectAccountVue from './module/selectAccount.vue'
import { getDsBalance } from "@/api/dataCenter"
import { numFormat, numToTenThousand } from "@/utils/numFormat";

export default defineComponent({
  name: "balance",
  components: {
    Pagination,
    balanceImportVue,
    selectAccountVue
  },
  setup() {
    const selectAccountRef = ref();
    const formRef = ref();
    const data = reactive({
      maxHeight: 400,
      tableData: [],
      total: 0,
      pageObj: {
        page: 0,
        size: 10,
      },
      form: {
        year: formatDate(new Date(), 'yyyy'),
        time:'',
        accountSetCode: "",
        accountSetName: "",
      },
      rules: {
        year: [{ required: true, message: "请选择年度", trigger: "blur" }],
        time: [{ required: true, message: "请选择起止月份", trigger: "blur" }],
        accountSetName: [{ required: true, message: "请选择账套", trigger: "blur" }]
      },
      disabledDateFun: (date: any) =>{
      // 这里我判断的是年份字符串是否等于form表单所选的年份 是则返回false ，否则禁用 返回true 具体根据你们的业务需求来判断
        if (!data.form.year) return false
        const year = date.getFullYear().toString()
        return year !== data.form.year
      },
      defaultDate: [new Date(formatDate(new Date(), 'yyyy')), new Date(formatDate(new Date(), 'yyyy'))]
    });
    const getSelected = (val:any) => {
      console.log(val);
      data.form.accountSetCode = val.accountSetCode;
      data.form.accountSetName = val.accountSetName;
    }

    const selectAccount = () => {
      selectAccountRef.value.open()
    }

    const changeYear = (item:any) => {
      console.log(item)
      data.defaultDate = [new Date(item), new Date(item)]
      data.form.time = ""
    }

    const doSimpleQuery = async () => {
      await formRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          data.pageObj.page = 0;
          getData();
        }
      })
    };
    const getData = () => {
      let params = {
        currentPageIndex: data.pageObj.page + 1,
        pageSize: data.pageObj.size
      }
      let query = {
        accountSetCode : data.form.accountSetCode,
        fiscalYear : data.form.year,
        startMonth : data.form.time[0].split('-')[1],
        endMonth : data.form.time[1].split('-')[1],
      }
      getDsBalance(params, query).then((res) => {
        data.tableData = res.data.records;
        data.total = Number(res.data.total);
      })
    };

    // 设置高度
    const setHeight = () => {
      nextTick(() => {
        data.maxHeight = innerHeight - 345; // 这里的X就是顶部栏的高度
      });
    };
    // 高度自适应
    const autoHeight = () => {
      // 初始化的时候，设置高度
      setHeight();
      // 改变浏览器窗口大小的时候，设置高度
      window.addEventListener("resize", () => {
        setHeight();
      });
    };

    const balanceImport = ref();
    const importBalance = () => {
      setTimeout(() => {
        balanceImport.value.loadShowById();
      }, 50);
    };

    onMounted(() => {
      autoHeight();
    })

    return {
      ...toRefs(data),
      doSimpleQuery,
      getData,
      importBalance,
      balanceImport,
      selectAccountRef,
      formRef,
      changeYear,
      selectAccount,
      getSelected,
      numFormat
    };
  },
});
</script>

<style lang="scss" scoped>
.tableTitle{
  display: flex;
  justify-content: center;
}
.box_wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .account_info{
    font-size: 15px;
    font-weight: 600;
  }
}

.head-container, .formClass {
  display: flex;
}
</style>
