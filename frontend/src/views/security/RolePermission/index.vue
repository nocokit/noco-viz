<template>
  <div class="role-permission-page">
    <SimpleCrudPage
      :breadcrumb="[
        { label: '首页', path: '/' },
        { label: '安全与权限', path: '/users' },
        { label: '角色权限' }
      ]"
      :config="crudConfig"
      :data="roleStore.roleList"
      :loading="roleStore.loading"
      :pagination="roleStore.pagination"
      :sort="roleStore.sort"
      v-on="eventHandlers"
      @configure-permission="openPermissionDrawer"
    />

    <!-- 权限配置抽屉 -->
    <a-drawer
      v-model:open="drawerVisible"
      width="1100"
      :closable="true"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <template #title>
        <div class="drawer-header-content">
          <div>
            <h3 class="role-title">{{ activeRole?.name }}</h3>
            <p class="role-desc">{{ activeRole?.description || '暂无描述' }}</p>
          </div>
        </div>
      </template>

      <template #default>
        <div v-if="activeRole" class="permission-content">
        <!-- 角色信息 -->
        <div class="role-info-section">
          <div class="info-row">
            <span class="info-label">数据权限范围</span>
            <a-tag :color="getScopeTagColor(activeRole.scope)">
              {{ getScopeText(activeRole.scope) }}
            </a-tag>
          </div>
          <div class="info-row">
            <span class="info-label">关联用户数</span>
            <span class="info-value">{{ activeRole.userCount || 0 }} 人</span>
          </div>
          <div class="info-row" v-if="activeRole.isSystem">
            <a-alert
              message="系统内置角色，权限配置仅供查看"
              type="info"
              :closable="false"
              show-icon
            />
          </div>
        </div>

        <!-- 保存按钮区域 -->
        <div class="save-actions">
          <a-button @click="handleReset" :disabled="activeRole?.isSystem">
            重置
          </a-button>
          <a-button
            type="primary"
            @click="handleSave"
            :disabled="activeRole?.isSystem || saving"
            :loading="saving"
          >
            {{ activeRole?.isSystem ? '系统内置角色不可修改' : '保存更改' }}
          </a-button>
        </div>

        <!-- 权限配置区域 -->
        <div class="permissions-area">
          <div class="permissions-header">
            <h4>功能权限配置</h4>
            <a-space>
              <a-button size="small" @click="handleSelectAll" :disabled="activeRole?.isSystem">
                全选
              </a-button>
              <a-button size="small" @click="handleClearAll" :disabled="activeRole?.isSystem">
                清空
              </a-button>
            </a-space>
          </div>

          <div class="perm-table-wrapper">
            <table class="perm-table">
              <thead>
                <tr>
                  <th width="120">分类</th>
                  <th width="150">模块</th>
                  <th width="80">全选</th>
                  <th width="80">查看</th>
                  <th width="80">创建</th>
                  <th width="80">编辑</th>
                  <th width="80">删除</th>
                  <th>其他操作</th>
                </tr>
              </thead>
            <tbody>
              <!-- 用户与角色管理 -->
              <tr v-if="formData.permissions.users">
                <td class="category-name" rowspan="2">用户与角色</td>
                <td class="module-name">用户管理</td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.users.all"
                    :disabled="activeRole.isSystem"
                    @change="toggleModule('users')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.users.view"
                    :disabled="activeRole.isSystem"
                    @change="updateModuleAll('users')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.users.create"
                    :disabled="activeRole.isSystem"
                    @change="updateModuleAll('users')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.users.edit"
                    :disabled="activeRole.isSystem"
                    @change="updateModuleAll('users')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.users.delete"
                    :disabled="activeRole.isSystem"
                    @change="updateModuleAll('users')"
                  />
                </td>
                <td class="checkbox-cell">-</td>
              </tr>
              <tr v-if="formData.permissions.roles">
                <td class="module-name">角色管理</td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.roles.all"
                    :disabled="activeRole.isSystem"
                    @change="toggleModule('roles')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.roles.view"
                    :disabled="activeRole.isSystem"
                    @change="updateModuleAll('roles')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.roles.create"
                    :disabled="activeRole.isSystem"
                    @change="updateModuleAll('roles')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.roles.edit"
                    :disabled="activeRole.isSystem"
                    @change="updateModuleAll('roles')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.roles.delete"
                    :disabled="activeRole.isSystem"
                    @change="updateModuleAll('roles')"
                  />
                </td>
                <td class="checkbox-cell">-</td>
              </tr>

              <!-- 工作台权限 -->
              <tr v-if="formData.permissions.projects">
                <td class="category-name" rowspan="4">工作台</td>
                <td class="module-name">项目管理</td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.projects.all"
                    :disabled="activeRole.isSystem"
                    @change="toggleModule('projects')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.projects.view" :disabled="activeRole.isSystem" @change="updateModuleAll('projects')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.projects.create" :disabled="activeRole.isSystem" @change="updateModuleAll('projects')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.projects.edit" :disabled="activeRole.isSystem" @change="updateModuleAll('projects')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.projects.delete" :disabled="activeRole.isSystem" @change="updateModuleAll('projects')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.projects.publish" :disabled="activeRole.isSystem" @change="updateModuleAll('projects')">
                    发布
                  </a-checkbox>
                </td>
              </tr>
              <tr v-if="formData.permissions.templates">
                <td class="module-name">模板管理</td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.templates.all"
                    :disabled="activeRole.isSystem"
                    @change="toggleModule('templates')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.templates.view" :disabled="activeRole.isSystem" @change="updateModuleAll('templates')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.templates.create" :disabled="activeRole.isSystem" @change="updateModuleAll('templates')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.templates.edit" :disabled="activeRole.isSystem" @change="updateModuleAll('templates')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.templates.delete" :disabled="activeRole.isSystem" @change="updateModuleAll('templates')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.templates.publish" :disabled="activeRole.isSystem" @change="updateModuleAll('templates')">
                    发布
                  </a-checkbox>
                </td>
              </tr>
              <tr v-if="formData.permissions.datasets">
                <td class="module-name">数据集管理</td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.datasets.all"
                    :disabled="activeRole.isSystem"
                    @change="toggleModule('datasets')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.datasets.view" :disabled="activeRole.isSystem" @change="updateModuleAll('datasets')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.datasets.create" :disabled="activeRole.isSystem" @change="updateModuleAll('datasets')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.datasets.edit" :disabled="activeRole.isSystem" @change="updateModuleAll('datasets')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.datasets.delete" :disabled="activeRole.isSystem" @change="updateModuleAll('datasets')" />
                </td>
                <td class="checkbox-cell">-</td>
              </tr>
              <tr v-if="formData.permissions.connections">
                <td class="module-name">数据连接管理</td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.connections.all"
                    :disabled="activeRole.isSystem"
                    @change="toggleModule('connections')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.connections.view" :disabled="activeRole.isSystem" @change="updateModuleAll('connections')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.connections.create" :disabled="activeRole.isSystem" @change="updateModuleAll('connections')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.connections.edit" :disabled="activeRole.isSystem" @change="updateModuleAll('connections')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.connections.delete" :disabled="activeRole.isSystem" @change="updateModuleAll('connections')" />
                </td>
                <td class="checkbox-cell">-</td>
              </tr>

              <!-- 资产管理 -->
              <tr v-if="formData.permissions.media">
                <td class="category-name" rowspan="2">资产管理</td>
                <td class="module-name">媒体资源</td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.media.all"
                    :disabled="activeRole.isSystem"
                    @change="toggleModule('media')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.media.view" :disabled="activeRole.isSystem" @change="updateModuleAll('media')" />
                </td>
                <td class="checkbox-cell">-</td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.media.edit" :disabled="activeRole.isSystem" @change="updateModuleAll('media')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.media.delete" :disabled="activeRole.isSystem" @change="updateModuleAll('media')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.media.upload" :disabled="activeRole.isSystem" @change="updateModuleAll('media')">
                    上传
                  </a-checkbox>
                </td>
              </tr>
              <tr v-if="formData.permissions.components">
                <td class="module-name">组件库</td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.components.all"
                    :disabled="activeRole.isSystem"
                    @change="toggleModule('components')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.components.view" :disabled="activeRole.isSystem" @change="updateModuleAll('components')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.components.create" :disabled="activeRole.isSystem" @change="updateModuleAll('components')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.components.edit" :disabled="activeRole.isSystem" @change="updateModuleAll('components')" />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.components.delete" :disabled="activeRole.isSystem" @change="updateModuleAll('components')" />
                </td>
                <td class="checkbox-cell">-</td>
              </tr>

              <!-- 系统管理 -->
              <tr v-if="formData.permissions.system">
                <td class="category-name" rowspan="2">系统管理</td>
                <td class="module-name">系统设置</td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.system.all"
                    :disabled="activeRole.isSystem"
                    @change="toggleModule('system')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.system.view" :disabled="activeRole.isSystem" @change="updateModuleAll('system')" />
                </td>
                <td class="checkbox-cell">-</td>
                <td class="checkbox-cell">-</td>
                <td class="checkbox-cell">-</td>
                <td class="checkbox-cell">
                  <a-space direction="vertical" :size="4">
                    <a-checkbox v-model:checked="formData.permissions.system.config" :disabled="activeRole.isSystem" @change="updateModuleAll('system')">
                      配置
                    </a-checkbox>
                    <a-checkbox v-model:checked="formData.permissions.system.backup" :disabled="activeRole.isSystem" @change="updateModuleAll('system')">
                      备份
                    </a-checkbox>
                    <a-checkbox v-model:checked="formData.permissions.system.restore" :disabled="activeRole.isSystem" @change="updateModuleAll('system')">
                      恢复
                    </a-checkbox>
                  </a-space>
                </td>
              </tr>
              <tr v-if="formData.permissions.security">
                <td class="module-name">安全管理</td>
                <td class="checkbox-cell">
                  <a-checkbox
                    v-model:checked="formData.permissions.security.all"
                    :disabled="activeRole.isSystem"
                    @change="toggleModule('security')"
                  />
                </td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.security.view" :disabled="activeRole.isSystem" @change="updateModuleAll('security')" />
                </td>
                <td class="checkbox-cell">-</td>
                <td class="checkbox-cell">-</td>
                <td class="checkbox-cell">-</td>
                <td class="checkbox-cell">
                  <a-checkbox v-model:checked="formData.permissions.security.config" :disabled="activeRole.isSystem" @change="updateModuleAll('security')">
                    配置
                  </a-checkbox>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
      </template>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import SimpleCrudPage from '@/components/simple/SimpleCrudPage.vue'
import { useRoleStore } from '@/store'
import { crudConfig } from './crudConfig'
import { getRolePermissions, updateRolePermissions } from '@/api/role'

// 使用 Pinia store
const roleStore = useRoleStore()

// 抽屉状态
const drawerVisible = ref(false)
const activeRole = ref(null)
const saving = ref(false)

// 权限表单数据
const formData = ref({
  permissions: {
    users: { all: false, view: false, create: false, edit: false, delete: false },
    roles: { all: false, view: false, create: false, edit: false, delete: false },
    projects: { all: false, view: false, create: false, edit: false, delete: false, publish: false },
    templates: { all: false, view: false, create: false, edit: false, delete: false, publish: false },
    datasets: { all: false, view: false, create: false, edit: false, delete: false },
    connections: { all: false, view: false, create: false, edit: false, delete: false },
    media: { all: false, view: false, upload: false, edit: false, delete: false },
    components: { all: false, view: false, create: false, edit: false, delete: false },
    system: { all: false, view: false, config: false, backup: false, restore: false },
    security: { all: false, view: false, config: false }
  }
})

// 统一的事件处理器
const eventHandlers = computed(() => ({
  // CRUD 操作
  add: roleStore.handleAdd,
  edit: roleStore.handleEdit,
  delete: roleStore.handleDelete,

  // 数据操作
  refresh: roleStore.loadData,
  search: roleStore.handleSearch,

  // 表格操作
  pageChange: roleStore.handlePageChange,
  pageSizeChange: roleStore.handlePageSizeChange,
  sortChange: roleStore.handleSortChange,

  // 自定义操作
  configurePermission: openPermissionDrawer,
}))

// 获取数据权限范围文本
const getScopeText = (scope) => {
  const map = {
    all: '全部数据',
    dept: '本部门',
    self: '仅本人',
    custom: '自定义'
  }
  return map[scope] || scope
}

// 获取数据权限范围标签颜色
const getScopeTagColor = (scope) => {
  const map = {
    all: 'red',
    dept: 'blue',
    self: 'green',
    custom: 'orange'
  }
  return map[scope] || 'default'
}

// 打开权限配置抽屉
const openPermissionDrawer = async (role) => {
  activeRole.value = role
  drawerVisible.value = true

  // 加载角色权限
  try {
    const permissions = await getRolePermissions(role.id)
    if (permissions) {
      formData.value.permissions = permissions
    }
  } catch (error) {
    console.error('加载权限失败:', error)
    message.error('加载权限失败')
  }
}

// 切换模块权限（全选/取消全选）
const toggleModule = (module) => {
  const modulePerms = formData.value.permissions[module]
  if (!modulePerms) return

  const checked = modulePerms.all
  Object.keys(modulePerms).forEach(key => {
    if (key !== 'all') {
      modulePerms[key] = checked
    }
  })
}

// 更新模块的全选状态
const updateModuleAll = (module) => {
  const modulePerms = formData.value.permissions[module]
  if (!modulePerms) return

  // 检查除了 all 之外的所有权限是否都被选中
  const allChecked = Object.keys(modulePerms)
    .filter(key => key !== 'all')
    .every(key => modulePerms[key])

  modulePerms.all = allChecked
}

// 全选所有权限
const handleSelectAll = () => {
  Object.keys(formData.value.permissions).forEach(module => {
    const modulePerms = formData.value.permissions[module]
    Object.keys(modulePerms).forEach(key => {
      modulePerms[key] = true
    })
  })
  message.success('已全选所有权限')
}

// 清空所有权限
const handleClearAll = () => {
  Object.keys(formData.value.permissions).forEach(module => {
    const modulePerms = formData.value.permissions[module]
    Object.keys(modulePerms).forEach(key => {
      modulePerms[key] = false
    })
  })
  message.success('已清空所有权限')
}

// 重置权限
const handleReset = async () => {
  if (!activeRole.value) return

  try {
    const permissions = await getRolePermissions(activeRole.value.id)
    if (permissions) {
      formData.value.permissions = permissions
    }
    message.success('已重置')
  } catch (error) {
    console.error('重置失败:', error)
    message.error('重置失败')
  }
}

// 保存权限
const handleSave = async () => {
  if (!activeRole.value || activeRole.value.isSystem) return

  try {
    saving.value = true
    await updateRolePermissions(activeRole.value.id, formData.value.permissions)
    message.success('保存成功')
    drawerVisible.value = false
  } catch (error) {
    console.error('保存失败:', error)
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 初始化加载
onMounted(() => {
  roleStore.loadData()
})
</script>

<style scoped>
.save-actions {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}
</style>
