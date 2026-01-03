<template>
  <div class="role-permission">
    <!-- 左侧：角色列表 -->
    <aside class="role-panel">
      <div class="panel-header">
        <div class="panel-title">角色列表</div>
        <div class="btn-icon" title="导入角色" @click="handleImportRole">
          <el-icon><Upload /></el-icon>
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
          <div class="role-item-actions">
            <span v-if="role.isSystem" class="system-badge">系统内置</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 右侧：权限配置 -->
    <section class="perm-panel" v-if="activeRole">
      <!-- 头部基本信息 -->
      <div class="perm-header">
        <div class="header-top">
          <h3 class="role-title">{{ activeRole.name }}</h3>
          <button
            v-if="!activeRole.isSystem"
            class="btn-edit-role"
            @click="handleEditRoleName"
            title="编辑角色信息"
          >
            <el-icon><Edit /></el-icon>
            编辑基本信息
          </button>
        </div>
        <div class="role-meta">
          <div class="meta-item">
            <span class="meta-label">角色描述：</span>
            <span class="meta-value">{{ activeRole.description }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">数据权限范围：</span>
            <span class="meta-value">
              {{
                activeRole.scope === 'all' ? '全部数据权限' :
                activeRole.scope === 'dept' ? '仅本部门' :
                activeRole.scope === 'self' ? '仅本人' : '自定义'
              }}
            </span>
          </div>
          <div class="meta-item" v-if="activeRole.isSystem">
            <span class="system-tag">
              <el-icon><Lock /></el-icon>
              系统内置角色
            </span>
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

    <!-- 编辑角色基本信息模态框 -->
    <el-dialog
      v-model="roleModalVisible"
      title="编辑角色信息"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="roleFormData" :rules="roleFormRules" ref="roleFormRef" label-position="top">
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="roleFormData.name"
            placeholder="请输入角色名称，例如：数据分析师"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleFormData.description"
            type="textarea"
            :rows="3"
            placeholder="请简要描述该角色的职责和权限范围..."
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="数据权限范围" prop="scope">
          <el-select v-model="roleFormData.scope" placeholder="请选择数据权限范围" style="width: 100%">
            <el-option label="全部数据权限" value="all">
              <div style="display: flex; flex-direction: column;">
                <span>全部数据权限</span>
                <span style="font-size: 12px; color: #9ca3af;">可以访问所有数据</span>
              </div>
            </el-option>
            <el-option label="仅本部门" value="dept">
              <div style="display: flex; flex-direction: column;">
                <span>仅本部门</span>
                <span style="font-size: 12px; color: #9ca3af;">只能访问本部门数据</span>
              </div>
            </el-option>
            <el-option label="仅本人" value="self">
              <div style="display: flex; flex-direction: column;">
                <span>仅本人</span>
                <span style="font-size: 12px; color: #9ca3af;">只能访问自己创建的数据</span>
              </div>
            </el-option>
            <el-option label="自定义" value="custom">
              <div style="display: flex; flex-direction: column;">
                <span>自定义</span>
                <span style="font-size: 12px; color: #9ca3af;">自定义数据权限规则</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeRoleModal">取消</el-button>
          <el-button type="primary" @click="handleRoleSubmit" :loading="roleSubmitting">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导入角色对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入角色"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="import-container">
        <el-alert
          title="导入说明"
          type="info"
          :closable="false"
          style="margin-bottom: 20px;"
        >
          <template #default>
            <div style="font-size: 13px; line-height: 1.6;">
              <p>• 支持 JSON 格式的角色配置文件</p>
              <p>• 文件大小不超过 5MB</p>
              <p>• 导入的角色将添加到现有角色列表中</p>
              <p>• 系统内置角色不会被覆盖</p>
            </div>
          </template>
        </el-alert>

        <el-upload
          ref="uploadRef"
          class="upload-container"
          drag
          :auto-upload="false"
          :on-change="handleFileChange"
          :file-list="importFileList"
          accept=".json"
          :limit="1"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            拖拽文件到此处或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 JSON 格式，文件大小不超过 5MB
            </div>
          </template>
        </el-upload>

        <div v-if="importPreview" class="preview-section">
          <div class="preview-title">预览导入数据</div>
          <div class="preview-content">
            <div class="preview-item" v-for="role in importPreview" :key="role.name">
              <div class="preview-role-name">{{ role.name }}</div>
              <div class="preview-role-desc">{{ role.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeImportDialog">取消</el-button>
          <el-button
            type="primary"
            @click="handleImportSubmit"
            :loading="importing"
            :disabled="!importFileList.length"
          >
            {{ importing ? '导入中...' : '开始导入' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { Edit, Lock, Upload, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { getRoles, updateRole, importRoles } from '@/api/role'

const route = useRoute()

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

// 角色模态框相关
const roleModalVisible = ref(false)
const roleSubmitting = ref(false)
const roleFormRef = ref(null)
const editingRoleId = ref(null)

// 导入角色相关
const importDialogVisible = ref(false)
const importing = ref(false)
const importFileList = ref([])
const importPreview = ref(null)
const uploadRef = ref(null)

const roleFormData = reactive({
  name: '',
  description: '',
  scope: 'self'
})

const roleFormRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 30, message: '角色名称长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' },
    { max: 100, message: '角色描述不能超过 100 个字符', trigger: 'blur' }
  ],
  scope: [
    { required: true, message: '请选择数据权限范围', trigger: 'change' }
  ]
}

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

// 打开编辑角色信息模态框
const handleEditRoleName = () => {
  if (!activeRole.value || activeRole.value.isSystem) {
    ElMessage.warning('系统内置角色不可编辑')
    return
  }
  editingRoleId.value = activeRole.value.id
  roleFormData.name = activeRole.value.name
  roleFormData.description = activeRole.value.description
  roleFormData.scope = activeRole.value.scope
  roleModalVisible.value = true
}

// 关闭角色模态框
const closeRoleModal = () => {
  roleModalVisible.value = false
  if (roleFormRef.value) {
    roleFormRef.value.resetFields()
  }
}

// 提交角色表单
const handleRoleSubmit = async () => {
  if (!roleFormRef.value) return

  roleFormRef.value.validate(async (valid) => {
    if (!valid) return

    roleSubmitting.value = true

    try {
      // 调用后端API更新角色基本信息
      const updateData = {
        name: roleFormData.name,
        description: roleFormData.description,
        scope: roleFormData.scope
      }

      const response = await updateRole(editingRoleId.value, updateData)

      if (response.code === 200) {
        // 更新本地数据
        const role = roles.value.find(r => r.id === editingRoleId.value)
        if (role) {
          role.name = roleFormData.name
          role.description = roleFormData.description
          role.scope = roleFormData.scope

          // 更新formData
          formData.name = roleFormData.name
          formData.description = roleFormData.description
          formData.scope = roleFormData.scope
        }

        ElMessage.success('角色信息已更新')
        roleSubmitting.value = false
        closeRoleModal()
      } else {
        ElMessage.error(response.message || '更新失败')
        roleSubmitting.value = false
      }
    } catch (error) {
      console.error('更新失败:', error)

      // Mock更新逻辑（API调用失败时的降级方案）
      setTimeout(() => {
        const role = roles.value.find(r => r.id === editingRoleId.value)
        if (role) {
          role.name = roleFormData.name
          role.description = roleFormData.description
          role.scope = roleFormData.scope

          // 更新formData
          formData.name = roleFormData.name
          formData.description = roleFormData.description
          formData.scope = roleFormData.scope

          ElMessage.success('角色信息已更新（Mock）')
        }

        roleSubmitting.value = false
        closeRoleModal()
      }, 800)
    }
  })
}

const handleReset = () => {
  if (activeRole.value) {
    handleSelectRole(activeRole.value)
  }
}

const handleSave = async () => {
  if (activeRole.value.isSystem) return

  saving.value = true

  try {
    // 调用后端API更新角色
    const updateData = {
      name: formData.name,
      description: formData.description,
      scope: formData.scope,
      permissions: formData.permissions
    }

    const response = await updateRole(activeRole.value.id, updateData)

    if (response.code === 200) {
      // 更新本地数据
      const roleIndex = roles.value.findIndex((r) => r.id === activeRole.value.id)
      if (roleIndex !== -1) {
        roles.value[roleIndex].name = formData.name
        roles.value[roleIndex].description = formData.description
        roles.value[roleIndex].scope = formData.scope
        roles.value[roleIndex].permissions = JSON.parse(JSON.stringify(formData.permissions))
      }
      saving.value = false
      ElMessage.success('角色权限已保存')
    } else {
      ElMessage.error(response.message || '保存失败')
      saving.value = false
    }
  } catch (error) {
    console.error('保存失败:', error)

    // Mock保存逻辑（API调用失败时的降级方案）
    setTimeout(() => {
      const roleIndex = roles.value.findIndex((r) => r.id === activeRole.value.id)
      if (roleIndex !== -1) {
        roles.value[roleIndex].name = formData.name
        roles.value[roleIndex].description = formData.description
        roles.value[roleIndex].scope = formData.scope
        roles.value[roleIndex].permissions = JSON.parse(JSON.stringify(formData.permissions))
      }
      saving.value = false
      ElMessage.success('角色权限已保存（Mock）')
    }, 800)
  }
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

// 导入角色相关函数
const handleImportRole = () => {
  importDialogVisible.value = true
}

const handleFileChange = (file, fileList) => {
  importFileList.value = fileList

  if (file.raw) {
    const isJSON = file.raw.type === 'application/json' || file.name.endsWith('.json')
    const isLt5M = file.raw.size / 1024 / 1024 < 5

    if (!isJSON) {
      ElMessage.error('只能上传 JSON 文件!')
      importFileList.value = []
      return
    }
    if (!isLt5M) {
      ElMessage.error('文件大小不能超过 5MB!')
      importFileList.value = []
      return
    }

    // 读取并预览文件内容
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target.result)

        // 验证数据格式
        if (Array.isArray(content)) {
          importPreview.value = content
        } else if (content.roles && Array.isArray(content.roles)) {
          importPreview.value = content.roles
        } else {
          ElMessage.error('文件格式不正确，请上传包含角色数组的 JSON 文件')
          importFileList.value = []
          importPreview.value = null
        }
      } catch (error) {
        ElMessage.error('JSON 文件解析失败，请检查文件格式')
        importFileList.value = []
        importPreview.value = null
      }
    }
    reader.readAsText(file.raw)
  }
}

const handleImportSubmit = async () => {
  if (!importPreview.value || importPreview.value.length === 0) {
    ElMessage.warning('请先上传文件')
    return
  }

  importing.value = true

  try {
    // 调用后端API导入角色
    const response = await importRoles(importPreview.value)

    if (response.code === 200) {
      // 更新本地角色列表
      if (response.data && response.data.imported) {
        response.data.imported.forEach(newRole => {
          roles.value.push(newRole)
        })
        ElMessage.success(`成功导入 ${response.data.imported.length} 个角色`)
      }
      importing.value = false
      closeImportDialog()
    } else {
      ElMessage.error(response.message || '导入失败')
      importing.value = false
    }
  } catch (error) {
    console.error('导入失败:', error)

    // Mock导入逻辑（API调用失败时的降级方案）
    setTimeout(() => {
      let importCount = 0

      importPreview.value.forEach(importRole => {
        // 检查是否已存在同名角色
        const existingRole = roles.value.find(r => r.name === importRole.name)

        if (!existingRole) {
          // 添加新角色
          const newRole = {
            id: Date.now() + Math.random(),
            name: importRole.name,
            description: importRole.description || '',
            isSystem: false,
            scope: importRole.scope || 'self',
            permissions: importRole.permissions || {
              project: { all: false, view: false, create: false, edit: false, delete: false, export: false },
              datasource: { all: false, view: false, edit: false, test: false, delete: false },
              ops: { all: false, monitor: false, dbMonitor: false, publish: false },
              settings: { all: false, org: false, role: false, audit: false, global: false },
            }
          }
          roles.value.push(newRole)
          importCount++
        }
      })

      if (importCount > 0) {
        ElMessage.success(`成功导入 ${importCount} 个角色（Mock）`)
      } else {
        ElMessage.warning('没有新角色被导入（可能已存在同名角色）')
      }

      importing.value = false
      closeImportDialog()
    }, 1000)
  }
}

const closeImportDialog = () => {
  importDialogVisible.value = false
  importFileList.value = []
  importPreview.value = null
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

// Init - 从URL参数中获取roleId并选中对应角色
const initializeRole = () => {
  const roleId = route.query.roleId
  if (roleId) {
    const role = roles.value.find(r => r.id === Number(roleId))
    if (role) {
      handleSelectRole(role)
      return
    }
  }
  // 默认选中第一个角色
  if (roles.value.length > 0) {
    handleSelectRole(roles.value[0])
  }
}

initializeRole()
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

.role-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
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

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.role-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--text-main);
}

.btn-edit-role {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-edit-role:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(59, 130, 246, 0.05);
}

.role-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.meta-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.meta-value {
  color: var(--text-main);
}

.system-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  font-size: 12px;
  border: 1px solid var(--border);
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
