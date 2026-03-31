/**
 * Playlist Store - 轮播管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  updateSlides,
  updatePlaylistStatus
} from '@/api/playlist'
import { message } from 'ant-design-vue'

export const usePlaylistStore = defineStore('playlist', () => {
  // State
  const playlistList = ref([])
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })
  const sort = ref({
    key: 'updatedAt',
    order: 'desc'
  })
  const searchParams = ref({})

  // Getters
  const filteredList = computed(() => {
    let result = playlistList.value

    // 应用搜索过滤
    if (searchParams.value.name) {
      const keyword = searchParams.value.name.toLowerCase()
      result = result.filter(item =>
        item.name.toLowerCase().includes(keyword)
      )
    }

    if (searchParams.value.status !== undefined && searchParams.value.status !== '') {
      result = result.filter(item => item.status === searchParams.value.status)
    }

    return result
  })

  // Actions
  const loadData = async () => {
    try {
      loading.value = true
      const data = await getPlaylists()
      playlistList.value = data
      pagination.value.total = data.length
    } catch (error) {
      console.error('加载轮播列表失败:', error)
      message.error('加载轮播列表失败')
    } finally {
      loading.value = false
    }
  }

  const handleAdd = async (formData) => {
    try {
      await createPlaylist(formData)
      message.success('创建成功')
      await loadData()
      return true
    } catch (error) {
      console.error('创建失败:', error)
      message.error('创建失败')
      return false
    }
  }

  const handleEdit = async (id, formData) => {
    try {
      await updatePlaylist(id, formData)
      message.success('更新成功')
      await loadData()
      return true
    } catch (error) {
      console.error('更新失败:', error)
      message.error('更新失败')
      return false
    }
  }

  const handleDelete = async (id) => {
    try {
      await deletePlaylist(id)
      message.success('删除成功')
      await loadData()
      return true
    } catch (error) {
      console.error('删除失败:', error)
      message.error('删除失败')
      return false
    }
  }

  const handleSearch = (params) => {
    searchParams.value = params
  }

  const handlePageChange = (page) => {
    pagination.value.page = page
  }

  const handlePageSizeChange = (pageSize) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
  }

  const handleSortChange = (sortData) => {
    sort.value = sortData
  }

  const toggleStatus = async (playlist) => {
    try {
      const newStatus = playlist.status === 1 ? 0 : 1
      await updatePlaylistStatus(playlist.id, newStatus)
      message.success(`已${newStatus === 1 ? '启用' : '禁用'}`)
      await loadData()
    } catch (error) {
      console.error('状态切换失败:', error)
      message.error('状态切换失败')
    }
  }

  const copyPlaylistUrl = (playlist) => {
    const url = playlist.url || `${window.location.origin}/playlist/${playlist.id}`
    navigator.clipboard.writeText(url)
    message.success('播放链接已复制到剪贴板')
  }

  const updatePlaylistSlides = async (id, slides) => {
    try {
      await updateSlides(id, slides)
      message.success('配置已保存')
      await loadData()
      return true
    } catch (error) {
      console.error('保存配置失败:', error)
      message.error('保存配置失败')
      return false
    }
  }

  return {
    // State
    playlistList,
    loading,
    pagination,
    sort,
    searchParams,

    // Getters
    filteredList,

    // Actions
    loadData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    toggleStatus,
    copyPlaylistUrl,
    updatePlaylistSlides
  }
})
