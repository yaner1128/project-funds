<template>
  <el-dialog
    top="3vh"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1100px"
    title="审核"
  >
    <el-scrollbar class="scrollbar">
      <div class="dialog_container">
        <detailsVue ref="detailsVueRef" :detailsData="detailsData" />
      </div>
    </el-scrollbar>
    <rejectView ref="rejectViewRef" @putData="getReason" />
    <template #footer>
      <div style="text-align: right">
        <el-button @click="submitClick" type="primary">同意</el-button>
        <el-button @click="reject" link>拒绝</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { dsAllocationDetail, updateDsAllocationReques } from "@/api/dsAccounts";
import { ElMessage } from "element-plus";
import rejectView from '@/components/rejectView/index.vue';
import detailsVue from "./cardView.vue";
import { formatDate } from "@/utils/date";

export default defineComponent({
  name: "checkPage",
  components: {
    rejectView,
    detailsVue
  },
  setup(props, { emit }) {
    const addFormRef = ref();
    const data = reactive({
      dialogFormVisible: false,
      allocationCode: null,
      detailsData: <any>{}
    });
    // 打开弹窗
    const open = (allocationCode: any) => {
      data.allocationCode = allocationCode;
      dsAllocationDetail({allocationCode: allocationCode}).then((res: any) => {
        if(res.code === 200) {
          data.detailsData = res.data;
          data.dialogFormVisible = true;
        }
      })
    };
    // 拒绝
    const rejectViewRef = ref();
    const reject = () => {
      rejectViewRef.value.open()
    };
    const getReason = (reason: any) => {
      // 获取拒绝理由
      updateDsAllocationReques({
        allocationCode: data.allocationCode,
        rejectIllustrate: reason,
        isValid: 2
      }).then((res: any) => {
        if(res.code === 200) {
          ElMessage.success('审核完成！');
          data.dialogFormVisible = false;
          emit('reload')
          return;
        }
        ElMessage.error(res.message);
      })
    }
    // 同意审批
    const submitClick = async() => {
      console.log('审批通过')
      updateDsAllocationReques({
        allocationCode: data.allocationCode,
        validTime: formatDate(new Date(), 'yyyy-MM-dd hh:ss:mm'),
        isValid: 1
      }).then((res: any) => {
        if(res.code === 200) {
          ElMessage.success('审核完成！');
          data.dialogFormVisible = false;
          emit('reload')
          return;
        }
        ElMessage.error(res.message);
      })
    };

    return {
      addFormRef,
      rejectViewRef,
      ...toRefs(data),
      open,
      submitClick,
      reject,
      getReason
    };
  },
});
</script>

<style lang="scss" scoped>
.scrollbar {
  height: calc(100vh - 300px);
}
/deep/ .el-input-number input{
  text-align: left;
}
</style>
