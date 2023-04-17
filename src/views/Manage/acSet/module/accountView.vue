<template>
  <el-dialog
    top="10vh"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1100px"
    title="账目列表"
    :before-close="resetForm"
  >
    <el-table
      :data="tableData"
      border
      :header-cell-style="{
        backgroundColor: '#f9f9f9',
        height: '40px',
        color: '#666',
      }"
      show-overflow-tooltip
      @cell-dblclick="viewData"
    >
      <el-table-column prop="certificateNumber" label="记账凭证号" min-width="260" />
      <el-table-column prop="ledgerTime" label="记账时间" width="160" />
      <el-table-column prop="accountSetName" label="账套名称" min-width="200" />
      <el-table-column prop="amount" label="金额" width="140" />
      <el-table-column prop="review" label="复核状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.review == 2 ? 'danger' : row.review == 1 ? 'success' : ''" effect="dark" >
            {{ row.review == 2 ? '已拒绝' : row.review == 1 ? '已复核' : '待复核' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="rejectIllustrate" label="拒绝理由" min-width="240" :show-overflow-tooltip="true" />
    </el-table>
    <!-- 分页 -->
    <Pagination :pageObj="pageObj" :total="total" @search="getData" />
    <template #footer>
      <div style="text-align: right">
        <el-button @click="resetForm" type="primary">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs,nextTick } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { simpleAccountingSubject, addLedgerAccounts } from "@/api/dsAccountSets";
import { ElMessage } from "element-plus";
import { Coordinate } from "@element-plus/icons-vue";
import { getDsLedgerPage, deleteDsLedger, getDsLedgerDetail } from '@/api/bookkeeping';
import { useRouter } from "vue-router";

export default defineComponent({
  name: "accountView",
  components: {
    Pagination,
  },
  setup(props, { emit }) {
    const data = reactive({
      dialogFormVisible: false,
      accountSetCode: null,
      accountSetName: null,
      tableData: [],
      treeData: <any>[],
      addFormVisible: false,
      maxHeight: 400,
      pageObj: {
        page: 1,
        size: 10
      },
      total: 0
    });
    // 打开弹窗
    const open = (accountSetName: any, accountSetCode: any) => {
      data.accountSetName = accountSetName;
      data.accountSetCode = accountSetCode;
      doSimpleQuery();
      data.dialogFormVisible = true;
    };

    // 搜索
    const doSimpleQuery = () => {
      data.pageObj.page = 1;
      getData();
    };
    const getData = () => {
      const params = Object.assign({
        currentPageIndex: data.pageObj.page,
        pageSize: data.pageObj.size
      }, {
        accountSetName: data.accountSetName,
        accountSetCode: data.accountSetCode,
      })
      getDsLedgerPage(params).then((res) => {
        data.tableData = res.data.records;
        data.total = Number(res.data.total);
      })
    };

    const resetForm = () => {
      data.dialogFormVisible = false;
    }

    // 设置高度
    const setHeight = () => {
      nextTick(() => {
        data.maxHeight = innerHeight - 340; // 这里的X就是顶部栏的高度
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
    })

    return {
      ...toRefs(data),
      open,
      getData,
      resetForm
    };
  },
});
</script>

<style lang="scss" scoped>
.scrollbar {
  height: calc(100vh - 173px);
}
.el-select, .el-input{
  width: 430px;
}
</style>
