<template>
  <div class="app-container">
    <!-- 标题 -->
    <div class="title_info">
      <h2>新增专户付款申请</h2>
      <p>
        <span>制单人：{{ user.agencyName }}</span> &nbsp;
        <span
          >制单时间：{{ formatDate(new Date(), "yyyy-MM-dd hh:mm:ss") }}</span
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
        <el-form-item label="单号：" prop="cardId">
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
          <el-input v-model="infoForm.cardId" disabled />
        </el-form-item>
        <el-form-item label="归口股室：" prop="mofDivCode">
          <el-input
            v-model="infoForm.mofDivCode"
            placeholder="请选择股室"
            @change="generateCardId"
          />
        </el-form-item>
        <el-form-item label="所属项目：" prop="projectId">
          <el-input v-model="infoForm.projectId" placeholder="请选择所属项目" />
        </el-form-item>
        <el-form-item label="拨款账户：" prop="approve">
          <el-input
            v-model="infoForm.approve"
            placeholder="请选择拨款账户(专户)"
          />
        </el-form-item>
        <el-form-item label="收款账户：" prop="collection">
          <el-input
            v-model="infoForm.collection"
            placeholder="请选择收款账户"
            :disabled="!infoForm.approve"
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
    <!-- d打印 -->
    <printView ref="printViewRef" />
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

export default defineComponent({
  name: "payApplication",
  components: {
    printView
  },
  setup() {
    const infoRef = ref();
    const data = reactive({
      user: {
        agencyName: "溆浦财政局-国库股-出纳",
      },
      infoForm: {
        cardId: "",
      },
      rules: {
        mofDivCode: [{ required: true, message: "必填", trigger: "blur" }],
        approve: [{ required: true, message: "必填", trigger: "blur" }],
        collection: [{ required: true, message: "必填", trigger: "blur" }],
        remark: [{ required: true, message: "必填", trigger: "blur" }],
        purpose: [{ required: true, message: "必填", trigger: "blur" }],
      },
    });
    // 提交
    const submit = async () => {
      if (!infoRef.value) return;
      await infoRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          console.log("submit!");
          console.log(data.infoForm);
        }
      });
    };
    // 生成单号
    const generateCardId = (val: any) => {
      if (!val) {
        data.infoForm.cardId = "";
        return;
      }
      data.infoForm.cardId = val + new Date().getTime();
    };
    // 打印
    const printViewRef = ref();
    const printfClick = () => {
      printViewRef.value.open();
    }

    return {
      infoRef,
      printViewRef,
      ...toRefs(data),
      formatDate,
      generateCardId,
      submit,
      printfClick
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
