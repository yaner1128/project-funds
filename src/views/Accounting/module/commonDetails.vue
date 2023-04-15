<template>
  <div class="details">
    <div class="topBox">
      <div class="accountSet">
        账套：
        <el-input
          v-model="accountSetName"
          placeholder="请选择账套"
          @click="selectClick"
          style="width: 200px"
          readonly
          :disabled="disabled"
        />
        付款申请：
        <el-input
          v-model="allocationCode"
          placeholder="请选择付款申请"
          @click="selectPayClick"
          style="width: 200px"
          readonly
          :disabled="disabled"
        />
      </div>
      <span>凭证号：{{ certificateNumber }}</span>
    </div>
    <selectAccountSet ref="selectAccountSetRef" @selected="getAccount" />
    <!-- 付款申请 -->
      <selectPayVue ref="selectPayRef" @selected="getPayItem" />
    <div class="payBox">
      <div class="left">
        <div class="title">借方</div>
        <div class="pay_container">
          <itemVue
            ref="itemVueRef1"
            :curData ="sendData"
            :disabled="!accountSetCode || !allocationCode || disabled"
            :treeData="treeData1"
            @putData="getDebitData"
            :isPay="true"
          />
        </div>
      </div>
      <div class="right">
        <div class="title">贷方</div>
        <div class="pay_container">
          <el-scrollbar class="scrollbar">
            <template v-for="item in creditData" :key="item">
              <itemVue
                ref="itemVueRef2"
                :curData="item"
                :disabled="!accountSetCode || !allocationCode || disabled"
                :treeData="treeData2"
                @putData="getCreditData"
              />
            </template>
            <span v-if="accountSetCode && !disabled" class="insertIcon" @click="insertClick"
              ><el-icon><CirclePlus /></el-icon
            ></span>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from "vue";
import selectAccountSet from './selectAccountSet.vue';
import selectPayVue from './selectPay.vue'
import { CirclePlus } from "@element-plus/icons-vue";
import itemVue from "./item.vue";
import { simpleAccountingSubject } from "@/api/dsAccountSets";
import { ElMessage } from "element-plus";
import { formatDate } from "@/utils/date";
import { useStore } from "vuex";

export default defineComponent({
  name: "detailsVue",
  components: {
    selectAccountSet,
    CirclePlus,
    itemVue,
    selectPayVue
  },
  props: {
    detailData: {
      type: Object,
      default: {}
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    const data = reactive({
      user: store.state.user.user,
      certificateNumber: null,
      accountSetName: '',
      accountSetCode: '',
      allocationCode: "",
      treeData1: [],
      treeData2: [],
      curCreditData: <any>{},
      debitData: <any>{},
      creditData: <any>[],
      sendData: <any>{
        amount: ''
      },
    });

    watch(() => props.detailData, (val: any) => {
      if(val) {
        data.accountSetCode = val.accountSetCode;
        data.accountSetName = val.accountSetName;
        data.certificateNumber = val.certificateNumber;
        data.allocationCode = val.allocationCode;

        const tempData = val.data;
        data.creditData = tempData.filter((item: any) => {
          return item.accountDirection === '0'
        })
        data.sendData = tempData.filter((item: any) => {
          return item.accountDirection === '1'
        })[0]
      }
    },{ immediate: true })

    watch(() => data.accountSetCode, (val) => {
      if(val) {
        // 借
        simpleAccountingSubject({ accountSetCode: val,  accountDirection: '1'}).then((res: any) => {
          data.treeData1 = res.data;
        })
        // 贷
        simpleAccountingSubject({ accountSetCode: val,  accountDirection: '0'}).then((res: any) => {
          data.treeData2 = res.data;
        })
      }
    }, { immediate: true })

    // 勾选付款申请
    const selectPayRef = ref();
    const selectPayClick = () => {
      selectPayRef.value.open();
    }
    const getPayItem = (val: any) => {
      console.log('当前勾选的付款申请', val)
      data.sendData.amount = val.amount;
      data.allocationCode = val.allocationCode;
    }
    // 勾选账套
    const selectAccountSetRef = ref();
    const selectClick = () => {
      selectAccountSetRef.value.open()
    }
    const itemVueRef1 = ref();
    const itemVueRef2 = ref();
    const getAccount = (val: any) => {
      data.accountSetName = val.accountSetName;
      data.accountSetCode = val.accountSetCode;
      // 借
      simpleAccountingSubject({ accountSetCode: val.accountSetCode,  accountDirection: '1'}).then((res: any) => {
        data.treeData1 = res.data;
      })
      // 贷
      simpleAccountingSubject({ accountSetCode: val.accountSetCode,  accountDirection: '0'}).then((res: any) => {
        data.treeData2 = res.data;
      })
      clearItem();
    }
    // 插入贷方科目
    const insertClick = () => {
      data.creditData.push({});
    };

    const clearItem = () => {
      // 借方数据清除
      if(!data.allocationCode) {
        itemVueRef1.value.clear();
        data.sendData = {};
      }
      data.sendData = {
        amount: data.sendData.amount
      };
      
      // 贷方数据清除
      data.creditData = [{}]
      for(var i=0; i<itemVueRef2.value.length; i++) {
        itemVueRef2.value[i].clear()
      }
    }
    // 借
    const getDebitData = (val: any) => {
      for(var k in val) {
        data.debitData[k] = val[k]
      }
    }
    // 贷
    const getCreditData = (val: any) => {
      for(var k in val) {
        data.curCreditData[k] = val[k];
      }
    }

    const checkValid = async () => {
      data.debitData = {};
      data.curCreditData = {};
      // 借方数据校验
      let idError = true;
      idError = await itemVueRef1.value.checkValid();
      // 贷方数据校验
      let creditError = true;
      for(var i=0; i<itemVueRef2.value.length; i++) {
        creditError = await itemVueRef2.value[i].checkValid()
        if(!creditError) {
          return false;
        }
      }
      if(idError && creditError) {
        const isEqual = checkIsEqual();
        if(!isEqual) {
          ElMessage.error('借、贷金额必须相等!');
          return false;
        }
        emit('putData', Object.assign({
          common: {
            certificateNumber: data.certificateNumber,
            ledgerTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            review: 0,
            isEqual: 't',
            accountSetCode: data.accountSetCode,
            mofDivCode: data.user.mofDivCode,
            allocationCode: data.allocationCode,
            isDeleted: 0,
          },
          data: Object.assign(data.debitData,data.curCreditData)
        }))
        return true;
      }
      return false;
    }
    // 判断借贷是否相等
    const checkIsEqual = () => {
      debugger
      // 获取借方金额
      let borrow_value = 0;
      for(var k in data.debitData) {
        borrow_value += Number(data.debitData[k].amount);
      }
      // 获取贷方金额合计
      let credit_value = 0;
      for(var k in data.curCreditData) {
        credit_value += Number(data.curCreditData[k].amount)
      }

      if(borrow_value===credit_value) {
        return true;
      }
      return false;
    }

    return {
      itemVueRef1,
      itemVueRef2,
      selectAccountSetRef,
      ...toRefs(data),
      selectClick,
      getDebitData,
      getCreditData,
      getAccount,
      insertClick,
      checkValid,
      selectPayRef,
      selectPayClick,
      getPayItem
    };
  },
});
</script>

<style lang="scss" scoped>
.topBox{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  color: #222;
}
.payBox {
  border: 1px solid #ccc;
  min-height: 200px;
  max-height: calc(100vh - 360px);
  display: flex;
  flex-direction: row;
  .left,
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      width: 100%;
      padding: 5px 0;
      text-align: center;
      font-size: 16px;
      font-weight: 800;
      color: #000;
      border-bottom: 1px solid #ccc;
    }
  }
  .pay_container {
    position: relative;
    padding: 5px 0 0;
  }
  .right {
    border-left: 1px solid #ccc;
    .insertIcon {
      cursor: pointer;
      font-size: 20px;
      color: #409eff;
      height: 50px;
      line-height: 40px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
