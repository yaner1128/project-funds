<template>
  <el-dialog
    top="3vh"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1100px"
    title="打印"
  >
    <el-scrollbar class="scrollbar">
      <div class="dialog_container" id="print-iframe">
        <detailsVue ref="detailsVueRef" :detailsData="detailsData" :check2="infoForm.check2" />
      </div>
      <div class="checkBox">
        <el-checkbox v-model="infoForm.check1" label="打印不显示子账户分隔符"/>
        <el-checkbox v-model="infoForm.check2" label="打印归口股室及账号" />
        <el-checkbox v-model="infoForm.check3" label="打印不显示子账户" />
      </div>
    </el-scrollbar>
    <template #footer>
      <div style="text-align: right">
        <el-button type="primary" v-print="prints">打印</el-button>
        <el-button link @click="dialogFormVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { dsAllocationDetail } from "@/api/dsAccounts";
import { ElMessage } from "element-plus";
import detailsVue from "./cardView.vue";
import { formatDate } from "@/utils/date";
import print from "vue3-print-nb";

export default defineComponent({
  name: "printfView",
  components: {
    detailsVue,
  },
  setup(props, { emit }) {
    const addFormRef = ref();
    const data = reactive({
      dialogFormVisible: false,
      allocationCode: null,
      detailsData: <any>{},
      infoForm: {},
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
    const open = (allocationCode: any) => {
      data.allocationCode = allocationCode;
      dsAllocationDetail({ allocationCode: allocationCode }).then(
        (res: any) => {
          if (res.code === 200) {
            data.detailsData = res.data;
            data.dialogFormVisible = true;
          }
        }
      );
    };
    return {
      ...toRefs(data),
      open,
      prints,
    };
  },
});
</script>

<style lang="scss" scoped>
.checkBox{
  display: flex;
  flex-direction: column;
}
.scrollbar {
  height: calc(100vh - 300px);
}
/deep/ .el-input-number input {
  text-align: left;
}
</style>
