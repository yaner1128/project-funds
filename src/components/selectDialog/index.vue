<template>
  <div
    ref="selectRef"
    class="pc-user-info-select"
    @mouseenter="() => (showClear = true)"
    @mouseleave="() => (showClear = false)"
  >
    <div
      ref="tags"
      class="el-select__tags"
      @click="showDialog"
      :style="{
        'max-width': inputWidth - 30 + 'px',
        overflow: 'hidden',
        height: inputHeight,
      }"
    >
      <span>
        <!-- v-for="tag in selection"
        :key="tag.code"-->
        <el-tag
          v-if="selection.length > 0"
          class="inner-tag"
          type="info"
          @close="removeItem(tag)"
          :closable="false"
        >
          {{
            selection[0].name.length > 10
              ? selection.length - 1 > 99
                ? selection[0].name.substring(0, 8) + "..."
                : selection[0].name.substring(0, 10) + "..."
              : selection[0].name
          }}
        </el-tag>
        <el-tag
          v-if="selection.length > 1"
          class="inner-tag"
          type="info"
          @close="removeItem(tag)"
          :closable="false"
          >+{{ selection.length - 1 }}</el-tag
        >
      </span>
    </div>
    <div class="el-input el-input--mini el-input--suffix">
      <div class="el-input__wrapper">
        <input
          link
          readonly
          ref="reference"
          @click="showDialog"
          autocomplete="off"
          :placeholder="selection.length > 0 ? '' : '选择' + typeName"
          :class="{ disabled: disabled }"
          class="el-input__inner"
          :disabled="disabled"
          :style="{ height: inputHeight }"
        />
        <span class="el-input__suffix" @click.stop="clearHandle">
          <span class="el-input__suffix-inner" v-if="selection.length > 0">
            <el-icon class="el-input__icon"><circle-close /></el-icon>
          </span>
        </span>
      </div>
    </div>

    <el-dialog
      :title="typeName + '选择列表'"
      :close-on-press-escape="false"
      append-to-body
      :close-on-click-modal="false"
      width="35%"
      class="pc-user-info-select-dialog"
      v-model="dialogVisible"
    >
      <el-row :gutter="20">
        <!--用户数据-->
        <el-col>
          <el-input
            ref="searchInputRef"
            style="width: 100%; margin-top: 15px; margin-bottom: 15px"
            placeholder="输入编码或者名称搜索"
            v-model="filterText"
          ></el-input>
          <div>
            <el-checkbox
              v-if="!isSingle"
              v-model="checked"
              @change="checkedAll"
              style="margin-bottom: 10px; color: #1890ff"
            >
              <span>{{ checked ? "取消全选" : "全选" }}</span>
            </el-checkbox>
            <slot></slot>
          </div>
          <div style="height: 350px; overflow-y: auto">
            <el-tree
              v-if="!needFresh"
              class="filter-tree"
              :data="data"
              :props="defaultProps"
              :show-checkbox="isSingle ? false : true"
              @check-change="handleCheckChange"
              @node-click="handleNodeClick"
              @check="checkChange"
              :filter-node-method="filterNode"
              :accordion="true"
              node-key="codeId"
              ref="treeRef"
            ></el-tree>
          </div>
        </el-col>
      </el-row>

      <template #footer>
        <div style="text-align: right">
          <el-button @click="selectConfirm" type="primary">确定</el-button>
          <el-button @click="selectCancel" link>取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
// import emitter from "element-ui/src/mixins/emitter";
import { splitArr } from "@/utils/split";
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  nextTick,
  watch,
  getCurrentInstance,
} from "vue";
/**
 * 条件选择器
 */
export default defineComponent({
  name: "infoSelect",
  // mixins: [emitter],
  components: { },
  props: {
    clearable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Object, Array],
      default() {
        return {};
      },
    },
    clearInput: {
      type: Boolean,
      default: false,
    },
    treeData: {
      type: Array,
      default: [],
    },
    typeName: {
      type: String,
    },
    isSingle: {
      type: Boolean,
      default: false,
    },
    curSelect: {
      type:Array,
      default: []
    }
  },
  emits: ["selectChange"],
  setup(props: any, ctx) {
    const instance: any = getCurrentInstance();
    const { disabled, value, treeData, clearInput, isSingle, curSelect } = toRefs(props);
    const data = reactive({
      loadTimes: 0,
      loading: false,
      showClear: false,
      currentVal: value.value,
      inputHeight: "30px",
      inputWidth: "400px",
      dialogVisible: false,
      organizationId: null,
      names: [] as any[],
      selectArr: [] as any[],
      selectArrTemp: [] as any[],
      selecDataTemp: [] as any[],
      selection: [] as any[],
      data: [] as any[],
      filterText: "",
      defaultProps: {
        children: "children",
        label: function (a: any) {
          if (a.name) {
            return a.code + "\xa0" + a.name;
          } else {
            return a.name;
          }
        },
      },
      defaultCheckedKeys: [] as any[],
      dialogLoading: false,
      needFresh: false,
      checked: false, //checkbox的值
      checkedTemp: false, //存储未点击确认时checkbox的值
      flatArr: [] as any[],
    });

    const searchInputRef = ref();
    const treeRef = ref();
    const selectRef = ref();

    // watch([treeData, data.filterText, clearInput], (newValue, oldValue) => {
    //   console.log("obj改变了", newValue, oldValue);
    // });

    /**
     * 打开对话框
     */
    const showDialog = () => {
      data.defaultCheckedKeys = data.selectArr;
      if (disabled.value) {
        return;
      }
      if (data.loadTimes === 0) {
      }
      data.dialogVisible = true;
      nextTick(() => {
        searchInputRef.value.focus();
      });
      data.checkedTemp = data.checked;
    };

    /**
     * 确认
     */
    const selectConfirm = () => {
      data.selection = data.selecDataTemp;
      data.selectArr = data.selectArrTemp;
      data.dialogVisible = false;
      if (data.checked) {
        ctx.emit("selectChange", []);
      } else {
        const newArr = splitArr(data.selectArr);
        ctx.emit("selectChange", newArr);
      }
    };
    /**
     * 取消选择
     */
    const selectCancel = () => {
      if (data.selectArr.length > 0) {
        treeRef.value.setCheckedKeys(data.selectArr, false);
      } else {
        treeRef.value.setCheckedKeys([]);
      }
      data.dialogVisible = false;
      data.checked = data.checkedTemp;
      instance.parent.changeChecked && instance.parent.changeChecked();
    };

    /**
     * 筛选节点
     */
    const filterNode = (value: any, datum: any) => {
      if (!value) return true;
      return (
        datum.name.indexOf(value) !== -1 || datum.code.indexOf(value) !== -1
      );
    };

    /**
     * 选择节点
     */
    const handleCheckChange = (
      datum: any,
      checked: any,
      indeterminate: any
    ) => {
      let res = treeRef.value.getCheckedNodes(false, false); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
      let selectedNames = [];
      let arr: any = [];
      let selectedCodes: any = [];
      res.forEach((item: any) => {
        selectedNames.push(item.code + "\xa0" + item.name);
        selectedCodes.push(item.codeId);
        arr.push({
          code: item.codeId,
          name: item.code + "\xa0" + item.name,
        });
      });
      data.selectArrTemp = selectedCodes;
      data.selecDataTemp = arr;
    };
    /**
     * 复选框点击事件
     */
    const checkChange = (obj: any, obj1: any) => {
      if (obj1.checkedNodes.length === data.flatArr.length) {
        data.checked = true;
        instance.parent.checked = true;
        instance.parent.checked1 = true;
      } else {
        data.checked = false;
        instance.parent.checked = false;
        instance.parent.checked1 = false;
      }
    };
    /**
     * 单选点击事件
     */
    const handleNodeClick = (datum: any) => {
      if (isSingle) {
        let arr = [];
        let selectedCodes = [];
        data.selectArrTemp = [];
        selectedCodes.push(datum.codeId);
        arr.push({
          code: datum.codeId,
          name: datum.code + "\xa0" + datum.name,
        });
        data.selectArrTemp = selectedCodes;
        data.selecDataTemp = arr;
      }
    };

    /**
     * 清除某项
     */
    const removeItem = (item: any) => {
      data.selection.forEach((_, i) => {
        if (item.code === _.code) {
          data.selection.splice(i, 1);
        }
      });
      data.selectArr = [];
      data.selection.forEach((v) => {
        data.selectArr.push(v.code);
      });
      treeRef.value.setCheckedKeys(data.selectArr, false);
      ctx.emit("selectChange", data.selectArr);
    };
    /**
     * 清空
     */
    const clearHandle = () => {
      data.selection = [];
      data.selectArr = [];
      data.selectArrTemp = [];
      data.selecDataTemp = [];
      data.checked = false;
      data.checkedTemp = false;
      treeRef.value && treeRef.value.setCheckedKeys([]);
      selectConfirm();
      instance.parent.changeChecked && instance.parent.changeChecked(); //后期别的父组件清除，都在父组件写上这个方法吧，用以变更checked状态
    };
    /**
     * 全选或取消全选
     */
    const checkedAll = (res: any) => {
      data.checked = res;
      if (res) {
        //全选
        instance.parent.checked = true;
        instance.parent.checked1 = true;
        treeRef.value.setCheckedNodes(data.data);
      } else {
        //取消选中
        instance.parent.checked = false;
        instance.parent.checked1 = false;
        treeRef.value.setCheckedKeys([]);
      }
    };
    // 选中某些树节点
    const checkedSome = (arr: any) => {
      treeRef.value.setCheckedNodes(arr);
    };
    // 树形结构扁平化函数
    const flatFn = (source: any) => {
      source.forEach((el: any) => {
        data.flatArr.push(el);
        el.children && el.children.length > 0 ? flatFn(el.children) : ""; // 子级递归
      });
    };
    watch(
      treeData,
      (newValue, oldValue) => {
        data.data = newValue;
        data.flatArr = [];
        flatFn(data.data);
      },
      { immediate: true }
    );
    watch(
      () => data.filterText,
      (newValue, oldValue) => {
        treeRef.value.filter(newValue);
      }
    );
    watch(clearInput, (newValue, oldValue) => {
      if (newValue) {
        data.selection = [];
        data.selectArr = [];
      }
    });

    watch(curSelect, (newValue, oldValue) => {
      data.selection = newValue;
    });
    return {
      ...toRefs(data),
      ...toRefs(props),
      searchInputRef,
      treeRef,
      selectRef,
      showDialog,
      selectConfirm,
      selectCancel,
      filterNode,
      handleCheckChange,
      checkChange,
      handleNodeClick,
      removeItem,
      clearHandle,
      checkedAll,
      checkedSome,
    };
  },
});
</script>

<style>
.pc-user-info-select-dialog .el-dialog__body {
  padding: 0 20px 10px 20px !important;
  color: #606266;
  font-size: 16px;
  word-break: break-all;
}
</style>

<style scoped>
.pc-user-info-select {
  display: inline-block;
  position: relative;
  width: 200px;
}

.pc-user-info-select .el-input__inner {
  font-size: 14px;
}

.disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}

.select-panel {
  border: 1px dashed #e0e0e0;
  margin-bottom: 10px;
  min-height: 37px;
  padding: 5px;
}

.inner-tag {
  margin: 2px 0 2px 6px;
}
.el-input__suffix {
  z-index: 9999;
}
</style>
