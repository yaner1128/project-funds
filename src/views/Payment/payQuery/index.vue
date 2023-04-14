<template>
  <div class="app-container">
    <div class="head-container">
      <el-input v-model="query.accountSetName" placeholder="请输入单号" class="filter-item" style="width: 200px" clearable />
      <el-button type="primary" class="filter-item"  @click="doSimpleQuery">
        搜索
      </el-button>
    </div>
    <el-button type="primary" class="tableBtn" @click="addClick">
      <el-icon class="el-icon--left"><Plus /></el-icon>
      新增付款申请
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
      <el-table-column prop="allocationCode" label="单号" width="150px" />
      <el-table-column prop="accountSetCode" label="归口股室" />
      <el-table-column prop="prjId" label="所属项目" />
      <el-table-column prop="outaccountcode" label="拨款账户" />
      <el-table-column prop="inaccountcode" label="收款账户" />
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="remark" label="摘要" />
      <el-table-column prop="usepurposeapplication" label="用途" />
      <el-table-column prop="isValid" label="是否已签字通过" />
      <el-table-column prop="validTime" label="签字通过时间" />
      <el-table-column prop="rejectillustrate" label="拒绝理由" />
      <el-table-column label="操作" fixed="right" width="240">
        <template #default="{ row }">
          <el-button link type="primary">
            <el-icon class="el-icon--left"><Postcard /></el-icon>打印
          </el-button>
          <el-button link type="primary">
            <el-icon class="el-icon--left"><EditPen /></el-icon>编辑
          </el-button>
          <el-button link type="primary">
            <el-icon class="el-icon--left"><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :pageObj="pageObj" :total="total" @search="doSimpleQuery" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, nextTick, watch } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { Postcard } from '@element-plus/icons-vue';
import { getDsAllocationReques } from "@/api/dsAccounts";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "payQuery",
  components: {
    Pagination,
    Postcard
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
        page: 0,
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
      getDsAllocationReques(params).then((res: any) => {
        data.tableData = res.data.records;
        data.total = Number(res.data.total);
      })
    }
    // 新增付款申请
    const addClick = () => {
      router.push('/Payment/payApplication');
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
