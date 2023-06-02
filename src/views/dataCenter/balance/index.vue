<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="head-container">
      <el-input
        v-model="query.account"
        placeholder="请输入明细账户"
        class="filter-item"
        style="width: 200px"
        clearable
      />
      <el-input
        v-model="query.accountCode"
        placeholder="请输入票据代码"
        class="filter-item"
        style="width: 200px"
        clearable
      />
      <el-button type="primary" class="filter-item" @click="doSimpleQuery">
        搜索
      </el-button>
    </div>
    <h2 class="tableTitle">科目余额表</h2>
    <div class="box_wrap">
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
      <el-table-column prop="date" label="科目代码" width="120" />
      <el-table-column prop="date" label="科目名称" min-width="150" />
      <el-table-column prop="date" label="借/贷" width="100" />
      <el-table-column prop="date" label="期初余额" min-width="120" />
      <el-table-column prop="date" label="借方发生" min-width="120" />
      <el-table-column prop="date" label="贷方发生" min-width="120" />
      <el-table-column prop="date" label="借方累计" min-width="150" />
      <el-table-column prop="name" label="贷方累计" min-width="150" />
      <el-table-column prop="name" label="期末余额" min-width="150" />
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, nextTick } from "vue";
import { ElMessage } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";

export default defineComponent({
  name: "balance",
  components: {
    Pagination,
  },
  setup() {
    const data = reactive({
      query: {
        account: "",
        accountCode: "",
      },
      maxHeight: 400,
      tableData: [],
      total: 0,
      pageObj: {
        page: 0,
        size: 10,
      },
    });

    const doSimpleQuery = () => {
      data.pageObj.page = 0;
      getData();
    };
    const getData = () => {
      const params = Object.assign(data.pageObj, data.query)
      console.log('params', params)
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

    onMounted(() => {
      autoHeight();
      doSimpleQuery();
    })

    return {
      ...toRefs(data),
      doSimpleQuery,
      getData,
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
  justify-content: flex-end;
  align-items: center;
  .account_info{
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
