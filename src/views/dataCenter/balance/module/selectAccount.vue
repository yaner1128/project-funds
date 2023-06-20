<template>
  <el-dialog
    top="100px"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1000px"
    title="选择账套"
    :before-close="resetForm"
  >
    <div class="dialog_container">
      <el-date-picker v-model="query.year" type="year" value-format="YYYY" class="filter-item" placeholder="请选择年份"/>
      <el-input v-model="query.accountSetName" placeholder="请输入账套名称" class="filter-item" style="width: 200px" clearable />
      <el-button type="primary" class="filter-item"  @click="doSimpleQuery">
        搜索
      </el-button>
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
        <vxe-column title="账套会计年份" field="year"></vxe-column>
        <vxe-column title="账套编号" field="accountSetCode"></vxe-column>
        <vxe-column title="账套名称" field="accountSetName"></vxe-column>
        <vxe-column title="备注" field="remark"></vxe-column>
      </vxe-table>
      <!-- 分页 -->
      <Pagination :pageObj="pageObj" :total="total" @search="doSimpleQuery" />
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
import { ElMessage } from "element-plus";
import { getAccountSets } from "@/api/dsAccountSets";

export default defineComponent({
  name: "selectAccount",
  components: {
    Pagination,
  },
  setup(props, { emit }) {
    const data = reactive({
      dialogFormVisible: false,
      query: {
        year: '',
        accountSetName: ''
      },
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
      const params = Object.assign({
        currentPageIndex: data.pageObj.page,
        pageSize: data.pageObj.size,
        hasInit:0
      }, data.query)
      getAccountSets(params).then((res: any) => {
        data.tableData = res.data.records;
        data.total = Number(res.data.total);
      })
    }
    // 关闭
    const resetForm = () => {
      data.dialogFormVisible = false;
    };
    // 确认提交
    const submitClick = async () => {
      if (data.selectRow) { 
        emit('selected', data.selectRow);
        data.dialogFormVisible = false;
      } else {
        ElMessage.warning('请选择账套')
      }
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
      doSimpleQuery
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
