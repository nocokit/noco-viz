/**
 * 连接配置状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDatasources, createDatasource, updateDatasource, deleteDatasource, testConnection } from '@/api/datasource'
import { success, error } from '@/utils/message'
import { confirmDelete } from '@/utils/confirm'

export const useConnectionStore = defineStore('connection', () => {
  // 状态
  const loading = ref(false)
  const connectionList = ref([])
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
   * 加载数据
   */
  async function loadData() {
    try {
      loading.value = true
      const listRes = await getDatasources()

      // 确保数据格式正确，并处理 config 字段
      allData.value = Array.isArray(listRes) ? listRes.map(conn => ({
        ...conn,
        host: conn.config?.host ? `${conn.config.host}:${conn.config.port || ''}` : 'N/A',
        usedByDatasets: 0 // TODO: 从后端获取
      })) : []

      // 更新总数（使用过滤后的数据）
      pagination.value.total = filteredData.value.length

      // 更新当前页数据
      connectionList.value = currentPageData.value
    } catch (err) {
      console.error('加载数据失败:', err)
      error('加载数据失败')
      connectionList.value = []
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
    connectionList.value = currentPageData.value
  }

  /**
   * 处理页码变化
   */
  function handlePageChange(page) {
    pagination.value.page = page
    connectionList.value = currentPageData.value
  }

  /**
   * 处理每页条数变化
   */
  function handlePageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1 // 重置到第一页
    connectionList.value = currentPageData.value
  }

  /**
   * 处理排序变化
   */
  function handleSortChange(sortData) {
    sort.value = sortData
    pagination.value.page = 1 // 重置到第一页
    connectionList.value = currentPageData.value
  }

  /**
   * 处理添加
   */
  async function handleAdd(formData) {
    try {
      // 构造 config 对象
      const data = {
        name: formData.name,
        type: formData.type,
        config: {
          host: formData.host,
          port: formData.port,
          database: formData.database,
          username: formData.username,
          password: formData.password
        }
      }

      await createDatasource(data)
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
      // 构造 config 对象
      const data = {
        name: formData.name,
        type: formData.type,
        config: {
          host: formData.host,
          port: formData.port,
          database: formData.database,
          username: formData.username,
          password: formData.password
        }
      }

      await updateDatasource(editingItem.id, data)
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
      await confirmDelete(`确定要删除连接 "${item.name}" 吗？此操作不可恢复。`)
      await deleteDatasource(item.id)
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
    connectionList.value = []
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
    connectionList,
    pagination,
    sort,
    searchQuery,

    // 计算属性
    currentPageData,
    filteredData,

    // Actions
    loadData,
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
