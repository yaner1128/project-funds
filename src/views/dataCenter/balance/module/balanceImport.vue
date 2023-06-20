<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialog"
    :lock-scroll="true"
    title="科目余额导入"
    width="500px"
  > 
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="年度：" prop="year">
        <el-date-picker
          v-model="form.year"
          value-format="YYYY"
          type="year"
          :clearable="false"
          @change="changeYear"
        />
      </el-form-item>
      <el-form-item label="日期：" prop="time">
        <el-date-picker
          v-model="form.time"
          type="date"
          value-format="YYYY-MM-DD"
          :default-value="defaultDate"
          :disabled-date="disabledDateFun"
        />
      </el-form-item>
      <el-form-item label="账套：" prop="accountSetName">
        <el-input
          v-model="form.accountSetName"
          placeholder="请选择账套"
          @click="selectAccount"
        />
      </el-form-item>
    </el-form>
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
    <select-account-vue ref="selectAccountRef" @selected="getSelected"></select-account-vue>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { formatDate } from "@/utils/date";
import { getToken } from '@/utils/auth';
import selectAccountVue from './selectAccount.vue'

export default defineComponent({
  components: {
    UploadFilled,
    selectAccountVue
  },
  setup() {
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
      action:process.env.VUE_APP_BASE_API + '/ds-cz-datacenter-special-funds/dsBalance/initBalanceByExcel',
      downLink:process.env.VUE_APP_BASE_API+'/ds-cz-datacenter-special-funds/dsBalance/downloadExcelMode',
      submitUpload: async() => {
        await formRef.value.validate((valid: any, fields: any) => {
        if (valid) {
            data.dataList.accountSetCode = data.form.accountSetCode;
            data.dataList.fiscalYear = data.form.year;
            // data.dataList.startMonth = data.form.time[0].split('-')[1];
            // data.dataList.endMonth = data.form.time[1].split('-')[1];
            data.dataList.carryDate = data.form.time
            console.log(data.form)
            uploadBalance.value.submit();
          }
        })
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
      form: <any>{
        year: formatDate(new Date(), 'yyyy'),
        time:'',
        accountSetCode: "",
        accountSetName: "",
      },
      rules: {
        year: [{ required: true, message: "请选择年度", trigger: "blur" }],
        time: [{ required: true, message: "请选择起止月份", trigger: "blur" }],
        accountSetName: [{ required: true, message: "请选择账套", trigger: "blur" }]
      },
      disabledDateFun: (date: any) =>{
      // 这里我判断的是年份字符串是否等于form表单所选的年份 是则返回false ，否则禁用 返回true 具体根据你们的业务需求来判断
        if (!data.form.year) return false
        const year = date.getFullYear().toString()
        return year !== data.form.year
      },
      defaultDate: [new Date(formatDate(new Date(), 'yyyy-MM-dd'))]
    })
    const getSelected = (val:any) => {
      console.log(val);
      data.form.accountSetCode = val.accountSetCode;
      data.form.accountSetName = val.accountSetName;
    }

    const selectAccount = () => {
      selectAccountRef.value.open('0')
    }

    const changeYear = (item:any) => {
      console.log(item)
      data.defaultDate = [new Date(item)]
      data.form.time = ""
    }
    const open = () => {
      data.dialog = true;
    }
    const close = () => {
      data.dialog = false;
      data.loading = false;
      data.form = {year: formatDate(new Date(), 'yyyy')};
      uploadBalance.value.clearFiles();
    }
    const loadShowById = () => {
      open();
    }

    return {
      ...toRefs(data), 
      uploadBalance, 
      open, 
      close, 
      loadShowById, 
      formRef,
      changeYear,
      selectAccountRef,
      selectAccount,
      getSelected
    }
  },
});
</script>

<style></style>
