<template>
  <div>
    <el-button type="primary" @click="to" size="small">
      <el-icon class="el-icon--left"><EditPen /></el-icon>
    </el-button>
    <eForm ref="formRef" :is-add="false" @init="init" />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref } from "vue";
import eForm from "./form.vue";

export default defineComponent({
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  emits: ["init"],
  setup(props, { emit }) {
    const { data } = toRefs(props);
    const formRef = ref();
    const to = () => {
      formRef.value.getMenus();
      formRef.value.form = {
        id: data.value.id,
        component: data.value.component,
        name: data.value.name,
        sort: Number(data.value.sort),
        pid: data.value.pid,
        path: data.value.path,
        iframe: data.value.iframe,
        roles: [],
        icon: data.value.icon,
        embIcoNactive: data.value.embIcoNactive,
        embIcoActive: data.value.embIcoActive,
      };
      formRef.value.dialog = true;
    };
    const init = () => {
      emit("init");
    };
    return {
      to,
      formRef,
      init,
    };
  },
});
</script>

<style scoped>
div {
  display: inline-block;
  margin-right: 3px;
}
</style>
