<template>
  <div class="item">
    <el-form ref="addFormRef" :inline="true" :rules="rules" :model="formInline" class="demo-form-inline" :disabled="disabled">
      <el-form-item prop="ledgerAccountCode">
        <el-tree-select
          v-model="formInline.ledgerAccountCode"
          :data="treeData"
          check-strictly
          :render-after-expand="false"
          :props="{children: 'children',label: 'ledgerAccountName', value: 'ledgerAccountCode'}"
          placeholder="请选择会计科目"
        />
      </el-form-item>
      <el-form-item prop="amount">
        <el-input-number
          v-model="formInline.amount"
          :controls="false"
          placeholder="请输入金额"
          :disabled="isPay"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from "vue";

export default defineComponent({
  name: "item",
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    treeData: {
      type: Array,
      default: []
    },
    curData: {
      type: Object,
      default: {}
    },
    isPay: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const data = reactive({
      formInline: <any>{
        ledgerAccountCode: "",
        amount: null,
      },
      rules: {
        ledgerAccountCode: [{ required: true, message: "请选择会计科目", trigger: "change" }],
        amount: [{ required: true, message: "请输入金额", trigger: "blur" }],
      }
    });
    const addFormRef = ref();
    const checkValid = async () => {
      return await addFormRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          var label = data.formInline.ledgerAccountCode + new Date().getTime()
          emit('putData', { [label]: data.formInline })
          return true;
        }
        return false;
      })
    }

    const clear = () => {
      addFormRef.value.resetFields();
    }

    watch(() => props.curData, (val) => {
      data.formInline = val;
    }, {immediate: true})

    return {
      addFormRef,
      ...toRefs(data),
      ...toRefs(props),
      checkValid,
      clear
    };
  },
});
</script>

<style lang="scss" scoped>
.item {
  overflow: hidden;
  width: 460px;
  height: 50px;
  /deep/ .el-input-number input {
    text-align: left;
  }
}
</style>
