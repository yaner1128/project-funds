<template>
  <el-dialog
    top="10vh"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1100px"
    :title="isEdit? '编辑专户付款申请' : '详情'"
    :before-close="resetForm"
  >
    <el-scrollbar class="scrollbar">
      <div class="dialog_container">
        <!-- 标题 -->
        <div class="title_info">
          <p>
            <span>制单人：{{ user.agencyName }}</span> &nbsp;
            <span>制单时间：{{ infoForm.allocationTime }}</span>
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
            :disabled="!isEdit"
          >
            <el-form-item label="单号：" prop="allocationCode">
              <template #label>
                <span class="labelBox"
                  >单号
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="生成规则：股室简称-日期-排序号"
                    placement="top-start"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  ：</span
                >
              </template>
              <el-input v-model="infoForm.allocationCode" disabled />
            </el-form-item>
            <el-form-item label="归口股室：" prop="allocationMofCode">
              <el-tree-select
                v-model="infoForm.allocationMofCode"
                :data="mofDepData"
                :disabled="true"
                :props="{
                  children: 'children',
                  label: 'codeName',
                  value: 'code',
                }"
                :render-after-expand="false"
                placeholder="请选择归属股室"
                @change="generateCardId"
              />
            </el-form-item>
            <el-form-item label="所属项目：" prop="prjName">
              <el-input
                ref="projectInput"
                v-model="infoForm.prjName"
                placeholder="请选择所属项目"
                :disabled="!infoForm.allocationMofCode"
                @click="btnProject"
              />
            </el-form-item>
            <el-form-item label="拨款账户：" prop="outAccountCode">
              <el-input
                v-model="infoForm.outAccount"
                placeholder="请选择拨款账户(专户)"
                @click="selectApprove"
              />
            </el-form-item>
            <el-form-item label="收款账户：" prop="inAccountCode">
              <el-input
                v-model="infoForm.inAccount"
                placeholder="请选择收款账户"
                :disabled="!infoForm.outAccountCode"
                @click="checkCollection"
              />
            </el-form-item>
            <el-form-item label="金额：" prop="amount">
              <!-- <el-input v-model="infoForm.amount" placeholder="请输入金额" /> -->
              <el-input-number v-model="infoForm.amount" :precision="2" :controls="false" placeholder="请输入金额" />
            </el-form-item>
            <el-form-item label="摘要：" prop="remark">
              <el-input
                v-model="infoForm.remark"
                type="textarea"
                placeholder="请输入详细摘要信息"
              />
            </el-form-item>
            <el-form-item label="用途：" prop="userpurposerapplication">
              <el-input
                v-model="infoForm.userpurposerapplication"
                type="textarea"
                placeholder="请输入专项资金相关用途"
              />
            </el-form-item>
            <!-- <el-form-item class="checkItem">
              <el-checkbox
                v-model="infoForm.check1"
                label="打印不显示子账户分隔符"
              />
            </el-form-item>
            <el-form-item class="checkItem">
              <el-checkbox
                v-model="infoForm.check2"
                label="打印归口股室及账号"
              />
            </el-form-item>
            <el-form-item class="checkItem">
              <el-checkbox v-model="infoForm.check3" label="打印不显示子账户" />
            </el-form-item> -->
          </el-form>
        </div>
        <!-- 选择拨款账号 -->
        <selectApproveVue ref="selectApproveRef" @selected="getSelected" />
        <!-- d打印 -->
        <printView ref="printViewRef" />
        <!-- 选择项目 -->
        <checkProjectView
          ref="checkProjectViewRef"
          @reload="projectData"
        ></checkProjectView>
        <!-- 选择付款账号 -->
        <selectCollection ref="selectCollectionRef" @selected="getCollection" />
      </div>
    </el-scrollbar>
    <template #footer>
      <div style="text-align: right" v-if="isEdit">
        <el-button @click="submitClick" type="primary">确认</el-button>
        <el-button @click="resetForm" link>取消</el-button>
      </div>
      <div style="text-align: right" v-else>
        <el-button @click="resetForm" type="primary">关闭</el-button>
      </div>
    </template>
  </el-dialog>
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
import {
  basMofDepTree,
  getMaxAllocationCode,
  dsAllocationDetail,
  updateDsAllocationReques
} from "@/api/dsAccounts";
import selectApproveVue from "../../payApplication/module/selectApprove.vue";
import checkProjectView from "../../payApplication/module/checkProjectView.vue";
import selectCollection from "../../payApplication/module/selectCollection.vue";
import printView from "../../payApplication/module/printfView.vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { getProjectEleUnionTree } from "@/api/codeManage";

export default defineComponent({
  name: "editView",
  components: {
    printView,
    selectApproveVue,
    checkProjectView,
    selectCollection,
  },
  setup(props, { emit }) {
    const store = useStore();
    const infoRef = ref();
    const checkProjectViewRef = ref();
    const projectInput = ref();
    const selectCollectionRef = ref();
    const data = reactive({
      isEdit: false,
      dialogFormVisible: false,
      allocationCode: null,
      user: {
        agencyName: store.state.user.user.username,
      },
      infoForm: <any>{
        isValid: 0,
        allocationCode: "",
        allocationMofCode: "",
        allocationMofName: "",
        prjId: "",
        prjName: "",
        outAccountCode: "",
        outAccountName: "",
        inAccountCode: "",
        inAccountName: "",
        amount: null,
        remark: "",
        userpurposerapplication: ""
      },
      rules: {
        allocationMofCode: [
          { required: true, message: "请选择归口股室", trigger: "blur" },
        ],
        outAccountCode: [
          { required: true, message: "请选择拨款账户", trigger: "blur" },
        ],
        inAccountCode: [
          { required: true, message: "请选择收款账户", trigger: "blur" },
        ],
        collection: [{ required: true, message: "必填", trigger: "blur" }],
        remark: [{ required: true, message: "必填", trigger: "blur" }],
        userpurposerapplication: [{ required: true, message: "必填", trigger: "blur" }],
        amount: [{ required: true, message: "必填", trigger: "blur" }],
      },
      mofDepData: [],
      accountData: [],
      checkProject: true, //项目选择
      mofDepCode: "",
      projectData: (row: any) => {
        console.log(row)
        data.infoForm.prjName = row.prjName;
        data.infoForm.prjid = row.prjid;
      },
      checkCollection: () => {
        selectCollectionRef.value.open(data.infoForm.outAccountCode);
      },
    });
    const btnProject = () => {
      projectInput.value.blur;
      checkProjectViewRef.value.init(data.mofDepCode);
    };

    // 打开弹窗
    const open = (allocationCode: any, isEdit: any) => {
      data.isEdit = isEdit;
      data.allocationCode = allocationCode;
      dsAllocationDetail({allocationCode: allocationCode}).then((res: any) => {
        data.infoForm.allocationCode = res.data.allocationCode;
        data.infoForm.allocationMofCode = res.data.allocationMofCode;
        data.infoForm.allocationMofName = res.data.allocationMofName;
        data.infoForm.prjId = res.data.prjId;
        data.infoForm.prjName = res.data.prjName;
        data.infoForm.outAccountCode = res.data.outAccountCode;
        data.infoForm.outAccountName = res.data.outAccountName;
        data.infoForm.inAccountCode = res.data.inAccountCode;
        data.infoForm.inAccountName = res.data.inAccountName;
        data.infoForm.amount = res.data.amount;
        data.infoForm.remark = res.data.remark;
        data.infoForm.userpurposerapplication = res.data.userpurposerapplication;
        data.infoForm.allocationTime = res.data.allocationTime;
        data.infoForm.allocationCode = res.data.allocationCode;
        data.infoForm.outAccount = res.data.outBankName+'-'+res.data.outAccountName+'-'+res.data.outAccountCode;
        data.infoForm.inAccount = res.data.inBankName+'-'+res.data.inAccountName+'-'+res.data.inAccountCode;
        data.dialogFormVisible = true;
      })
    };
    // 关闭
    const resetForm = () => {
      infoRef.value.resetFields();
      data.dialogFormVisible = false;
    };
    // 余额修正提交
    const submitClick = async () => {
      await infoRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          updateDsAllocationReques(data.infoForm).then((res: any) => {
            if(res.code === 200) {
              ElMessage.success('修改成功')
              resetForm();
              emit('reload');
              return;
            }
            ElMessage.success(res.message)
          })
        }
      });
    };
    // 生成单号
    const generateCardId = (val: any) => {
      const curMofDepData = <any>data.mofDepData.filter((item: any) => {
        return item.code == val;
      });
      data.infoForm.allocationMofName = curMofDepData[0].codeName;
      data.checkProject = false;
      data.mofDepCode = val;
      data.infoForm.prjName = "";
      data.infoForm.prjId = "";
      getMaxAllocationCode({
        mofName: curMofDepData[0].abbreviation,
      }).then((res: any) => {
        data.infoForm.allocationCode = res.data.allocationCode;
      });
    };
    // 勾选拨款账户
    const selectApproveRef = ref();
    const selectApprove = () => {
      selectApproveRef.value.open();
    };
    // 获取拨款账号
    const getSelected = (val: any) => {
      console.log("当前勾选的账号", val);
      data.infoForm.outAccountName = val.accountName;
      data.infoForm.outAccountCode = val.accountCode;
      data.infoForm.outAccount = val.bankName + " - " + val.accountName + " - " + val.accountCode;
      data.infoForm.inAccountName = "";
      data.infoForm.inAccountCode = "";
      data.infoForm.inAccount = "";
    };
    // 获取付款账号
    const getCollection = (val: any) => {
      console.log("当前付款的账号", val);
      data.infoForm.inAccountName = val.accountName;
      data.infoForm.inAccountCode = val.accountCode;
      data.infoForm.inAccount = val.bankName + " - " + val.accountName + " - " + val.accountCode;
    };

    // 获取下拉数据
    const getCodeData = () => {
      // 股室
      // basMofDepTree({sourceId: 1}).then((res: any) => {
      //   data.mofDepData = res.data;
      // })
      getProjectEleUnionTree({ type: "MOF" }).then((res: any) => {
        data.mofDepData = res.data;
      });
    };

    onMounted(() => {
      getCodeData();
    });

    return {
      infoRef,
      selectApproveRef,
      ...toRefs(data),
      formatDate,
      generateCardId,
      selectApprove,
      getSelected,
      btnProject,
      checkProjectViewRef,
      projectInput,
      selectCollectionRef,
      getCollection,
      store,
      open,
      resetForm,
      submitClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.scrollbar {
  height: calc(100vh - 360px);
}
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
/deep/ .el-input-number {
  width: 100%;
  input{
    text-align: left;
    width: 100%;
  }
}
</style>
