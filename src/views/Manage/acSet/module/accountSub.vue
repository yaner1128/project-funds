<template>
  <el-dialog
    top="10vh"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-model="dialogFormVisible"
    :lock-scroll="true"
    width="1000px"
    title="会计科目"
    :before-close="resetForm"
  >
    <el-button v-permission="['ACCOUNTANT']" @click="addAccount" type="primary">新增</el-button>
    <vxe-table
      border
      ref="xTree"
      :column-config="{resizable: true}"
      :tree-config="{ rowField: 'id', parentField: 'parentId' }"
      :height="maxHeight"
      :data="tableData">
      <vxe-column field="ledgerAccountCode" title="会计科目编码" tree-node min-width="280px"></vxe-column>
      <vxe-column field="ledgerAccountName" title="会计科目名称" min-width="200px"></vxe-column>
      <vxe-column field="accountDirection" title="借贷方向">
        <template #default="{ row }">
          {{ row.accountDirection === '1' ? '借方' : '贷方' }}
        </template>
      </vxe-column>
    </vxe-table>
    <!-- 新增 -->
    <el-dialog
      :close-on-click-modal="false"
      :append-to-body="true"
      v-model="addFormVisible"
      :lock-scroll="true"
      width="500px"
      title="新增会计科目"
      :before-close="resetAddForm"
    >
      <div class="dialog_container">
        <el-form ref="addFormRef" :model="addForm" label-width="120px" :rules="rules">
          <el-form-item label="父级科目：" prop="parentCode">
            <el-tree-select
              :props="{children: 'children',label: 'ledgerAccountName', value: 'ledgerAccountCode'}"
              v-model="addForm.parentCode"
              :data="treeData"
              check-strictly
              :render-after-expand="false"
              placeholder="请选择父级科目"
            />
          </el-form-item>
          <el-form-item label="会计科目编码：" prop="ledgerAccountCode">
            <el-input v-model="addForm.ledgerAccountCode" placeholder="请输入会计科目编码" />
          </el-form-item>
          <el-form-item label="会计科目名称：" prop="ledgerAccountName">
            <el-input v-model="addForm.ledgerAccountName" placeholder="请输入会计科目名称" />
          </el-form-item>
          <el-form-item label="级别：" prop="levelNo">
            <el-select v-model="addForm.levelNo" placeholder="请选择会计科目级别">
              <el-option :label="1" :value="1" />
              <el-option :label="2" :value="2" />
              <el-option :label="3" :value="3" />
              <el-option :label="4" :value="4" />
              <el-option :label="5" :value="5" />
              <el-option :label="6" :value="6" />
            </el-select>
          </el-form-item>
          <el-form-item label="借贷方向：" prop="accountDirection">
            <el-switch
              v-model="addForm.accountDirection"
              inline-prompt
              active-text="借"
              inactive-text="贷"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div style="text-align: right">
          <el-button @click="submitAdd" type="primary">确认</el-button>
          <el-button link @click="resetAddForm" type="primary">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <template #footer>
      <div style="text-align: right">
        <el-button @click="resetForm" type="primary">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs,nextTick } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { simpleAccountingSubject, addLedgerAccounts } from "@/api/dsAccountSets";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "accountSub",
  components: {
    Pagination,
  },
  setup(props, { emit }) {
    const checkCode = (rule: any, value: any, callback: any) => {
      if(value == '0') {
        callback(new Error('会计科目编码不能为0'))
      }
      callback()
    }
    const data = reactive({
      dialogFormVisible: false,
      accountSetCode: null,
      tableData: [],
      treeData: <any>[],
      addFormVisible: false,
      maxHeight: 400,
      addForm: {
        parentCode: '0',
        ledgerAccountCode: '',
        ledgerAccountName: '',
        accountDirection: null,
        levelNo: ''
      },
      rules: {
        parentCode: [{ required: true, message: "请选择父级科目", trigger: "change" }],
        ledgerAccountCode: [{ required: true, message: "请输入会计科目编码", trigger: "blur" },{ validator: checkCode, trigger: 'blur' } ],
        ledgerAccountName: [{ required: true, message: "请输入会计科目名称", trigger: "blur" }],
        accountDirection: [{ required: true, message: "请选择借贷方向", trigger: "change" }],
        levelNo: [{ required: true, message: "请选择科目级别", trigger: "change" }],
      }
    });
    const getData = () => {
      simpleAccountingSubject({ accountSetCode: data.accountSetCode }).then((res: any) => {
        data.tableData = res.data;
        data.treeData = [{
          ledgerAccountCode: '0',
          ledgerAccountName: '顶级科目',
          parentCode: null,
          children: res.data.slice(0)
        }]
      })
    }
    // 打开弹窗
    const open = (accountSetCode: any) => {
      data.accountSetCode = accountSetCode;
      getData();
      data.dialogFormVisible = true;
    };
    // 新增
    const addFormRef = ref();
    const addAccount = () => {
      data.addFormVisible = true;
      autoHeight();
    }
    const resetAddForm = () => {
      addFormRef.value.resetFields();
      data.addFormVisible = false;
    };
    const submitAdd = async () => {
      await addFormRef.value.validate((valid: any, fields: any) => {
        if (valid) {
          const params = Object.assign({
            accountSetCode: data.accountSetCode
          }, data.addForm)
          addLedgerAccounts(params).then((res: any) => {
            if(res.code === 200) {
              ElMessage.success('新增成功')
              addFormRef.value.resetFields();
              resetAddForm();
              getData();
              return
            }
            ElMessage.warning(res.message);
          })
        }
      })
    }
    // 关闭
    const resetForm = () => {
      data.dialogFormVisible = false;
    };

    // 设置高度
    const setHeight = () => {
      nextTick(() => {
        data.maxHeight = innerHeight - 340; // 这里的X就是顶部栏的高度
      });
    };
    // 高度自适应
    const autoHeight = () => {
      // 初始化的时候，设置高度
      setHeight();
      // 改变浏览器窗口大小的时候，设置高度
      window.addEventListener("resize", () => {
        setHeight();
      });
    };

    onMounted(() => {
      autoHeight();
    })

    return {
      addFormRef,
      ...toRefs(data),
      open,
      resetForm,
      addAccount,
      resetAddForm,
      submitAdd
    };
  },
});
</script>

<style lang="scss" scoped>
.scrollbar {
  height: calc(100vh - 173px);
}
.el-select, .el-input{
  width: 430px;
}
</style>
