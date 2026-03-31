<template>
  <div class="project-list-page">
    <WorkspaceLayout
      :breadcrumb-items="breadcrumbItems"
      :filters="filters"
      :search-placeholder="'搜索项目...'"
      :view-modes="viewModes"
      :default-view="'grid'"
      :items="projects"
      :filter-function="filterProjects"
      :search-function="searchProjects"
      @filter-change="handleFilterChange"
      @search="handleSearch"
      @view-change="handleViewChange"
    >
      <template #toolbar-extra>
        <a-button @click="loadProjects" title="刷新">
          <template #icon><ReloadOutlined /></template>
        </a-button>
        <a-button type="primary" @click="openCreateModal">
          <template #icon><PlusOutlined /></template>
          新增
        </a-button>
      </template>

      <template #grid="{ items }">
        <ProjectCard
          v-for="project in items"
          :key="project.id"
          :project="project"
          @enter-editor="handleEnterEditor"
          @preview="handlePreview"
          @edit="handleEdit"
          @duplicate="handleDuplicate"
          @publish="handlePublish"
          @unpublish="handleUnpublish"
          @delete="handleDeleteProject"
        />
      </template>

      <template #list="{ items }">
        <ProjectListItem
          v-for="project in items"
          :key="project.id"
          :project="project"
          @edit="handleEdit"
          @preview="handlePreview"
          @duplicate="handleDuplicate"
          @publish="handlePublish"
          @unpublish="handleUnpublish"
          @delete="handleDeleteProject"
        />
      </template>
    </WorkspaceLayout>

    <ProjectModal
      v-model:open="modalVisible"
      :project="editingProject"
      :update-project="updateProject"
      @success="loadProjects"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { useViewModes } from '@/composables/useViewModes'
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout.vue'
import ProjectCard from '@/components/workspace/ProjectCard.vue'
import ProjectListItem from './ProjectListItem.vue'
import ProjectModal from './ProjectModal.vue'
import { useProjectOperations } from './useProjectOperations'

const userStore = useUserStore()
const { viewModes } = useViewModes()

const {
  projects,
  loadProjects,
  handleEnterEditor,
  handlePreview,
  handleDuplicate,
  handlePublish,
  handleUnpublish,
  handleDeleteProject,
  updateProject
} = useProjectOperations()

const modalVisible = ref(false)
const editingProject = ref(null)

const breadcrumbItems = [
  { label: '工作台', path: '/workspace' },
  { label: '项目管理' }
]

const filters = [
  { id: 'all', label: '全部项目' },
  { id: 'mine', label: '我创建的' },
  { id: 'shared', label: '协作项目' }
]

const matchesUserId = (item, userId) => {
  const creatorId = typeof item.createdBy === 'object' ? item.createdBy?.id : item.createdBy
  const itemUserId = typeof item.userId === 'object' ? item.userId?.id : item.userId
  return creatorId === userId || itemUserId === userId || item.createdById === userId
}

const filterProjects = (items, filterId) => {
  if (filterId === 'all') return items
  const currentUserId = userStore.userInfo?.id
  if (!currentUserId) return items
  if (filterId === 'mine') return items.filter(item => matchesUserId(item, currentUserId))
  if (filterId === 'shared') return items.filter(item => !matchesUserId(item, currentUserId))
  return items
}

const searchProjects = (items, query) => {
  if (!query) return items
  const lowerQuery = query.toLowerCase()
  return items.filter(project =>
    project.title?.toLowerCase().includes(lowerQuery) ||
    project.description?.toLowerCase().includes(lowerQuery)
  )
}

const handleFilterChange = () => {}
const handleSearch = () => {}
const handleViewChange = () => {}

const openCreateModal = () => {
  editingProject.value = null
  modalVisible.value = true
}

const handleEdit = (project) => {
  editingProject.value = project
  modalVisible.value = true
}

onMounted(() => loadProjects())
</script>

<style scoped>
.project-list-page {
  height: 100%;
}
</style>
