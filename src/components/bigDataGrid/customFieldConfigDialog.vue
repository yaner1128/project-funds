<template>
  <!-- 列表配置对话框 -->
  <el-dialog
    title="提示"
    v-model="visible"
    width="60%"
    :modal="false"
    :append-to-body="true"
    @close="hide"
    class="field-config-dialog"
  >
    <div>
      <el-row>
        <el-col :span="11">
          <div class="boxTitle">点击或拖拽显示到表头预览</div>
          <draggable
            class="list-group dragArea1"
            v-model="hideColumns"
            item-key="id"
            :disabled="true"
            :group="{ name: 'article', pull: 'clone' }"
          >
            <template #item="{ element, index }">
              <div class="list-group-item">
                <div>{{ element.title }} {{ index + 1 }}</div>
                <el-icon class="iconColor" @click="transformToShow(index)"
                  ><plus
                /></el-icon>
              </div>
            </template>
          </draggable>
        </el-col>
        <el-col :span="2">
          <div class="list-group-center">
            <div>
              <el-icon class="iconColor"><arrow-left /></el-icon>
              <el-icon class="iconColor"><arrow-right /></el-icon>
            </div>
            <div class="iconColor">左右拖动</div>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="boxTitle">表头预览</div>
          <draggable
            class="list-group dragArea2"
            v-model="showColumns"
            item-key="id"
            :disabled="false"
            :animation="100"
            :group="{ name: 'article', pull: 'clone', put: 'true' }"
          >
            <template #item="{ element, index }">
              <div class="list-group-item">
                <div>{{ element.title }} {{ index + 1 }}</div>
                <div>
                  <el-icon @click="transformToHide(index)"><minus /></el-icon>
                  <el-icon class="iconColor" style="margin-left: 20px"
                    ><sort
                  /></el-icon>
                </div>
              </div>
            </template>
          </draggable>
        </el-col>
      </el-row>
      <div class="btnbox">
        <el-button @click="hide">取 消</el-button>
        <el-button type="primary" @click="submitHandler">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import draggable from "vuedraggable";
import XEUtils from "xe-utils";
import { getColumnKey } from "@/components/bigDataGrid/util";
import {
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  Sort,
} from "@element-plus/icons-vue";

const visibleStorageKey = "BIG_DATA_GRID_CUSTOM_COLUMN_VISIBLE";

export default defineComponent({
  name: "CustomFieldConfigDialog",
  components: {
    draggable,
    Minus,
    Plus,
    ArrowLeft,
    ArrowRight,
    Sort,
  },
  emits: ["visibleChange"],
  props: {
    visible: Boolean,
  },
  setup(props, { emit }) {
    const data = reactive({
      bdGrid: ref<any>(null),
      showColumns: <any>[],
      hideColumns: <any>[],
      syncUpdate: (params: any) => {
        data.bdGrid = params;
        const { collectColumn } = params.getTableColumn();
        data.showColumns = collectColumn.filter(
          (column: any) =>
            column.visible &&
            column.field &&
            (!column.params || !column.params.customFieldExclude)
        );
        data.hideColumns = collectColumn.filter(
          (column: any) =>
            !column.visible &&
            column.field &&
            (!column.params || !column.params.customFieldExclude)
        );
      },
      submitHandler: () => {
        const { collectColumn } = data.bdGrid.getTableColumn();
        const { hideColumns, showColumns } = data;
        hideColumns.forEach((item: any) => {
          if (item.visible) {
            data.bdGrid.hideColumn(item.field);
          }
        });
        showColumns.forEach((item: any) => {
          data.bdGrid.showColumn(item.field);
        });
        // const hideCols=XEUtils.mapTree(hideColumns,column=>getColumnKey(column))
        const showCols = XEUtils.mapTree(showColumns, (column) =>
          getColumnKey(column)
        );

        //对表格的列按colShows的顺序重新排序
        for (let i = showCols.length - 1; i >= 0; i--) {
          for (let j = collectColumn.length - 1; j >= 0; j--) {
            if (showCols[i] && showCols[i] === getColumnKey(collectColumn[j])) {
              collectColumn.unshift(...collectColumn.splice(j, 1));
              break;
            }
          }
        }
        data.bdGrid.reloadColumn(collectColumn);
        data.hide();

        localStorage.setItem(
          visibleStorageKey,
          JSON.stringify({
            [data.bdGrid.id]: collectColumn.filter((item: any) => {
              return item.field;
            }),
          })
        );
      },
      hide: () => {
        emit("visibleChange", false);
      },
      transformToShow: (hideColumnIndex: number) => {
        const { hideColumns, showColumns } = data;
        showColumns.push(...hideColumns.splice(hideColumnIndex, 1));
      },
      transformToHide: (showColumnIndex: number) => {
        const { hideColumns, showColumns } = data;
        hideColumns.push(...showColumns.splice(showColumnIndex, 1));
      },
    });

    onMounted(() => {});
    return {
      ...toRefs(props),
      ...toRefs(data),
    };
  },
});
</script>

<style lang="scss" scoped>
.field-config-dialog {
  .ulbox {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    li {
      border: 1px solid #dcdfe6;
      padding: 12px 20px;
    }
  }
  .groupbox {
    margin-top: 20px;
    .el-checkbox-button {
      margin: 10px;
      border: 1px solid #dcdfe6;
      .el-checkbox-button__inner {
        border: none;
        border-radius: 0;
      }
    }
  }
  .boxTitle {
    font-size: 16px;
    margin-bottom: 10px;
    .clearAll {
      font-size: 12px;
      margin-left: 20px;
      color: #1890ff;
      cursor: pointer;
    }
  }
  .btnbox {
    text-align: right;
    margin-top: 30px;
  }
  .list-group {
    border: 1px solid #dfe6ec;
    height: 400px;
    overflow-y: auto;
    padding: 10px;
    background-color: #e9ecef;
    .list-group-item {
      padding: 10px;
      background-color: #fff;
      border: 1px solid rgba(0, 0, 0, 0.125);
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      border-radius: 4px;
    }
  }
  .list-group-center {
    height: 450px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .iconColor {
    font-size: 14px;
    color: #1890ff;
  }
}
</style>
