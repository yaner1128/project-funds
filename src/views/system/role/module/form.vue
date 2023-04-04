<template>
  <el-dialog
    v-model="dialog"
    :title="isAdd ? '新增角色' : '编辑角色'"
    append-to-body
    width="500px"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" style="width: 370px" />
      </el-form-item>
      <el-form-item label="角色代码" prop="name">
        <el-input v-model="form.code" style="width: 370px" />
      </el-form-item>
      <el-form-item label="角色级别" prop="sort">
        <el-input-number
          v-model.number="form.level"
          :min="1"
          controls-position="right"
          style="width: 370px"
        />
      </el-form-item>
      <el-form-item label="数据范围">
        <el-select
          v-model="form.dataScope"
          style="width: 370px"
          placeholder="请选择数据范围"
          @change="changeScope"
        >
          <el-option
            v-for="item in dateScopes"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.dataScope === '自定义'" label="数据权限">
        <el-tree-select
          v-model="deptIds"
          :data="depts"
          multiple
          clearable
          style="width: 370px"
          placeholder="请选择"
          :value-consists-of="valueConsistsOf"
        />
      </el-form-item>
      <el-form-item label="描述信息">
        <el-input
          v-model="form.remark"
          style="width: 370px"
          rows="5"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" link @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button
      >
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { add, edit, getAgencys } from '@/api/role';
import { ElNotification } from "element-plus";

export default defineComponent({
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["toQuery"],
  setup(props, {emit}) {
    const formRef = ref();
    const data = reactive({
      dateScopes: ["全部", "本级", "本级及下属", "自定义"],
      loading: false,
      dialog: false,
      depts: [],
      deptIds: [],
      form: {
        name: "",
        code: "",
        agencys: <any>[],
        remark: "",
        dataScope: "本级",
        level: 3,
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      valueConsistsOf: "ALL",
      changeScope: () => {
        if (data.form.dataScope === "自定义") {
          getAgencys('').then((res: any)=>{
            data.depts = handleArr(res.content[0].children)
          });
        }
      },
      cancel: () => {
        data.dialog = false;
        formRef.value.resetFields()
        data.form = {
          name: "",
          code: "",
          agencys: [],
          remark: "",
          dataScope: "本级",
          level: 3,
        };
      },
      resetForm: () => {
        data.dialog = false
        formRef.value.resetFields()
        data.form = { name: '', code: "", agencys: [], remark: '', dataScope: '本级', level: 3 }
      },
      doAdd: () => {
        add(data.form).then(res => {
          data.resetForm();
          ElNotification({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          data.loading = false;
          // this.$parent.$parent.init()
          emit("toQuery")
        }).catch(err => {
          data.loading = false;
        })
      },
      doEdit: () => {
        edit(data.form).then((res: any) => {
          data.resetForm()
          ElNotification({
            title: '修改成功',
            type: 'success',
            duration: 2500
          })
          data.loading = false
          emit("toQuery")
          // this.sup_this.init()
        }).catch(err => {
          data.loading = false
          console.log(err.response.data.message)
        })
      },
    });
    const handleArr = (arr: any) => {
      arr.forEach((item: any) => {
        item.label = item.agencyCode + item.agencyName
        item.value = item.agencyCode
        if(item.children){
          handleArr(item.children)
        }
      })
      return arr
    }

    const doSubmit = () => {
      // 提交
      if (data.form.dataScope === '自定义' && data.deptIds.length === 0) {
        ElMessage({
          message: '自定义数据权限不能为空',
          type: 'warning'
        })
      } else {
        data.form.agencys = []
        if (data.form.dataScope === '自定义') {
          for (let i = 0; i < data.deptIds.length; i++) {
            data.form.agencys.push({
              agencyCode: data.deptIds[i]
            })
          }
        }
        formRef.value.validate((valid: any) => {
          if (valid) {
            data.loading = true
            if (props.isAdd) {
              data.doAdd()
            } else {
              data.doEdit()
            }
          } else {
            return false
          }
        })
      }
    };

    const handleDialog = (row?: any) => {
      if (row) {
        data.form = row;
      }

      data.dialog = true;
    };

    return {
      formRef,
      ...toRefs(data),
      ...toRefs(props),
      doSubmit,
      handleDialog,
    };
  },
});
</script>

<style lang="scss" scoped></style>
