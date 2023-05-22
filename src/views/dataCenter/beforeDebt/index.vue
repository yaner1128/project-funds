<template>
  <div class="app-container">
    <div class="head-container">
      <el-date-picker v-model="query.year" type="month" value-format="YYYY-MM" class="filter-item" placeholder="请选择年月" :clearable="false"/>
      <el-button type="primary" class="filter-item">
        搜索
      </el-button>
    </div>
    <!-- 表格 -->
    <big-data-grid
      :loading="loading"
      :maxHeight="700"
      id="indicator-query-grid"
      ref="dataTable"
      :columns="tableHeader"
      :data="tableData"
      :retain-static-column="true"
      :isConversion="isConversion"
      :column-config="{ resizable: true }"
      show-overflow
    >
    </big-data-grid>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import bigDataGrid from "@/components/bigDataGrid";
import { getGridColumns } from "@/api/gridColumns";
import { formatDate } from "@/utils/date";

export default defineComponent({
  name: 'beforeDebt',
  components: {
    bigDataGrid,
  },
  setup(){
    const data = reactive({
      query: {
        year: formatDate(new Date(), 'yyyy-MM'),
      },
      loading: false,
      tableData: <any>[],
      tableHeader: <any>[],
      isConversion: true,
      loadColumns: async () => {
        data.tableHeader = await getGridColumns("beforeDebt");
      },
    })

    onMounted(() => {
      data.loadColumns();
    });

    return {
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>