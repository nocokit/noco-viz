import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { confirm } from '@/utils/confirm'
import {
  getProjectList,
  createProject,
  deleteProject,
  cloneProject,
  publishProject,
  unpublishProject,
  updateProject
} from '@/api/project'

export function useProjectOperations() {
  const router = useRouter()
  const projects = ref([])
  const loading = ref(false)

  // 格式化时间
  const formatTime = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  // 加载项目列表
  const loadProjects = async () => {
    try {
      loading.value = true
      const data = await getProjectList()
      projects.value = data.map(project => ({
        ...project,
        updatedAt: formatTime(project.updatedAt)
      }))
    } catch (error) {
      console.error('加载项目列表失败:', error)
      message.error('加载项目列表失败')
    } finally {
      loading.value = false
    }
  }

  // 进入编辑器
  const handleEnterEditor = (project) => {
    if (project.type === 'report') {
      router.push(`/editor/report/${project.id}`)
    } else {
      router.push(`/editor/screen/${project.id}`)
    }
  }

  // 预览项目
  const handlePreview = (project) => {
    message.info('预览功能开发中')
  }

  // 复制项目
  const handleDuplicate = async (project) => {
    try {
      const newTitle = `${project.title} (副本)`
      await cloneProject(project.id, newTitle)
      message.success(`项目 "${project.title}" 已复制`)
      await loadProjects()
    } catch (error) {
      console.error('复制项目失败:', error)
      message.error('复制项目失败')
    }
  }

  // 发布项目
  const handlePublish = async (project) => {
    try {
      await confirm(
        `确定要发布项目 "${project.title}" 吗？`,
        '发布确认',
        {
          confirmButtonText: '发布',
          cancelButtonText: '取消',
          type: 'info'
        }
      )

      await publishProject(project.id)
      message.success('项目已发布')
      await loadProjects()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('发布失败:', error)
        message.error('发布失败')
      }
    }
  }

  // 取消发布项目
  const handleUnpublish = async (project) => {
    try {
      await confirm(
        `确定要取消发布项目 "${project.title}" 吗？`,
        '取消发布确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await unpublishProject(project.id)
      message.success('项目已取消发布')
      await loadProjects()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('取消发布失败:', error)
        message.error('取消发布失败')
      }
    }
  }

  // 删除项目
  const handleDeleteProject = async (project) => {
    try {
      await confirm(
        `确定要删除项目 "${project.title}" 吗？此操作不可恢复。`,
        '删除确认',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await deleteProject(project.id)
      message.success('项目已删除')
      await loadProjects()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除项目失败:', error)
        message.error('删除项目失败')
      }
    }
  }

  return {
    projects,
    loading,
    loadProjects,
    handleEnterEditor,
    handlePreview,
    handleDuplicate,
    handlePublish,
    handleUnpublish,
    handleDeleteProject,
    updateProject
  }
}
