/**
 * 组件库状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as componentApi from '@/api/component'
import { success, error } from '@/utils/message'
import { confirmDelete } from '@/utils/confirm'

export const useComponentLibraryStore = defineStore('componentLibrary', () => {
  // 状态
  const loading = ref(false)
  const componentList = ref([])
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
    keyword: '',
    category: '',
    isPublic: ''
  })

  // 计算属性：过滤后的数据
  const filteredData = computed(() => {
    let data = [...allData.value]

    // 应用搜索过滤
    if (searchQuery.value.keyword) {
      const keyword = searchQuery.value.keyword.toLowerCase()
      data = data.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        (item.description && item.description.toLowerCase().includes(keyword))
      )
    }

    if (searchQuery.value.category) {
      data = data.filter(item =>
        item.category && item.category.toLowerCase().includes(searchQuery.value.category.toLowerCase())
      )
    }

    if (searchQuery.value.isPublic !== '') {
      const isPublic = searchQuery.value.isPublic === 'true'
      data = data.filter(item => item.isPublic === isPublic)
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
      const listRes = await componentApi.getComponents()

      // 确保数据格式正确
      allData.value = Array.isArray(listRes) ? listRes : []

      // 更新总数（使用过滤后的数据）
      pagination.value.total = filteredData.value.length

      // 更新当前页数据
      componentList.value = currentPageData.value
    } catch (err) {
      console.error('加载数据失败:', err)
      error('加载数据失败')
      componentList.value = []
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
    componentList.value = currentPageData.value
  }

  /**
   * 处理页码变化
   */
  function handlePageChange(page) {
    pagination.value.page = page
    componentList.value = currentPageData.value
  }

  /**
   * 处理每页条数变化
   */
  function handlePageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1 // 重置到第一页
    componentList.value = currentPageData.value
  }

  /**
   * 处理排序变化
   */
  function handleSortChange(sortData) {
    sort.value = sortData
    pagination.value.page = 1 // 重置到第一页
    componentList.value = currentPageData.value
  }

  /**
   * 处理添加
   */
  async function handleAdd(formData) {
    try {
      await componentApi.createComponent(formData)
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
      await componentApi.updateComponent(editingItem.id, formData)
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
      await confirmDelete(`确定要删除组件 "${item.name}" 吗？此操作不可恢复。`)
      await componentApi.deleteComponent(item.id)
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
    componentList.value = []
    allData.value = []
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    sort.value = null
    searchQuery.value = {
      keyword: '',
      category: '',
      isPublic: ''
    }
  }

  return {
    // 状态
    loading,
    componentList,
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

