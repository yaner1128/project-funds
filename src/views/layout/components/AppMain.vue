<template>
  <section class="app-main">
    <router-view v-slot="{ Component }" :key="key">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component"></component>
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import route from "@/router/routers";

export default defineComponent({
  name: "AppMain",
  setup() {
    const $store = useStore();
    const $route: any = route.currentRoute.value;

    const cachedViews = computed(() => {
      return $store.state.tagsView.cachedViews;
    });

    const key = computed(() => {
      return $route.fullPath;
    });

    return {
      cachedViews,
      key,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100vh - 160px);
  z-index: 88;
  // padding-bottom: 60px;
  // height: 700px;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 85px;
  }
}
</style>
