/**
 * 表格数据管理 Composable
 * 统一管理表格数据加载、分页、排序、搜索
 */

import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * @param {Function} apiFunc - API请求函数
 * @param {Object} options - 配置选项
 * @param {number} options.pageSize - 每页数量,默认20
 * @param {boolean} options.autoLoad - 是否自动加载,默认true
 * @param {Object} options.defaultFilters - 默认筛选条件
 * @param {Function} options.onSuccess - 成功回调
 * @param {Function} options.onError - 错误回调
 * @param {Function} options.transform - 数据转换函数
 */
export function useTableData(apiFunc, options = {}) {
  const {
    pageSize = 20,
    autoLoad = false,
    defaultFilters = {},
    onSuccess,
    onError,
    transform
  } = options

  // 状态
  const loading = ref(false)
  const data = ref([])
  const total = ref(0)
  const searchQuery = ref('')
  const filters = reactive({ ...defaultFilters })

  const pagination = reactive({
    page: 1,
    pageSize: pageSize,
    total: 0
  })

  const sortOptions = reactive({
    sortBy: '',
    sortOrder: ''
  })

  /**
   * 加载数据
   */
  const loadData = async (resetPage = false) => {
    if (!apiFunc) {
      console.warn('未提供API函数')
      return
    }

    if (resetPage) {
      pagination.page = 1
    }

    loading.value = true

    try {
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters
      }

      if (searchQuery.value) {
        params.search = searchQuery.value
      }

      if (sortOptions.sortBy) {
        params.sortBy = sortOptions.sortBy
        params.sortOrder = sortOptions.sortOrder
      }

      const response = await apiFunc(params)

      // 数据转换
      const responseData = transform ? transform(response) : response

      data.value = responseData.data || responseData.list || []
      total.value = responseData.total || 0
      pagination.total = responseData.total || 0

      onSuccess && onSuccess(responseData)
    } catch (error) {
      console.error('加载数据失败:', error)
      ElMessage.error(error.message || '加载数据失败')
      onError && onError(error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索
   */
  const handleSearch = () => {
    loadData(true)
  }

  /**
   * 重置搜索
   */
  const resetSearch = () => {
    searchQuery.value = ''
    Object.keys(filters).forEach(key => {
      filters[key] = defaultFilters[key] || ''
    })
    loadData(true)
  }

  /**
   * 分页变化
   */
  const handlePageChange = (page) => {
    pagination.page = page
    loadData()
  }

  /**
   * 每页数量变化
   */
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    pagination.page = 1
    loadData()
  }

  /**
   * 排序变化
   */
  const handleSortChange = ({ prop, order }) => {
    sortOptions.sortBy = prop
    sortOptions.sortOrder = order
    loadData()
  }

  /**
   * 刷新当前页
   */
  const refresh = () => {
    loadData()
  }

  /**
   * 重置并重新加载
   */
  const reset = () => {
    pagination.page = 1
    searchQuery.value = ''
    Object.keys(filters).forEach(key => {
      filters[key] = defaultFilters[key] || ''
    })
    loadData()
  }

  return {
    // 状态
    loading,
    data,
    total,
    pagination,
    searchQuery,
    filters,
    sortOptions,

    // 方法
    loadData,
    handleSearch,
    resetSearch,
    handlePageChange,
    handleSizeChange,
    handleSortChange,
    refresh,
    reset
  }
}
