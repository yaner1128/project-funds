<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5">
        <el-card class="box-card">
          <template #header>
            <span>个人信息</span>
          </template>
          <div>
            <ul class="user-info">
              <li>
                <svg-icon icon-class="user1" /> 用户名称
                <div class="user-right">{{ user.username }}</div>
              </li>
              <li>
                <svg-icon icon-class="user1" /> 姓名
                <div class="user-right">{{ user.perName }}</div>
              </li>
              <li>
                <svg-icon icon-class="user1" /> 性别
                <div class="user-right">{{ user.sexCodeName }}</div>
              </li>
              <li>
                <svg-icon icon-class="user1" /> 单位
                <div class="user-right">{{ user.agencyCodeName }}</div>
              </li>
              <li>
                <svg-icon icon-class="user1" /> 人员身份
                <div class="user-right">{{ user.perIdeCodeName }}</div>
              </li>
              <li>
                <svg-icon icon-class="user1" /> 职级
                <div class="user-right">{{ user.grCodeName }}</div>
              </li>
              <li>
                <svg-icon icon-class="user1" /> 职务
                <div class="user-right">{{ user.posCodeName }}</div>
              </li>
              <!-- <li><svg-icon icon-class="user1" /> 职称 <div class="user-right">{{ user.username }}</div></li> -->
              <li>
                <svg-icon icon-class="user1" /> 民族
                <div class="user-right">{{ user.natCodeName }}</div>
              </li>
              <li>
                <svg-icon icon-class="user1" /> 学历
                <div class="user-right">{{ user.schRecCodeName }}</div>
              </li>
              <!-- <li><svg-icon icon-class="phone" /> 手机号码 <div class="user-right">{{ user.phone }}</div></li>
              <li><svg-icon icon-class="email" /> 用户邮箱 <div class="user-right">{{ user.email }}</div></li>
              <li><svg-icon icon-class="dept" /> 所属部门 <div class="user-right"> {{ user.dept }} / {{ user.job }}</div></li>
              <li><svg-icon icon-class="date" /> 创建日期 <div class="user-right">{{ parseTime(user.createTime) }}</div></li> -->
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                  <!-- <a @click="$refs.email.dialog = true">修改邮箱</a> -->
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <el-card class="box-card">
          <template #header>
            <span>操作日志</span>
            <div
              style="display: inline-block; float: right; cursor: pointer"
              @click="refresh"
            >
              <i :class="ico" />
            </div>
          </template>
          <!-- <log ref="log" /> -->
        </el-card>
      </el-col>
    </el-row>
    <!-- <updateEmail ref="email" :email="user.email"/> -->
    <updatePass ref="pass" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { mapGetters } from "vuex";
import updatePass from "./center/updatePass.vue";
// import log from "./center/log.vue";
import { getToken } from "@/utils/auth";
import store from "@/store";
export default defineComponent({
  name: "Center",
  components: { updatePass },
  computed: {
    ...mapGetters(["user", "updateAvatarApi"]),
  },
  setup() {
    const headers = reactive({
      Authorization: "Bearer " + getToken(),
    });
    store.dispatch("GetInfo").then()
    return {
      ico: "el-icon-refresh",
      headers,
    }
  }
})
</script>

<style rel="stylesheet/scss" lang="scss">
.avatar-uploader-icon {
  font-size: 28px;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}
.user-info {
  margin-top: 0;
  padding-left: 0px;
  list-style: none;
  li {
    border-bottom: 1px solid #f0f3f4;
    border-top: 1px solid #f0f3f4;
    padding: 11px 0px;
    font-size: 13px;
  }
  .user-right {
    float: right;

    a {
      color: #317ef3;
    }
  }
}
</style>
