<template>
  <div class="app-container">
    <div class="head-container">
      <el-input v-model="query.accountSetName" placeholder="请输入单号" class="filter-item" style="width: 200px" clearable />
      <el-button type="primary" class="filter-item"  @click="doSimpleQuery">
        搜索
      </el-button>
    </div>
    <el-button type="primary" v-permission="['CASHIER']" class="tableBtn" @click="addClick">
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
      show-overflow-tooltip
      @cell-dblclick="detailView"
    >
      <el-table-column prop="allocationCode" label="单号" min-width="200px" />
      <el-table-column prop="allocationMofName" label="申请股室名" width="180" />
      <el-table-column prop="prjName" label="所属项目" width="150" />
      <el-table-column prop="outAccountName" label="拨款账户" width="200" />
      <el-table-column prop="inAccountName" label="收款账户" width="200" />
      <el-table-column prop="amount" label="金额" width="120" />
      <el-table-column prop="remark" label="摘要" width="150" show-overflow-tooltip />
      <el-table-column prop="userpurposerapplication" label="用途" width="150" show-overflow-tooltip />
      <el-table-column prop="isAccounting" label="是否已记账审核" width="140">
        <template #default="{ row }">
          {{ statusObj[row.isAccounting] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="240">
        <template #default="{ row }">
          <el-button link type="primary" @click="printClick(row.allocationCode)">
            <el-icon class="el-icon--left"><Postcard /></el-icon>打印
          </el-button>
          <el-button link type="primary" v-permission="['CASHIER']" :disabled="row.isAccounting != 0" @click="editClick(row.allocationCode)">
            <el-icon class="el-icon--left"><EditPen /></el-icon>编辑
          </el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            title="确认删除当前行数据吗?"
            @confirm="deleteClick(row.allocationCode)"
          >
            <template #reference>
              <el-button v-permission="['CASHIER']" type="primary" link>
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :pageObj="pageObj" :total="total" @search="doSimpleQuery" />
    <!-- 编辑 -->
    <editViewVue ref="editViewRef" @reload="getData" />
    <!-- 审核 -->
    <checkPageVue ref="checkPageRef" @reload="getData" />
    <!-- 打印 -->
    <printfViewVue ref="printfViewRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, nextTick, watch } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { Postcard, Coordinate } from '@element-plus/icons-vue';
import { getDsAllocationReques, deleteDsAllocation } from "@/api/dsAccounts";
import { useRouter } from "vue-router";
import editViewVue from "./module/editView.vue";
import { ElMessage } from "element-plus";
import checkPageVue from "./module/checkPage.vue";
import printfViewVue from "./module/printfView.vue";
import { useStore } from 'vuex';

export default defineComponent({
  name: "payQuery",
  components: {
    Pagination,
    Postcard,
    Coordinate,
    editViewVue,
    checkPageVue,
    printfViewVue
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const editViewRef = ref();
    const data = reactive({
      maxHeight: 500,
      mofDepCode: store.state.user.user.mofDepCode,
      query: {
        year: '',
        accountSetName: ''
      },
      tableData: [],
      pageObj: {
        page: 1,
        size: 10
      },
      total: 0,
      statusObj: {
        '0': '未记账', 
        '1': '已记账未审核', 
        '2': '已记账已拒绝', 
        '3': '已记账已审核', 
      }
    });
    // 查询
    const doSimpleQuery = () => {
      data.pageObj.page = 1;
      getData();
    }
    const getData = () => {
      const params = Object.assign({
        currentPageIndex: data.pageObj.page,
        pageSize: data.pageObj.size,
        allocationMofCode: data.mofDepCode,
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
    // 详情
    const detailView = (row) => {
      editViewRef.value.open(row.allocationCode, false);
    }
    // 审核
    const checkPageRef = ref();
    const checkClick = (allocationCode: any) => {
      checkPageRef.value.open(allocationCode)
    }
    // 打印
    const printfViewRef = ref();
    const printClick = (allocationCode: any) => {
      printfViewRef.value.open(allocationCode);
    }
    // 编辑
    const editClick = (allocationCode: any) => {
      editViewRef.value.open(allocationCode, true);
    }
    //删除
    const deleteClick = (allocationCode:any) => {
      deleteDsAllocation({ id: allocationCode }).then((res: any) => {
        if(res.code === 200) {
          ElMessage.success('删除成功！');
          doSimpleQuery();
          return
        }
        ElMessage.error(res.message);
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
      doSimpleQuery();
      autoHeight();
    })

    return {
      editViewRef,
      checkPageRef,
      ...toRefs(data),
      doSimpleQuery,
      addClick,
      editClick,
      deleteClick,
      printClick,
      printfViewRef,
      getData,
      detailView,
      checkClick
    };
  },
});
</script>

<style lang="scss" scoped>
.tableBtn{
  margin-bottom: 5px;
}
</style>
