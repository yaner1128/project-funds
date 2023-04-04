<!-- @author zhengjie -->
<template>
  <div class="icon-body">
    <el-input
      v-model="name"
      style="position: relative"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <el-icon><Search /></el-icon>
    </el-input>
    <div class="icon-list">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        @click="selectedIcon(item)"
      >
        <svg-icon :icon-class="item" style="height: 30px; width: 16px" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import icons from "./requireIcons";
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  emits: ["selected"],
  name: "IconSelect",
  setup(props, { emit }) {
    const data = reactive({
      name: "",
      iconList: icons,
    });

    const filterIcons = () => {
      if (data.name) {
        data.iconList = data.iconList.filter((item: any) =>
          item.includes(data.name)
        );
      } else {
        data.iconList = icons;
      }
    };

    const selectedIcon = (name: any) => {
      emit("selected", name);
      document.body.click();
    };
    const reset = () => {
      data.name = "";
      data.iconList = icons;
    };
    return {
      ...toRefs(data),
      filterIcons,
      selectedIcon,
      reset
    }
  },
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
