<template>
  <div style="display: inline-block">
    <el-dialog
      v-model="dialog"
      :title="title"
      append-to-body
      width="500px"
      @close="cancel"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="88px">
        <el-form-item label="旧密码" prop="oldPass">
          <el-input
            v-model="form.oldPass"
            type="password"
            auto-complete="on"
            style="width: 370px"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input
            v-model="form.newPass"
            type="password"
            auto-complete="on"
            style="width: 370px"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPass">
          <el-input
            v-model="form.confirmPass"
            type="password"
            auto-complete="on"
            style="width: 370px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button link @click="cancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="doSubmit"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import store from "@/store";
// import { validPass, updatePass } from "@/api/user";
import { defineComponent, ref, reactive } from "vue";
import { ElMessage } from 'element-plus'

export default defineComponent({
  setup() {
    const loading = ref(false);
    const dialog = ref(false);
    let form = reactive({ oldPass: "", newPass: "", confirmPass: "" });
    const formRef = ref()
    const validatePass = (rule: any, value: any, callback: any) => {
      if (value) {
        // validPass(value).then((res) => {
        //   if (res.status === 200) {
        //     callback();
        //   } else {
        //     callback(new Error("旧密码错误，请检查"));
        //   }
        // });
      } else {
        callback(new Error("请输入旧密码"));
      }
    };
    const confirmPass = (rule: any, value: string, callback: any) => {
      if (form.newPass !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    const rules = reactive({
      oldPass: [{ required: true, validator: validatePass, trigger: "blur" }],
      newPass: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        {
          min: 6,
          max: 20,
          message: "长度在 6 到 20 个字符",
          trigger: "blur",
        },
      ],
      confirmPass: [
        { required: true, validator: confirmPass, trigger: "blur" },
      ],
    })

    function cancel() {
      resetForm();
    }
    function doSubmit() {
      formRef.value.validate((valid: any) => {
        if (valid) {
          loading.value = true;
          // updatePass(form.confirmPass)
          //   .then((res) => {
          //     resetForm();
          //     ElMessage.success('密码修改成功，请重新登录')
          //     setTimeout(() => {
          //       store.dispatch("LogOut").then(() => {
          //         location.reload(); // 为了重新实例化vue-router对象 避免bug
          //       });
          //     }, 1500);
          //   })
          //   .catch((err) => {
          //     loading.value = false;
          //     console.log(err.response.data.message);
          //   });
        } else {
          return false;
        }
      });
    }
    function resetForm() {
      dialog.value = false;
      formRef.value.resetFields();
      form = { oldPass: "", newPass: "", confirmPass: "" };
    }
    return {
      title: "修改密码",
      rules,
      form,
      dialog,
      loading,
      doSubmit,
      cancel,
      resetForm,
      formRef
    };
  },
});
</script>

