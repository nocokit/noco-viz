<template>
  <div class="organization-management">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <h2>组织架构 (Organization)</h2>
      </div>
      <div class="header-right">
        <div class="sync-status">
          <el-icon><Refresh /></el-icon>
          数据来源: LDAP 同步
        </div>
        <el-button class="header-btn">
          <el-icon><Sort /></el-icon>
          导入/导出
        </el-button>
        <el-button type="primary" class="header-btn">
          <el-icon><RefreshRight /></el-icon>
          立即同步
        </el-button>
      </div>
    </header>

    <div class="content-body">
      <!-- Left: Org Tree -->
      <aside class="org-tree-panel">
        <div class="tree-header">
          <el-input
            v-model="filterText"
            placeholder="搜索部门..."
            prefix-icon="Search"
            class="tree-search"
          />
        </div>
        <div class="tree-content">
          <el-tree
            ref="treeRef"
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            highlight-current
            node-key="id"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <el-icon class="node-icon" v-if="data.children && data.children.length"><OfficeBuilding /></el-icon>
                <el-icon class="node-icon" v-else><Folder /></el-icon>
                <span class="node-name">{{ node.label }}</span>
                <span class="node-count">{{ data.count }}</span>
                <div class="node-actions" @click.stop>
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="handleAddChildNode(data)"
                    title="添加子部门"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-button>
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="handleEditNode(data)"
                    title="编辑部门"
                  >
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    size="small"
                    @click="handleDeleteNode(data, node)"
                    title="删除部门"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </aside>

      <!-- Right: Members -->
      <aside class="member-panel">
        <div class="panel-toolbar">
          <div class="breadcrumb">
            {{ currentDept.label || '集团总部' }} <span>/ 成员列表 ({{ currentDept.count || 1204 }})</span>
          </div>
          <div class="toolbar-actions">
            <el-input
              v-model="searchMember"
              placeholder="搜索成员姓名/工号"
              prefix-icon="Search"
              style="width: 200px"
            />
            <el-button type="primary" icon="Plus" @click="openCreateModal">
              添加成员
            </el-button>
          </div>
        </div>

        <div class="table-container">
          <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: 'rgba(0,0,0,0.2)', color: '#9ca3af', borderBottom: '1px solid #2d2e33' }" :cell-style="{ background: 'transparent', color: '#fff', borderBottom: '1px solid #2d2e33' }" row-class-name="table-row">
            <el-table-column label="姓名 / 工号" width="250">
              <template #default="scope">
                <div class="user-cell">
                  <div class="avatar" :style="{ background: scope.row.avatarColor }">
                    {{ scope.row.initials }}
                  </div>
                  <div>
                    <div class="user-name">{{ scope.row.name }}</div>
                    <div class="user-no">{{ scope.row.no }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="dept" label="所属部门" />
            <el-table-column label="系统角色">
              <template #default="scope">
                <span :class="['role-badge', scope.row.roleClass]">{{ scope.row.role }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" />
            <el-table-column label="状态">
              <template #default="scope">
                <span class="status-cell">
                  <span :class="['status-dot', scope.row.status === 'active' ? 'status-active' : 'status-disabled']"></span>
                  {{ scope.row.status === 'active' ? '正常' : '禁用' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </aside>
    </div>

    <!-- 新增/编辑部门节点模态框 -->
    <el-dialog
      v-model="deptModalVisible"
      :title="isDeptEditMode ? '编辑部门' : '新增部门'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="deptFormData" :rules="deptFormRules" ref="deptFormRef" label-position="top">
        <el-form-item label="部门名称" prop="label">
          <el-input v-model="deptFormData.label" placeholder="请输入部门名称" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDeptModal">取消</el-button>
          <el-button type="primary" @click="handleDeptSubmit" :loading="deptSubmitting">
            {{ isDeptEditMode ? '保存' : '创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增/编辑成员模态框 -->
    <el-dialog
      v-model="modalVisible"
      :title="isEditMode ? '编辑成员' : '新增成员'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-position="top">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="no">
              <el-input v-model="formData.no" placeholder="例如：NO.1001" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱地址" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="所属部门" prop="dept">
              <el-select v-model="formData.dept" placeholder="请选择部门" style="width: 100%">
                <el-option label="集团总部" value="集团总部" />
                <el-option label="研发中心" value="研发中心" />
                <el-option label="市场营销部" value="市场营销部" />
                <el-option label="财务部" value="财务部" />
                <el-option label="前端架构组" value="前端架构组" />
                <el-option label="后端服务组" value="后端服务组" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统角色" prop="role">
              <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
                <el-option label="超级管理员" value="超级管理员" />
                <el-option label="管理员" value="管理员" />
                <el-option label="普通用户" value="普通用户" />
                <el-option label="访客" value="访客" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio value="active">正常</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="头像颜色" prop="avatarColor">
          <el-select v-model="formData.avatarColor" placeholder="选择头像背景色" style="width: 100%">
            <el-option label="蓝色" value="#3b82f6" />
            <el-option label="橙色" value="#f59e0b" />
            <el-option label="绿色" value="#10b981" />
            <el-option label="紫色" value="#8b5cf6" />
            <el-option label="红色" value="#ef4444" />
            <el-option label="灰色" value="#333" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeModal">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEditMode ? '保存' : '创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import { Search, Refresh, RefreshRight, Sort, Plus, OfficeBuilding, Folder, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// --- Tree Logic ---
const filterText = ref('')
const treeRef = ref(null)
const currentDept = ref({ label: '集团总部', count: 1204 })

const defaultProps = {
  children: 'children',
  label: 'label',
}

const treeData = [
  {
    id: 1,
    label: '集团总部',
    count: 1204,
    children: [
      {
        id: 2,
        label: '研发中心',
        count: 450,
        children: [
          { id: 21, label: '前端架构组', count: 32 },
          { id: 22, label: '后端服务组', count: 85 },
        ],
      },
      {
        id: 3,
        label: '市场营销部',
        count: 210,
      },
      {
        id: 4,
        label: '财务部',
        count: 45,
      },
    ],
  },
]

watch(filterText, (val) => {
  treeRef.value.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}

const handleNodeClick = (data) => {
  currentDept.value = data
}

// --- Department Node CRUD Logic ---
const deptModalVisible = ref(false)
const isDeptEditMode = ref(false)
const deptSubmitting = ref(false)
const deptFormRef = ref(null)
let parentNodeData = null
let currentEditingNode = null

// 部门表单数据
const deptFormData = reactive({
  label: ''
})

// 部门表单验证规则
const deptFormRules = {
  label: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 30, message: '部门名称长度在 2 到 30 个字符', trigger: 'blur' }
  ]
}

// 生成新的部门ID
let maxDeptId = 100
const generateDeptId = () => {
  maxDeptId++
  return maxDeptId
}

// 添加子部门
const handleAddChildNode = (data) => {
  isDeptEditMode.value = false
  parentNodeData = data
  currentEditingNode = null
  resetDeptForm()
  deptModalVisible.value = true
}

// 编辑部门
const handleEditNode = (data) => {
  isDeptEditMode.value = true
  parentNodeData = null
  currentEditingNode = data
  deptFormData.label = data.label
  deptModalVisible.value = true
}

// 删除部门
const handleDeleteNode = (data, node) => {
  ElMessageBox.confirm(
    `确定要删除部门 "${data.label}" 吗？${data.children && data.children.length > 0 ? '删除后，其子部门也将被删除。' : ''}此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // 找到父节点并删除该节点
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      if (index !== -1) {
        children.splice(index, 1)
        ElMessage.success(`部门 "${data.label}" 已删除`)
      }
    })
    .catch(() => {})
}

// 关闭部门模态框
const closeDeptModal = () => {
  deptModalVisible.value = false
  resetDeptForm()
}

// 重置部门表单
const resetDeptForm = () => {
  deptFormData.label = ''
  if (deptFormRef.value) {
    deptFormRef.value.resetFields()
  }
}

// 提交部门表单
const handleDeptSubmit = () => {
  if (!deptFormRef.value) return

  deptFormRef.value.validate((valid) => {
    if (!valid) return

    deptSubmitting.value = true

    // 模拟异步提交
    setTimeout(() => {
      if (isDeptEditMode.value) {
        // 编辑模式
        if (currentEditingNode) {
          currentEditingNode.label = deptFormData.label
          ElMessage.success(`部门 "${deptFormData.label}" 已更新`)
        }
      } else {
        // 新增模式
        const newDept = {
          id: generateDeptId(),
          label: deptFormData.label,
          count: 0,  // 人员数量动态计算
          children: []
        }

        if (parentNodeData) {
          // 添加为子节点
          if (!parentNodeData.children) {
            parentNodeData.children = []
          }
          parentNodeData.children.push(newDept)
          ElMessage.success(`子部门 "${deptFormData.label}" 创建成功`)
        }
      }

      deptSubmitting.value = false
      closeDeptModal()
    }, 800)
  })
}

// --- Modal & Form Logic ---
const modalVisible = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const editingMemberNo = ref(null)

// 表单数据
const formData = reactive({
  name: '',
  no: '',
  email: '',
  dept: '',
  role: '普通用户',
  status: 'active',
  avatarColor: '#3b82f6'
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  no: [
    { required: true, message: '请输入工号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  dept: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ],
  role: [
    { required: true, message: '请选择系统角色', trigger: 'change' }
  ]
}

// 生成首字母缩写
const getInitials = (name) => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// 获取角色样式类
const getRoleClass = (role) => {
  if (role === '超级管理员' || role === '管理员') {
    return 'admin'
  }
  return ''
}

// 打开新增成员模态框
const openCreateModal = () => {
  isEditMode.value = false
  editingMemberNo.value = null
  resetForm()
  modalVisible.value = true
}

// 关闭模态框
const closeModal = () => {
  modalVisible.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.no = ''
  formData.email = ''
  formData.dept = ''
  formData.role = '普通用户'
  formData.status = 'active'
  formData.avatarColor = '#3b82f6'
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 提交表单
const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate((valid) => {
    if (!valid) return

    submitting.value = true

    // 模拟异步提交
    setTimeout(() => {
      if (isEditMode.value) {
        // 编辑模式
        const member = tableData.find(item => item.no === editingMemberNo.value)
        if (member) {
          member.name = formData.name
          member.no = formData.no
          member.email = formData.email
          member.dept = formData.dept
          member.role = formData.role
          member.roleClass = getRoleClass(formData.role)
          member.status = formData.status
          member.avatarColor = formData.avatarColor
          member.initials = getInitials(formData.name)
          ElMessage.success(`成员 "${formData.name}" 已更新`)
        }
      } else {
        // 新增模式
        const newMember = {
          name: formData.name,
          no: formData.no,
          initials: getInitials(formData.name),
          avatarColor: formData.avatarColor,
          dept: formData.dept,
          role: formData.role,
          roleClass: getRoleClass(formData.role),
          email: formData.email,
          status: formData.status
        }
        tableData.unshift(newMember)
        ElMessage.success(`成员 "${formData.name}" 创建成功`)
      }

      submitting.value = false
      closeModal()
    }, 800)
  })
}

// --- Table Logic ---
const searchMember = ref('')
const tableData = reactive([
  {
    name: 'David Miller',
    no: 'NO.1001',
    initials: 'DM',
    avatarColor: '#3b82f6',
    dept: '集团总部',
    role: '超级管理员',
    roleClass: 'admin',
    email: 'david@company.com',
    status: 'active',
  },
  {
    name: 'Sarah Jen',
    no: 'NO.1024',
    initials: 'SJ',
    avatarColor: '#f59e0b',
    dept: '研发中心',
    role: '普通用户',
    roleClass: '',
    email: 'sarah@company.com',
    status: 'active',
  },
  {
    name: 'Mike Ross',
    no: 'NO.8821',
    initials: 'MR',
    avatarColor: '#333',
    dept: '市场营销部',
    role: '普通用户',
    roleClass: '',
    email: 'mike@company.com',
    status: 'disabled',
  },
])

// 编辑成员
const handleEdit = (row) => {
  isEditMode.value = true
  editingMemberNo.value = row.no
  formData.name = row.name
  formData.no = row.no
  formData.email = row.email
  formData.dept = row.dept
  formData.role = row.role
  formData.status = row.status
  formData.avatarColor = row.avatarColor
  modalVisible.value = true
}

// 删除成员
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除成员 "${row.name}" 吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      const index = tableData.findIndex(item => item.no === row.no)
      if (index !== -1) {
        tableData.splice(index, 1)
        ElMessage.success('成员已删除')
      }
    })
    .catch(() => {})
}
</script>

<style scoped>
/* =========================================
   Global Variables & Reset
   ========================================= */
.organization-management {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #0a0b0d; /* var(--bg-body) */
  color: #ffffff; /* var(--text-main) */
  overflow: hidden;
}

/* =========================================
   Header
   ========================================= */
.page-header {
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid #2d2e33; /* var(--border) */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(20, 21, 25, 0.9);
  flex-shrink: 0;
}

.header-left h2 {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.sync-status {
  font-size: 12px;
  color: #9ca3af; /* var(--text-secondary) */
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #2d2e33;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* =========================================
   Content Body
   ========================================= */
.content-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 24px;
  gap: 24px;
}

/* --- Left: Org Tree Panel --- */
.org-tree-panel {
  width: 300px;
  background: #1c1d21; /* var(--bg-card) */
  border: 1px solid #2d2e33;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tree-header {
  padding: 16px;
  border-bottom: 1px solid #2d2e33;
}

.tree-search :deep(.el-input__wrapper) {
  background-color: #000;
  box-shadow: 0 0 0 1px #2d2e33 inset;
}

.tree-search :deep(.el-input__inner) {
  color: #fff;
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.tree-content :deep(.el-tree) {
  background: transparent;
  color: #9ca3af;
}

.tree-content :deep(.el-tree-node__content:hover) {
  background-color: #26272c; /* var(--bg-hover) */
  color: #fff;
}

.tree-content :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6; /* var(--primary) */
}

.custom-tree-node {
  display: flex;
  align-items: center;
  font-size: 13px;
  width: 100%;
}

.node-icon {
  margin-right: 8px;
  font-size: 14px;
}

.node-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-count {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.1);
  padding: 1px 6px;
  border-radius: 10px;
  color: #9ca3af;
  margin-right: 8px;
}

.node-actions {
  display: none;
  gap: 4px;
}

.custom-tree-node:hover .node-actions {
  display: flex;
}

.node-actions .el-button {
  padding: 2px;
  font-size: 14px;
}

/* --- Right: Member Panel --- */
.member-panel {
  flex: 1;
  background: #1c1d21;
  border: 1px solid #2d2e33;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-toolbar {
  padding: 16px 24px;
  border-bottom: 1px solid #2d2e33;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breadcrumb {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb span {
  color: #9ca3af; /* var(--text-muted) */
  font-weight: 400;
  font-size: 12px;
}

.toolbar-actions {
  display: flex;
  gap: 12px;
}

.toolbar-actions :deep(.el-input__wrapper) {
  background-color: #000;
  box-shadow: 0 0 0 1px #2d2e33 inset;
}

.toolbar-actions :deep(.el-input__inner) {
  color: #fff;
}

.table-container {
  flex: 1;
  overflow-y: auto;
}

/* Table Styles Override */
.table-container :deep(.el-table) {
  background-color: transparent;
  --el-table-border-color: #2d2e33;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: rgba(0, 0, 0, 0.2);
  --el-table-row-hover-bg-color: #26272c;
  --el-table-text-color: #fff;
  --el-table-header-text-color: #9ca3af;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #fff;
  flex-shrink: 0;
}

.user-name {
  font-weight: 600;
  font-size: 13px;
  color: #fff;
}

.user-no {
  font-size: 12px;
  color: #9ca3af;
}

.role-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  display: inline-block;
}

.role-badge.admin {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.status-cell {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.status-active {
  background: #10b981; /* var(--success) */
}

.status-disabled {
  background: #9ca3af; /* var(--text-muted) */
}
</style>
