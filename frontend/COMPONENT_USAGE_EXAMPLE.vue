<template>
  <PageLayout :show-sidebar="false">
    <!-- 页面头部 - 使用 PageHeader 组件 -->
    <template #header>
      <PageHeader
        title="项目列表"
        subtitle="管理所有可视化项目和报表"
        :icon="FolderOpened"
      >
        <template #actions>
          <SearchBar
            v-model="searchQuery"
            placeholder="搜索项目..."
            style="width: 300px; margin-right: 12px"
          />
          <el-button type="primary" @click="showCreateModal">
            <el-icon><Plus /></el-icon>
            新建项目
          </el-button>
        </template>
      </PageHeader>

      <!-- 筛选栏 - 使用 TabFilter 组件 -->
      <TabFilter
        v-model="activeTab"
        :tabs="[
          { value: 'all', label: '全部项目', count: projects.length },
          { value: 'mine', label: '我创建的', count: myProjects.length },
          { value: 'shared', label: '协作项目', count: sharedProjects.length }
        ]"
        @change="handleTabChange"
      />
    </template>

    <!-- 主内容区 -->
    <div class="content-area">
      <!-- 项目卡片网格 -->
      <div class="projects-grid">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
        >
          <!-- 卡片图片区域 -->
          <div class="card-image">
            <img
              v-if="project.coverImage"
              :src="project.coverImage"
              :alt="project.title"
            />
            <div v-else class="card-image-default">
              <component :is="getProjectIcon(project.type)" />
            </div>

            <!-- 悬停时的操作按钮 -->
            <div class="card-overlay">
              <el-button type="primary" @click="handleEdit(project)">
                {{ project.type === 'screen' ? '进入大屏编辑器' : '进入报表编辑器' }}
              </el-button>
              <el-button @click="handlePreview(project)">预览</el-button>
            </div>
          </div>

          <!-- 卡片内容 -->
          <div class="card-content">
            <div class="card-header">
              <div class="card-title">
                <component :is="getProjectIcon(project.type)" class="type-icon" />
                {{ project.title }}
              </div>

              <!-- 操作菜单 - 使用 ActionDropdown 组件 -->
              <ActionDropdown
                :actions="[
                  { label: '编辑信息', value: 'edit', icon: Edit },
                  { label: '复制项目', value: 'duplicate', icon: DocumentCopy },
                  { label: '导出', value: 'export', icon: Download },
                  { label: '删除', value: 'delete', type: 'danger', icon: Delete, divided: true }
                ]"
                @select="(cmd) => handleAction(cmd, project)"
              />
            </div>

            <p class="card-description">{{ project.description }}</p>

            <div class="card-footer">
              <StatusBadge :status="project.status" />
              <span class="update-time">{{ project.updatedAt }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 - 使用 EmptyState 组件 -->
      <EmptyState
        v-if="filteredProjects.length === 0"
        description="暂无项目"
        :image="emptyImage"
      >
        <el-button type="primary" @click="showCreateModal">
          <el-icon><Plus /></el-icon>
          创建第一个项目
        </el-button>
      </EmptyState>
    </div>
  </PageLayout>

  <!-- 新建项目弹窗 - 使用 StepModal 组件 -->
  <StepModal
    v-model="createModalVisible"
    title="新建项目"
    :steps="[
      { title: '选择类型' },
      { title: '基本信息' }
    ]"
    :step-validator="validateStep"
    @finish="handleCreateProject"
    @cancel="resetCreateForm"
  >
    <!-- 第一步：选择类型 -->
    <template #step-0="{ formData }">
      <div class="type-selection">
        <div
          v-for="type in projectTypes"
          :key="type.value"
          :class="['type-card', { active: formData.type === type.value }]"
          @click="formData.type = type.value"
        >
          <component :is="type.icon" class="type-icon" />
          <h3>{{ type.label }}</h3>
          <p>{{ type.description }}</p>
        </div>
      </div>
    </template>

    <!-- 第二步：基本信息 -->
    <template #step-1="{ formData }">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="项目名称" required>
          <el-input v-model="formData.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入项目描述"
          />
        </el-form-item>
        <el-form-item label="选择模板">
          <el-select v-model="formData.templateId" placeholder="请选择模板">
            <el-option label="空白模板" value="blank" />
            <el-option label="数据分析" value="analytics" />
            <el-option label="营销监控" value="marketing" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </StepModal>

  <!-- 删除确认对话框 - 使用 ConfirmDialog 组件 -->
  <ConfirmDialog
    v-model="deleteDialogVisible"
    title="删除确认"
    :message="`确定要删除项目 "${currentProject?.title}" 吗？此操作不可恢复。`"
    type="danger"
    confirm-text="删除"
    @confirm="handleDelete"
  />

  <!-- 编辑项目弹窗 - 使用 FormModal 组件 -->
  <FormModal
    v-model="editModalVisible"
    title="编辑项目信息"
    :form-data="editForm"
    :form-rules="editRules"
    :loading="submitting"
    @submit="handleUpdate"
  >
    <el-form-item label="项目名称" prop="title">
      <el-input v-model="editForm.title" />
    </el-form-item>
    <el-form-item label="项目描述" prop="description">
      <el-input v-model="editForm.description" type="textarea" :rows="3" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="editForm.status">
        <el-option label="草稿" value="draft" />
        <el-option label="已发布" value="published" />
      </el-select>
    </el-form-item>
  </FormModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  FolderOpened,
  Plus,
  Edit,
  Delete,
  Download,
  DocumentCopy,
  Monitor,
  Document
} from '@element-plus/icons-vue'

// 导入公共组件
import PageLayout from '@/components/common/PageLayout'
import PageHeader from '@/components/common/PageHeader'
import TabFilter from '@/components/common/TabFilter'
import ActionDropdown from '@/components/common/ActionDropdown'
import StepModal from '@/components/common/StepModal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import FormModal from '@/components/common/FormModal'
import EmptyState from '@/components/common/EmptyState'
import SearchBar from '@/components/common/SearchBar'
import StatusBadge from '@/components/common/StatusBadge'

const router = useRouter()

// 数据
const projects = ref([
  {
    id: 1,
    title: '销售数据分析大屏',
    description: '实时展示销售数据和趋势分析',
    type: 'screen',
    status: 'published',
    coverImage: null,
    updatedAt: '2小时前'
  },
  // ... 更多项目
])

// 状态
const searchQuery = ref('')
const activeTab = ref('all')
const createModalVisible = ref(false)
const deleteDialogVisible = ref(false)
const editModalVisible = ref(false)
const currentProject = ref(null)
const submitting = ref(false)

// 表单
const editForm = ref({
  title: '',
  description: '',
  status: 'draft'
})

const editRules = {
  title: [{ required: true, message: '请输入项目名称' }]
}

// 项目类型
const projectTypes = [
  {
    value: 'screen',
    label: '数据可视化大屏',
    description: '适用于大屏展示、数据监控等场景',
    icon: Monitor
  },
  {
    value: 'report',
    label: '中国式复杂报表',
    description: '适用于复杂的表格报表、打印等场景',
    icon: Document
  }
]

// 计算属性
const filteredProjects = computed(() => {
  let result = projects.value

  // 根据 tab 筛选
  if (activeTab.value === 'mine') {
    result = result.filter(p => p.isMine)
  } else if (activeTab.value === 'shared') {
    result = result.filter(p => p.isShared)
  }

  // 根据搜索词筛选
  if (searchQuery.value) {
    result = result.filter(p =>
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return result
})

const myProjects = computed(() => projects.value.filter(p => p.isMine))
const sharedProjects = computed(() => projects.value.filter(p => p.isShared))

// 方法
const getProjectIcon = (type) => {
  return type === 'screen' ? Monitor : Document
}

const showCreateModal = () => {
  createModalVisible.value = true
}

const validateStep = (stepIndex, formData) => {
  if (stepIndex === 0) {
    return !!formData.type
  }
  if (stepIndex === 1) {
    return !!formData.name
  }
  return true
}

const handleCreateProject = async (formData) => {
  try {
    // 调用创建接口
    console.log('创建项目:', formData)
    // await api.createProject(formData)
    createModalVisible.value = false
  } catch (error) {
    console.error(error)
  }
}

const resetCreateForm = () => {
  // 重置表单
}

const handleTabChange = (tab) => {
  console.log('切换 tab:', tab)
}

const handleAction = (command, project) => {
  currentProject.value = project

  switch (command) {
    case 'edit':
      editForm.value = { ...project }
      editModalVisible.value = true
      break
    case 'duplicate':
      // 复制项目
      break
    case 'export':
      // 导出项目
      break
    case 'delete':
      deleteDialogVisible.value = true
      break
  }
}

const handleEdit = (project) => {
  router.push(`/editor/${project.type}/${project.id}`)
}

const handlePreview = (project) => {
  router.push(`/preview/${project.id}`)
}

const handleDelete = async () => {
  try {
    // 调用删除接口
    console.log('删除项目:', currentProject.value.id)
    // await api.deleteProject(currentProject.value.id)
    deleteDialogVisible.value = false
  } catch (error) {
    console.error(error)
  }
}

const handleUpdate = async () => {
  submitting.value = true
  try {
    // 调用更新接口
    console.log('更新项目:', editForm.value)
    // await api.updateProject(editForm.value)
    editModalVisible.value = false
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.content-area {
  padding: 24px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.project-card {
  background: var(--bg-card, #1a1b1e);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card-image {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-image-default {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 48px;
  color: var(--text-secondary, #9aa0a6);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.project-card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary, #e8eaed);
}

.type-icon {
  font-size: 18px;
  color: var(--el-color-primary);
}

.card-description {
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
  margin: 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border, #35363a);
  font-size: 12px;
  color: var(--text-tertiary, #5f6368);
}

.type-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 24px;
}

.type-card {
  padding: 24px;
  background: var(--bg-card, #1a1b1e);
  border: 2px solid var(--border, #35363a);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.type-card:hover {
  border-color: var(--el-color-primary);
}

.type-card.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.type-card .type-icon {
  font-size: 48px;
  color: var(--el-color-primary);
  margin-bottom: 16px;
}

.type-card h3 {
  font-size: 18px;
  margin: 12px 0 8px;
  color: var(--text-primary, #e8eaed);
}

.type-card p {
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
}
</style>
