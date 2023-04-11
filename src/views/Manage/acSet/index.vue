<template>
  <div class="app-container">
    <el-button type="primary" class="tableBtn" @click="addClick">
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
      <el-table-column prop="id" label="账套编号" />
      <el-table-column prop="agencyName" label="账套名称" />
      <el-table-column label="操作" fixed="right" width="300">
        <template #default>
          <el-button link type="primary" class="tableBtn">
            <el-icon class="el-icon--left"><Ticket /></el-icon>查看账目
          </el-button>
          <el-button link type="primary" class="tableBtn">
            <el-icon class="el-icon--left"><Document /></el-icon>会计科目
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :pageObj="pageObj" :total="total" @search="doSimpleQuery" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, nextTick } from "vue";
import { getProject } from "@/api/manage";
import Pagination from "@/components/Pagination/index.vue";
import { Ticket, Document } from '@element-plus/icons-vue';
export default defineComponent({
  name: "acSet",
  components: {
    Pagination,
    Ticket,
    Document
  },
  setup() {
    const data = reactive({
      maxHeight: 500,
      tableData: [],
      pageObj: {
        page: 0,
        size: 10
      },
      total: 0
    });
    // 查询
    const doSimpleQuery = () => {
      getProject().then((res: any) => {
        data.tableData = res.data.records;
        data.total = res.data.total;
      })
    }
    // 新增账套
    const addClick = () => {

    }

    // 设置高度
    const setHeight = () => {
      nextTick(() => {
        data.maxHeight = innerHeight - 300 // 这里的X就是顶部栏的高度
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
      ...toRefs(data),
      doSimpleQuery,
      addClick
    };
  },
});
</script>

<style lang="scss" scoped>
.tableBtn{
  margin-bottom: 5px;
}
</style>
