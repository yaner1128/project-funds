<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="query.name"
        clearable
        placeholder="输入名称搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="toQuery"
      />
      <el-button class="filter-item" type="primary" @click="toQuery">
        <el-icon class="el-icon--left"><Search /></el-icon>
        搜索</el-button
      >
      <!-- 新增 -->
      <div
        style="display: inline-block"
      >
        <el-button class="filter-item" type="success" @click="add">
          <el-icon class="el-icon--left"><Plus /></el-icon>
          新增</el-button
        >
        <eForm ref="form" :is-add="true" @init="toQuery" />
      </div>
      <div style="display: inline-block">
        <el-button class="filter-item" type="warning" @click="expandFun">
          <el-icon class="el-icon--left"><MoreFilled /></el-icon>
          {{ expand ? "折叠" : "展开" }}</el-button
        >
        <!-- <eForm ref="form" :is-add="true" /> -->
      </div>
    </div>
    <!--表格渲染-->
    <tree-table
      v-loading="loading"
      :data="data"
      :expand-all="expand"
      :columns="columns"
    >
      <el-table-column prop="icon" label="图标" align="center" width="80px">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" width="100px" label="排序">
        <template #default="scope">
          <el-tag>{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="path"
        label="链接地址"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="component"
        label="组件路径"
      />
      <el-table-column prop="iframe" width="100px" label="内部菜单">
        <template #default="scope">
          <span v-if="!scope.row.iframe">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="130px"
        align="center"
      >
        <template #default="scope">
          <edit
            v-if="scope.row.pid != 111 && scope.row.id != 111 "
            :data="scope.row"
            :sup_this="sup_this"
            @init="toQuery"
          />
          <el-popconfirm
            title="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
            @confirm="subDelete(scope.row.id)"
            v-if="scope.row.pid != 111 && scope.row.id != 111"
          >
            <template #reference>
              <el-button type="danger" size="small"
                ><el-icon><Delete /></el-icon
              ></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script lang="ts">
import checkPermission from "@/utils/permission"; // 权限判断函数
import treeTable from "@/components/TreeTable/index.vue";
import { del, getMenusTree } from "@/api/menu";
import { parseTime } from "@/utils/index";
import edit from "./module/edit.vue";
import { defineComponent, reactive, toRefs, ref } from "vue";
import eForm from "./module/form.vue";
import { ElNotification } from "element-plus";

export default defineComponent({
  name: "menus",
  components: {
    edit,
    treeTable,
    eForm,
  },
  setup() {
    const data = reactive({
      loading: false,
      delLoading: false,
      visible: false,
      data: [],
      expand: true,
      columns: [
        {
          text: "名称",
          value: "name",
        },
      ],
      // total: 0,
      query: { name: "", page: 0, size: 20 },
      sup_this: {},
    });
    const form: any = ref();

    const toQuery = () => {
      data.loading = true;
      const query = { name:data.query.name }
      getMenusTree(query)
        .then((res: any) => {
          // data.total = res.totalElements;
          setTimeout(() => {
            data.data = res.data;
            data.loading = false;
          });
        })
        .catch((err) => {
          data.loading = false;
        });
    };
    const add = () => {
      form.value.getMenus();
      form.value.dialog = true;
    };
    const expandFun = () => {
      data.expand = !data.expand;
      toQuery();
    };
    const subDelete = (id: any) => {
      data.delLoading = true;
      del(id)
        .then((res) => {
          data.delLoading = false;
          toQuery();
          ElNotification({
            title: "删除成功",
            type: "success",
            duration: 2500,
          });
        })
        .catch((err) => {
          data.delLoading = false;
          console.log(err.response.data.message);
        });
    };
    toQuery();
    return {
      ...toRefs(data),
      checkPermission,
      parseTime,
      toQuery,
      add,
      expandFun,
      form,
      subDelete,
    };
  },
});
</script>
