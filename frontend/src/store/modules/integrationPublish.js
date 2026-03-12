/**
 * 集成发布状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as integrationPublishApi from '@/api/integrationPublish'
import { success, error } from '@/utils/message'
import { confirmDelete } from '@/utils/confirm'

export const useIntegrationPublishStore = defineStore('integrationPublish', () => {
  // 状态
  const loading = ref(false)
  const configList = ref([])
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
    projectId: '',
    authType: '',
    status: ''
  })

  // 计算属性：过滤后的数据
  const filteredData = computed(() => {
    let data = [...allData.value]

    // 应用搜索过滤
    if (searchQuery.value.projectId) {
      data = data.filter(item =>
        String(item.projectId).includes(searchQuery.value.projectId)
      )
    }

    if (searchQuery.value.authType) {
      data = data.filter(item => item.authType === searchQuery.value.authType)
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
      const listRes = await integrationPublishApi.getIntegrationPublishList()

      // 确保数据格式正确
      allData.value = Array.isArray(listRes) ? listRes : []

      // 更新总数（使用过滤后的数据）
      pagination.value.total = filteredData.value.length

      // 更新当前页数据
      configList.value = currentPageData.value
    } catch (err) {
      console.error('加载数据失败:', err)
      error('加载数据失败')
      configList.value = []
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
    configList.value = currentPageData.value
  }

  /**
   * 处理页码变化
   */
  function handlePageChange(page) {
    pagination.value.page = page
    configList.value = currentPageData.value
  }

  /**
   * 处理每页条数变化
   */
  function handlePageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1 // 重置到第一页
    configList.value = currentPageData.value
  }

  /**
   * 处理排序变化
   */
  function handleSortChange(sortData) {
    sort.value = sortData
    pagination.value.page = 1 // 重置到第一页
    configList.value = currentPageData.value
  }

  /**
   * 处理添加
   */
  async function handleAdd(formData) {
    try {
      // 处理 domains 字段：将 textarea 的换行文本转换为数组
      const data = { ...formData }
      if (typeof data.domains === 'string') {
        data.domains = data.domains.split('\n').filter(d => d.trim())
      }

      await integrationPublishApi.createIntegrationPublish(data)
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
      // 处理 domains 字段
      const data = { ...formData }
      if (typeof data.domains === 'string') {
        data.domains = data.domains.split('\n').filter(d => d.trim())
      }

      await integrationPublishApi.updateIntegrationPublish(editingItem.id, data)
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
      await confirmDelete(`确定要删除项目 #${item.projectId} 的集成配置吗？此操作不可恢复。`)
      await integrationPublishApi.deleteIntegrationPublish(item.id)
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
    configList.value = []
    allData.value = []
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    sort.value = null
    searchQuery.value = {
      projectId: '',
      authType: '',
      status: ''
    }
  }

  return {
    // 状态
    loading,
    configList,
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

