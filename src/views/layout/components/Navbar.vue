<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <div class="system_title" @click="jumpLink">
        <span class="link"><img class="daping_img" src="@/assets/img/dapingicon.png" />返回数据中心</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs  } from 'vue'
import { useStore } from 'vuex';
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";

export default defineComponent({
  components: {
    Breadcrumb,
    Hamburger
  },
  setup(){
    const $store = useStore()
    const data = reactive({
      sidebar: $store.state.app.sidebar,
      device: $store.state.app.device,
      user: $store.state.user.user,
      toggleSideBar() {
        // $store.dispatch("ToggleSideBar");
      },
      jumpLink: () => {
        // 测试环境
        // window.location.href = 'http://192.168.1.7:3265/';
        // 正式环境
        window.location.href = window.location.origin;
      }
    })
    const resData = toRefs(data)

    return {
      ...resData
    }
  }
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
}
.right-menu {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &:focus{
    outline: none;
  }
  .right-menu-item {
    display: inline-block;
    margin: 0 8px;
  }
}
.system_title {
  cursor: pointer;
  @keyframes text {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: -150% 0;
    }
  }
  .link {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    // color: #25376a;
    // text-shadow: 2px 2px 3px #a2b7ee;
    // 渐变色字体
    background: linear-gradient(
      90deg,
      rgba(131, 58, 180, 1) 0%,
      rgba(253, 29, 29, 1) 33.3%,
      rgb(41, 26, 245) 66.6%,
      rgba(131, 58, 180, 1) 100%
    );
    -webkit-background-clip: text; /*截取背景区域为文字*/
    color: transparent;
    background-size: 300% 100%; /*扩大背景区域*/
    animation: text 4s infinite linear;

    padding-right: 20px;
    .daping_img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
}
</style>
