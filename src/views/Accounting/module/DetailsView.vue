<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1100px"
    title="详情"
    :before-close="closeClick"
  >
    <div class="dialog_container">
      <detailsVue ref="detailsVueRef" :detailData="detailData" :disabled="true" />
    </div>
    <template #footer>
      <div style="text-align: right">
        <el-button @click="closeClick" type="primary">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import detailsVue from "./commonDetails.vue";
import { getDsLedgerDetail } from "@/api/bookkeeping";

export default defineComponent({
  name: "DetailsView",
  components: {
    detailsVue
  },
  setup(props, { emit }) {
    const addFormRef = ref();
    const data = reactive({
      dialogFormVisible: false,
      certificateNumber: null,
      detailData: {}
    });
    // 打开弹窗
    const open = (row: any) => {
      data.certificateNumber = row.certificateNumber;
      getDsLedgerDetail({ certificateNumber: row.certificateNumber }).then((res: any) => {
        if(Array.isArray(res.data) && res.data.length>0) {
          data.detailData = {
            ...res.data[0],
            data: res.data
          };
        }
        data.dialogFormVisible = true;
      })
    };
    // 关闭
    const closeClick = () => {
      data.dialogFormVisible = false;
    };

    return {
      ...toRefs(data),
      open,
      closeClick
    };
  },
});
</script>

<style lang="scss" scoped>
.scrollbar {
  height: calc(100vh - 173px);
}
/deep/ .el-input-number input{
  text-align: left;
}
</style>
