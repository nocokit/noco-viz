<template>
  <div class="role-permission">
    <!-- 左侧：角色列表 -->
    <aside class="role-panel">
      <div class="panel-header">
        <div class="panel-title">角色列表</div>
        <div class="btn-icon" title="新建角色" @click="handleAddRole">
          <el-icon><Plus /></el-icon>
        </div>
      </div>
      <div class="role-list">
        <div
          v-for="role in roles"
          :key="role.id"
          class="role-item"
          :class="{ active: activeRole && activeRole.id === role.id }"
          @click="handleSelectRole(role)"
        >
          <div class="role-info">
            <h4>{{ role.name }}</h4>
            <p>{{ role.description }}</p>
          </div>
          <span v-if="role.isSystem" class="system-badge">系统内置</span>
        </div>
      </div>
    </aside>

    <!-- 右侧：权限配置 -->
    <section class="perm-panel" v-if="activeRole">
      <!-- 头部基本信息 -->
      <div class="perm-header">
        <div class="form-grid">
          <div class="form-group">
            <label>角色名称</label>
            <input
              type="text"
              class="form-input"
              v-model="formData.name"
              :disabled="activeRole.isSystem"
            />
          </div>
          <div class="form-group">
            <label>角色描述</label>
            <input
              type="text"
              class="form-input"
              v-model="formData.description"
              :disabled="activeRole.isSystem"
            />
          </div>
          <div class="form-group">
            <label>数据权限范围</label>
            <select
              class="form-input"
              v-model="formData.scope"
              :disabled="activeRole.isSystem"
              :style="{ background: activeRole.isSystem ? '#111' : '' }"
            >
              <option value="all">全部数据权限</option>
              <option value="dept">仅本部门</option>
              <option value="self">仅本人</option>
              <option value="custom">自定义</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 权限矩阵 -->
      <div class="perm-content">
        <!-- Section 1: Workspace -->
        <div class="perm-section">
          <div class="section-title">
            <span>工作台权限 (Workspace)</span>
            <label
              class="checkbox-wrapper"
              :class="{ disabled: activeRole.isSystem }"
            >
              <input
                type="checkbox"
                v-model="isWorkspaceAllChecked"
                :disabled="activeRole.isSystem"
                @change="toggleSection('workspace', $event.target.checked)"
              />
              <span class="checkbox-box"></span> 全选
            </label>
          </div>

          <!-- Module: Project -->
          <div class="perm-card">
            <div class="card-header">
              <span class="module-name">项目管理</span>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.project.all"
                  :disabled="activeRole.isSystem"
                  @change="toggleModule('project', $event.target.checked)"
                />
                <span class="checkbox-box"></span>
              </label>
            </div>
            <div class="card-body">
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.project.view"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 查看列表
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.project.create"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 新建项目
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.project.edit"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 编辑项目
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.project.delete"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 删除项目
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.project.export"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 导出/复制
              </label>
            </div>
          </div>

          <!-- Module: Data Source -->
          <div class="perm-card">
            <div class="card-header">
              <span class="module-name">数据源管理</span>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.datasource.all"
                  :disabled="activeRole.isSystem"
                  @change="toggleModule('datasource', $event.target.checked)"
                />
                <span class="checkbox-box"></span>
              </label>
            </div>
            <div class="card-body">
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.datasource.view"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 查看列表
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.datasource.edit"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 新建/编辑连接
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.datasource.test"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 测试连接
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.datasource.delete"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 删除数据源
              </label>
            </div>
          </div>
        </div>

        <!-- Section 2: Ops & System -->
        <div class="perm-section">
          <div class="section-title">
            <span>运维与系统 (System)</span>
            <label
              class="checkbox-wrapper"
              :class="{ disabled: activeRole.isSystem }"
            >
              <input
                type="checkbox"
                v-model="isSystemAllChecked"
                :disabled="activeRole.isSystem"
                @change="toggleSection('system', $event.target.checked)"
              />
              <span class="checkbox-box"></span> 全选
            </label>
          </div>

          <!-- Module: Ops -->
          <div class="perm-card">
            <div class="card-header">
              <span class="module-name">运维中心</span>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.ops.all"
                  :disabled="activeRole.isSystem"
                  @change="toggleModule('ops', $event.target.checked)"
                />
                <span class="checkbox-box"></span>
              </label>
            </div>
            <div class="card-body">
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.ops.monitor"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 系统监控
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.ops.dbMonitor"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 数据源连接池监控
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.ops.publish"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 发布链接管理
              </label>
            </div>
          </div>

          <!-- Module: Settings -->
          <div class="perm-card">
            <div class="card-header">
              <span class="module-name">系统设置</span>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.settings.all"
                  :disabled="activeRole.isSystem"
                  @change="toggleModule('settings', $event.target.checked)"
                />
                <span class="checkbox-box"></span>
              </label>
            </div>
            <div class="card-body">
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.settings.org"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 组织架构管理
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.settings.role"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 角色权限分配
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.settings.audit"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 审计日志查看
              </label>
              <label
                class="checkbox-wrapper"
                :class="{ disabled: activeRole.isSystem }"
              >
                <input
                  type="checkbox"
                  v-model="formData.permissions.settings.global"
                  :disabled="activeRole.isSystem"
                />
                <span class="checkbox-box"></span> 全局配置 (Logo/安全)
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="perm-footer">
        <button class="btn" @click="handleReset" :disabled="activeRole.isSystem">
          重置
        </button>
        <button
          class="btn btn-primary"
          :disabled="activeRole.isSystem || saving"
          @click="handleSave"
          :title="activeRole.isSystem ? '系统内置角色不可修改' : ''"
        >
          {{ activeRole.isSystem ? '系统内置角色不可修改' : (saving ? '保存中...' : '保存更改') }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// --- Mock Data ---
const roles = ref([
  {
    id: 1,
    name: '超级管理员',
    description: '拥有系统所有权限',
    isSystem: true,
    scope: 'all',
    permissions: {
      project: { all: true, view: true, create: true, edit: true, delete: true, export: true },
      datasource: { all: true, view: true, edit: true, test: true, delete: true },
      ops: { all: true, monitor: true, dbMonitor: true, publish: true },
      settings: { all: true, org: true, role: true, audit: true, global: true },
    },
  },
  {
    id: 2,
    name: '项目管理员',
    description: '管理所有项目及资源',
    isSystem: false,
    scope: 'dept',
    permissions: {
      project: { all: true, view: true, create: true, edit: true, delete: true, export: true },
      datasource: { all: true, view: true, edit: true, test: true, delete: true },
      ops: { all: false, monitor: false, dbMonitor: false, publish: false },
      settings: { all: false, org: false, role: false, audit: false, global: false },
    },
  },
  {
    id: 3,
    name: '开发工程师',
    description: '仅限编辑和开发大屏',
    isSystem: false,
    scope: 'dept',
    permissions: {
      project: { all: false, view: true, create: true, edit: true, delete: false, export: true },
      datasource: { all: false, view: true, edit: false, test: true, delete: false },
      ops: { all: false, monitor: true, dbMonitor: false, publish: false },
      settings: { all: false, org: false, role: false, audit: false, global: false },
    },
  },
  {
    id: 4,
    name: '普通访客',
    description: '仅具备查看权限',
    isSystem: false,
    scope: 'self',
    permissions: {
      project: { all: false, view: true, create: false, edit: false, delete: false, export: false },
      datasource: { all: false, view: false, edit: false, test: false, delete: false },
      ops: { all: false, monitor: false, dbMonitor: false, publish: false },
      settings: { all: false, org: false, role: false, audit: false, global: false },
    },
  },
])

// --- State ---
const activeRole = ref(null)
const formData = reactive({
  name: '',
  description: '',
  scope: 'self',
  permissions: {},
})
const saving = ref(false)

// --- Computed ---
const isWorkspaceAllChecked = computed({
  get: () => {
    if (!formData.permissions.project || !formData.permissions.datasource) return false
    return formData.permissions.project.all && formData.permissions.datasource.all
  },
  set: (val) => {
    toggleModule('project', val)
    toggleModule('datasource', val)
  }
})

const isSystemAllChecked = computed({
  get: () => {
    if (!formData.permissions.ops || !formData.permissions.settings) return false
    return formData.permissions.ops.all && formData.permissions.settings.all
  },
  set: (val) => {
    toggleModule('ops', val)
    toggleModule('settings', val)
  }
})

// --- Methods ---
const handleSelectRole = (role) => {
  activeRole.value = role
  // Deep copy permissions to formData to avoid direct mutation of source until save
  formData.name = role.name
  formData.description = role.description
  formData.scope = role.scope
  formData.permissions = JSON.parse(JSON.stringify(role.permissions))
}

const handleAddRole = () => {
  const newRole = {
    id: Date.now(),
    name: '新角色',
    description: '请配置角色权限',
    isSystem: false,
    scope: 'self',
    permissions: {
      project: { all: false, view: false, create: false, edit: false, delete: false, export: false },
      datasource: { all: false, view: false, edit: false, test: false, delete: false },
      ops: { all: false, monitor: false, dbMonitor: false, publish: false },
      settings: { all: false, org: false, role: false, audit: false, global: false },
    },
  }
  roles.value.push(newRole)
  handleSelectRole(newRole)
}

const handleReset = () => {
  if (activeRole.value) {
    handleSelectRole(activeRole.value)
  }
}

const handleSave = () => {
  if (activeRole.value.isSystem) return
  
  saving.value = true
  setTimeout(() => {
    // Save back to local mock data
    const roleIndex = roles.value.findIndex((r) => r.id === activeRole.value.id)
    if (roleIndex !== -1) {
      roles.value[roleIndex].name = formData.name
      roles.value[roleIndex].description = formData.description
      roles.value[roleIndex].scope = formData.scope
      roles.value[roleIndex].permissions = JSON.parse(JSON.stringify(formData.permissions))
    }
    saving.value = false
    ElMessage.success('角色权限已保存')
  }, 800)
}

const toggleModule = (moduleName, checked) => {
  if (activeRole.value.isSystem) return
  
  const modulePerms = formData.permissions[moduleName]
  if (modulePerms) {
    Object.keys(modulePerms).forEach((key) => {
      modulePerms[key] = checked
    })
  }
}

const toggleSection = (section, checked) => {
   // Computed setter handles this logic by calling toggleModule
}

// Init
handleSelectRole(roles.value[0])
</script>

<style scoped>
/* =========================================
   Global Variables
   ========================================= */
.role-permission {
  --bg-body: #0a0b0d;
  --bg-sidebar: #141519;
  --bg-card: #1c1d21;
  --bg-hover: #26272c;
  --bg-input: #000000;
  
  --primary: #3b82f6;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  
  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --border: #2d2e33;

  height: 100%;
  display: flex;
  background-color: var(--bg-body);
  color: var(--text-main);
  overflow: hidden;
}

/* =========================================
   Left: Role Panel
   ========================================= */
.role-panel {
  width: 280px;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
}

.btn-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: 0.2s;
}

.btn-icon:hover {
  background: var(--bg-hover);
  color: var(--primary);
}

.role-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.role-item {
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid transparent;
  transition: 0.2s;
}

.role-item:hover {
  background: var(--bg-hover);
}

.role-item.active {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.role-info h4 {
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 500;
  color: var(--text-main);
}

.role-info p {
  font-size: 12px;
  color: var(--text-muted);
}

.role-item.active .role-info h4 {
  color: var(--primary);
}

.system-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-muted);
}

/* =========================================
   Right: Permission Panel
   ========================================= */
.perm-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-body);
  overflow: hidden;
}

/* Header */
.perm-header {
  padding: 24px 32px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
  flex-shrink: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 24px;
  align-items: end;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
}

.form-input:focus {
  border-color: var(--primary);
}

.form-input:disabled {
  background: #111;
  color: var(--text-muted);
  cursor: not-allowed;
}

/* Content */
.perm-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.perm-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid var(--primary);
  display: flex;
  justify-content: space-between;
}

/* Card */
.perm-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.card-header {
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.module-name {
  font-weight: 500;
  font-size: 13px;
}

.card-body {
  padding: 16px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* Custom Checkbox */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  user-select: none;
}

.checkbox-wrapper:hover {
  color: #fff;
}

.checkbox-wrapper input {
  display: none;
}

.checkbox-box {
  width: 16px;
  height: 16px;
  border: 1px solid var(--border);
  border-radius: 3px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  transition: 0.2s;
}

.checkbox-wrapper input:checked + .checkbox-box {
  background: var(--primary);
  border-color: var(--primary);
}

.checkbox-wrapper input:checked + .checkbox-box::after {
  content: "✓";
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}

/* Disabled State */
.checkbox-wrapper.disabled {
  color: #555;
  cursor: not-allowed;
}

.checkbox-wrapper.disabled input:checked + .checkbox-box {
  background: #333;
  border-color: #444;
}

.checkbox-wrapper input:disabled + .checkbox-box {
  background: #333;
  border-color: #444;
  cursor: not-allowed;
}

/* Footer */
.perm-footer {
  padding: 16px 32px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

.btn {
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  transition: 0.2s;
}

.btn:hover:not(:disabled) {
  border-color: var(--text-main);
  color: var(--text-main);
}

.btn-primary {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
