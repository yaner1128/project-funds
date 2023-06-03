<template>
  <el-dialog
    v-model="dialogVisible"
    title="自动凭证分录管理"
    width="80%"
    @close="handleClose"
  >
    <el-button type="primary" @click="addClick">
      <el-icon class="el-icon--left"><Plus /></el-icon>增 加
    </el-button>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{
        backgroundColor: '#f8f8f8',
        height: '40px',
        color: '#333',
      }"
      :height="500"
    >
      <el-table-column
        property="date"
        label="分录号"
        align="center"
        width="180"
      />
      <el-table-column property="date" label="分录名称" align="center" />
      <el-table-column property="date" label="摘要" align="center" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="editClick(row)">
            <el-icon class="el-icon--left"><EditPen /></el-icon>编辑
          </el-button>
          <el-button link type="primary" @click="deleteClick(row)">
            <el-icon class="el-icon--left"><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="addDialogVisible"
      append-to-body
      @close="quitClick"
      title="方式"
      width="460"
    >
      <div class="container_wrap">
        <div class="title">转账分录设置方式</div>
        <el-radio-group v-model="type" class="selectBox">
          <el-radio :label="1">直接选择结转科目 (多转一)</el-radio>
          <el-radio :label="2">定义结转公式</el-radio>
          <el-radio :label="3">单选一级科目对等结转</el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitClick">确认</el-button>
          <el-button type="primary" @click="quitClick">退出</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 方式一 -->
    <type1 ref="type1Ref" :accountSetCode="accountSetCode" @quit="quitEvent"></type1>
    <!-- 方式二 -->
    <type2 ref="type2Ref" :accountSetCode="accountSetCode"></type2>
    <!-- 方式三 -->
    <type3 ref="type3Ref" :accountSetCode="accountSetCode" @quit="quitEvent"></type3>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClose"> 关 闭 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import type1 from "./module/type1.vue";
import type2 from "./module/type2.vue";
import type3 from "./module/type3.vue";

export default defineComponent({
  name: "EntryManage",
  components: {
    type1,
    type2,
    type3
  },
  setup() {
    const data = reactive({
      dialogVisible: false,
      tableData: [{}],
      accountSetCode: null,
      handleClose: () => {
        data.dialogVisible = false;
      },
      addDialogVisible: false,
      type: 1,
      quitClick: () => {
        data.addDialogVisible = false;
        data.type = 1;
      }
    });

    const open = (accountSetCode: any) => {
      data.accountSetCode = accountSetCode;
      getData();
      data.dialogVisible = true;
    };

    // 获取分录凭证管理
    const getData = () => {};
    // 新增
    const addClick = () => {
      data.addDialogVisible = true;
    };
    const type1Ref = ref();
    const type2Ref = ref();
    const type3Ref = ref();
    const submitClick = () => {
      switch (data.type) {
        case 1:
          type1Ref.value.open();
          break;
        case 2:
          type2Ref.value.open();
          break;
        case 3:
          type3Ref.value.open();
          break;
        default:
          break;
      }
    }
    // 退出
    const quitEvent = () => {
      data.quitClick();
    }
    // 编辑
    const editClick = (row: any) => {};
    // 删除
    const deleteClick = (row: any) => {};

    return {
      ...toRefs(data),
      open,
      addClick,
      type1Ref,
      type2Ref,
      type3Ref,
      submitClick,
      editClick,
      deleteClick,
      quitEvent
    };
  },
});
</script>

<style lang="scss" scoped>
.container_wrap{
  height: 200px;
  border: 1px solid #f0f0f0;
  box-shadow: inset 0px 0px 2px #666;
  position: relative;
  display: flex;
  justify-content: center;
  .title{
    padding: 10px 20px;
    font-size: 16px;
    background-color: #fff;
    position: absolute;
    top: -20px;
    left: 10px;
  }
  .selectBox{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-evenly;
    padding: 20px 0;
  }
}
</style>
