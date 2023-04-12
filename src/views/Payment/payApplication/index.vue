<template>
  <div class="app-container">
    <!-- 标题 -->
    <div class="title_info">
      <h2>新增专户付款申请</h2>
      <p>
        <span>制单人：{{ user.agencyName }}</span> &nbsp;
        <span
          >制单时间：{{ dateTime }}</span
        >
      </p>
    </div>
    <!-- 申请内容 -->
    <div class="info">
      <el-form
        ref="infoRef"
        :model="infoForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="单号：" prop="allocationCode">
          <template #label>
            <span class="labelBox"
              >单号
              <el-tooltip
                class="box-item"
                effect="dark"
                content="依据拨款单生成日期"
                placement="top-start"
              >
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
              ：</span
            >
          </template>
          <el-input v-model="infoForm.allocationCode" disabled />
        </el-form-item>
        <el-form-item label="归口股室：" prop="mofDivCode">
          <el-tree-select 
          v-model="infoForm.mofDivCode" 
          :data="mofDepData" 
          :props="{
            children: 'children',
            label: 'mofDepName', 
            value: 'mofDepCode'
          }" 
          :render-after-expand="false"
          placeholder="请选择归属股室" 
          @change="generateCardId" />
        </el-form-item>
        <el-form-item label="所属项目：" prop="prjName">
          <el-input 
          ref="projectInput"
          v-model="infoForm.prjName" 
          placeholder="请选择所属项目" 
          :disabled="checkProject" 
          @click="btnProject"/>
        </el-form-item>
        <el-form-item label="拨款账户：" prop="approve">
          <el-input
            v-model="infoForm.approve"
            placeholder="请选择拨款账户(专户)"
            @click="selectApprove"
          />
        </el-form-item>
        <el-form-item label="收款账户：" prop="collection">
          <el-input
            v-model="infoForm.collection"
            placeholder="请选择收款账户"
            :disabled="!infoForm.approve"
            @click="checkCollection"
          />
        </el-form-item>
        <el-form-item label="金额：" prop="money">
          <el-input
            v-model="infoForm.money"
            placeholder="请输入金额"
          />
        </el-form-item>
        <el-form-item label="摘要：" prop="remark">
          <el-input
            v-model="infoForm.remark"
            type="textarea"
            placeholder="请输入详细摘要信息"
          />
        </el-form-item>
        <el-form-item label="用途：" prop="purpose">
          <el-input
            v-model="infoForm.purpose"
            type="textarea"
            placeholder="请输入专项资金相关用途"
          />
        </el-form-item>
        <el-form-item class="checkItem">
          <el-checkbox
            v-model="infoForm.check1"
            label="打印不显示子账户分隔符"
          />
        </el-form-item>
        <el-form-item class="checkItem">
          <el-checkbox v-model="infoForm.check2" label="打印归口股室及账号" />
        </el-form-item>
        <el-form-item class="checkItem">
          <el-checkbox v-model="infoForm.check3" label="打印不显示子账户" />
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="printfClick">打印</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 选择拨款账号 -->
    <selectApproveVue ref="selectApproveRef" @selected="getSelected" />
    <!-- d打印 -->
    <printView ref="printViewRef" />
    <!-- 选择项目 -->
    <checkProjectView ref="checkProjectViewRef" @reload="projectData"></checkProjectView>
    <!-- 选择付款账号 -->
    <selectCollection ref="selectCollectionRef" @selected="getCollection" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  nextTick,
} from "vue";
import { formatDate } from "@/utils/date";
import printView from "./module/printfView.vue";
import { basMofDepTree, getMaxAllocationCode, dsAllocationRequesAdd } from "@/api/dsAccounts";
import selectApproveVue from "./module/selectApprove.vue";
import checkProjectView from "./module/checkProjectView.vue";
import { da } from "element-plus/es/locale";
import selectCollection from "./module/selectCollection.vue";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "payApplication",
  components: {
    printView,
    selectApproveVue,
    checkProjectView,
    selectCollection
  },
  setup() {
    const infoRef = ref();
    const checkProjectViewRef = ref();
    const projectInput = ref();
    const selectCollectionRef = ref();
    const data = reactive({
      dateTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
      user: {
        agencyName: "溆浦财政局-国库股-出纳",
      },
      infoForm: <any>{
        mofDepName: "",
        allocationCode: "",
        prjName: "",
        prjid: "",
        bankName: "",
        accountName : "",
        accountCode: "",
        approve: "",
        collection: "",
        collectionBankName: "",
        collectionAccountName: "",
        collectionAccountCode: ""
      },
      rules: {
        mofDivCode: [{ required: true, message: "请选择归口股室", trigger: "blur" }],
        approve: [{ required: true, message: "请选择拨款账户", trigger: "blur" }],
        collection: [{ required: true, message: "必填", trigger: "blur" }],
        remark: [{ required: true, message: "必填", trigger: "blur" }],
        purpose: [{ required: true, message: "必填", trigger: "blur" }],
        money: [{ required: true, message: "必填", trigger: "blur" }],
      },
      mofDepData: [],
      accountData: [],
      checkProject: true, //项目选择
      mofDepCode: "",
      projectData: (row:any) => { 
        data.infoForm.prjName = row.prjName;
        data.infoForm.prjid = row.prjid
      },
      checkCollection: () => { 
        selectCollectionRef.value.open(data.infoForm.accountCode);
      }
    });
    const btnProject = () => {
      projectInput.value.blur;
      checkProjectViewRef.value.init(data.mofDepCode);
    }

    // 提交
    const submit = async () => {
      if (!infoRef.value) return;
      await infoRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          console.log("submit!");
          console.log(data.infoForm);
          const list = {
            allocationTime: data.dateTime, //申请时间
            allocationmofcode: data.mofDepCode, //股室
            allocationCode: data.infoForm.allocationCode, //单号
            prjid: data.infoForm.prjid, // 项目
            outaccountcode: data.infoForm.accountCode,
            inaccountcode: data.infoForm.collectionAccountCode,
            amount:data.infoForm.money, // 金额
            remark: data.infoForm.remark, // 摘要
            usepurposeapplication: data.infoForm.purpose, //用途
          }
          dsAllocationRequesAdd(list).then((res: any) => {
            if (res.code == 200) { 
              ElMessage.success(res.message);
            }
          })
        }
      });
    };
    // 生成单号
    const generateCardId = (val: any) => {
      console.log(val);
      data.infoForm.mofDepName = data.mofDepData.filter((item: any) => {
        return item.mofDepCode == val
      });
      data.checkProject = false;
      data.mofDepCode = val;
      data.infoForm.prjName = "";
      data.infoForm.prjid = ""
      getMaxAllocationCode({mofCode: val}).then((res: any) => {
        data.infoForm.allocationCode = res.data.allocationCode
      })
    };
    // 勾选拨款账户
    const selectApproveRef = ref();
    const selectApprove = () => {
      selectApproveRef.value.open()
    }
    // 获取拨款账号
    const getSelected = (val: any) => {
      console.log('当前勾选的账号', val);
      data.infoForm.bankName = val.bankName;
      data.infoForm.accountName = val.accountName;
      data.infoForm.accountCode = val.accountCode;
      data.infoForm.approve = val.bankName + ' - ' + val.accountName + ' - ' + val.accountCode;
      data.infoForm.collectionBankName = "";
      data.infoForm.collectionAccountName = "";
      data.infoForm.collectionAccountCode = "";
      data.infoForm.collection = "";
    }
    // 获取付款账号
    const getCollection= (val: any) => {
      console.log('当前付款的账号', val);
      data.infoForm.collectionBankName = val.bankName;
      data.infoForm.collectionAccountName = val.accountName;
      data.infoForm.collectionAccountCode = val.accountCode;
      data.infoForm.collection = val.bankName + ' - ' + val.accountName + ' - ' + val.accountCode;
    }
    
    // 打印
    const printViewRef = ref();
    const printfClick = () => {
      printViewRef.value.open(data.infoForm, data.user, data.dateTime, data.mofDepCode);
    }

    // 获取下拉数据
    const getCodeData = () => {
      // 股室
      basMofDepTree({sourceId: 1}).then((res: any) => {
        data.mofDepData = res.data;
      })
    }

    onMounted(() => {
      getCodeData();
    })

    return {
      infoRef,
      printViewRef,
      selectApproveRef,
      ...toRefs(data),
      formatDate,
      generateCardId,
      submit,
      selectApprove,
      printfClick,
      getSelected,
      btnProject,
      checkProjectViewRef,
      projectInput,
      selectCollectionRef,
      getCollection
    };
  },
});
</script>

<style lang="scss" scoped>
.info {
  padding: 20px 20px 20px 0;
  background-color: #f8f8f8;
  .labelBox {
    display: flex;
    align-items: center;
  }
  .el-icon {
    cursor: pointer;
    font-size: 18px;
  }
}
.checkItem {
  margin-bottom: 0;
}
/deep/ .btn {
  .el-form-item__content {
    justify-content: center;
  }
}
</style>
