<template>
  <el-dialog
    top="10vh"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1100px"
    title="会计审核"
  >
    <el-scrollbar class="scrollbar">
      <div class="dialog_container">
        <detailsVue ref="detailsVueRef" :detailData="detailData" :disabled="true" />
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
import { getDsLedgerDetail, updateDsLedger } from "@/api/bookkeeping";
import { ElMessage } from "element-plus";
import rejectView from '@/components/rejectView/index.vue';
import detailsVue from "./commonDetails.vue";
import { updateDsAllocationReques } from "@/api/dsAccounts";

export default defineComponent({
  name: "addView",
  components: {
    rejectView,
    detailsVue
  },
  setup(props, { emit }) {
    const addFormRef = ref();
    const data = reactive({
      dialogFormVisible: false,
      certificateNumber: null,
      detailData: <any>{},
    });
    // 打开弹窗
    const open = (certificateNumber: any) => {
      data.certificateNumber = certificateNumber;
      getDsLedgerDetail({ certificateNumber: certificateNumber }).then((res: any) => {
        if(Array.isArray(res.data) && res.data.length>0) {
          data.detailData = {
            ...res.data[0],
            data: res.data
          };
        }
        data.dialogFormVisible = true;
      })
    };
    // 拒绝
    const rejectViewRef = ref();
    const reject = () => {
      rejectViewRef.value.open()
    };
    const getReason = (reason: any) => {
      // 获取拒绝理由
      if(data.detailData.data && Array.isArray(data.detailData.data)) {
        let temp = <any>[];
        data.detailData.data.forEach((item: any) => {
          var obj = <any>{
            ...item,
            rejectIllustrate: reason,
            review: '2',
          }
          delete obj.accountSetName;
          delete obj.accountDirection;
          temp.push(obj)
        })
        updateDsLedger(temp).then((res: any) => {
          if(res.code === 200) {
            ElMessage.success('审核完成！');
            data.dialogFormVisible = false;
            // 修改付款申请状态
            updateDsAllocationReques({
              allocationCode: data.detailData.allocationCode,
              isAccounting: 2
            })
            emit('reload')
            return;
          }
          ElMessage.error(res.message);
        })
      }
    }
    // 同意审批
    const submitClick = async() => {
      console.log('审批通过')
      let temp = <any>[];
      data.detailData.data.forEach((item: any) => {
        var obj = <any>{
          ...item,
          review: '1',
        }
        delete obj.accountSetName;
        delete obj.accountDirection;
        temp.push(obj)
      })
      updateDsLedger(temp).then((res: any) => {
        if(res.code === 200) {
          ElMessage.success('审核完成！');
          data.dialogFormVisible = false;
          emit('reload')
          // 修改付款申请状态
          updateDsAllocationReques({
            allocationCode: data.detailData.allocationCode,
            isAccounting: 3
          })
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
