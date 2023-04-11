<template>
  <div v-if="!item.hidden && item.children" class="menu-wrapper">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link :to="resolvePath(onlyOneChild)">
        <el-menu-item
          class="singleItem"
          :index="resolvePath(onlyOneChild)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <svg-icon
            v-if="onlyOneChild.meta.icon"
            :icon-class="onlyOneChild.meta.icon"
          />
          <template #title>
            <item
              v-if="onlyOneChild.meta"
              :title="onlyOneChild.meta.title"
            />
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="submenu" :index="resolvePath(item)">
      <template #title>
        <svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon" />
        <item
          v-if="item.meta"
          :icon="item.meta.icon"
          :title="item.meta.title"
        />
      </template>

      <template #default>
        <template v-for="child in item.children" :key="child">
          <div v-if="!child.hidden">
            <sidebar-item
              v-if="child.children && child.children.length > 0"
              :is-nest="true"
              :item="child"
              :key="child.path"
              :base-path="resolvePath(child)"
              class="nest-menu"
            />
            <app-link v-else :to="resolvePath(child)" :key="child.name">
              <el-menu-item :index="resolvePath(child)">
                <svg-icon
                  v-if="child.meta.icon"
                  :icon-class="child.meta.icon"
                />
                <template #title>
                  <item
                    v-if="child.meta"
                    :icon="child.meta.icon"
                    :title="child.meta.title"
                  />
                </template>
              </el-menu-item>
            </app-link>
          </div>
        </template>
      </template>
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import path from "path";
import { isExternal } from "@/utils/index";
import Item from "./Item.vue";
import AppLink from "./Link.vue";
// import FixiOSBug from "./FixiOSBug";

export default defineComponent({
  name: "SidebarItem",
  components: { AppLink, Item },
  // mixins: [FixiOSBug],
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const data = reactive({
      onlyOneChild: <any>null,
    });
    const resData = toRefs(data);

    const hasOneShowingChild = (children: any[], parent: any) => {
      const showingChildren = children.filter((item: any) => {
        if (item.hidden) {
          return false;
        } else {
          data.onlyOneChild = item;
          return true;
        }
      });
      if (showingChildren.length === 1) {
        return true;
      }
      if (showingChildren.length === 0) {
        data.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }
      return false;
    };
    const resolvePath = (menu: any) => {
      if (menu.meta.iframe || isExternalLink(menu.path)) {
        if (isExternalLink(menu.path)) {
          return menu.path;
        } else {
          return location.origin + process.env.VUE_APP_BASE_API + menu.path;
        }
      }
      return path.resolve(props.basePath, menu.path);
    };
    const isExternalLink = (routePath: string) => {
      return isExternal(routePath);
    };

    return {
      ...toRefs(props),
      ...resData,
      hasOneShowingChild,
      resolvePath,
      isExternalLink,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.singleItem {
  background-color: $menuBg;
  color: $menuText;
}
</style>
