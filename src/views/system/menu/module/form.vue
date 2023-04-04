<template>
  <el-dialog
    v-model="dialog"
    :title="isAdd ? '新增菜单' : '编辑菜单'"
    append-to-body
    :close-on-click-modal="false"
    width="600px"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="菜单图标">
        <el-popover
          placement="bottom-start"
          :width="460"
          trigger="click"
          @show="$refs['iconSelect'].reset()"
        >
          <template #reference>
            <el-input
              v-model="form.icon"
              style="width: 460px"
              placeholder="点击选择图标"
              clearable
            >
              <template #prefix>
                <svg-icon
                  v-if="form.icon"
                  :icon-class="form.icon"
                  class="el-input__icon"
                  style="height: 32px; width: 16px"
                />
                <el-icon class="el-input__icon" v-else><Search /></el-icon>
              </template>
            </el-input>
          </template>
          <IconSelect ref="iconSelect" @selected="selected" />
        </el-popover>
      </el-form-item>
      <el-form-item prop="enbableEmb">
        <div>
          <b>自定义图标（非激活状态 / 激活状态）</b>
          <div>
            <div
              @click="selectLocalIco($event)"
              pop="embIcoNactive"
              style="
                width: 48px;
                height: 48px;
                background-color: #f1eeee;
                border: 0px solid;
                border-radius: 3px;
                float: left;
              "
            >
              <img
                v-if="form.embIcoNactive"
                :src="form.embIcoNactive"
                style="width: 100%"
              />
              <div v-else class="image-slot" style="padding: 6px 0px 6px 15px">
                <el-icon><Plus /></el-icon>
              </div>
            </div>
            <div
              @click="selectLocalIco($event)"
              pop="embIcoActive"
              style="
                width: 48px;
                height: 48px;
                background-color: #f1eeee;
                border: 0px solid;
                border-radius: 3px;
                float: left;
                margin-left: 10px;
              "
            >
              <img
                v-if="form.embIcoActive"
                :src="form.embIcoActive"
                style="width: 100%"
              />
              <div v-else class="image-slot" style="padding: 6px 0px 6px 15px">
                <el-icon><Plus /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" placeholder="名称" style="width: 460px" />
      </el-form-item>
      <el-form-item label="菜单排序" prop="sort">
        <el-input-number
          v-model.number="form.sort"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 460px"
        />
      </el-form-item>
      <el-form-item label="内部菜单" prop="iframe">
        <el-radio v-model="form.iframe" :label="0">是</el-radio>
        <el-radio v-model="form.iframe" :label="1">否</el-radio>
      </el-form-item>
      <el-form-item label="链接地址">
        <el-input
          v-model="form.path"
          placeholder="菜单路径"
          style="width: 460px"
        />
      </el-form-item>
      <el-form-item v-if="form.iframe === 0" label="组件路径">
        <el-input
          v-model="form.component"
          placeholder="菜单路径"
          style="width: 460px"
        />
      </el-form-item>
      <el-form-item label="上级类目">
        <el-tree-select
          :check-strictly="true"
          v-model="form.pid"
          :data="menus"
          filterable
          style="width: 460px"
          placeholder="选择上级类目"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button link @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit"
          >确认</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { add, edit, getMenusTree } from "@/api/menu";
import IconSelect from "@/components/IconSelect/index.vue";
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  getCurrentInstance,
} from "vue";
import { ElNotification } from "element-plus";

export default defineComponent({
  components: { IconSelect },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["init"],
  setup(props, { emit }) {
    const { isAdd } = toRefs(props);
    const instance: any = getCurrentInstance();
    const data = reactive({
      loading: false,
      dialog: false,
      menus: [] as any,
      form: {
        name: "",
        sort: 999,
        path: "",
        component: "",
        iframe: 0,
        embIcoNactive: "",
        embIcoActive: "",
        enbableEmb: 0,
        roles: [],
        pid: 0,
        icon: "",
      } as any,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        sort: [
          {
            required: true,
            message: "请输入序号",
            trigger: "blur",
            type: "number",
          },
        ],
        iframe: [
          { required: true, message: "请选择菜单类型", trigger: "blur" },
        ],
      },
    });
    const cancel = () => {
      resetForm();
    };
    const formRef = ref();
    const doSubmit = () => {
      formRef.value.validate((valid: any) => {
        if (valid) {
          data.loading = true;
          if (isAdd.value) {
            doAdd();
          } else doEdit();
        } else {
          return false;
        }
      });
    };
    const doAdd = () => {
      add(data.form)
        .then((res) => {
          resetForm();
          ElNotification({
            title: "添加成功",
            type: "success",
            duration: 2500,
          });
          data.loading = false;
          emit("init");
        })
        .catch((err) => {
          data.loading = false;
          console.log(err.response.data.message);
        });
    };

    const doEdit = () => {
      edit(data.form)
        .then((res) => {
          resetForm();
          ElNotification({
            title: "修改成功",
            type: "success",
            duration: 2500,
          });
          data.loading = false;
          emit("init");
        })
        .catch((err) => {
          data.loading = false;
          console.log(err.response.data.message);
        });
    };
    const resetForm = () => {
      data.dialog = false;
      formRef.value.resetFields();
      data.form = {
        name: "",
        sort: 999,
        path: "",
        component: "",
        iframe: 0,
        roles: [],
        pid: 0,
        icon: "",
      };
    };
    const selected = (name: string) => {
      data.form.icon = name;
    };
    const handleArr = (arr: any) => {
      arr.forEach((item: any) => {
        item.value = item.id;
        item.label = item.name;
        if (item.children) {
          handleArr(item.children);
        }
      });
      return arr;
    };
    const getMenus = () => {
      getMenusTree().then(
        (res: any) => {
          data.menus = [];
          const menu: any = {
            value: "0",
            id: "0",
            label: "顶级类目",
            children: [],
          };
          menu.children = handleArr(res.data);
          data.menus.push(menu);
        }
      );
    };
    const findContainer: any = (dom: {
      tagName: string;
      hasAttribute: (arg0: string) => any;
      parentElement: any;
    }) => {
      if (dom.tagName == "HTML") {
        return null;
      }
      if (dom.hasAttribute("pop")) {
        return dom;
      } else {
        return findContainer(dom.parentElement);
      }
    };
    const selectLocalIco = (event: { target: any }) => {
      let div = findContainer(event.target);
      let pop = div.getAttribute("pop");
      var inputObj: any = document.createElement("input");
      inputObj.type = "file";
      inputObj.accept = ".jpg, .png";
      inputObj.click();
      inputObj.addEventListener("change", (event: any) => {
        let fileObj = inputObj.files[0];
        if (fileObj) {
          var reader = new FileReader();
          reader.readAsDataURL(fileObj);
          reader.onload = function (e: any) {
            let res = e.target.result;
            data.form[pop] = res;
          };
        }
      });
    };
    return {
      ...toRefs(data),
      getMenus,
      selected,
      doSubmit,
      cancel,
      selectLocalIco,
      formRef,
    };
  },
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
