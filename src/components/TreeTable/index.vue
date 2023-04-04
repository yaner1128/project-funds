<template>
  <el-table
    :data="formatData"
    :row-style="showRow"
    v-bind="$attrs"
    @cell-dblclick="viewData"
    :max-height="maxHeight ? maxHeight : '640px'"
    :height="maxHeight ? maxHeight : '640px'"
  >
    <el-table-column v-if="columns.length === 0" width="150">
      <template #default="scope">
        <span
          v-for="space in scope.row._level"
          :key="space"
          class="ms-tree-space"
        />
        <span
          v-if="iconShow(0, scope.row)"
          class="tree-ctrl"
          @click="toggleExpanded(scope.$index)"
        >
          <i v-if="!scope.row._expanded" class="el-icon-plus" />
          <i v-else class="el-icon-minus" />
        </span>
        {{ scope.$index }}
      </template>
    </el-table-column>
    <el-table-column
      v-for="(column, index) in columns"
      v-else
      :key="column.value"
      :label="column.text"
      :width="column.width"
      :align="column.isMoney ? 'right' : 'left'"
      class-name="filtered"
    >
      <template #default="scope" v-if="index === 0">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span
          v-for="space in scope.row._level"
          :key="space"
          class="ms-tree-space"
        />
        <span
          v-if="iconShow(index, scope.row)"
          class="tree-ctrl"
          @click="toggleExpanded(scope.$index)"
        >
          <el-icon v-if="!scope.row._expanded" class="el-icon--left"
            ><Plus
          /></el-icon>
          <el-icon v-else class="el-icon--left"><Minus /></el-icon>
        </span>
        <span :class="column.isMoney ? 'stateWarnColor' : ''">
          {{
            column.isMoney
              ? isConversion
                ? numFormat(scope.row[column.value])
                : numFormat(
                    numToTenThousand(
                      scope.row[column.value]
                    )
                  )
              : scope.row[column.value]
          }}
        </span>
      </template>
    </el-table-column>
    <slot />
  </el-table>
</template>

<script lang="ts">
import treeToArray from "./eval";
import { defineComponent, computed, toRefs, watch } from "vue";
import { numFormat, numToTenThousand } from "@/utils/numFormat";

export default defineComponent({
  name: "TreeTable",
  emits: ["cell-dblclick"],
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true,
    },
    columns: <any>{
      type: Array,
      default: () => [],
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false,
    },
    isConversion: Boolean,
    maxHeight: String,
  },
  setup(props: any, { emit }) {
    const { data, evalFunc, expandAll, evalArgs } = toRefs(props);
    let flag = true;
    watch(()=> props.expandAll, () => {
      flag = true;
    })
    // 格式化数据源
    const formatData: any = computed(() => {
      let tmp;
      if (!Array.isArray(data.value)) {
        tmp = [data.value];
      } else {
        tmp = data.value;
      }
      const func: any = evalFunc.value||treeToArray;
      let args = [];
      if (evalArgs.value) {
        args = evalArgs.value.concat([flag, tmp, expandAll.value]);
      } else {
        args = [flag, tmp, expandAll.value];
      }
      return func.apply(null, args);
    });

    const showRow = (row: any) => {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? {
            animation: "treeTableShow 1s",
            "-webkit-animation": "treeTableShow 1s",
          }
        : { display: "none" };
    };

    // 切换下级是否展开
    const toggleExpanded = (trIndex: number) => {
      flag = false;
      let record = formatData.value[trIndex];
      record._expanded = !record._expanded;
    };
    // 图标显示
    const iconShow = (index: any, record: any) => {
      return index === 0 && record.children && record.children.length > 0;
    };
    const viewData = (data: any) => {
      emit("cell-dblclick", data);
    };
    return {
      numFormat,
      numToTenThousand,
      formatData,
      showRow,
      toggleExpanded,
      iconShow,
      viewData,
    };
  },
});
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: "";
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 36px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
</style>
