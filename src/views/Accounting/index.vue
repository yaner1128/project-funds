<template>
  <div class="app-container">
    <div class="head-container">
      <el-input
        v-model="query.certificateNumber"
        placeholder="请输入凭证号"
        class="filter-item"
        style="width: 200px"
        clearable
      />
      <el-input
        v-model="query.accountSetName"
        placeholder="请输入账套名"
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
      <el-table-column label="操作区" fixed="right" min-width="140px">
        <template #default="{ row }">
          <el-button :disabled="row.review !== 0" link type="primary" @click="checkClick(row.certificateNumber)">
            <el-icon><Coordinate /></el-icon>
            审核
          </el-button>
          <el-button :disabled="row.review === 1" link type="primary" @click="editClick(row.certificateNumber)">
            <el-icon><EditPen /></el-icon>
            编辑
          </el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            title="确认删除当前行数据吗?"
            @confirm="deleteClick(row.certificateNumber)"
          >
            <template #reference>
              <el-button type="primary" :disabled="row.review !== 0" link>
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :pageObj="pageObj" :total="total" @search="getData" />
    <!-- 记账 -->
    <addViewVue ref="addViewRef" @reload="doSimpleQuery" />
    <!-- 审核 -->
    <checkViewVue ref="checkViewRef" @reload="getData" />
    <!-- 详情 -->
    <DetailsView ref="DetailsViewRef" />
    <!-- 编辑 -->
    <editViewVue ref="editViewVueRef" @reload="getData" />
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
  watch
} from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { Coordinate } from "@element-plus/icons-vue";
import addViewVue from './module/addView.vue';
import checkViewVue from "./module/checkView.vue";
import { getDsLedgerPage, deleteDsLedger, getDsLedgerDetail } from '@/api/bookkeeping';
import DetailsView from "./module/DetailsView.vue";
import { ElMessage } from "element-plus";
import editViewVue from "./module/editView.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Accounting",
  components: {
    Pagination,
    Coordinate,
    addViewVue,
    checkViewVue,
    DetailsView,
    editViewVue
  },
  setup() {
    const router = useRouter();
    const data = reactive({
      query: {
        certificateNumber: "",
        accountSetName: ""
      },
      maxHeight: 400,
      tableData: [],
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
    const getData = () => {
      const params = Object.assign({
        currentPageIndex: data.pageObj.page,
        pageSize: data.pageObj.size
      }, data.query)
      getDsLedgerPage(params).then((res) => {
        data.tableData = res.data.records;
        data.total = Number(res.data.total);
      })
    };

    watch(() => router.currentRoute.value.query, (val: any) => {
      data.query.accountSetName = val.accountSetName
      nextTick(() => {
        doSimpleQuery();
      })
    }, { immediate: true })

    // 新增
    const addViewRef = ref();
    const addClick = () => {
      addViewRef.value.open();
    };
    // 查看详情
    const DetailsViewRef = ref();
    const viewData = (row: any) => {
      DetailsViewRef.value.open(JSON.parse(JSON.stringify(row)))
    }

    //  编辑
    const editViewVueRef = ref();
    const editClick = (certificateNumber: any) => {
      editViewVueRef.value.open(certificateNumber);
    }

    // 复核
    const checkViewRef = ref();
    const checkClick = (certificateNumber: any) => {
      checkViewRef.value.open(certificateNumber);
    }

    // 删除
    const deleteClick = (certificateNumber: any) => {
      deleteDsLedger({ certificateNumber: certificateNumber }).then((res: any) => {
        if(res.code === 200) {
          ElMessage.success('删除成功')
          doSimpleQuery();
          return;
        }
        ElMessage.error(res.message)
      })
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
      getData();
    });

    return {
      DetailsViewRef,
      addViewRef,
      checkViewRef,
      ...toRefs(data),
      doSimpleQuery,
      getData,
      addClick,
      checkClick,
      viewData,
      deleteClick,
      editViewVueRef,
      editClick
    };
  },
});
</script>

<style lang="scss" scoped></style>
