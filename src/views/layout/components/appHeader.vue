<template>
  <div class="header">
    <div class="logo-title">
      <!-- <img src="../../../assets/logo.png"> -->
      {{ webName }}
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item" trigger="click" placement="bottom-end">
        <div class="username">
          <span>{{ user.username }}</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <router-link to="/user/center">
              <el-dropdown-item>
                个人中心
              </el-dropdown-item>
            </router-link> -->
            <span style="display:block;" @click="loginOutClick">
              <el-dropdown-item>
                退出登录
              </el-dropdown-item>
            </span>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div style="display: flex; align-items: center;" >
        <el-tooltip v-if="device !== 'mobile'" content="全屏" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item" />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch, onActivated } from "vue";
import config from '@/config/index';
import { useStore } from 'vuex'
import Screenfull from '@/components/Screenfull/index.vue'
import { ElMessageBox } from 'element-plus';
import checkPermission from '@/utils/permission';
import { nextTick } from "process";

export default defineComponent({
  name: 'appHeader',
  components: {
    Screenfull
  },
  setup(){
    const store = useStore();
    const data = reactive({
      webName: config.webName,
      user: store.state.user.user,
      device: store.state.app.device
    })

    nextTick(() => {
      data.user = store.state.user.user;
    })
    watch(() => store.state.user, (val) => {
      data.user = val.user;
    }, { immediate: true })

    const loginOutClick = () => {
      ElMessageBox.confirm('确定注销并退出系统吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        logout()
      }).catch(() => {
        console.log('取消')
      })
    }

    const logout = () => {
      store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      }).catch(() => {
        location.reload()
      })
    }

    return {store,
      ...toRefs(data), loginOutClick, checkPermission
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding:0 30px;
  background-size: 100%;
  background: $headTitleBg;
  .logo-title{
    display: flex;
    align-items: center;
    color: $headTitleText;
    font-size: 30px;
    line-height: 30px;
    font-weight: 600;
    img{
      width: 38px;
      margin-right: 18px;
    }
  }
  .right-menu {
    display: flex;
    align-items: center;
    height: 100%;
    &:focus{
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      line-height: 50px;
      .username{
        font-weight: 800;
        font-size: 18px;
        color: $headTitleText;
      }
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>