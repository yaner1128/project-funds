<template>
  <el-dialog
    top="10vh"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1100px"
    title="报表"
  >
    <div class="dialog_container">
      <!-- 筛选条件 -->
      <div class="head-container">
        <el-tree-select
          :props="{children: 'children',label: 'ledgerAccountName', value: 'ledgerAccountCode'}"
          v-model="query.ledgerAccountCode"
          :data="treeData"
          check-strictly
          :render-after-expand="false"
          placeholder="请选择会计科目"
        />
        <el-input v-model="query.accountName" placeholder="请输入账号名称" class="filter-item" style="width: 200px" clearable />
        <el-select
          v-model="query.status"
          placeholder="请选择账号状态"
          class="filter-item"
          clearable
        >
          <el-option
            v-for="item in statusOption"
            :key="item.code"
            :label="item.codeName"
            :value="item.code"
          />
        </el-select>
        <el-button type="primary" class="filter-item"  @click="doSimpleQuery">
          搜索
        </el-button>
      </div>
    </div>
    <template #footer>
      <div style="text-align: right">
        <el-button type="primary" @click="dialogFormVisible=false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { addAccountLog } from "@/api/dsAccounts";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "reportView",
  setup() {
    const data = reactive({
      dialogFormVisible: false,
      accountCode: null,
      query: {

      },
      rules: {
        modifyAmount: [{ required: true, message: "请输入修正金额", trigger: "blur" }],
        remark: [{ required: true, message: "请输入修正原因", trigger: "blur" }],
      },
      treeData: <any>[],
    });
    // 打开弹窗
    const open = (accountCode:any) => {
      data.accountCode = accountCode;
      getData();
      data.dialogFormVisible = true;
    };
    // 获取会计科目数据
    const getData = () => {
      // simpleAccountingSubject({ accountSetCode: data.accountSetCode }).then((res: any) => {
      //   data.treeData = [{
      //     ledgerAccountCode: '0',
      //     ledgerAccountName: '顶级科目',
      //     parentCode: null,
      //     children: res.data.slice(0)
      //   }]
      // })
    }
    

    return {
      ...toRefs(data),
      open,
    };
  },
});
</script>

<style lang="scss" scoped>
.scrollbar {
  height: calc(100vh - 173px);
}
/deep/ .el-input-number input{
  text-align: left;
}
</style>
