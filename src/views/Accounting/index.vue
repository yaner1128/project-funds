<template>
  <div class="app-container">
    <div class="head-container">
      <el-input
        v-model="query.accountName"
        placeholder="请输入账号名称"
        class="filter-item"
        style="width: 200px"
        clearable
      />
      <el-button type="primary" class="filter-item" @click="doSimpleQuery">
        搜索
      </el-button>
    </div>
    <el-button type="primary" class="tableBtn" @click="addClick">
      <el-icon class="el-icon--left"><Plus /></el-icon>
      记账
    </el-button>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{
        backgroundColor: '#f9f9f9',
        height: '40px',
        color: '#666',
      }"
    >
      <el-table-column prop="date" label="科目代码" width="180" />
      <el-table-column prop="name" label="科目名称" width="180" />
      <el-table-column prop="address" label="科目特征" />
      <el-table-column prop="address" label="余额方向" />
      <el-table-column prop="address" label="部门核算" />
      <el-table-column prop="address" label="科目类型" />
      <el-table-column label="科目特征">
        <template #default>
          <el-button link type="primary" class="tableBtn" @click="checkClick">
            <el-icon><Coordinate /></el-icon>
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :pageObj="pageObj" :total="total" @search="getData" />
    <!-- 记账 -->
    <addViewVue ref="addViewRef" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  nextTick,
} from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { Coordinate } from "@element-plus/icons-vue";
import addViewVue from './module/addView.vue';

export default defineComponent({
  name: "Accounting",
  components: {
    Pagination,
    Coordinate,
    addViewVue
  },
  setup() {
    const data = reactive({
      query: {
        accountName: "",
      },
      maxHeight: 400,
      tableData: [{}],
      pageObj: {
        page: 0,
        size: 10,
      },
      total: 0,
    });
    // 搜索
    const doSimpleQuery = () => {
      data.pageObj.page = 0;
      getData();
    };
    const getData = () => {};

    // 新增
    const addViewRef = ref();
    const addClick = () => {
      addViewRef.value.open();
    };

    // 复核
    const checkClick = () => {

    }

    // 设置高度
    const setHeight = () => {
      nextTick(() => {
        data.maxHeight = innerHeight - 350; // 这里的X就是顶部栏的高度
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
    });

    return {
      addViewRef,
      ...toRefs(data),
      doSimpleQuery,
      getData,
      addClick,
      checkClick
    };
  },
});
</script>

<style lang="scss" scoped></style>
