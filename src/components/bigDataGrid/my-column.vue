<template>
  <vxe-colgroup :title="item.title" v-if="item.children" :align="item.align ? item.align : 'center'">
    <template v-if="item.slots && item.slots.header" #header="{row}">
      <slot :name="item.slots.header" :row="row"></slot>
    </template>
    <template #default>
      <my-column v-for="(col, index) in item.children" :key="index" :item="col" :treeNode="col.treeNode" :isConversion="isConversion">
        <template v-slot:[col.slots.default]="{row}" v-if="col.slots">
          <!-- 定义插槽用于接受其父级组件的插槽内容 -->
          <slot :name="col.slots.default" :row="row"></slot>
        </template>
      </my-column>
    </template>
  </vxe-colgroup>
  <vxe-column
    v-else
    :field="item.field"
    :title="item.title"
    :width="item.width"
    :sortable="item.sortable"
    :filters="item.filters"
    :filter-render="item.filterRender"
    :formatter="item.formatter"
    :align="item.align"
  >
    <template #default="{ row }">
      <slot v-if="item.slots" :name="item.slots.default" :row="row"></slot>
      <span
        v-else-if="item.className === 'stateWarnColor'"
        :class="item.className"
        >{{
          isConversion
            ? numFormat(row[item.field])
            : numFormat(numToTenThousand(row[item.field]))
        }}</span
      >
      <span v-else>{{ row[item.field] }}</span>
    </template>
  </vxe-column>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { numFormat, numToTenThousand } from "@/utils/numFormat";

export default defineComponent({
  name: "MyColumn",
  props: {
    item: {
      type: Object,
    },
    isConversion: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      numFormat,
      numToTenThousand,
    };
  },
});
</script>
