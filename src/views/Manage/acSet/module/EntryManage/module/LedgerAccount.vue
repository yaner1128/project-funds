<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    title="记账凭证"
    width="400"
    @close="handleClose"
    align-center
    center
  >
    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary">确认</el-button>
        <el-button type="primary" @click="handleClose">退 出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: 'voucher',
  setup(){
    const data = reactive({
      dialogVisible: false,
      transfereeSelected: null,
      treeData: [{
        label: '银行存款',
        value: '102',
        children: [
          {
            label: '工行（0096）',
            value: '10201',
            children: [
              {
                label: '测试',
                value: '1020101'
              }
            ]
          }
        ]
      }],
      defaultProps: {
        children: "children",
        label: function (a: any) {
          return a.value + "\xa0" + a.label;
        }
      },
      open: () => {
        data.dialogVisible = true;
      },
      handleNodeClick: (value: any) => {
        console.log(value)
      }
    })

    const handleClose = () => {
      data.dialogVisible = false;
      data.transfereeSelected = null;
    }

    return {
      ...toRefs(data),
      handleClose
    }
  }
})
</script>

<style lang="scss" scoped>
/deep/.el-tree-node.is-current > .el-tree-node__content {
  color: #fff !important;
  background-color: #409EFF !important;
}
</style>
