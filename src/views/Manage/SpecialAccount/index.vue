<template>
  <div class="app-container">
    <div class="head-container">
      <el-input v-model="query.accountName" placeholder="请输入账号名称" class="filter-item" style="width: 200px" clearable />
      <el-select
        size="mini"
        v-model="query.status"
        placeholder="请选择账号状态"
        class="filter-item"
        clearable
      >
        <el-option
          v-for="item in statusOption"
          :key="item.code"
          :label="item.codeName"
          :value="item.code"
        />
      </el-select>
      <el-button type="primary" class="filter-item"  @click="doSimpleQuery">
        搜索
      </el-button>
    </div>
    <el-button type="primary" class="tableBtn" @click="addClick">
      <el-icon class="el-icon--left"><Plus /></el-icon>
      添加专户
    </el-button>
    <el-table
      :data="tableData"
      border
      :height="maxHeight"
      :header-cell-style="{
        backgroundColor: '#f8f8f8',
        height: '40px',
        color: '#333',
      }"
    >
      <el-table-column prop="accountCode" label="账号" width="240" />
      <el-table-column prop="accountName" label="账号名称" min-width="200" />
      <el-table-column prop="bank" label="开户行" min-width="200" />
      <el-table-column prop="amounts" label="账户余额(单位：元)" width="200" />
      <el-table-column prop="status" label="状态" width="150">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : row.status === '2' ? 'danger' : 'warning'"
            >{{ statusObj[row.status] }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-button v-if="row.status !== -1" link type="primary" class="tableBtn" @click="editAmount(row.accountCode)">
            <el-icon class="el-icon--left"><Ticket /></el-icon>余额修正
          </el-button>
          <el-button link type="primary" class="tableBtn">
            <el-icon class="el-icon--left"><Document /></el-icon>查看报表
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :pageObj="pageObj" :total="total" @search="doSimpleQuery" />
    <!-- 新增专户 -->
    <addView ref="addViewRef" @reload="doSimpleQuery" />
    <!-- 余额修正 -->
    <editAmount ref="editAmountRef"  @reload="doSimpleQuery" />
  </div>
</template> 

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, nextTick } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import addView from './module/addView.vue';
import { Ticket, Document } from '@element-plus/icons-vue';
import editAmount from './module/editAmount.vue';
import { getDsAccountsPage, getAccountsStatus } from "@/api/dsAccounts";

export default defineComponent({
  name: "SpecialAccount",
  components: {
    Pagination,
    addView,
    editAmount,
    Ticket,
    Document
  },
  setup() {
    const data = reactive({
      maxHeight: 500,
      agencyName: "溆浦县城乡建设局",
      statusOption: [],
      statusObj: {},
      query: {
        accountName: '',
        status: ''
      },
      tableData: [],
      pageObj: {
        page: 0,
        size: 10
      },
      total: 0
    });
    // 查询
    const doSimpleQuery = () => {
      getDsAccountsPage({
        currentPageIndex: data.pageObj.page,
        pageSize: data.pageObj.size
      }, data.query).then((res: any) => {
        data.tableData = res.data.records;
        data.total = Number(res.data.total);
      })
    }
    // 新增
    const addViewRef = ref();
    const addClick = () => {
      addViewRef.value.open();
    }
    // 余额修正
    const editAmountRef = ref();
    const editAmount = (accountCode: any) => {
      editAmountRef.value.open(accountCode);
    }
    // 获取下拉数据
    const getCodeData = () => {
      getAccountsStatus().then((res: any) => {
        data.statusOption = res.data;
        let obj = <any>{}
        res.data.forEach((item: any) => {
          obj[item.code] = item.codeName;
        })
        data.statusObj = obj;
      })
    }

    // 设置高度
    const setHeight = () => {
      nextTick(() => {
        data.maxHeight = innerHeight - 355 // 这里的X就是顶部栏的高度
      })
    }
    // 高度自适应
    const autoHeight = () => {
      // 初始化的时候，设置高度
      setHeight()
      // 改变浏览器窗口大小的时候，设置高度
      window.addEventListener('resize', () => {
        setHeight();
      })
    }

    onMounted(() => {
      getCodeData();
      doSimpleQuery();
      autoHeight();
    })

    return {
      addViewRef,
      editAmountRef,
      ...toRefs(data),
      doSimpleQuery,
      addClick,
      editAmount
    };
  },
});
</script>

<style lang="scss" scoped>
// .back {
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   .icon_container {
//     cursor: pointer;
//     padding-right: 10px;
//   }
// }
.tableBtn{
  margin-bottom: 5px;
}
</style>
