<template>
    <div class="demo-collapse">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="文件列表" name="1">
            <div style="margin: 20px 0">
                <el-upload
                    v-model:file-list="fileList"
                    class="upload-demo"
                    :action="action"
                    :headers="headers"
                    multiple
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :limit="3"
                    :on-exceed="handleExceed"
                    :on-success="handleSuccess"
                >
                    <el-button type="primary">选择文件</el-button>
                </el-upload>
            </div>
            <!-- 表格 -->
            <el-table
                :data="listData"
                border
            >
                <el-table-column label="文件名称" prop="projectName" width="200">
                <template #default="scope">
                    <router-link :to="{path: '/details'}"><span class="jumpItem">{{ scope.row.projectName }}</span></router-link>
                </template>
                </el-table-column>
                <el-table-column label="大小" prop="project" width="180" />
                <el-table-column label="上传时间" prop="type" width="180" />
                <el-table-column label="备注" prop="total" />
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="工资表" name="2">
            <div style="margin: 20px 0">
                <el-form
                    ref="infoFormRef"
                    :model="infoForm"
                    :inline="true"
                    class="demo-infoForm"
                    label-width="110px"
                >
                    <el-form-item label="发放类型：" prop="type">
                        <el-select v-model="infoForm.type" placeholder="请选择项目分类">
                            <el-option 
                            v-for="item in typeData"  
                            :key="item.typeId" 
                            :label="item.typeName" 
                            :value="item.typeId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="人数：" prop="name">
                        <el-input v-model="infoForm.name" />
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary">添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 表格 -->
            <el-table
                :data="listData"
                border
            >
                <el-table-column label="发放类型" prop="projectName">
                <template #default="scope">
                    <router-link :to="{path: '/details'}"><span class="jumpItem">{{ scope.row.projectName }}</span></router-link>
                </template>
                </el-table-column>
                <el-table-column label="人数" prop="project" />
            </el-table>
          </el-collapse-item>
        </el-collapse>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken } from '@/utils/auth'

export default defineComponent({
    name: 'wage',
    components:{
        UploadFilled,
    },
    emits: ["reload"],
    props: {
        typeData: <any>{
            type: Array,
        },
    },
    setup(props, {  emit }){
        const data = reactive({
            activeName: 1,
            listData: [],
            infoForm: <any>{},
            rules: [],
            headers: {Authorization: 'Bearer ' + getToken() },
            action: process.env.VUE_APP_BASE_API + '/ds-cz-datacenter-basics/dsBasResources/add',
            handleSuccess: (response: { code: number; data: { msg: string; }; }, file: any, fileList: any) => {
                console.log(response)
            },
            handleRemove:(file: any, fileList: any) => {
                console.log(file, fileList);
            },
        })

        const fileList = ref<any[]>([])

        const handlePreview: any['onPreview'] = (uploadFile: any) => {
            console.log(uploadFile)
        }

        const handleExceed: any['onExceed'] = (files: string|any[], uploadFiles: string|any[]) => {
            ElMessage.warning(
                `The limit is 3, you selected ${files.length} files this time, add up to ${
                files.length + uploadFiles.length
                } totally`
            )
        }

        const beforeRemove: any['beforeRemove'] = (uploadFile: { name: any; }, uploadFiles: any) => {
            return ElMessageBox.confirm(
                `Cancel the transfert of ${uploadFile.name} ?`
            ).then(
                () => true,
                () => false
            )
        }
      
        return {
            ...toRefs(data),
            fileList,
            handlePreview,
            handleExceed,
            beforeRemove
        }
    }
  })
</script>

<style lang="scss" scoped>
.upload-demo{
width: 680px;
}

/deep/ .el-collapse-item__header {
    display: block;
    text-align: center;
    border-width: 0px;
    background: inherit;
    background-color: rgba(22, 155, 213, 1);
    border: 1px solid #fff;
    border-radius: 5px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-size: 18px;
    color: #FFFFFF;
    height: 70px;
    line-height: 70px;
}
/deep/ .el-collapse-item__header .el-icon svg {
    width: 0;
    height: 0;
}
</style>
  