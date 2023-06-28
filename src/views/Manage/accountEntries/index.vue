<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input
          v-model="accountSetName"
          clearable
          placeholder="输入账套编号或名称搜索"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-scrollbar style="height: 650px">
          <el-tree
            ref="treeRef"
            :data="accountSetData"
            :props="defaultProps"
            empty-text="暂无数据"
            :expand-on-click-node="false"
            default-expand-all
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
          >
            <template #default="{ node }">
              <span class="custom-tree-node span-ellipsis">
                <span :title="node.label">{{ node.label }}</span>
              </span>
            </template>
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <div class="head-main">
          <el-button type="primary" @click="addClick">
            <el-icon class="el-icon--left"><Plus /></el-icon>增 加
          </el-button>
        </div>
        <el-table
          :data="tableData"
          border
          :header-cell-style="{
            backgroundColor: '#f8f8f8',
            height: '38px',
            color: '#333',
          }"
          :height="500"
        >
          <el-table-column
            property="journalNumber"
            label="分录号"
            align="center"
            width="180"
          />
          <el-table-column property="name" label="分录名称" align="center" />
          <el-table-column property="journalAbs" label="摘要" align="center" />
          <el-table-column
            label="操作"
            width="200"
            fixed="right"
            align="center"
          >
            <template #default="{ row }">
              <el-button link type="primary" @click="editClick(row)">
                <el-icon class="el-icon--left"><EditPen /></el-icon>编辑
              </el-button>
              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                title="确认删除当前行数据吗?"
                @confirm="deleteClick(row)"
              >
                <template #reference>
                  <el-button type="primary" link>
                    <el-icon class="el-icon--left"><Delete /></el-icon>删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <Pagination :pageObj="pageObj" :total="total" @search="getData" />

        <!-- 新增 -->
        <el-dialog
          v-model="addDialogVisible"
          append-to-body
          @close="quitClick"
          title="方式"
          :close-on-click-modal="false"
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
              <el-button type="" @click="quitClick">退出</el-button>
            </span>
          </template>
        </el-dialog>
        <!-- 方式一 -->
        <type1 ref="type1Ref" :asId="queryObj.asId" :accountSetCode="accountSetCode" @quit="quitClick"></type1>
        <!-- 方式二 -->
        <type2 ref="type2Ref" :asId="queryObj.asId" :accountSetCode="accountSetCode" @quit="quitClick"></type2>
        <!-- 方式三 -->
        <type3 ref="type3Ref" :asId="queryObj.asId" :accountSetCode="accountSetCode" @quit="quitClick"></type3>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { getAccountSetsList, getAccountJournal, deleteAccountJournal } from "@/api/accountEntrie";
import { ElMessage } from "element-plus";
import type1 from "./module/type1.vue";
import type2 from "./module/type2.vue";
import type3 from "./module/type3.vue";

export default defineComponent({
  name: "accountEntries",
  components: {
    Pagination,
    type1,
    type2,
    type3
  },
  setup() {
    const data = reactive({
      accountSetData: [],
      defaultProps: {
        label: function (row: any) {
          return "[" + row.accountSetCode + "]" + "\xa0" + row.accountSetName;
        },
      },
      filterNode: (value: any, treeData: any) => {
        if (!value) return true;
        return (
          treeData.accountSetName.includes(value) ||
          treeData.accountSetCode.includes(value)
        );
      },
      accountSetCode: "",
      queryObj: <any>{},
      pageObj: {
        currentPageIndex: 0,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      addDialogVisible: false,
      type: 1
    });

    const treeRef = ref();
    const accountSetName = ref("");
    watch(accountSetName, (val) => {
      treeRef.value!.filter(val);
    });
    // 获取左侧账套树
    const getTreeData = () => {
      getAccountSetsList().then((res: any) => {
        data.accountSetData = res.data;
      });
    };
    // 账套点击事件
    const handleNodeClick = (val: any) => {
      data.accountSetCode = val.accountSetCode;
      data.queryObj.asId = val.id;
      getData();
    };

    // 获取分录列表数据
    const doSimpleQuery = () => {
      data.pageObj.currentPageIndex = 0;
      getData();
    }
    // 获取会计分录列表
    const getData = () => {
      if(!data.queryObj.asId) {
        ElMessage.warning('请先选择账套');
        return;
      }
      getAccountJournal(data.pageObj, data.queryObj).then((res: any) => {
        data.tableData = res.data.records;
        data.total = Number(res.data.total);
      })
    }
    // 新增
    const addClick = () => {
      if(!data.queryObj.asId) {
        ElMessage.warning('请先选择账套');
        return;
      }
      data.addDialogVisible=true;
    }
    // 选择方式
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
    // 编辑
    const editClick = (row: any) => {
      console.log(row)
      switch (Number(row.journalType)) {
        case 1:
          type1Ref.value.open(true, row.id);
          break;
        case 2:
          type2Ref.value.open(true, row.id);
          break;
        case 3:
          type3Ref.value.open(true, row.id);
          break;
        default:
          break;
      }
    }
    // 删除
    const deleteClick = (row: any) => {
      deleteAccountJournal({ id: row.id }).then((res: any) => {
        if(res.code == 200) {
          ElMessage.success('删除成功');
          doSimpleQuery();
        }
      })
    }
    // 退出
    const quitClick = () => {
      data.addDialogVisible = false;
      // 默认为方式一
      data.type = 1;
      getData();
    }

    onMounted(() => {
      getTreeData();
    });

    return {
      ...toRefs(data),
      treeRef,
      accountSetName,
      handleNodeClick,
      getData,
      addClick,
      submitClick,
      quitClick,
      type1Ref,
      type2Ref,
      type3Ref,
      editClick,
      deleteClick
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
