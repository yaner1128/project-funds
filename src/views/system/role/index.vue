<template>
  <div class="app-container">
    <div class="head-container">
      <el-input
        v-model="query.name"
        clearable
        placeholder="输入名称搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="toQuery"
      />
      <el-button class="filter-item" type="primary" @click="toQuery">
        <el-icon class="el-icon--left"><Search /></el-icon>
        搜索
      </el-button>
      <el-button
        class="filter-item"
        type="success"
        @click="toCreate"
      >
        <el-icon class="el-icon--left"><Plus /></el-icon>
        新增
      </el-button>
    </div>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>角色列表</span>
              <!-- <el-button-group>
                <el-button
                  :type="type === 1 ? 'primary' : ''"
                  @click="changeType(1)"
                  >菜单分配</el-button
                >
                <el-button
                  :type="type !== 1 ? 'primary' : ''"
                  @click="changeType(2)"
                  >权限分配</el-button
                >
              </el-button-group> -->
            </div>
          </template>
          <el-table
            v-loading="loading"
            :data="tableData"
            highlight-current-row
            style="width: 100%"
            @current-change="handleCurrentChange"
          >
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="code" label="角色代码" width="200px" />
            <el-table-column prop="dataScope" label="数据权限" />
            <el-table-column prop="level" label="角色级别" />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="remark"
              label="描述"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="createTime"
              label="创建日期"
            >
              <template #default="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="130px"
              align="center"
            >
              <template #default="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="toEdit(scope.row)"
                >
                  <el-icon><EditPen /></el-icon>
                </el-button>
                <el-popconfirm
                  title="确定删除本条数据吗？"
                  @confirm="subDelete(scope.row.id)"
                >
                  <template #reference>
                    <el-button
                      type="danger"
                      size="small"
                      :loading="delLoading"
                      ><el-icon><Delete /></el-icon
                    ></el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
            ref="paginationRef"
            :pageObj="pageObj"
            :total="total"
            @search="toQuery"
          ></pagination>
        </el-card>
      </el-col>
      <!-- 授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card v-if="type===1" class="box-card">
          <template #header>
            <div class="card-header">
              <span>菜单分配</span>
              <el-button
                type="primary"
                :disabled="!showButton"
                :loading="menuLoading"
                @click="saveMenu"
              >保存</el-button>
            </div>
          </template>
          <el-checkbox v-model="checkAllmenu" @change="handleCheckAllChangeMenu">全选</el-checkbox>
          <el-tree
            ref="menuRef"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            accordion
            show-checkbox
            node-key="id"/>
        </el-card>
        <el-card v-else class="box-card">
          <template #header>
            <div class="card-header">
              <span>权限分配</span>
              <el-button
                type="primary"
                :disabled="!showButton"
                :loading="permissionLoading"
                @click="savePermission"
              >保存</el-button>
            </div>
          </template>
          <el-checkbox v-model="checkAllpermission" @change="handleCheckAllChangePermission">全选</el-checkbox>
          <el-tree
            ref="permissionRef"
            :data="permissions"
            :default-checked-keys="permissionIds"
            :props="defaultProps1"
            show-checkbox
            accordion
            node-key="id"/>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增 -->
    <eForm ref="eForm" :isAdd="isAdd" @toQuery="toQuery"></eForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import eForm from "./module/form.vue";
import { parseTime } from "@/utils/index";
import checkPermission from "@/utils/permission";
import { del, getRoles } from "@/api/role";
import { ElNotification } from "element-plus";
import Pagination from "@/components/Pagination/index.vue";
import { getPermissionTree } from '@/api/permission'
import { getMenusTree } from '@/api/menu'
import { editPermission, editMenu, get } from '@/api/role'
import config from "@/config";

export default defineComponent({
  name: "role",
  components: {
    eForm,
    Pagination,
  },
  setup() {
    const menuRef = ref();
    const permissionRef = ref();
    const data = reactive({
      loading: false,
      delLoading: false,
      query: {
        name: "",
      },
      isAdd: false,
      type: 1,
      changeType: (val: number) => {
        data.type = val;
      },
      pageObj: {
        page: 0,
        size: 10
      },
      total: 0,
      tableData: <any>[],
      currentId: 0,
      permissionLoading: false,
      menuLoading: false,
      showButton: false,
      permissions: [],
      permissionIds: <any>[],
      menus: [],
      menuIds: <any>[],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultProps1: {
        children: 'children',
        label: 'alias'
      },
      getPermissions: () => {
        getPermissionTree().then((res: any) => {
          data.permissions = res.data
        })
      },
      getMenus: () => {
        getMenusTree().then((res: any) => {
          data.menus = res.data
        })
      },
      handleCurrentChange: (val: any) => {
        if (val) {
          // 保存当前的角色id
          data.currentId = val.id
          // 点击后显示按钮
          data.showButton = true
          // 清空权限与菜单的选中
          if (data.type === 1) {
            menuRef.value.setCheckedKeys([])
          } else {
            permissionRef.value.setCheckedKeys([])
          }
          // 初始化
          data.menuIds = []
          data.permissionIds = []
          // 菜单数据需要特殊处理
          val.menuVOList.forEach((item:  any) => {
            let add = true
            for (let i = 0; i < val.menuVOList.length; i++) {
              if (item.id === val.menuVOList[i].pid) {
                add = false
                break
              }
            }
            if (add) {
              !item.children&&data.menuIds.push(item.id)
              item.children&&item.children.forEach((element:any) => {
                data.menuIds.push(element.id)
              });
            }
          })
          val.permissionVOList.forEach(function(val: { id: any; }, index: any) {
            data.permissionIds.push(val.id)
          })
        }
      },
      checkAllmenu: false,
      checkAllpermission: false,
      handleCheckAllChangeMenu: () =>{ 
        if (data.checkAllmenu) {
          menuRef.value.setCheckedNodes(data.menus);
        } else {
          menuRef.value.setCheckedKeys([]);
        }
      },
      handleCheckAllChangePermission: () =>{ 
        if (data.checkAllpermission) {
          permissionRef.value.setCheckedNodes(data.permissions);
        } else {
          permissionRef.value.setCheckedKeys([]);
        }
      },
    });
    const update = () => {
      // 无刷新更新 表格数据
      get(data.currentId).then((res: any) => {
        for (let i = 0; i < data.tableData.length; i++) {
          if (res.data[0].id === data.tableData[i].id) {
            data.tableData[i] = res.data[0]
            break
          }
        }
      })
    }
    // 菜单权限保存
    const saveMenu = () => {
      data.menuLoading = true
      const role = <any>{ id: data.currentId, menuIds: [], serviceId: config.serviceId }
      // 得到半选的父节点数据，保存起来
      menuRef.value.getHalfCheckedNodes().forEach(function(val: any) {
        const permission = val.id
        role.menuIds.push(permission)
      })
      // 得到已选中的 key 值
      menuRef.value.getCheckedKeys().forEach(function(val: any) {
        const permission = val
        role.menuIds.push(permission)
      })
      editMenu(role).then(res => {
        ElNotification({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        data.menuLoading = false
        update()
      }).catch(err => {
        data.menuLoading = false
      })
    }
    // 权限保存
    const savePermission = () => {
      data.permissionLoading = true
      const role = <any>{ id: data.currentId, permissionIds: [] }
      permissionRef.value.getCheckedKeys().forEach(function(val: any) {
        const permission = val
        role.permissionIds.push(permission)
      })
      editPermission(role).then(res => {
        ElNotification({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        data.permissionLoading = false
        update()
      }).catch(err => {
        data.permissionLoading = false
      })
    }
    // 新增
    const eForm = ref();
    const toCreate = () => {
      data.isAdd = true;
      eForm.value.handleDialog();
    };
    // 编辑
    const toEdit = (row: any) => {
      data.isAdd = false;
      eForm.value.handleDialog(row);
    };
    // 删除
    const subDelete = (id: any) => {
      data.delLoading = true;
      del(id)
        .then((res) => {
          data.delLoading = false;
          toQuery();
          ElNotification({
            title: "删除成功",
            type: "success",
            duration: 2500,
          });
        })
        .catch((err) => {
          data.delLoading = false;
          console.log(err.response.data.message);
        });
    };
    // 搜索
    const paginationRef = ref();
    const toQuery = () => {
      data.loading = true;
      const params = Object.assign(
        {
          currentPageIndex: data.pageObj.page + 1,
          pageSize: data.pageObj.size,
          ascs: "id",
        },
        data.query
      );
      getRoles(params).then((res: any) => {
        data.tableData = res.data.records;
        data.total = Number(res.data.total);
        data.loading = false;
      });
    };

    onMounted(() => {
      toQuery();
      // data.getPermissions();
      data.getMenus();
    });

    return {
      parseTime,
      checkPermission,
      ...toRefs(data),
      toQuery,
      toCreate,
      toEdit,
      eForm,
      subDelete,
      paginationRef,
      menuRef,
      permissionRef,
      saveMenu,
      savePermission,
    };
  },
});
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
