/**
 * 数据源监控状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDatasources } from '@/api/datasource'
import { success, error } from '@/utils/message'

export const useDatasourceMonitorStore = defineStore('datasourceMonitor', () => {
  // 状态
  const loading = ref(false)
  const monitorList = ref([])
  const allData = ref([])

  // 分页状态
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 排序状态
  const sort = ref(null)

  // 搜索条件
  const searchQuery = ref({
    name: '',
    type: '',
    status: ''
  })

  // 统计数据
  const stats = computed(() => {
    const data = allData.value
    return {
      totalActiveConnections: data.reduce((sum, item) => sum + (item.activeConnections || 0), 0),
      totalMaxConnections: data.reduce((sum, item) => sum + (item.maxConnections || 100), 0),
      avgLatency: data.length > 0
        ? Math.round(data.reduce((sum, item) => sum + (item.latency || 0), 0) / data.length)
        : 0,
      totalCount: data.length,
      errorCount: data.filter(item => item.status === 'error').length,
      slowQueryCount: data.reduce((sum, item) => sum + (item.slowQueries || 0), 0)
    }
  })

  // 计算属性：过滤后的数据
  const filteredData = computed(() => {
    let data = [...allData.value]

    // 应用搜索过滤
    if (searchQuery.value.name) {
      const keyword = searchQuery.value.name.toLowerCase()
      data = data.filter(item =>
        item.name.toLowerCase().includes(keyword)
      )
    }

    if (searchQuery.value.type) {
      data = data.filter(item => item.type === searchQuery.value.type)
    }

    if (searchQuery.value.status) {
      data = data.filter(item => item.status === searchQuery.value.status)
    }

    return data
  })

  // 计算属性：当前页数据
  const currentPageData = computed(() => {
    let data = [...filteredData.value]

    // 排序
    if (sort.value) {
      data = data.sort((a, b) => {
        const aVal = a[sort.value.key]
        const bVal = b[sort.value.key]

        if (aVal === bVal) return 0

        const comparison = aVal > bVal ? 1 : -1
        return sort.value.order === 'asc' ? comparison : -comparison
      })
    }

    // 分页
    const start = (pagination.value.page - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return data.slice(start, end)
  })

  /**
   * 模拟监控数据
   */
  function generateMonitorData(datasource) {
    return {
      ...datasource,
      activeConnections: Math.floor(Math.random() * 50) + 10,
      maxConnections: 100,
      latency: Math.floor(Math.random() * 200) + 20,
      slowQueries: Math.floor(Math.random() * 5),
      lastCheck: new Date().toISOString()
    }
  }

  /**
   * 加载数据
   */
  async function loadData() {
    try {
      loading.value = true
      const listRes = await getDatasources()

      // 添加监控数据
      allData.value = Array.isArray(listRes) ? listRes.map(generateMonitorData) : []

      // 更新总数（使用过滤后的数据）
      pagination.value.total = filteredData.value.length

      // 更新当前页数据
      monitorList.value = currentPageData.value
    } catch (err) {
      console.error('加载数据失败:', err)
      error('加载数据失败')
      monitorList.value = []
      allData.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理搜索
   */
  function handleSearch(query) {
    searchQuery.value = { ...query }
    pagination.value.page = 1 // 重置到第一页
    pagination.value.total = filteredData.value.length
    monitorList.value = currentPageData.value
  }

  /**
   * 处理页码变化
   */
  function handlePageChange(page) {
    pagination.value.page = page
    monitorList.value = currentPageData.value
  }

  /**
   * 处理每页条数变化
   */
  function handlePageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1 // 重置到第一页
    monitorList.value = currentPageData.value
  }

  /**
   * 处理排序变化
   */
  function handleSortChange(sortData) {
    sort.value = sortData
    pagination.value.page = 1 // 重置到第一页
    monitorList.value = currentPageData.value
  }

  /**
   * 测试连接
   */
  async function testConnection(item) {
    try {
      // TODO: 调用测试连接 API
      success(`正在测试连接: ${item.name}`)
      await loadData()
    } catch (err) {
      error('测试连接失败')
    }
  }

  /**
   * 查看详情
   */
  function viewDetails(item) {
    // TODO: 打开详情抽屉或跳转到详情页
    console.log('查看详情:', item)
  }

  /**
   * 重置状态
   */
  function reset() {
    loading.value = false
    monitorList.value = []
    allData.value = []
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    sort.value = null
    searchQuery.value = {
      name: '',
      type: '',
      status: ''
    }
  }

  return {
    // 状态
    loading,
    monitorList,
    pagination,
    sort,
    searchQuery,
    stats,

    // 计算属性
    currentPageData,
    filteredData,

    // Actions
    loadData,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    testConnection,
    viewDetails,
    reset,
  }
})
