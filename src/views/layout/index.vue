<template>
  <div class="app-wrapper">
    <!-- 顶部栏 -->
    <app-header />
    <!-- 左侧菜单栏 -->
    <div class="sidebar-container">
      <!-- <div class="userInfo">
        <div class="tipBox">{{ user.username }}</div>
        <div class="userInfoBox">
          <div class="avatar"><img src="../../assets/avatar.png" alt="头像"></div>
          <div class="username">{{ agencyInfo.agencyName || mofDivInfo.mofDepName }}</div>
          <div class="username">{{ user.username }}</div>
        </div>
      </div> -->
      <sidebar class="sidebar-box" />
    </div>
    <!-- 主体内容 -->
    <div class="main-container">
      <div>
        <navbar />
        <tags-view />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from "vue";
import { useStore } from "vuex";
import appHeader from "./components/appHeader.vue";
import Sidebar from "./components/Sidebar/index.vue";
import Navbar from "./components/Navbar.vue";
import TagsView from "./components/TagsView.vue";
import AppMain from "./components/AppMain.vue";

export default defineComponent({
  name: "layout",
  components: {
    appHeader,
    Sidebar,
    Navbar,
    TagsView,
    AppMain,
  },
  setup() {
    const store = useStore();
    const data = reactive({
      sidebar: store.state.app.sidebar,
      device: store.state.app.device,
      user: store.state.user.user,
      mofDivInfo: store.state.user.mofDivInfo,
      agencyInfo: store.state.user.agencyInfo
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
.userInfo{
  height: 150px;
  width: 100%;
  background-color: #010f58;
  overflow: hidden;
  .tipBox{
    height: 30px;
    width: 60%;
    margin: 0 auto;
    text-align: center;
    line-height: 30px;
    background-color: rgb(224, 82, 26);
    border-radius: 0 0 10px 10px;
    color: #fff;
    font-size: 14px;
  }
  .userInfoBox{
    position: absolute;
    width: 100%;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #fff;
    border-bottom: 1px solid #888;
    .avatar{
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-content: center;
      border-radius: 25px;
      background-color: #8a8fa7;
      overflow: hidden;
    }
    img{
      width: 50px;
    }
    .username{
      padding: 5px 0;
      width: 100%;
      text-align: center;
      font-size: 14px;
    }
  }
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.sidebar-container {
  margin-top: 60px;
  padding-bottom: 60px;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  background: #ffffff;
  z-index: 99;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}
.hideSidebar .fixed-header {
  width: calc(100% - #{$hideSidebarWidth});
}

.mobile .fixed-header {
  width: 100%;
}
</style>
