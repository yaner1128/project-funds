<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    title="科目选择"
    width="400"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- <h3>科目树</h3> -->
    <el-scrollbar style="height: 500px">
      <el-tree
        ref="treeRef"
        default-expand-all
        :data="treeData"
        :props="defaultProps"
        node-key="value"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
        :highlight-current="true"
        :current-node-key="selectedNodeId"
      />
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确认</el-button>
        <el-button type="" @click="handleClose">退 出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { simpleAccountingSubject } from "@/api/dsAccountSets";

export default defineComponent({
  name: "LedgerAccount",
  props: {
    accountSetCode: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const treeRef = ref();
    const data = reactive({
      dialogVisible: false,
      selectedNodeId: ref(null),
      selected: <any>{},
      treeData: [],
      defaultProps: {
        children: "children",
        label: function (a: any) {
          return a.ledgerAccountCode + "\xa0" + a.ledgerAccountName;
        },
      },
      open: () => {
        data.dialogVisible = true;
        // 会计科目
        simpleAccountingSubject({ accountSetCode: props.accountSetCode }).then((res: any) => {
          data.treeData = res.data;
        });
      },
      handleNodeClick: (value: any) => {
        if (value.ledgerAccountId === data.selectedNodeId) {
          // 如果当前节点已经选中，则取消选中
          data.selectedNodeId = null;
        } else {
          // 否则选中当前节点
          data.selected = value;
          data.selectedNodeId = value.ledgerAccountId;
        }
      },
    });
    // 关闭
    const handleClose = () => {
      data.dialogVisible = false;
      data.selected = {
        value: null
      };
      data.selectedNodeId = null;
      treeRef.value!.setCheckedKeys([], false);
    };
    // 提交
    const handleSubmit = () => {
      if (!data.selectedNodeId) {
        ElMessage.warning("请选择一个科目");
        return;
      }
      emit("putData", data.selected);
      data.dialogVisible = false;
      data.selectedNodeId = null;
      treeRef.value!.setCheckedKeys([], false);
    };

    return {
      ...toRefs(data),
      handleClose,
      treeRef,
      handleSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
/deep/.el-tree-node.is-current > .el-tree-node__content {
  color: #fff !important;
  background-color: #409eff !important;
}
</style>
