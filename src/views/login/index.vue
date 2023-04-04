<template>
  <div class="loginBox">
    <div class="login">
      <h1 class="system_title">洪江市财政局项目库管理系统</h1>
      <div class="content_box">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="70px"
          class="demo-form"
          status-icon
          size="large"
        >
          <el-form-item class="filter-item" label="用户名: " prop="username">
            <el-input
              v-model="form.username"
              size="large"
              placeholder="请输入手机号码或用户名"
              prefix-icon="UserFilled"
            />
          </el-form-item>
          <el-form-item label="密 码: " prop="password">
            <el-input
              v-model="form.password"
              size="large"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item label="" prop="rememberMe">
            <el-checkbox v-model="form.rememberMe">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="loginLoading"
              @click="submitForm(formRef)"
              >登录</el-button
            >
            <el-button @click="resetForm(formRef)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import Cookies from "js-cookie";
import Config from "@/config";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "login",
  setup() {
    const store = useStore();
    const router = useRouter();
    const data = reactive({
      loginLoading: false,
      form: {
        username: "",
        password: "",
        rememberMe: false,
      },
      rules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
      },
      redirect: undefined,
    });
    const getCookie = () => {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      data.form = {
        username: username ? username : data.form.username,
        password: password ? password : data.form.password,
        rememberMe: rememberMe ? Boolean(rememberMe) : data.form.rememberMe,
      };
    };
    const formRef = ref<any>();
    const submitForm = async (formEl: any) => {
      if (!formEl) return;
      await formEl.validate((valid: any, fields: any) => {
        if (valid) {
          data.loginLoading = true;
          const user = data.form;
          //  校验成功 登录
          if (user.rememberMe) {
            Cookies.set("username", user.username, {
              expires: Config.passCookieExpires,
            });
            Cookies.set("password", user.password, {
              expires: Config.passCookieExpires,
            });
            Cookies.set("rememberMe", user.rememberMe, {
              expires: Config.passCookieExpires,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          store
            .dispatch("Login", user)
            .then(() => {
              console.log('登录成功')
              data.loginLoading = false
              router.push({ path: data.redirect || "/" });
            })
            .catch(() => {
              data.loginLoading = false
            });
        }
      });
    };

    const resetForm = (formEl: any) => {
      data.loginLoading = false;
      if (!formEl) return;
      formEl.resetFields();
    };

    onMounted(() => {
      getCookie();
    });

    return {
      ...toRefs(data),
      formRef,
      submitForm,
      resetForm,
    };
  },
});
</script>

<style lang="scss" scoped>
.loginBox {
  width: 100vw;
  height: 100vh;
  background-color: rgb(146, 179, 232);
  display: flex;
  justify-content: center;
  align-items: center;
}
.login {
  width: 540px;
  height: 50%;
  background-color: rgba(114, 108, 108, 0.359);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 10px;
  .content_box {
    width: 400px;
    height: 300px;
    background-color: rgba(252, 252, 252, 0.9);
    padding: 50px 20px 10px;
    border-radius: 15px;
  }
}
</style>
