/**
 * 审计日志状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as auditLogApi from '@/api/auditLog'
import { error } from '@/utils/message'

export const useAuditLogStore = defineStore('auditLog', () => {
  // 状态
  const loading = ref(false)
  const logList = ref([])
  const totalLogs = ref(0)

  // 分页状态
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0
  })

  // 排序状态
  const sort = ref(null)

  // 筛选条件
  const filters = ref({
    search: '',
    dateRange: '',
    module: '',
    status: ''
  })

  // 获取用户首字母
  const getUserInitials = (userName) => {
    if (!userName || userName === 'Unknown') return '?'
    const words = userName.split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return userName.substring(0, 2).toUpperCase()
  }

  // 生成头像颜色
  const getAvatarColor = (userName) => {
    const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#6366f1']
    if (!userName) return '#333'
    const index = userName.charCodeAt(0) % colors.length
    return colors[index]
  }

  // 格式化时间
  const formatTimestamp = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  // 转换后端数据为前端格式
  const transformLogData = (log) => {
    return {
      id: log.id,
      timestamp: formatTimestamp(log.createdAt),
      userName: log.userName || 'Unknown',
      userInitials: getUserInitials(log.userName),
      avatarColor: getAvatarColor(log.userName),
      ip: log.ipAddress,
      module: log.module,
      action: log.action,
      actionType: log.actionType,
      description: log.description,
      status: log.status,
      statusText: log.status === 'success' ? '成功' : (log.error || '失败'),
      statusColor: log.status === 'success' ? '' : '#ef4444',
      traceId: log.traceId || '-',
      userAgent: log.userAgent || '-',
      detailsLabel: log.error ? '错误信息' : '请求详情',
      details: log.error || log.requestBody || '-'
    }
  }

  /**
   * 加载审计日志列表
   */
  async function loadData() {
    loading.value = true
    try {
      const params = {
        page: pagination.value.page,
        pageSize: pagination.value.pageSize,
        search: filters.value.search || undefined,
        module: filters.value.module || undefined,
        status: filters.value.status || undefined,
        startDate: filters.value.dateRange || undefined,
        endDate: filters.value.dateRange || undefined
      }

      const response = await auditLogApi.getAuditLogs(params)

      if (response.data) {
        logList.value = response.data.map(transformLogData)
        pagination.value.total = response.total || 0
        totalLogs.value = response.total || 0
      }
    } catch (err) {
      console.error('加载审计日志失败:', err)
      error('加载审计日志失败')
      logList.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理搜索/筛选
   */
  function handleSearch(query) {
    filters.value = { ...query }
    pagination.value.page = 1
    loadData()
  }

  /**
   * 处理页码变化
   */
  function handlePageChange(page) {
    pagination.value.page = page
    loadData()
  }

  /**
   * 处理每页条数变化
   */
  function handlePageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
    loadData()
  }

  /**
   * 处理排序变化
   */
  function handleSortChange(sortData) {
    sort.value = sortData
    pagination.value.page = 1
    loadData()
  }

  /**
   * 重置状态
   */
  function reset() {
    loading.value = false
    logList.value = []
    totalLogs.value = 0
    pagination.value = {
      page: 1,
      pageSize: 20,
      total: 0
    }
    sort.value = null
    filters.value = {
      search: '',
      dateRange: '',
      module: '',
      status: ''
    }
  }

  return {
    // 状态
    loading,
    logList,
    totalLogs,
    pagination,
    sort,
    filters,

    // Actions
    loadData,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    reset,
  }
})
