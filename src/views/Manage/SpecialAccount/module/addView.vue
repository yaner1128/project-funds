<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="600px"
    title="添加财政专户"
    :before-close="resetForm"
  >
    <div class="dialog_container">
      <!-- <div class="my-header">
        <h3 class="back">
          <span>当前操作员：溆浦县财政局-国库股-欧阳翠花</span>
        </h3>
      </div> -->
      <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="rules">
        <el-form-item label="开户银行：" prop="bank">
          <el-tree-select v-model="addForm.bank" :data="optionData" :props="{children: 'children',label: 'codeName', value: 'code'}" :render-after-expand="false" placeholder="请选择开户银行" />
        </el-form-item>
        <el-form-item label="账号：" prop="accountCode">
          <el-input v-model="addForm.accountCode" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="账号名称：" prop="accountName">
          <el-input v-model="addForm.accountName" placeholder="请输入账号名称" />
        </el-form-item>
        <el-form-item label="余额：" prop="amounts">
          <el-input-number v-model="addForm.amounts" :controls="false" placeholder="请输入余额"  />
        </el-form-item>
        <el-form-item label="账号状态：" prop="status">
          <el-select v-model="addForm.status"  placeholder="请选择账号状态">
            <el-option
              v-for="item in statusOption"
              :key="item.code"
              :label="item.codeName"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="归属股室：" prop="mofDepCode">
          <el-tree-select v-model="addForm.mofDepCode" :data="mofDepData" :props="{children: 'children',label: 'mofDepName', value: 'mofDepCode'}" :render-after-expand="false" placeholder="请选择归属股室" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div style="text-align: right">
        <el-button @click="submitClick" type="primary">新建</el-button>
        <el-button @click="resetForm" link>取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { specialFundsEleUnionTree, basMofDepTree, addDsAccounts, getAccountsStatus } from "@/api/dsAccounts";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "addView",
  components: {
    Pagination,
  },
  setup(props, { emit }) {
    const addFormRef = ref();
    const data = reactive({
      title: "溆浦县城乡建设局",
      dialogFormVisible: false,
      addForm: {
        bank: '',
        accountCode: '',
        accountName: '',
        amounts: 0,
        status: '',
        mofDepCode: ''
      },
      tableData: [],
      pageObj: {
        page: 0,
        size: 10,
      },
      total: 0,
      rules: {
        bank: [{ required: true, message: "请选择开户银行", trigger: "change" }],
        accountCode: [{ required: true, message: "请输入开户账号", trigger: "blur" }],
        accountName: [{ required: true, message: "请输入开户账号名称", trigger: "blur" }],
        amounts: [{ required: true, message: "请输入余额", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        mofDepCode: [{ required: true, message: "请选择归属股室", trigger: "blur" }]
      },
      optionData: [],
      statusOption: [],
      mofDepData: [],
    });
    // 打开弹窗
    const open = (id: any) => {
      data.dialogFormVisible = true;
      getCodeData();
    };
    // 关闭
    const resetForm = () => {
      addFormRef.value.resetFields();
      data.dialogFormVisible = false;
    };
    // 返回
    const back = () => {
      resetForm();
    };
    // 添加专户
    const submitClick = async() => {
      await addFormRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          addDsAccounts(data.addForm).then((res: any) => {
            if(res.code === 200) {
              ElMessage.success(res.message);
              resetForm();
              emit('reload')
            }else{
              ElMessage.warning(res.message);
            }
          })
        }
      })
    };
    // 获取下拉数据
    const getCodeData = () => {
      // 开户行
      specialFundsEleUnionTree().then((res: any) => {
        data.optionData = res.data;
      })
      // 股室
      basMofDepTree({sourceId: 1}).then((res: any) => {
        data.mofDepData = res.data;
      })
      // 状态
      getAccountsStatus().then((res: any) => {
        data.statusOption = res.data;
      })
    }

    return {
      addFormRef,
      ...toRefs(data),
      open,
      back,
      resetForm,
      submitClick
    };
  },
});
</script>

<style lang="scss" scoped>
.scrollbar {
  height: calc(100vh - 173px);
}
.el-select, .el-input{
  width: 430px;
}
</style>
