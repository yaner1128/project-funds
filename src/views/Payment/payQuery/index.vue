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
      show-overflow-tooltip
      @cell-dblclick="detailView"
    >
      <el-table-column prop="allocationCode" label="单号" min-width="200px" />
      <el-table-column prop="allocationMofName" label="申请股室名" width="150" />
      <el-table-column prop="prjName" label="所属项目" width="150" />
      <el-table-column prop="outAccountName" label="拨款账户" width="150" />
      <el-table-column prop="inAccountName" label="收款账户" width="150" />
      <el-table-column prop="amount" label="金额" width="120" />
      <el-table-column prop="remark" label="摘要" width="150" show-overflow-tooltip />
      <el-table-column prop="userpurposerapplication" label="用途" width="150" show-overflow-tooltip />
       <el-table-column prop="isValid" label="审核状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.isValid == 2 ? 'danger' : row.isValid == 1 ? 'success' : ''" effect="dark" >
            {{ row.isValid == 2 ? '已拒绝' : row.isValid == 1 ? '已复核' : '待复核' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="validTime" label="签字通过时间" width="160" />
      <el-table-column prop="rejectIllustrate" label="拒绝理由" width="150" show-overflow-tooltip />
      <el-table-column label="操作" fixed="right" width="280">
        <template #default="{ row }">
          <el-button link type="primary" :disabled="row.isValid != 0" @click="checkClick(row.allocationCode)">
            <el-icon class="el-icon--left"><Coordinate /></el-icon>审核
          </el-button>
          <el-button link type="primary" @click="printClick(row.allocationCode)">
            <el-icon class="el-icon--left"><Postcard /></el-icon>打印
          </el-button>
          <el-button link type="primary" :disabled="row.isValid == 1" @click="editClick(row.allocationCode)">
            <el-icon class="el-icon--left"><EditPen /></el-icon>编辑
          </el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            title="确认删除当前行数据吗?"
            @confirm="deleteClick(row.allocationCode)"
          >
            <template #reference>
              <el-button type="primary" link>
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
import printfViewVue from "./module/printfView.vue"

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
    const router = useRouter();
    const editViewRef = ref();
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
      data.pageObj.page = 1;
      getData();
    }
    const getData = () => {
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
