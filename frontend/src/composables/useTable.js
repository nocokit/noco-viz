/**
 * 表格通用逻辑 Composable
 * 提供分页、排序、筛选、选择等常用功能
 */
import { ref, reactive, computed } from 'vue'

export function useTable(options = {}) {
  const {
    fetchData,
    pageSize = 10,
    defaultSort = null
  } = options

  // 加载状态
  const loading = ref(false)

  // 表格数据
  const tableData = ref([])

  // 分页配置
  const pagination = reactive({
    currentPage: 1,
    pageSize: pageSize,
    total: 0
  })

  // 排序配置
  const sortConfig = ref(defaultSort)

  // 筛选配置
  const filters = reactive({})

  // 选中的行
  const selectedRows = ref([])

  // 加载数据
  const loadData = async () => {
    if (!fetchData) return

    loading.value = true
    try {
      const params = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...sortConfig.value,
        ...filters
      }

      const result = await fetchData(params)

      tableData.value = result.data || result.list || []
      pagination.total = result.total || 0
    } catch (error) {
      console.error('加载数据失败:', error)
      tableData.value = []
      pagination.total = 0
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const refresh = () => {
    loadData()
  }

  // 重置并刷新
  const reset = () => {
    pagination.currentPage = 1
    sortConfig.value = defaultSort
    Object.keys(filters).forEach(key => delete filters[key])
    loadData()
  }

  // 分页改变
  const handlePageChange = (page) => {
    pagination.currentPage = page
    loadData()
  }

  // 每页数量改变
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    pagination.currentPage = 1
    loadData()
  }

  // 排序改变
  const handleSortChange = ({ prop, order }) => {
    sortConfig.value = prop ? { sortBy: prop, sortOrder: order } : null
    pagination.currentPage = 1
    loadData()
  }

  // 筛选改变
  const handleFilterChange = (newFilters) => {
    Object.assign(filters, newFilters)
    pagination.currentPage = 1
    loadData()
  }

  // 选择改变
  const handleSelectionChange = (rows) => {
    selectedRows.value = rows
  }

  // 是否有选中项
  const hasSelection = computed(() => selectedRows.value.length > 0)

  // 选中数量
  const selectionCount = computed(() => selectedRows.value.length)

  return {
    // 状态
    loading,
    tableData,
    pagination,
    sortConfig,
    filters,
    selectedRows,

    // 计算属性
    hasSelection,
    selectionCount,

    // 方法
    loadData,
    refresh,
    reset,
    handlePageChange,
    handleSizeChange,
    handleSortChange,
    handleFilterChange,
    handleSelectionChange
  }
}
