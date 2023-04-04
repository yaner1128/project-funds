<template>
  <div>
    <button v-print="prints">打印2</button>
    <div >
      <!-- // dom部分 可用if控制 -->
      <div class="xwtable" id="print-iframe">
        <table>
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>性别</th>
            <th>手机</th>
            <th>邮箱</th>
            <th>地址</th>
            <th>工龄</th>
            <th>岗位</th>
            <th>薪资</th>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.age }}</td>
            <td>{{ item.sex }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.mail }}</td>
            <td>{{ item.address }}</td>
            <td>{{ item.workAge }}</td>
            <td>{{ item.jobs }}</td>
            <td>{{ item.salary }}</td>
          </tr>
        </table>
      </div>
      <div>
        <div class="text_styte">我是测试样式的</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// 引入封装好的打印函数
import print from "vue3-print-nb";
import { ref } from "vue";
const vPrint = print;
let prints = {
  id: "print-iframe",
  popTitle: "配置页眉标题", // 打印配置页上方的标题
  extraHead: "", // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
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
let list = [
  {
    name: "阿荣",
    age: 24,
    sex: "男",
    phone: "12345678901",
    mail: "mmm@mmm.com",
    address: "蓝星星国马尔哈哈海岛",
    workAge: 1,
    jobs: "研发",
    salary: "1.8k",
  },
  {
    name: "阿豪",
    age: 26,
    sex: "男",
    phone: "12345678901",
    mail: "mmm@mmm.com",
    address: "蓝星星国马尔哈哈海岛",
    workAge: 5,
    jobs: "产品",
    salary: "1.8k",
  },
  {
    name: "阿晨",
    age: 29,
    sex: "男",
    phone: "12345678901",
    mail: "mmm@mmm.com",
    address: "蓝星星国马尔哈哈海岛",
    workAge: 9,
    jobs: "设计",
    salary: "1.8k",
  },
  {
    name: "阿震",
    age: 30,
    sex: "男",
    phone: "12345678901",
    mail: "mmm@mmm.com",
    address: "蓝星星国马尔哈哈海岛",
    workAge: 7,
    jobs: "销售",
    salary: "1.8k",
  },
  {
    name: "阿锋",
    age: 21,
    sex: "男",
    phone: "12345678901",
    mail: "mmm@mmm.com",
    address: "蓝星星国马尔哈哈海岛",
    workAge: 0.1,
    jobs: "售后",
    salary: "1.8k",
  },
];
// 点击处理打印
</script>
<style scoped>
.xwtable {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
}
.xwtable thead td {
  font-size: 12px;
  color: #333333;
  text-align: center;
  background: url('../assets/logo.png') repeat-x top center;
  border: 1px solid #ccc;
  font-weight: bold;
}
.xwtable tbody tr {
  background: #fff;
  font-size: 12px;
  color: #666666;
}
.xwtable tbody tr.alt-row {
  background: #f2f7fc;
}
.xwtable td {
  line-height: 20px;
  text-align: left;
  padding: 4px 10px 3px 10px;
  height: 18px;
  border: 1px solid #ccc;
}
</style>
