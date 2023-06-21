<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialog"
    :lock-scroll="true"
    title="会计科目导入"
    width="500px"
  > 
    <el-upload
      class="upload"
      ref="uploadBalance"
      drag
      :action="action"
      accept=".xlsx,.xls"
      :fileList="fileList"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :auto-upload="false"
      :data="dataList"
      :headers="headers"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>选取文件</em></div>
      <template #tip>
        <div class="el-upload__tip">只能上传excel文件, 且不超过1M</div>
      </template>
    </el-upload>
    <el-link :href="downLink" type="primary" target="_blank" class="downLink"
      >下载模板</el-link
    >
    <template #footer>
      <el-button
        style="margin-left: 10px"
        :loading="loading"
        type="primary"
        @click="submitUpload"
        >上传</el-button
      >
      <el-button type="warning" @click="close()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { formatDate } from "@/utils/date";
import { getToken } from '@/utils/auth';
import { emit } from "process";

export default defineComponent({
  components: {
    UploadFilled,
  },
  emits: ["close"],
  setup(props, {emit}) {
    const selectAccountRef = ref();
    const uploadBalance = ref<any>()
    const formRef = ref();
    const data = reactive({
      loading: false,
      dialog: false,
      delLoading:false,
      dataList: <any>{},
      fileList:[],
      headers: {Authorization: 'Bearer ' + getToken() },
      action:process.env.VUE_APP_BASE_API + '/ds-cz-datacenter-special-funds/dsLedgerAccounts/initLedgerAccountsByExcel',
      downLink:process.env.VUE_APP_BASE_API+'/ds-cz-datacenter-special-funds/dsLedgerAccounts/downloadExcelMode',
      submitUpload: async() => {
        data.dataList.accountSetCode = data.accountSetCode
        uploadBalance.value.submit();
      },
      uploadSuccess: (response: { code: number; message: string; }, file: any, fileList: any) => {
        if(response.code==200){
          uploadBalance.value.clearFiles()
          ElMessage({ type: 'success', message: '导入成功!' })
          close()
        }else{
          ElMessage({ type: 'warning', message: response.message + '！' })
        }
      },
      uploadError: (error: any, file: any, fileList: any) => {
        uploadBalance.value.clearFiles()
        ElMessage({ type: 'warning', message: '导入失败!' })
      },
      accountSetCode: ""
    })
    const open = (row:any) => {
      data.accountSetCode = row;
      data.dialog = true;
    }
    const close = () => {
      data.dialog = false;
      data.loading = false;
      uploadBalance.value.clearFiles();
      emit("close")
    }

    return {
      ...toRefs(data), 
      uploadBalance, 
      open, 
      close, 
      formRef,
      selectAccountRef,
    }
  },
});
</script>

<style></style>
