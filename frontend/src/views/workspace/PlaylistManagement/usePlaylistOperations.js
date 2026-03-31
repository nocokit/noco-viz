import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { confirm } from '@/utils/confirm'
import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  updatePlaylistStatus
} from '@/api/playlist'

export function usePlaylistOperations() {
  const router = useRouter()
  const playlists = ref([])
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

  // 加载轮播列表
  const loadPlaylists = async () => {
    try {
      loading.value = true
      const data = await getPlaylists()
      playlists.value = data.map(playlist => ({
        ...playlist,
        updatedAt: formatTime(playlist.updatedAt)
      }))
    } catch (error) {
      console.error('加载轮播列表失败:', error)
      message.error('加载轮播列表失败')
    } finally {
      loading.value = false
    }
  }

  // 复制轮播链接
  const copyPlaylistUrl = async (playlist) => {
    const url = `${window.location.origin}/playlist/view/${playlist.id}`
    try {
      await navigator.clipboard.writeText(url)
      message.success('链接已复制到剪贴板')
    } catch (error) {
      console.error('复制失败:', error)
      message.error('复制失败，请手动复制')
    }
  }

  // 切换播放状态
  const handleToggleStatus = async (playlist) => {
    try {
      const newStatus = playlist.status === 'playing' ? 'idle' : 'playing'
      await updatePlaylistStatus(playlist.id, newStatus)
      message.success(`已${newStatus === 'playing' ? '启用' : '停用'}轮播`)
      await loadPlaylists()
    } catch (error) {
      console.error('切换状态失败:', error)
      message.error('切换状态失败')
    }
  }

  // 删除轮播
  const handleDeletePlaylist = async (playlist) => {
    try {
      await confirm(
        `确定要删除轮播组 "${playlist.name}" 吗？此操作不可恢复。`,
        '删除确认',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await deletePlaylist(playlist.id)
      message.success('轮播组已删除')
      await loadPlaylists()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除轮播失败:', error)
        message.error('删除轮播失败')
      }
    }
  }

  return {
    playlists,
    loading,
    loadPlaylists,
    copyPlaylistUrl,
    handleToggleStatus,
    handleDeletePlaylist
  }
}
