<template>
  <el-dialog
    top="7vh"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1000px"
    title="打印预览"
    :before-close="resetForm"
  >
    <div class="dialog_container" id="print-apply">
      <div style="overflow: hidden">
        <h3
          style="
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
            letter-spacing: 2px;
            font-size: 22px;
          "
        >
        专项资金拨付申请书
        </h3>
        <div class="flexBox">
          <div>
            <span>编号：</span>
            <span>财&nbsp;&nbsp;综&nbsp;&nbsp;字&nbsp;&nbsp;2193&nbsp;&nbsp;号</span>
          </div>
          <div>
            <span>{{ dateTime.split(" ")[0].split("-")[0] }}&nbsp;&nbsp;年&nbsp;&nbsp;{{ dateTime.split(" ")[0].split("-")[1] }}&nbsp;&nbsp;月&nbsp;&nbsp;{{ dateTime.split(" ")[0].split("-")[2] }}&nbsp;&nbsp;日</span>
          </div>
          <div>
            <span>单位：</span>
            <span>元</span>
          </div>
        </div>
        <div class="flexBox" style="justify-content: flex-start;">
          <div>
            <span>申请书编号：</span>
            <span>0220231406</span>
          </div>
          <div style="margin-left: 40px;">
            <span>项目名称：</span>
            <span>001&nbsp;&nbsp;非税往来</span>
          </div>
        </div>
        <table
          style="width: 100%"
          class="table table-striped table-bordered"
          align="center"
          valign="center"
        >
          <!--  -->
          <tr>
            <td class="column" colspan="1">资金性质</td>
            <td class="column" colspan="2">功能科目</td>
            <td class="column" colspan="1">本年计划</td>
            <td class="column" colspan="1">累计拨款</td>
            <td class="column" colspan="1">本次拨款</td>
          </tr>
          <!--  -->
          <tr>
            <td class="value" colspan="1">资金性质</td>
            <td class="value" colspan="2">功能科目</td>
            <td class="value" colspan="1">本年计划</td>
            <td class="value" colspan="1">累计拨款</td>
            <td class="value" colspan="1">本次拨款</td>
          </tr>
          <!--  -->  
          <tr>
            <td class="column" colspan="6">
              <h4 style="font-size: 20px;letter-spacing: 2px;">付款单位</h4>
            </td>
          </tr>
          <!--  -->
          <tr>
            <td class="column" colspan="1">付款人全称</td>
            <td class="column" colspan="2">付款人账号</td>
            <td class="column" colspan="2">付款人银行</td>
            <td class="column" colspan="1">付款金额</td>
          </tr>
          <!--  -->
          <tr>
            <td class="value" colspan="1">1515558</td>
            <td class="value" colspan="2">1515558</td>
            <td class="value" colspan="2">1515558</td>
            <td class="value" colspan="1">1515558</td>
          </tr>
          <!--  -->  
          <tr>
            <td class="column" colspan="6">
              <h4 style="font-size: 20px;letter-spacing: 2px;">收款单位</h4>
            </td>
          </tr>
          <!--  -->
          <tr>
            <td class="column" colspan="1">收款人全称</td>
            <td class="column" colspan="2">收款人账号及银行</td>
            <td class="column" colspan="1">收款金额</td>
            <td class="column" colspan="2">备注</td>
          </tr>
          <!-- 1 -->
          <tr>
            <td class="value" colspan="1">案发时v娃儿废弃物粉色啊沙发沙发沙发是</td>
            <td class="value" colspan="2"></td>
            <td class="value" colspan="1"></td>
            <td class="value" colspan="2"></td>
          </tr>
          <!-- 2 -->
          <tr>
            <td class="value" colspan="1"></td>
            <td class="value" colspan="2"></td>
            <td class="value" colspan="1"></td>
            <td class="value" colspan="2"></td>
          </tr>
          <!-- 3 -->
          <tr>
            <td class="value" colspan="1"></td>
            <td class="value" colspan="2"></td>
            <td class="value" colspan="1"></td>
            <td class="value" colspan="2"></td>
          </tr>
          <!-- 4 -->
          <tr>
            <td class="value" colspan="1"></td>
            <td class="value" colspan="2"></td>
            <td class="value" colspan="1"></td>
            <td class="value" colspan="2"></td>
          </tr>
          <!-- 5 -->
          <tr>
            <td class="value" colspan="1"></td>
            <td class="value" colspan="2"></td>
            <td class="value" colspan="1"></td>
            <td class="value" colspan="2"></td>
          </tr>
          <!-- 6 -->
          <tr>
            <td class="value" colspan="1"></td>
            <td class="value" colspan="2"></td>
            <td class="value" colspan="1"></td>
            <td class="value" colspan="2"></td>
          </tr>
          <tr>
            <td class="value" style="height: 100px;" colspan="3">
                <div>股室（印章）</div>
                <div class="flexBox" style="justify-content: flex-start;margin-top: 30px;"> 
                  <span>负责人：</span>
                  <span style="width:100px;"></span>
                  <span>经办人：</span>
                </div>
            </td>
            <td class="value" colspan="3">财政局分管领导：</td>
          </tr>
          <tr>
            <td class="value" style="height: 100px;" colspan="3">财政局局长：</td>
            <td class="value" colspan="3">财政局国库股：</td>
          </tr>
        </table>
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
  name: "printfApply",
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
      id: "print-apply",
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
        var element = document.getElementById("print-apply");
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

    return {
      ...toRefs(data),
      open,
      resetForm,
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
  height: 50px;
  width: 160px;
  border: 1px solid #333;
  font-weight: 550;
}
.value {
  height: 50px;
  border: 1px solid #333;
  box-sizing: border-box;
}

.column1 {
  width: 320px;
}

.flexBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
}
</style>
