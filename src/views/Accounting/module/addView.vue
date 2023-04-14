<template>
  <el-dialog
    top="10vh"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1100px"
    title="记账"
    :before-close="resetForm"
  >
    <div class="dialog_container">
      <div class="accountSet">
        账套：
        <el-input
          v-model="accountSetName"
          placeholder="请选择账套"
          @click="selectClick"
          style="width: 200px"
          readonly
        />
      </div>
      <selectAccountSet ref="selectAccountSetRef" @selected="getAccount" />
      <div class="payBox">
        <div class="left">
          <div class="title">借方</div>
          <div class="pay_container">
            <itemVue ref="itemVueRef1" :disabled="!accountSetCode" :curData="sendData" :treeData="treeData1" @putData="getDebitData" />
          </div>
        </div>
        <div class="right">
          <div class="title">贷方</div>
          <div class="pay_container">
            <el-scrollbar class="scrollbar">
              <template v-for="key in creditData" :key="key">
                <itemVue ref="itemVueRef2" :disabled="!accountSetCode" :curData="key" :treeData="treeData2" @putData="getCreditData" />
              </template>
              <span v-if="accountSetCode" class="insertIcon" @click="insertClick"
                ><el-icon><CirclePlus /></el-icon
              ></span>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div style="text-align: right">
        <el-button @click="submitClick" type="primary">确认</el-button>
        <el-button @click="resetForm" link>取消</el-button>
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
  watch
} from "vue";
import { addDsLedger } from "@/api/bookkeeping";
import { ElMessage } from "element-plus";
import itemVue from "./item.vue";
import { CirclePlus } from "@element-plus/icons-vue";
import selectAccountSet from './selectAccountSet.vue';
import { simpleAccountingSubject } from "@/api/dsAccountSets";
import { useStore } from "vuex";
import { formatDate } from "@/utils/date";

export default defineComponent({
  name: "addView",
  components: {
    itemVue,
    CirclePlus,
    selectAccountSet
  },
  setup(props, { emit }) {
    const store = useStore();
    const data = reactive({
      user: store.state.user.user,
      dialogFormVisible: false,
      maxHeight: 400,
      accountSetCode: "",
      accountSetName: "",
      creditData: [{}],
      sendData: {},
      treeData1: [],
      treeData2: [],
      curCreditData: <any>{},
      debitData: <any>{}
    });
    // 打开弹窗
    const open = () => {
      data.creditData = [{}];
      data.sendData = {};
      data.dialogFormVisible = true;
      autoHeight();
    };

    // 勾选账套
    const selectAccountSetRef = ref();
    const selectClick = () => {
      selectAccountSetRef.value.open()
    }
    const getAccount = (val: any) => {
      console.log('当前勾选账套', val)
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
    const clearItem = () => {
      // 借方数据清除
      itemVueRef1.value.clear();
      // 贷方数据清除
      for(var i=0; i<itemVueRef2.value.length; i++) {
        itemVueRef2.value[i].clear()
      }
    }
    // 插入贷方科目
    const insertClick = () => {
      data.creditData.push({});
    };

    // 关闭
    const resetForm = () => {
      data.creditData = [];
      data.sendData = {};
      data.accountSetCode = "";
      data.accountSetName = "";
      data.treeData1 = []
      data.treeData2 = []
      data.dialogFormVisible = false;
    };
    // 余额修正提交
    const itemVueRef1 = ref<any>();
    const itemVueRef2 = ref<any>();
    const submitClick = async () => {
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
          return;
        }
        console.log('校验成功');
        const allData = <any>Object.assign(data.curCreditData, data.debitData);
        const temp = <any>[];
        const ledgerTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        for(var key in allData){
          temp.push(Object.assign({
            accountSetCode: data.accountSetCode,
            mofDivCode: data.user.mofDivCode,
            ledgerTime: ledgerTime
          }, allData[key]))
        }
        console.log(temp)
        addDsLedger(temp).then((res: any) => {
          if(res.code === 200) {
            ElMessage.success('新增成功!')
            resetForm();
            emit('reload')
            return
          }
          ElMessage.warning(res.message)
        })
      }
    };
    // 判断借贷是否相等
    const checkIsEqual = () => {
      // 获取借方金额
      let borrow_value = 0;
      for(var k in data.debitData) {
        borrow_value += Number(data.debitData[k].amount);
      }
      // 获取贷方金额合计
      let credit_value = 0;
      for(var k in data.curCreditData) {
        credit_value += Number(data.curCreditData[k].amount);
      }

      if(borrow_value===credit_value) {
        return true;
      }
      return false;
    }
    // 借
    const getDebitData = (val: any) => {
      console.log(val)
      for(var k in val) {
        data.debitData[k] = val[k]
      }
    }
    // 贷
    const getCreditData = (val: any) => {
      console.log(val)
      for(var k in val) {
        data.curCreditData[k] = val[k];
      }
    }

    // 设置高度
    const setHeight = () => {
      nextTick(() => {
        data.maxHeight = innerHeight - 100; // 这里的X就是顶部栏的高度
      });
    };
    // 高度自适应
    const autoHeight = () => {
      // 初始化的时候，设置高度
      setHeight();
      // 改变浏览器窗口大小的时候，设置高度
      window.addEventListener("resize", () => {
        setHeight();
      });
    };

    onMounted(() => {
      autoHeight();
    });

    return {
      selectAccountSetRef,
      itemVueRef1,
      itemVueRef2,
      ...toRefs(data),
      open,
      resetForm,
      submitClick,
      insertClick,
      selectClick,
      getAccount,
      getCreditData,
      getDebitData
    };
  },
});
</script>

<style lang="scss" scoped>
.scrollbar {
  max-height: calc(100vh - 400px);
}
.accountSet{
  padding-bottom: 5px;
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
