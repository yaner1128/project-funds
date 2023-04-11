<template>
  <el-dialog
    top="3vh"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1100px"
    :title="title"
    :before-close="resetForm"
  >
    <template #header>
      <div class="my-header">
        <h3 class="back">
          <span class="icon_container" @click="back"
            ><svg-icon icon-class="back" class="el-input__icon"
          /></span>
          <span>{{ title }}</span>
        </h3>
      </div>
    </template>
    <el-scrollbar class="scrollbar">
      <div class="dialog_container">
        <!-- 当前单位详情 -->
        <div class="agency_container">
          <el-form
            :inline="true"
            :model="detailForm"
            label-width="110px"
            :disabled="formDisabled"
          >
            <el-form-item label="单位编码：">
              <el-input v-model="detailForm.agencyCode" placeholder="" />
            </el-form-item>
            <el-form-item label="单位名称：">
              <el-input v-model="detailForm.agencyName" placeholder="" />
            </el-form-item>
            <el-form-item label="单位专户数：">
              <el-input v-model="detailForm.account" placeholder="" />
            </el-form-item>
            <el-form-item label="今年度申请：">
              <el-input v-model="detailForm.application" placeholder="" />
            </el-form-item>
          </el-form>
          <el-button type="primary" v-if="formDisabled" @click="editClick">
            <el-icon class="el-icon--left"><EditPen /></el-icon>
            编辑
          </el-button>
          <el-button type="primary" v-else @click="checkClick">
            <el-icon class="el-icon--left"><Check /></el-icon>
            确认
          </el-button>
        </div>
        <el-divider />
        <div class="table_container">
          <el-button type="primary" @click="addClick">
            <el-icon class="el-icon--left"><Plus /></el-icon>
            添加专户
          </el-button>
          <el-table
            :data="tableData"
            border
            :header-cell-style="{
              backgroundColor: '#f8f8f8',
              height: '40px',
              color: '#333',
            }"
          >
            <el-table-column prop="agencyName" label="账号" min-width="200" />
            <el-table-column prop="id" label="开户行" min-width="200" />
            <el-table-column prop="amount" label="账户余额(单位：元)" width="200" />
            <el-table-column prop="status" label="状态" width="150">
              <template #default="{ row }">
                <el-tag class="ml-2" v-if="row.status === 1" type="success">使用中</el-tag>
                <el-tag class="ml-2" v-else-if="row.status === -1" type="warning">已删除</el-tag>
                <el-tag class="ml-2" v-else-if="row.status === 0" type="danger">停用</el-tag>
                <span v-else>{{ row.status }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <Pagination :pageObj="pageObj" :total="total" @search="doSimpleQuery" />
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { getProject } from "@/api/manage";
import Pagination from "@/components/Pagination/index.vue";

export default defineComponent({
  name: "detailsView",
  components: {
    Pagination
  },
  setup() {
    const data = reactive({
      title: "溆浦县城乡建设局",
      dialogFormVisible: false,
      formDisabled: true,
      detailForm: {
        agencyCode: "43006801",
        agencyName: "溆浦县城乡建设局",
        account: 25,
        application: 27,
      },
      tableData: [],
      pageObj: {
        page: 0,
        size: 10
      },
      total: 0,
    });
    // 打开弹窗
    const open = (id: any) => {
      data.formDisabled = true;
      data.dialogFormVisible = true;
      console.log("id", id);
      getData();
    };
    const getData = () => {
      getProject().then((res: any) => {
        data.tableData = res.data.records;
        data.total = res.data.total;
      })
    }
    // 添加专户
    const addClick = () => {

    }
    // 关闭
    const resetForm = () => {
      data.dialogFormVisible = false;
    };
    // 返回
    const back = () => {
      data.dialogFormVisible = false;
    };
    // 编辑
    const editClick = () => {
      data.formDisabled = false;
    };
    // 确认编辑
    const checkClick = () => {
      data.formDisabled = true;
    };

    return {
      ...toRefs(data),
      open,
      addClick,
      resetForm,
      back,
      editClick,
      checkClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.scrollbar {
  height: calc(100vh - 173px);
}
.back {
  display: flex;
  flex-direction: row;
  align-items: center;
  .icon_container {
    cursor: pointer;
    padding-right: 10px;
  }
}
.agency_container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
