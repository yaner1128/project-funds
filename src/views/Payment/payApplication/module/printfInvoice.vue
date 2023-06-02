<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="800px"
    title="打印预览"
    :before-close="resetForm"
  >
    <div class="dialog_container" id="print-invoice">
      <div style="overflow: hidden" class="content">
        <!-- 年 -->
        <div class="year">2022</div>
        <!-- 月 -->
        <div class="month">06</div>
        <!-- 日 -->
        <div class="day">22</div>
        <!-- 付款全称 -->
        <div class="payName">啊发撒打发</div>
        <!-- 付款账号 -->
        <div class="payAccount">完全颠覆请问</div>
        <!-- 付款银行 -->
        <div class="payBank">啊v阿迪斯</div>
        <!-- 收款全称 -->
        <div class="getName">啊发撒打发</div>
        <!-- 收款账号 -->
        <div class="getAccount">阿斯弗</div>
        <!-- 收款银行 -->
        <div class="getBank">啊v阿迪斯</div>
        <!-- 人民币大写 -->
        <div class="rmb">
          {{ menoyToUppercase(listData.money) }}
        </div>
        <!-- 分 -->
        <div class="money1">8</div>
        <!-- 角 -->
        <div class="money2">6</div>
        <!-- 元 -->
        <div class="money3">4</div>
        <!-- 十 -->
        <div class="money4">3</div>
        <!-- 百 -->
        <div class="money5">4</div>
        <!-- 千 -->
        <div class="money6">2</div>
        <!-- 万 -->
        <div class="money7">7</div>
        <!-- 十万 -->
        <div class="money8">1</div>
        <!-- 百万 -->
        <div class="money9">1</div>
        <!-- 千万 -->
        <div class="money10">1</div>
        <!-- 用途 -->
        <div class="purpose">氨法沙发沙发</div>
        <!-- 科目（借） -->
        <div class="borrow">分身乏术</div>
        <!-- 对方科目(贷) -->
        <div class="credit">份未发俄方微风</div>
        <!-- 转账年 -->
        <div class="turnYear">2023</div>
        <!-- 转账月 -->
        <div class="turnMon">06</div>
        <!-- 转账日 -->
        <div class="turnDay">02</div>
        <!-- 复核 -->
        <div class="review">秦行南</div>
        <!-- 记账 -->
        <div class="tally">发的</div>
      </div>
    </div>
    <template #footer>
      <div style="text-align: right">
        <el-button type="primary" v-print="prints">确认</el-button>
        <el-button @click="resetForm" link>取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { numFormat, numToTenThousand } from "@/utils/numFormat";
import print from "vue3-print-nb";

export default defineComponent({
  name: "printfInvoice",
  setup() {
    const data = reactive({
      dialogFormVisible: false,
      listData: <any>{},
      dateTime: "",
      mofDepCode: "",
      user: <any>{},
    });

    const vPrint = print;
    let prints = {
      id: "print-invoice",
      popTitle: " ", // 打印配置页上方的标题
      extraHead: " ", // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
      preview: false, // 是否启动预览模式，默认是false
      previewTitle: "预览的标题", // 打印预览的标题
      previewPrintBtnLabel: "预览结束，开始打印", // 打印预览的标题下方的按钮文本，点击可进入打印
      zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
      previewBeforeOpenCallback() {
        console.log("正在加载预览窗口！");
      }, // 预览窗口打开之前的callback
      previewOpenCallback() {
        console.log("已经加载完预览窗口，预览打开了！");
      }, // 预览窗口打开时的callback
      // 开始打印之前的callback
      beforeOpenCallback() {
        console.log("开始打印之前！");
      },
      openCallback() {
        console.log("执行打印了！");
      }, // 调用打印时的callback
      closeCallback() {
        console.log("关闭了打印工具！");
        var element = document.getElementById("print-invoice");
        // element?.parentNode?.removeChild(element);
      }, // 关闭打印的callback(无法区分确认or取消)
      clickMounted() {
        console.log("点击v-print绑定的按钮了！");
      },
      standard: "",
      extarCss: "",
    };

    // 打开弹窗
    const open = (row: any, user: any, dateTime: any, mofDepCode: any) => {
      data.dialogFormVisible = true;
      console.log("11", row);
      console.log("22", user);
      data.listData = row;
      console.log('********', row)
      data.user = user;
      data.dateTime = dateTime;
      data.mofDepCode = mofDepCode;
    };
    // 关闭
    const resetForm = () => {
      data.dialogFormVisible = false;
    };

    // 人民币大写
    const menoyToUppercase = (money: any) => {
      var cnNums = new Array(
        "零",
        "壹",
        "贰",
        "叁",
        "肆",
        "伍",
        "陆",
        "柒",
        "捌",
        "玖"
      ); //汉字的数字
      var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
      var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
      var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
      var cnInteger = "整"; //整数金额时后面跟的字符
      var cnIntLast = "元"; //整数完以后的单位
      //最大处理的数字
      var maxNum = 999999999999999.9999;
      var integerNum; //金额整数部分
      var decimalNum; //金额小数部分
      //输出的中文金额字符串
      var chineseStr = "";
      var parts; //分离金额后用的数组，预定义
      if (money == "") {
        return "";
      }

      money = parseFloat(money);
      if (money >= maxNum) {
        //超出最大处理数字
        return "超出最大处理数字";
      }
      if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
      }
      //四舍五入保留两位小数,转换为字符串
      money = Math.round(money * 100).toString();
      integerNum = money.substr(0, money.length - 2);
      decimalNum = money.substr(money.length - 2);
      //获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
          var n = integerNum.substr(i, 1);
          var p = IntLen - i - 1;
          var q = p / 4;
          var m = p % 4;
          if (n == "0") {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0];
            }
            //归零
            zeroCount = 0;
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m == 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q];
          }
        }
        chineseStr += cnIntLast;
      }
      //小数部分
      if (decimalNum != "") {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
          var n = decimalNum.substr(i, 1);
          if (n != "0") {
            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (chineseStr == "") {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (decimalNum == "" || /^0*$/.test(decimalNum)) {
        chineseStr += cnInteger;
      }
      return chineseStr;
    };

    // 获取人民币每位数值
    const getMoney = (number: any) => {
      if (parseInt(number) == number) {
        var money = number.toFixed(2).toString().split('');
        var points = money[money.length - 1] == undefined ? '' : money[money.length - 1];
        var angle = money[money.length - 2] == undefined ? '' : money[money.length - 2];
        var yuan = money[money.length - 4] == undefined ? '' : money[money.length - 4];
        var ten = money[money.length - 5] == undefined ? '' : money[money.length - 5];
        var best = money[money.length - 6] == undefined ? '' : money[money.length - 6];
        var thousand = money[money.length - 7] == undefined ? '' : money[money.length - 7];
        var wan = money[money.length - 8] == undefined ? '' : money[money.length - 8];
        var one = money[money.length - 9] == undefined ? '' : money[money.length - 9];
        var two = money[money.length - 10] == undefined ? '' : money[money.length - 10];
        var three = money[money.length - 11] == undefined ? '' : money[money.length - 11];
      }
    };

    return {
      ...toRefs(data),
      open,
      resetForm,
      menoyToUppercase,
      numFormat,
      numToTenThousand,
      vPrint,
      prints,
    };
  },
});
</script>

<style lang="scss" scoped>
// 去除页眉页脚
 @page{
  size:  auto;   /* auto is the initial value */
  margin: 3mm;  /* this affects the margin in the printer settings */
}

.scrollbar {
  height: calc(100vh - 173px);
}

.flexBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 25px 0;
}

.content {
  width: 100%;
  height: 280pt;
  background: url('../../../../assets/back.jpg') no-repeat center;
  background-size: contain;
  position: relative;
}

.year {
  position: absolute;
  top: 55px;
  left: 285px;
}

.month {
  position: absolute;
  top: 55px;
  left: 345px;
}

.day {
  position: absolute;
  top: 55px;
  left: 393px;
}

.payName, .payAccount, .payBank {
  position: absolute;
  top: 80px;
  left: 190px;
}
.getName, .getAccount, .getBank {
  position: absolute;
  top: 80px;
  left: 500px;
}

.payAccount, .getAccount {
  top: 110px;
}

.payBank, .getBank {
  top: 140px;
}

.rmb {
  position: absolute;
  top: 175px;
  left: 130px;
}

.money1, 
.money2, 
.money3, 
.money4, 
.money5, 
.money6, 
.money7,
.money8, 
.money9, 
.money10{
  position: absolute;
  top: 185px;
  left: 686px;
  // right: 66px;
}

.money2 {
  left: 666px
}
.money3 {
  left: 646px
}
.money4 {
  left: 626px
}
.money5 {
  left: 606px
}
.money6 {
  left: 586px
}
.money7 {
  left: 566px
}
.money8 {
  left: 546px
}
.money9 {
  left: 526px
}
.money10 {
  left: 506px
}

.purpose {
  position: absolute;
  top: 210px;
  left: 130px;
}

.borrow {
  position: absolute;
  top: 240px;
  left: 570px;
}

.credit {
  position: absolute;
  top: 260px;
  left: 600px;
}

.turnYear, .turnMon, .turnDay {
  position: absolute;
  top: 285px;
  left: 580px;
}
.turnMon {
  left: 630px;
} 
.turnDay {
  left: 665px;
}

.review, .tally {
  position: absolute;
  top: 328px;
  left: 550px;
}

.tally {
  left: 645px;
}
</style>
