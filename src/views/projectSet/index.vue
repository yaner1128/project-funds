<template>
    <div class="app-container">
        <div class="head-container">
            <el-input
            v-model="query.prjName"
            clearable
            placeholder="输入项目名称"
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
            <el-table-column prop="prjName" label="项目名称" />
            <el-table-column prop="prjCode" label="项目编号" />
            <el-table-column prop="mofDepName" label="归属股室" />
            <el-table-column prop="yearamount" label="年度计划付款额度" />
            <el-table-column prop="currentamount" label="累计拔款额度" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column label="操作" width="200px" align="center">
            <template #default="scope">
                <el-button type="primary" link @click="editClick(scope.row)">
                <el-icon><EditPen /></el-icon>
                </el-button>
                <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                title="确认删除当前行数据吗?"
                @confirm="deleteClick(scope.row.prjid)"
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
        <Pagination :pageObj="pageObj" :total="total" @search="doSimpleQuery" />
        <el-dialog
            :close-on-click-modal="false"
            :append-to-body="true"
            v-model="dialogFormVisible"
            :lock-scroll="true"
            width="600px"
            :title="isEdit ? '编辑' : '新增'"
            :before-close="resetForm"
        >
            <el-form ref="formRef" :model="form" :rules="rules" label-width="150px">
                <el-form-item label="选择归属股室:" prop="mofDepCode">
                    <el-tree-select
                        :check-strictly="true"
                        v-model="form.mofDepCode"
                        :data="treeData"
                        :props="defaultProps"
                        filterable
                        placeholder="选择归属股室"
                        :render-after-expand="false"
                    />
                </el-form-item>
                <el-form-item label="项目名称:" prop="prjName">
                    <el-input v-model="form.prjName" placeholder="请输入项目名称" />
                </el-form-item>
                <el-form-item label="项目编号:" prop="prjCode">
                    <el-input v-model="form.prjCode" placeholder="请输入项目编号" />
                </el-form-item>
                <el-form-item label="年度计划付款额度:" prop="yearamount">
                  <el-input-number v-model="form.yearamount" :precision="2" :controls="false" placeholder="请输入年度计划付款额度" />
                    <!-- <el-input v-model="form.yearamount" placeholder="请输入年度计划付款额度" /> -->
                </el-form-item>
                <el-form-item label="累计拔款额度:" prop="currentamount">
                  <el-input-number v-model="form.currentamount" :precision="2" :controls="false" placeholder="请输入累计拔款额度" />
                <!-- <el-input v-model="form.currentamount" placeholder="请输入累计拔款额度" /> -->
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" v-model="form.remark"  placeholder="请输入备注" />
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
    getBasMofDepTree,
    addDsMofProjects,
    updateDsMofProjects,
    getDsMofProjects,
    deleteDsMofProjects
} from "@/api/projectSet";
import { ElMessage } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";
  
export default defineComponent({
    name: "projectSet",
    components: {
        Pagination
    },
    setup() {
        const formRef = ref<any>();
        const data = reactive({
            loading: false,
            query: {
                prjName: ''
            },
            dialogFormVisible: false,
            visible: false,
            isEdit: false,
            form: <any>{
                mofDepCode: "",
                prjName: "",
            },
            defaultProps: {
                children: 'children',
                label: 'mofDepName',
                value: 'mofDepCode'
            },
            treeData: <any>[],
            rules: {
                mofDepCode: [
                    { required: true, message: "请选择归属股室", trigger: "change" },
                ],
                prjName: [
                    { required: true, message: "请填写项目名称", trigger: "blur" },
                ],
            },
            pageObj: {
                page: 0,
                size: 10
            },
            tableData: [],
            total: 0,
        });
        const doSimpleQuery = () => {
            const params = {
                currentPageIndex: data.pageObj.page+1,
                pageSize: data.pageObj.size
            }
            getDsMofProjects(params, data.query).then((res) => {
                data.tableData = res.data.records;
                data.total = Number(res.data.total);
            });
        };
        //  获取股室树
        const getTreeData = () => {
            getBasMofDepTree({sourceId:1}).then((res:any) => {
                console.log(res)
                data.treeData = res.data;
            });
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
            deleteDsMofProjects({ ids: [id] }).then((res: any) => {
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
                updateDsMofProjects(params).then((res: any) => {
                    if (res.code === 200) {
                    ElMessage.success(res.message);
                    resetForm();
                    doSimpleQuery();
                    }
                });
                } else {
                // 新增
                addDsMofProjects(params).then((res: any) => {
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
/deep/ .el-input-number {
  width: 100%;
  input{
    text-align: left;
    width: 100%;
  }
}
</style>
  