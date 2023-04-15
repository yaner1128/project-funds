<template>
  <el-dialog
    top="100px"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1000px"
    title="选择付款申请"
    :before-close="resetForm"
  >
    <div class="dialog_container">
      <vxe-table
        border
        ref="xTable"
        :height="maxHeight"
        :data="tableData"
        :radio-config="{highlight: true}"
        @radio-change="radioChangeEvent">
        <vxe-column type="radio" width="60">
          <template #header>
            <vxe-button type="text" @click="clearRadioRowEvent" :disabled="!selectRow">取消</vxe-button>
          </template>
        </vxe-column>
        <vxe-column title="单号" field="allocationCode"></vxe-column>
        <vxe-column title="申请股室名" field="allocationMofName"></vxe-column>
        <vxe-column title="所属项目" field="prjName"></vxe-column>
        <vxe-column title="拨款账户" field="outAccountName"></vxe-column>
        <vxe-column title="收款账户" field="inAccountName"></vxe-column>
        <vxe-column title="金额" field="amount"></vxe-column>
        <vxe-column title="摘要" field="remark"></vxe-column>
        <vxe-column title="用途" field="userpurposerapplication"></vxe-column>
      </vxe-table>
      <!-- 分页 -->
      <Pagination :pageObj="pageObj" :total="total" @search="getData" />
    </div>
    <template #footer>
      <div style="text-align: right">
        <el-button @click="submitClick" type="primary">确认</el-button>
        <el-button @click="resetForm" link>取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, nextTick } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { getAccountSets } from "@/api/dsAccountSets";
import { ElMessage } from "element-plus";
import { useStore } from 'vuex';
import { getDsAllocationReques } from "@/api/dsAccounts";

export default defineComponent({
  name: "selectPay",
  components: {
    Pagination,
  },
  setup(props, { emit }) {
    const store = useStore();
    const data = reactive({
      mofDepCode: store.state.user.user.mofDepCode,
      dialogFormVisible: false,
      selectRow: null,
      maxHeight: 400,
      tableData: [],
      pageObj: {
        page: 1,
        size: 10
      },
      total: 0
    });
    // 打开弹窗
    const open = () => {
      getData();
      data.dialogFormVisible = true;
      autoHeight();
    };
    // 勾选
    const xTable = ref();
    const radioChangeEvent = ({ row }: any) => {
      data.selectRow = row;
    }
    const clearRadioRowEvent = () => {
      data.selectRow = null
      xTable.value.clearRadioRow();
    }

    const doSimpleQuery = () => {
      data.pageObj.page = 1;
      getData();
    }
    const getData = () => {
      // 账户
      const params = {
        currentPageIndex: data.pageObj.page,
        pageSize: data.pageObj.size,
        allocationMofCode: data.mofDepCode,
        isAccounting: 0
      };
      getDsAllocationReques(params).then((res: any) => {
        data.tableData = res.data.records;
        data.total = Number(res.data.total);
      })
    }
    // 关闭
    const resetForm = () => {
      data.dialogFormVisible = false;
    };
    // 确认提交
    const submitClick = async() => {
      emit('selected', data.selectRow);
      data.dialogFormVisible = false;
    };

    // 设置高度
    const setHeight = () => {
      nextTick(() => {
        data.maxHeight = innerHeight - 380 // 这里的X就是顶部栏的高度
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

    return {
      xTable,
      ...toRefs(data),
      open,
      resetForm,
      submitClick,
      radioChangeEvent,
      clearRadioRowEvent,
      doSimpleQuery,
      getData
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
