<template>
  <vxe-table
    border
    show-overflow
    ref="xTable1"
    :data="data"
    :height="maxHeight"
    :row-config="{ isHover: true }"
    v-loading="loading"
    highlight-hover-row
    :column-config="{ resizable: resizable }"
    :custom-config="{ storage: customConfig }"
    :sort-config="{ remote: true, trigger: 'cell' }"
    @sort-change="sortChangeClick"
  >
    <my-column v-for="item in columns" :key="item.field" :item="item" :isConversion="isConversion" :treeNode="item.treeNode">
      <template v-for="slotItem in jugeSlot([item], [item])" :key="slotItem" v-slot:[slotItem.slots.default]="{row}">
        <slot :name="slotItem.slots.default" :row="row"></slot>
      </template>
      <template v-if="item.slots && item.slots.header" v-slot:[item.slots.header]>
        <slot :name="item.slots.header"></slot>
      </template>
    </my-column>
    <slot />
    <vxe-column fixed="right" title="列表配置" width="110" v-if="customConfig">
      <template #header>
        <span>
          <el-button link type="primary" @click="handleClick">
            <el-icon class="el-icon--left"><scale-to-original /></el-icon
            >列表配置
          </el-button>
          <CustomFieldConfigDialog
            ref="customRef"
            :visible="visible"
            @visibleChange="visibleChange"
          ></CustomFieldConfigDialog>
        </span>
      </template>
    </vxe-column>
  </vxe-table>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  nextTick,
  toRefs,
  reactive,
  getCurrentInstance,
} from "vue";
import { VxeTableInstance } from "vxe-table";
import XEUtils from "xe-utils";
import { ScaleToOriginal } from "@element-plus/icons-vue";
import { numFormat, numToTenThousand } from "@/utils/numFormat";
import CustomFieldConfigDialog from "./customFieldConfigDialog.vue";
import MyColumn from './my-column.vue'

export default defineComponent({
  components: {
    ScaleToOriginal,
    CustomFieldConfigDialog,
    MyColumn
  },
  props: {
    columns: {
      type: Array,
      default: [],
    },
    data: {
      type: Array,
      default: [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    maxHeight: {
      type: Number,
      default: 600,
    },
    resizable: {
      type: Boolean,
      default: true,
    },
    customConfig: {
      type: Boolean,
      default: false,
    },
    isConversion: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['sortChange'],
  setup(props, ctx) {
    const customRef = ref<any>();
    const instance = getCurrentInstance();
    const data = reactive({
      visible: false,
      visibleChange: (val: boolean) => {
        data.visible = val;
      },
    });
    const mockList1: any = [];
    for (let index = 0; index < 200; index++) {
      mockList1.push({
        name: "Test" + index,
        role: "Developer",
        sex: "男",
      });
    }

    const xTable1 = ref({} as VxeTableInstance);
    onMounted(() => {
      nextTick(() => {
        const $table = xTable1.value;
        if ($table) {
          setTimeout(() => {
          }, 10);
        }
      });
    });

    const sortChangeClick = (column: { order: string; prop: string }) => {
      ctx.emit("sortChange", column);
    };
    const handleClick = () => {
      data.visible = true;
      customRef.value.syncUpdate(xTable1.value);
    };

    const jugeSlot = (item: any, temp: any) => {
      for (var i =0; i < item.length; i++) {
        if (item[i].children) {
          jugeSlot(item[i].children, temp)
        } else {
          temp.push(item[i])
        }
      }
      return temp.filter((slot: any)=> {
        return slot.slots && slot.slots.default
      })
    }
    return {
      xTable1,
      ...toRefs(props),
      ...toRefs(data),
      sortChangeClick,
      numFormat,
      numToTenThousand,
      handleClick,
      customRef,
      jugeSlot,
    };
  },
});
</script>
