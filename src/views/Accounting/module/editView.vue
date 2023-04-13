<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1100px"
    title="编辑"
    :before-close="closeClick"
  >
    <div class="dialog_container">
      <detailsVue ref="detailsVueRef" :detailData="detailData" @putData="getData" :disabled="false" />
    </div>
    <template #footer>
      <div style="text-align: right">
        <el-button @click="submitClick" type="primary">确认</el-button>
        <el-button link @click="closeClick" type="primary">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import detailsVue from "./commonDetails.vue";
import { getDsLedgerDetail, updateDsLedger } from "@/api/bookkeeping";

export default defineComponent({
  name: "editView",
  components: {
    detailsVue
  },
  setup(props, { emit }) {
    const addFormRef = ref();
    const data = reactive({
      dialogFormVisible: false,
      certificateNumber: null,
      detailData: {},
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
    const detailsVueRef = ref();
    const submitClick = async () => {
      await detailsVueRef.value.checkValid();
    }
    const getData = (val: any) => {
      const tempData = val.data;
      let params = <any>[];
      for(var key in tempData) {
        params.push({
          ...val.common,
          ledgerId: tempData[key].ledgerId,
          ledgerAccountCode: tempData[key].ledgerAccountCode,
          amount: tempData[key].amount
        })
      }
      console.log(params)
      updateDsLedger(params).then((res: any) => {
        if(res.code === 200) {
          ElMessage.success('编辑成功');
          data.dialogFormVisible = false;
          emit('reload')
          return;
        }
        ElMessage.error(res.message);
      })
    }
    // 关闭
    const closeClick = () => {
      data.dialogFormVisible = false;
    };

    return {
      ...toRefs(data),
      open,
      detailsVueRef,
      closeClick,
      submitClick,
      getData
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
