<template>
    <el-dialog
      :close-on-click-modal="false"
      :append-to-body="true"
      v-model="dialogFormVisible"
      :lock-scroll="true"
      width="1000px"
      title="选择所属项目"
      :before-close="resetForm"
    >   
        <div style="margin-bottom:10px;">
            <el-input
            v-model="query.prjName"
            clearable
            placeholder="输入项目名称"
            style="width: 200px"
            @keyup.enter="doQuery"
            />
            <el-button style="margin-left:10px;" type="primary" @click="doQuery">搜索</el-button>
        </div>
        <vxe-table
            :loading="loading"
            border
            ref="xTable"
            height="500px"
            show-overflow
            :data="tableData"
            :column-config="{ resizable: true }"
            :radio-config="{highlight: true}"
            @radio-change="radioChange"
        >
            <vxe-column type="radio" width="60">
                <template #header>
                    <vxe-button type="text" @click="clearRadioRowEevnt" :disabled="!selectRow">取消</vxe-button>
                </template>
            </vxe-column>
            <vxe-column field="prjName" title="项目名称"></vxe-column>
            <vxe-column field="prjCode" title="项目编号"></vxe-column>
            <vxe-column field="mofDepName" title="归属股室"></vxe-column>
            <vxe-column field="yearamount" title="年度计划付款额度"></vxe-column>
            <vxe-column field="currentamount" title="累计拔款额度"></vxe-column>
            <vxe-column field="remark" title="备注"></vxe-column>
        </vxe-table>
        <Pagination :pageObj="pageObj" :total="total" @search="doSimpleQuery" />
        <template #footer>
            <span class="dialog-footer">
            <el-button @click="resetForm">取消</el-button>
            <el-button type="primary" @click="submitClick">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { numFormat } from "@/utils/numFormat";
import bigDataGrid from "@/components/bigDataGrid";
import { ElMessage } from "element-plus";
import {
    getDsMofProjects,
} from "@/api/projectSet";
import Pagination from "@/components/Pagination/index.vue";
  
export default defineComponent({
    name: "checkPay",
    emits: ["reload","onClose"],
    components: {
        bigDataGrid,
        Pagination
    },
    props: {
      proId: {
        type: String,
      },
    },
    setup(props, {  emit }) {
        const xTable = ref<any>()
        const data = reactive({
            mofDepCode: "",
            dialogFormVisible: false,
            loading: false,
            multipleSelection: <any>[],
            tableData: [],
            radioChange: (row: any) => {
                data.selectRow = row
                console.log('单选事件',row)
            },
            query: <any>{prjName:""},
            clearRadioRowEevnt : () => {
                const $table = xTable.value
                data.selectRow = null
                $table.clearRadioRow()
            },
            selectRow: null as any,
            total: 0,
            pageObj: <any>{
                page: 0,
                size: 10,
            },
        });
  
        const resetForm = () => {
            data.dialogFormVisible = false;
            emit('onClose')
        };
        const submitClick = async () => {
            if (data.selectRow) {
                console.log(data.selectRow.row)
                data.dialogFormVisible = false;
                emit('reload',data.selectRow.row)
            }
        };
  
        const init = (row:any) => {
            data.dialogFormVisible = true;
            data.mofDepCode = row;
            console.log(row)
            doQuery();
        };

        const doQuery = () => {
            data.pageObj.page = 1;
            doSimpleQuery();
        };
        
        const doSimpleQuery = () => {
            data.loading = true;
            const params = {
                currentPageIndex: data.pageObj.page+1,
                pageSize: data.pageObj.size
            }
            getDsMofProjects(params, {prjName: data.query.prjName, mofDepCode: data.mofDepCode}).then((res) => {
                data.tableData = res.data.records;
                data.total = Number(res.data.total);
                data.loading = false;
            });
        };
  
        return {
            ...toRefs(data),
            resetForm,
            submitClick,
            init,
            doSimpleQuery,
            numFormat,
            xTable,
            doQuery
        };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  /* 禁用全选 */
  /deep/ .el-table__header .el-table-column--selection {
    text-indent: -999999px;
  }
  </style>
  