<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1000px"
    title="打印预览"
    :before-close="resetForm"
  >
    <div class="dialog_container" id="print-iframe">
      <div style="overflow: hidden">
        <h3
          style="
            text-align: center;
            margin-top: 30px;
            margin-bottom: 20px;
            letter-spacing: 2px;
            font-size: 22px;
          "
        >
          专户付款申请拨款单
        </h3>
        <div class="flexBox">
          <div>
            <span>单据日期：</span>
            <span style="color: #1890ff">{{ dateTime }}</span>
          </div>
          <div>
            <span>申请书编号：</span>
            <span style="color: #1890ff">{{ listData.allocationCode }}</span>
          </div>
        </div>
        <table
          style="width: 100%"
          class="table table-striped table-bordered"
          align="center"
          valign="center"
        >
          <!--  -->
          <tr v-if="listData.check2">
            <td class="column" colspan="3">对应归口股市：</td>
            <td class="value" colspan="3">
              {{ listData.mofDepName[0].codeName }}
            </td>
            <td class="value" colspan="6"></td>
          </tr>
          <!-- 付款人 全称 收款人 全称 -->
          <tr>
            <td class="column" :rowspan="listData.check2 ? '3' : '2'" colspan="1">付款人</td>
            <td class="column" colspan="2">
              全&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：
            </td>
            <td class="value" colspan="3">
              {{ listData.collectionAccountName }}
            </td>
            <td class="column" :rowspan="listData.check2 ? '3' : '2'" colspan="1">收款人</td>
            <td class="column" colspan="2">
              全&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：
            </td>
            <td class="value" colspan="3">{{ listData.accountName }}</td>
          </tr>
          <!-- 账号 -->
          <tr v-if="listData.check2">
            <td class="column" colspan="2">
              账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：
            </td>
            <td class="value" colspan="3">
              {{ listData.collectionAccountCode }}
            </td>
            <td class="column" colspan="2">
              账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：
            </td>
            <td class="value" colspan="3">{{ listData.accountCode }}</td>
          </tr>
          <!-- 开户银行 -->
          <tr>
            <td class="column" colspan="2">开户银行：</td>
            <td class="value" colspan="3">{{ listData.collectionBankName }}</td>
            <td class="column" colspan="2">开户银行：</td>
            <td class="value" colspan="3">{{ listData.bankName }}</td>
          </tr>
          <!-- 金额 -->
          <tr>
            <td class="column" colspan="3">人民币（大写）</td>
            <td class="value" colspan="3" style="font-weight: 600">
              {{ menoyToUppercase(listData.money) }}
            </td>
            <td class="column" colspan="3">金额（小写）</td>
            <td class="value" colspan="3" style="text-align: right">
              {{ numFormat(listData.money) }}
            </td>
          </tr>
          <!--  -->
          <tr>
            <td class="column" colspan="3"></td>
            <td class="value" colspan="9"></td>
          </tr>
          <!-- 摘要 -->
          <tr>
            <td class="column" colspan="3">
              摘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;要：
            </td>
            <td class="value" colspan="9">{{ listData.remark }}</td>
          </tr>
          <!-- 用途 -->
          <tr>
            <td class="column" colspan="3">
              用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;途：
            </td>
            <td class="value" colspan="9">{{ listData.purpose }}</td>
          </tr>
        </table>
        <div class="flexBox">
          <div>
            <span>制单人：</span>
            <span style="color: #1890ff">{{ user.agencyName }}</span>
          </div>
          <div>
            <span>审核人：</span>
            <span style="color: #1890ff"></span>
          </div>
          <!-- <div>
            <span>记账标志：</span>
            <span style="color: #1890ff"></span>
          </div> -->
        </div>
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
  name: "printfView",
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
      id: "print-iframe",
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
        var element = document.getElementById("print-iframe");
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

.table {
  border-collapse: collapse;
  border-spacing: 0;
  background-color: transparent;
  display: table;
  width: 100%;
  max-width: 100%;
  width: 800px;
  margin: 0 auto;
}
.table td {
  vertical-align: middle;
  font-size: 14px;
  font-family: "Arial Normal", "Arial";
  color: #333333;
  padding: 8px 12px;
}
.table-bordered {
  border: 1px solid #ddd;
}
.column {
  text-align: center;
  width: 30px;
  height: 30px;
  border: 1px solid #333;
  background: #f1f1f1;
}
.value {
  // width: 70px;
  min-width: 200px;
  height: 30px;
  border: 1px solid #333;
  color: #1890ff !important;
}

.flexBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 25px 0;
}
</style>
