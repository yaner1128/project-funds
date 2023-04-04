<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :unique-opened="true"
      mode="vertical"
      active-text-color="#333"
      class="left-menu"
    >
      <sidebar-item
        v-for="route in permission_routers"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, watch, ref } from "vue";
import { useStore } from "vuex";
import SidebarItem from "./SidebarItem.vue";
// import Logo from "./Logo";

export default defineComponent({
  name: "App",
  components: { SidebarItem },
  setup() {
    const store = useStore();
    const data = reactive({
      permission_routers: store.state.permission.routers,
      sidebar: store.state.app.sidebar,
    });
    const resData = toRefs(data);

    const isCollapse = computed(() => {
      return !store.state.app.sidebar.opened;
    });

    return {
      ...resData,
      isCollapse,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.userInfoBox{
  height: 150px;
}
.left-menu /deep/ {
  .el-menu-item,
  .el-sub-menu__title {
    height: 50px;
    line-height: 50px;
  }
}
/deep/ .el-menu-item .el-menu-tooltip__trigger {
  display: inline-block !important;
  padding: 0 10px 0;
}
</style>
