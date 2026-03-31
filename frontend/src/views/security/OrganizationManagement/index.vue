<template>
  <div class="organization-management">
    <!-- 面包屑 -->
    <BreadcrumbHeader
      :items="[
        { label: '首页', path: '/' },
        { label: '安全与权限', path: '/security' },
        { label: '组织架构' }
      ]"
    />

    <div class="content-wrapper">
      <!-- 左侧：部门树 -->
      <div class="tree-panel">
        <div class="tree-header">
          <h3>部门</h3>
          <a-button type="primary" @click="handleAddRootDept">
            <template #icon><PlusOutlined /></template>
            新增部门
          </a-button>
        </div>

        <a-input-search
          v-model:value="searchText"
          placeholder="搜索部门"
          class="tree-search"
          allow-clear
          @search="onSearch"
        >
          <template #prefix>
            <SearchOutlined style="color: #bfbfbf" />
          </template>
        </a-input-search>

        <a-spin :spinning="treeLoading">
          <a-tree
            v-if="treeData.length > 0"
            :tree-data="treeData"
            :field-names="{ children: 'children', title: 'label', key: 'id' }"
            :expanded-keys="expandedKeys"
            :selected-keys="selectedKeys"
            show-line
            @select="onSelectDept"
            @expand="onExpand"
          >
            <template #title="{ label, count, id }">
              <div class="tree-node">
                <span class="node-label">{{ label }}</span>
                <span class="node-count">{{ count || 0 }}</span>
                <div class="node-actions" @click.stop>
                  <a-button type="link" size="small" @click="handleAddChildDept(id)">
                    <PlusOutlined />
                  </a-button>
                  <a-button type="link" size="small" @click="handleEditDept(id)">
                    <EditOutlined />
                  </a-button>
                  <a-button type="link" size="small" danger @click="handleDeleteDept(id)">
                    <DeleteOutlined />
                  </a-button>
                </div>
              </div>
            </template>
          </a-tree>
          <a-empty v-else description="暂无部门数据" />
        </a-spin>
      </div>

      <!-- 右侧：用户列表 -->
      <div class="user-panel">
        <div class="user-panel-header">
          <h3>{{ currentDeptName || '全部用户' }} <span class="user-count">({{ userStore.filteredData.length }})</span></h3>
        </div>
        <div class="user-panel-body">
          <SimpleCrudModal
            :config="dynamicUserConfig"
            :data="userStore.userList"
            :loading="userStore.loading"
            :pagination="userStore.pagination"
            :sort="userStore.sort"
            @add="userStore.handleAdd"
            @edit="userStore.handleEdit"
            @delete="userStore.handleDelete"
            @refresh="userStore.loadData"
            @search="userStore.handleSearch"
            @page-change="userStore.handlePageChange"
            @page-size-change="userStore.handlePageSizeChange"
            @sort-change="userStore.handleSortChange"
          />
        </div>
      </div>
    </div>

    <!-- 部门编辑弹窗 -->
    <CommonModal
      v-model:visible="deptModalVisible"
      :title="deptEditMode ? '编辑部门' : '新增部门'"
      :width="'600px'"
      :show-footer="true"
      @close="closeDeptModal"
    >
      <SimpleForm
        ref="deptFormRef"
        :modelValue="deptFormData"
        @update:modelValue="handleDeptFormUpdate"
        :config="dynamicDeptConfig.form"
      />

      <template #footer>
        <button class="modal-btn" @click="closeDeptModal">
          取消
        </button>
        <button
          class="modal-btn modal-btn-primary"
          @click="handleDeptSubmit"
          :disabled="deptSubmitting"
        >
          {{ deptSubmitting ? '保存中...' : '确定' }}
        </button>
      </template>
    </CommonModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons-vue'
import BreadcrumbHeader from '@/components/BreadcrumbHeader.vue'
import SimpleCrudModal from '@/components/simple/SimpleCrudModal.vue'
import CommonModal from '@/components/CommonModal.vue'
import SimpleForm from '@/components/simple/SimpleForm.vue'
import { useUserListStore } from '@/store'
import { userConfig } from './userConfig'
import { departmentConfig } from './departmentConfig'
import {
  getDepartmentTree,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentDetail
} from '@/api/department'
import { getRoles } from '@/api/role'

// 部门树相关
const treeLoading = ref(false)
const treeData = ref([])
const searchText = ref('')
const expandedKeys = ref([])
const selectedKeys = ref([])
const currentDeptId = ref(null)

// 用户管理相关
const userStore = useUserListStore()

// 角色列表
const roleList = ref([])

// 部门弹窗相关
const deptModalVisible = ref(false)
const deptEditMode = ref(false)
const deptSubmitting = ref(false)
const deptFormRef = ref(null)
const currentEditDeptId = ref(null)

const deptFormData = reactive({
  label: '',
  parentId: null,
  description: '',
  count: 0,
  isActive: true
})

// 动态部门配置（添加上级部门选项）
const dynamicDeptConfig = computed(() => {
  const config = { ...departmentConfig }

  // 将树形数据转换为平铺的选项列表
  const flattenTree = (nodes, result = []) => {
    nodes.forEach(node => {
      result.push({ label: node.label, value: node.id })
      if (node.children && node.children.length > 0) {
        flattenTree(node.children, result)
      }
    })
    return result
  }

  // 更新上级部门选项
  const parentField = config.form.fields.find(f => f.name === 'parentId')
  if (parentField) {
    parentField.options = flattenTree(treeData.value)
  }

  return config
})

// 动态用户配置（添加角色和部门选项）
const dynamicUserConfig = computed(() => {
  const config = JSON.parse(JSON.stringify(userConfig))

  // 将树形数据转换为平铺的选项列表
  const flattenTree = (nodes, result = []) => {
    nodes.forEach(node => {
      result.push({ label: node.label, value: node.id })
      if (node.children && node.children.length > 0) {
        flattenTree(node.children, result)
      }
    })
    return result
  }

  // 更新部门选项（表单）
  const formDeptField = config.form.fields.find(f => f.name === 'departmentId')
  if (formDeptField) {
    formDeptField.options = flattenTree(treeData.value)
  }

  // 更新部门选项（搜索）
  const searchDeptField = config.search.fields.find(f => f.name === 'departmentId')
  if (searchDeptField) {
    searchDeptField.options = flattenTree(treeData.value)
  }

  // 更新角色选项
  const roleField = config.form.fields.find(f => f.name === 'roleId')
  if (roleField) {
    roleField.options = roleList.value.map(role => ({
      label: role.name,
      value: role.id
    }))
  }

  return config
})

// 当前选中部门的名称
const currentDeptName = computed(() => {
  if (!currentDeptId.value) return ''

  // 递归查找部门名称
  const findDeptName = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node.label
      if (node.children && node.children.length > 0) {
        const found = findDeptName(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  return findDeptName(treeData.value, currentDeptId.value) || ''
})

// 加载部门树
const loadDepartmentTree = async () => {
  try {
    treeLoading.value = true
    const res = await getDepartmentTree()
    treeData.value = Array.isArray(res) ? res : []

    // 默认展开第一层并选中第一个部门
    if (treeData.value.length > 0) {
      expandedKeys.value = [treeData.value[0].id]
      selectedKeys.value = [treeData.value[0].id]
      currentDeptId.value = treeData.value[0].id
      // 加载该部门的用户
      loadUsersByDept(treeData.value[0].id)
    } else {
      // 如果没有部门，显示所有用户
      loadUsersByDept(null)
    }
  } catch (error) {
    console.error('加载部门树失败:', error)
    message.error('加载部门树失败')
  } finally {
    treeLoading.value = false
  }
}

// 加载角色列表
const loadRoleList = async () => {
  try {
    const res = await getRoles()
    roleList.value = Array.isArray(res) ? res : (res.data || [])
  } catch (error) {
    console.error('加载角色列表失败:', error)
    message.error('加载角色列表失败')
  }
}

// 搜索部门
const onSearch = (value) => {
  // TODO: 实现搜索逻辑
  console.log('搜索:', value)
}

// 选择部门
const onSelectDept = (keys) => {
  if (keys.length > 0) {
    selectedKeys.value = keys
    currentDeptId.value = keys[0]
    // 根据选中的部门加载用户列表
    loadUsersByDept(keys[0])
  } else {
    // 如果没有选中任何部门，显示所有用户
    selectedKeys.value = []
    currentDeptId.value = null
    loadUsersByDept(null)
  }
}

// 展开/收起节点
const onExpand = (keys) => {
  expandedKeys.value = keys
}

// 根据部门加载用户
const loadUsersByDept = (deptId) => {
  // 更新搜索条件，触发用户列表过滤
  userStore.handleSearch({
    ...userStore.searchQuery,
    departmentId: deptId || ''
  })
}

// 处理部门表单更新
const handleDeptFormUpdate = (newData) => {
  Object.assign(deptFormData, newData)
}

// 新增根部门
const handleAddRootDept = () => {
  deptEditMode.value = false
  currentEditDeptId.value = null
  resetDeptForm()
  deptModalVisible.value = true
}

// 新增子部门
const handleAddChildDept = (parentId) => {
  deptEditMode.value = false
  currentEditDeptId.value = null
  deptFormData.parentId = parentId
  deptModalVisible.value = true
}

// 编辑部门
const handleEditDept = async (id) => {
  try {
    deptEditMode.value = true
    currentEditDeptId.value = id

    // 加载部门详情
    const dept = await getDepartmentDetail(id)
    deptFormData.label = dept.label
    deptFormData.description = dept.description || ''
    deptFormData.count = dept.count || 0
    deptFormData.isActive = dept.isActive !== false

    deptModalVisible.value = true
  } catch (error) {
    console.error('加载部门详情失败:', error)
    message.error('加载部门详情失败')
  }
}

// 删除部门
const handleDeleteDept = (id) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除该部门吗？删除后将无法恢复。',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteDepartment(id)
        message.success('删除成功')
        await loadDepartmentTree()
      } catch (error) {
        console.error('删除部门失败:', error)
        message.error('删除失败')
      }
    }
  })
}

// 提交部门表单
const handleDeptSubmit = async () => {
  try {
    // 验证表单
    if (!deptFormRef.value?.validate()) {
      return
    }

    deptSubmitting.value = true

    const payload = {
      label: deptFormData.label,
      description: deptFormData.description,
      count: deptFormData.count || 0,
      isActive: deptFormData.isActive
    }

    if (deptEditMode.value) {
      await updateDepartment(currentEditDeptId.value, payload)
      message.success('更新成功')
    } else {
      if (deptFormData.parentId) {
        payload.parentId = deptFormData.parentId
      }
      await createDepartment(payload)
      message.success('创建成功')
    }

    await loadDepartmentTree()
    closeDeptModal()
  } catch (error) {
    console.error('提交失败:', error)
    message.error(deptEditMode.value ? '更新失败' : '创建失败')
  } finally {
    deptSubmitting.value = false
  }
}

// 关闭部门弹窗
const closeDeptModal = () => {
  deptModalVisible.value = false
  resetDeptForm()
}

// 重置部门表单
const resetDeptForm = () => {
  deptFormData.label = ''
  deptFormData.parentId = null
  deptFormData.description = ''
  deptFormData.count = 0
  deptFormData.isActive = true
  deptFormRef.value?.clearErrors()
}

// 初始化
onMounted(async () => {
  // 先加载角色列表
  await loadRoleList()
  // 加载用户数据
  await userStore.loadData()
  // 再加载部门树并选中第一个部门
  await loadDepartmentTree()
})
</script>

<style scoped>
.organization-management {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
}

.content-wrapper {
  flex: 1;
  display: flex;
  gap: 8px;
  padding: 8px;
  overflow: hidden;
}

/* 左侧部门树 */
.tree-panel {
  width: 280px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(to bottom, #fafafa, #fff);
}

.tree-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.tree-search {
  margin: 12px 16px;
  position: relative;
  z-index: 1;
  width: calc(100% - 32px);
}

.tree-search :deep(.ant-input-search) {
  width: 100%;
}

.tree-search :deep(.ant-input-affix-wrapper) {
  border-radius: 0px;
  border-color: #e8e8e8;
  transition: all 0.3s;
}

.tree-search :deep(.ant-input-affix-wrapper:hover) {
  border-color: #40a9ff;
}

.tree-search :deep(.ant-input-affix-wrapper-focused) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.tree-search :deep(.ant-input) {
  font-size: 13px;
}

.tree-panel :deep(.ant-spin-nested-loading) {
  flex: 1;
  overflow: hidden;
}

.tree-panel :deep(.ant-spin-container) {
  height: 100%;
  overflow-y: auto;
  padding: 8px 16px 16px;
}

.tree-panel :deep(.ant-tree) {
  background: transparent;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 4px 0;
}

.node-label {
  flex: 1;
  font-size: 14px;
  color: #262626;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 6px;
  background: rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.2);
  color: #1890ff;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.node-actions {
  display: none;
  align-items: center;
  gap: 4px;
}

.tree-node:hover .node-actions {
  display: flex;
}

.node-actions :deep(.ant-btn) {
  padding: 0;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tree-panel :deep(.ant-tree-node-selected) .node-label {
  color: #1890ff;
  font-weight: 500;
}

.tree-panel :deep(.ant-tree-node-selected) {
  background: rgba(24, 144, 255, 0.05);
}

.tree-panel :deep(.ant-empty) {
  padding: 40px 0;
}

/* 右侧用户列表 */
.user-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.user-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(to bottom, #fafafa, #fff);
}

.user-panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-count {
  font-size: 14px;
  font-weight: 400;
  color: #8c8c8c;
}

.user-panel-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.user-panel-body :deep(.simple-crud-modal) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 部门弹窗样式 */
.modal-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.modal-btn-primary {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.modal-btn-primary:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

.modal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>