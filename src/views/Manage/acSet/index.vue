<template>
  <div class="app-container">
    <div class="head-container">
      <el-date-picker v-model="query.year" type="year" value-format="YYYY" class="filter-item" placeholder="请选择年份"/>
      <el-input v-model="query.accountSetName" placeholder="请输入账套名称" class="filter-item" style="width: 200px" clearable />
      <el-button type="primary" class="filter-item"  @click="doSimpleQuery">
        搜索
      </el-button>
    </div>
    <el-button v-permission="['ACCOUNTANT']" type="primary" class="tableBtn" @click="addClick">
      <el-icon class="el-icon--left"><Plus /></el-icon>
      添加账套
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
      <el-table-column prop="year" label="账套会计年份" width="150px" />
      <el-table-column prop="accountSetCode" label="账套编号" />
      <el-table-column prop="accountSetName" label="账套名称" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" fixed="right" width="300">
        <template #default="{ row }">
          <el-button link type="primary" class="tableBtn" @click="jumpClick(row.accountSetName)">
            <el-icon class="el-icon--left"><Ticket /></el-icon>查看账目
          </el-button>
          <el-button link type="primary" class="tableBtn" @click="accountSubject(row.accountSetCode)">
            <el-icon class="el-icon--left"><Document /></el-icon>会计科目
          </el-button>
          <el-button link type="primary" class="tableBtn" @click="carryForward(row)">
            <el-icon class="el-icon--left"><Document /></el-icon>结转
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :pageObj="pageObj" :total="total" @search="doSimpleQuery" />
    <!-- 新增账套 -->
    <addView ref="addViewRef" @reload="doSimpleQuery" />
    <!-- 会计科目 -->
    <accountSub ref="accountSubRef" @reload="doSimpleQuery" />
    <!-- 账目 -->
    <account-view-vue ref="accountViewRef" @reload="doSimpleQuery" />
    <!-- 结转 -->
    <entry-manage ref="entryManageRef"></entry-manage>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, nextTick, watch } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { Ticket, Document } from '@element-plus/icons-vue';
import { getAccountSets } from "@/api/dsAccountSets";
import addView from "./module/addView.vue";
import accountSub from './module/accountSub.vue';
import { useRouter } from "vue-router";
import accountViewVue from "./module/accountView.vue";
import EntryManage from "./module/EntryManage/index.vue"

export default defineComponent({
  name: "acSet",
  components: {
    Pagination,
    Ticket,
    Document,
    addView,
    accountSub,
    accountViewVue,
    EntryManage
  },
  setup() {
    const router = useRouter();
    const data = reactive({
      maxHeight: 500,
      query: {
        year: '',
        accountSetName: ''
      },
      tableData: [],
      pageObj: {
        page: 1,
        size: 10
      },
      total: 0
    });
    // 查询
    const doSimpleQuery = () => {
      const params = Object.assign({
        currentPageIndex: data.pageObj.page,
        pageSize: data.pageObj.size
      }, data.query)
      getAccountSets(params).then((res: any) => {
        data.tableData = res.data.records;
        data.total = Number(res.data.total);
      })
    }
    // 新增账套
    const addViewRef = ref();
    const addClick = () => {
      addViewRef.value.open();
    }
    // 会计科目
    const accountSubRef = ref();
    const accountSubject = (accountSetCode: any) => {
      accountSubRef.value.open(accountSetCode);
    }
    // 结转
    const entryManageRef = ref();
    const carryForward = (row: any) => {
      console.log("结转", row)
      entryManageRef.value.open(row.accountSetCode);
    }
    // 跳转
    const accountViewRef = ref();
    const jumpClick = (accountSetName: any, accountSetCode: any) => {
      accountViewRef.value.open(accountSetName, accountSetCode)
      // router.push({ path: '/accounting/index', query: { accountSetName: accountSetName } })
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
      doSimpleQuery();
      autoHeight();
    })

    return {
      addViewRef,
      accountSubRef,
      ...toRefs(data),
      doSimpleQuery,
      addClick,
      accountSubject,
      jumpClick,
      accountViewRef,
      carryForward,
      entryManageRef
    };
  },
});
</script>

<style lang="scss" scoped>
.tableBtn{
  margin-bottom: 5px;
}
</style>
