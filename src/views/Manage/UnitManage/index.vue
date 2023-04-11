<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="单位名称：">
        <el-input v-model="queryForm.agencyName" placeholder="请输入单位名称" />
      </el-form-item>
      <el-form-item label="单位财政编码：">
        <el-input
          v-model="queryForm.agencyCode"
          placeholder="请输入单位财政代码"
        />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="doSimpleQuery">
          <el-icon class="el-icon--left"><Search /></el-icon>
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      :header-cell-style="{
        backgroundColor: '#f8f8f8',
        height: '40px',
        color: '#333',
      }"
    >
      <el-table-column prop="agencyCode" label="单位编码" min-width="180" />
      <el-table-column prop="agencyName" label="单位名称" min-width="180">
        <template #default="{ row }">
          <span class="agencyName" @click="jump(row)">{{ row.agencyName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="账号数" width="180" />
      <el-table-column
        prop="application"
        label="拨款申请数(当年)"
        width="180"
      />
      <el-table-column prop="pendingApproval" label="待审批" width="180" />
      <el-table-column prop="reviewed" label="已审查" width="180" />
      <el-table-column prop="rejected" label="已拒绝" width="180" />
    </el-table>
    <!-- 分页 -->
    <Pagination :pageObj="pageObj" :total="total" @search="doSimpleQuery" />
    <!-- 详情 -->
    <DetailsView ref="detailsRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { getProject } from "@/api/manage";
import Pagination from "@/components/Pagination/index.vue";
import DetailsView from "./module/details.vue";

export default defineComponent({
  name: "UnitManage",
  components: {
    Pagination,
    DetailsView
  },
  setup() {
    const data = reactive({
      loading: false,
      queryForm: {
        agencyName: "",
        agencyCode: "",
      },
      tableData: [],
      total: 0,
      pageObj: {
        page: 0,
        size: 10
      }
    });
    // 搜索
    const doSimpleQuery = () => {
      data.loading = true;
      console.log(Object.assign(data.queryForm, data.pageObj));
      getProject().then((res: any) => {
        data.tableData = res.data.records;
        data.total = res.data.total;
        data.loading = false;
      })
    };
    // 详情
    const detailsRef = ref();
    const jump = ({id}: any) => {
      console.log(detailsRef)
      detailsRef.value.open(id);
    }

    onMounted(() => {
      doSimpleQuery();
    })

    return {
      ...toRefs(data),
      doSimpleQuery,
      detailsRef,
      jump
    };
  },
});
</script>

<style lang="scss" scoped>
.agencyName{
  color: #409EFF;
  cursor: pointer;
}
</style>
