<template>
  <div class="app-container">
    <div class="head-container">
      <el-input
        v-model="query.codeName"
        clearable
        placeholder="输入值集名称"
        class="filter-item"
        @keyup.enter="doSimpleQuery"
      />
      <el-button class="filter-item" type="primary" @click="doSimpleQuery">
        <el-icon class="el-icon--left"><Search /></el-icon>
        搜索
      </el-button>
      <el-button class="filter-item" type="success" @click="toCreate">
        <el-icon class="el-icon--left"><Plus /></el-icon>
        新增
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      max-height="600px"
      border
      :header-cell-style="{
        backgroundColor: '#eee',
        height: '40px',
        color: '#333',
      }"
    >
      <el-table-column prop="codeName" label="值集名称" />
      <el-table-column prop="code" label="值集代码" />
      <el-table-column prop="type" label="值集分类" />
      <el-table-column prop="abbreviation" label="值集简称" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="200px" align="center">
        <template #default="scope">
          <el-button type="primary" link @click="editClick(scope.row)">
            <el-icon><EditPen /></el-icon>
          </el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            title="确认删除当前行数据吗?"
            @confirm="deleteClick(scope.row.codeId)"
          >
            <template #reference>
              <el-button type="primary" link>
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :pageObj="pageObj" :total="total" @search="getData" />
    <el-dialog
      :close-on-click-modal="false"
      :append-to-body="true"
      v-model="dialogFormVisible"
      :lock-scroll="true"
      width="600px"
      :title="isEdit ? '编辑' : '新增'"
      :before-close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="选择父值集:" prop="parentId">
          <el-tree-select
            :check-strictly="true"
            v-model="form.parentId"
            :data="treeData"
            :props="defaultProps"
            filterable
            style="width: 460px"
            placeholder="选择父值集"
            @change="changeMethods"
          />
        </el-form-item>
        <el-form-item label="值集类型:" prop="type">
          <el-input v-model="form.type" placeholder="请输入值集类型" :disabled="form.parentId!=0" />
        </el-form-item>
        <el-form-item label="值集简称:" prop="abbreviation">
          <el-input v-model="form.abbreviation" placeholder="请输入值集简称" :disabled="form.parentId!=0" />
        </el-form-item>
        <el-form-item label="值集名称:" prop="codeName">
          <el-input v-model="form.codeName" placeholder="请输入值集名称" />
        </el-form-item>
        <el-form-item label="值集代码:" prop="code">
          <el-input v-model="form.code" placeholder="请输入值集代码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm">取消</el-button>
          <el-button type="primary" @click="submitClick">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, computed } from "vue";
import {
  getProjectEleUnion,
  addProjectEleUnion,
  updateProjectEleUnion,
  deleteProjectEleUnion,
  getProjectEleUnionTree
} from "@/api/codeManage";
import { ElMessage } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";

export default defineComponent({
  name: "BaseCodeSet",
  components: {
    Pagination
  },
  setup() {
    const formRef = ref<any>();
    const data = reactive({
      loading: false,
      query: {
        codeName: ''
      },
      dialogFormVisible: false,
      visible: false,
      isEdit: false,
      form: <any>{
        parentId: "",
        type: "",
        abbreviation: "",
      },
      defaultProps: {
        children: 'children',
        label: 'codeName',
        value: 'codeId'
      },
      treeData: <any>[],
      rules: {
        parentId: [
          { required: true, message: "请选择父值集", trigger: "change" },
        ],
        type: [
          { required: true, message: "请输入值集类型", trigger: "blur" },
        ],
        abbreviation: [
          { required: true, message: "请输入值集简称", trigger: "blur" },
        ],
        codeName: [
          { required: true, message: "请输入值集名称", trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入值集代码", trigger: "blur" },
        ]
      },
      pageObj: {
        page: 1,
        size: 10
      },
      tableData: [],
      total: 0,
    });
    const doSimpleQuery = () => {
      data.pageObj.page = 1;
      getData();
    };
    const getData = () => {
      const params = Object.assign({
        currentPageIndex: data.pageObj.page,
        pageSize: data.pageObj.size
      }, data.query)
      getProjectEleUnion(params).then((res) => {
        data.tableData = res.data.records;
        data.total = Number(res.data.total);
      });
    }
    const getTreeData = () => {
      getProjectEleUnionTree().then((res) => {
        data.treeData = [{
          code: "0",
          codeId: "0",
          codeName: "顶级类目",
          children: res.data.slice(0)
        }];
      });
    }
    const changeMethods = (val: any) => {
      const temp = <any>data.tableData.filter((item:any) => {
        return item.codeId == val;
      })
      if(Array.isArray(temp) && temp.length > 0) {
        data.form.type = temp[0].type;
      }
    }

    const toCreate = () => {
      getTreeData();
      data.isEdit = false;
      data.dialogFormVisible = true;
    };
    const editClick = (row: any) => {
      getTreeData();
      row = JSON.parse(JSON.stringify(row));
      data.isEdit = true;
      data.form = row
      data.dialogFormVisible = true;
    };
    const deleteClick = (id: any) => {
      deleteProjectEleUnion({ ids: [id] }).then((res: any) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
          doSimpleQuery();
        }
      });
    };

    const resetForm = () => {
      data.form = {};
      formRef.value.resetFields();
      data.dialogFormVisible = false;
    };
    const submitClick = async () => {
      await formRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          const params = data.form;
          if (data.isEdit) {
            // 编辑
            updateProjectEleUnion(params).then((res: any) => {
              if (res.code === 200) {
                ElMessage.success(res.message);
                resetForm();
                doSimpleQuery();
              }
            });
          } else {
            // 新增
            addProjectEleUnion(params).then((res: any) => {
              if (res.code === 200) {
                ElMessage.success(res.message);
                resetForm();
                doSimpleQuery();
              }
            });
          }
        }
      });
    };

    onMounted(() => {
      doSimpleQuery();
    });

    return {
      ...toRefs(data),
      formRef,
      doSimpleQuery,
      toCreate,
      editClick,
      deleteClick,
      resetForm,
      submitClick,
      changeMethods,
      getData
    };
  },
});
</script>

<style lang="scss" scoped>
/deep/ .filter-item.el-input,
.el-select.filter-item {
  width: 200px;
  .el-input__wrapper {
    width: 200px;
  }
}
</style>
