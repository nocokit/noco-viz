/**
 * 数据集管理状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as datasetApi from '@/api/dataset'
import { success, error } from '@/utils/message'
import { confirmDelete } from '@/utils/confirm'

export const useDatasetStore = defineStore('dataset', () => {
  // 状态
  const loading = ref(false)
  const datasetList = ref([])
  const allData = ref([])
  const connections = ref([])

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

  // 格式化时间
  const formatTime = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString()
  }

  // 获取连接名称
  const getConnectionName = (connectionId) => {
    const conn = connections.value.find(c => c.id === connectionId)
    return conn ? conn.name : `连接 #${connectionId}`
  }

  // 计算属性：过滤后的数据
  const filteredData = computed(() => {
    let data = [...allData.value]

    // 应用搜索过滤
    if (searchQuery.value.name) {
      data = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.value.name.toLowerCase()) ||
        item.key.toLowerCase().includes(searchQuery.value.name.toLowerCase())
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
   * 加载连接列表
   */
  async function loadConnections() {
    try {
      const data = await datasetApi.getConnections()
      connections.value = data || []
    } catch (err) {
      console.error('加载连接列表失败:', err)
    }
  }

  /**
   * 加载数据
   */
  async function loadData() {
    try {
      loading.value = true

      // 先加载连接列表（如果还没加载）
      if (connections.value.length === 0) {
        await loadConnections()
      }

      const listRes = await datasetApi.getDatasets()

      // 确保数据格式正确
      allData.value = Array.isArray(listRes) ? listRes.map(dataset => ({
        id: dataset.id,
        name: dataset.name,
        key: `dataset_${dataset.id}`,
        type: dataset.type,
        source: dataset.config?.connectionId ? getConnectionName(dataset.config.connectionId) : '-',
        status: dataset.status,
        statusText: dataset.status === 'active' ? '正常' : '未激活',
        updatedAt: formatTime(dataset.updatedAt),
        config: dataset.config,
        description: dataset.description
      })) : []

      // 更新总数（使用过滤后的数据）
      pagination.value.total = filteredData.value.length

      // 更新当前页数据
      datasetList.value = currentPageData.value
    } catch (err) {
      console.error('加载数据失败:', err)
      error('加载数据失败')
      datasetList.value = []
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
    datasetList.value = currentPageData.value
  }

  /**
   * 处理页码变化
   */
  function handlePageChange(page) {
    pagination.value.page = page
    datasetList.value = currentPageData.value
  }

  /**
   * 处理每页条数变化
   */
  function handlePageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1 // 重置到第一页
    datasetList.value = currentPageData.value
  }

  /**
   * 处理排序变化
   */
  function handleSortChange(sortData) {
    sort.value = sortData
    pagination.value.page = 1 // 重置到第一页
    datasetList.value = currentPageData.value
  }

  /**
   * 处理添加
   */
  async function handleAdd(formData) {
    try {
      await datasetApi.createDataset(formData)
      success('添加成功')
      await loadData()
    } catch (err) {
      error('添加失败')
      throw err
    }
  }

  /**
   * 处理编辑
   */
  async function handleEdit(formData, editingItem) {
    try {
      await datasetApi.updateDataset(editingItem.id, formData)
      success('修改成功')
      await loadData()
    } catch (err) {
      error('修改失败')
      throw err
    }
  }

  /**
   * 处理删除
   */
  async function handleDelete(item) {
    try {
      await confirmDelete(`确定要删除数据集 "${item.name}" 吗？此操作不可恢复。`)
      await datasetApi.deleteDataset(item.id)
      success('删除成功')
      await loadData()
    } catch (err) {
      if (err !== 'cancel') {
        error('删除失败')
      }
      throw err
    }
  }

  /**
   * 重置状态
   */
  function reset() {
    loading.value = false
    datasetList.value = []
    allData.value = []
    connections.value = []
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
    datasetList,
    pagination,
    sort,
    searchQuery,
    connections,

    // 计算属性
    currentPageData,
    filteredData,

    // Actions
    loadData,
    loadConnections,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleAdd,
    handleEdit,
    handleDelete,
    reset,
  }
})