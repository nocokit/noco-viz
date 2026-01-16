/**
 * 数据管理通用 Composable
 * 整合了数据加载、筛选、CRUD 操作、分页等常用功能
 */

import { ref, computed } from 'vue'
import { useCrudOperations } from './useCrudOperations'
import { useFilter } from './useFilter'
import { usePagination } from './usePagination'

/**
 * @param {Object} options 配置选项
 * @param {Object} options.api API 接口对象 { list, create, update, delete }
 * @param {Array} options.searchFields 搜索字段
 * @param {Function} options.transformData 数据转换函数
 * @param {Boolean} options.autoLoad 是否自动加载
 * @param {Boolean} options.enablePagination 是否启用分页
 * @param {Number} options.pageSize 每页数量
 */
export function useDataManagement(options = {}) {
  const {
    api = {},
    searchFields = ['name', 'description'],
    transformData = (data) => data,
    autoLoad = true,
    enablePagination = false,
    pageSize = 10
  } = options

  // 状态
  const data = ref([])
  const loading = ref(false)
  const searchQuery = ref('')
  const activeFilters = ref({})

  // 使用 CRUD 操作
  const {
    create,
    update,
    remove,
    batchRemove,
    operationLoading
  } = useCrudOperations({
    api,
    onSuccess: async (operation) => {
      if (['create', 'update', 'delete', 'batchDelete'].includes(operation)) {
        await loadData()
      }
    }
  })

  // 使用筛选
  const { filteredData } = useFilter(data, {
    searchFields,
    searchQuery,
    customFilters: computed(() => {
      return Object.entries(activeFilters.value).map(([key, value]) => {
        return (item) => {
          if (value === null || value === undefined || value === '') return true
          if (Array.isArray(value)) {
            return value.length === 0 || value.includes(item[key])
          }
          return item[key] === value
        }
      })
    })
  })

  // 使用分页
  const pagination = enablePagination
    ? usePagination({
        data: filteredData,
        pageSize
      })
    : null

  // 最终显示的数据
  const displayData = computed(() => {
    return enablePagination ? pagination.paginatedData.value : filteredData.value
  })

  // 加载数据
  const loadData = async (params = {}) => {
    if (!api.list) {
      console.error('API list method not provided')
      return { success: false, error: 'API method not found' }
    }

    loading.value = true
    try {
      const response = await api.list(params)

      if (response?.code === 200 || response?.success === true) {
        const rawData = response.data || []
        data.value = transformData(rawData)
        return { success: true, data: data.value }
      } else {
        throw new Error(response?.message || 'Load failed')
      }
    } catch (error) {
      console.error('Load data error:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const refresh = () => loadData()

  // 搜索
  const search = (query) => {
    searchQuery.value = query
  }

  // 设置筛选
  const setFilter = (key, value) => {
    activeFilters.value[key] = value
  }

  // 清除筛选
  const clearFilter = (key) => {
    if (key) {
      delete activeFilters.value[key]
    } else {
      activeFilters.value = {}
    }
  }

  // 重置所有状态
  const reset = () => {
    data.value = []
    searchQuery.value = ''
    activeFilters.value = {}
    if (pagination) {
      pagination.currentPage.value = 1
    }
  }

  // 获取单条数据
  const getById = (id) => {
    return data.value.find(item => item.id === id)
  }

  // 批量操作
  const batchUpdate = async (ids, updateData) => {
    if (!api.batchUpdate && !api.update) {
      console.error('API batchUpdate or update method not provided')
      return { success: false, error: 'API method not found' }
    }

    loading.value = true
    try {
      let response
      if (api.batchUpdate) {
        response = await api.batchUpdate(ids, updateData)
      } else {
        const results = await Promise.all(
          ids.map(id => api.update(id, updateData))
        )
        response = {
          code: 200,
          success: true,
          data: results
        }
      }

      if (response?.code === 200 || response?.success === true) {
        await loadData()
        return { success: true }
      } else {
        throw new Error(response?.message || 'Batch update failed')
      }
    } catch (error) {
      console.error('Batch update error:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  // 统计信息
  const stats = computed(() => ({
    total: data.value.length,
    filtered: filteredData.value.length,
    displayed: displayData.value.length
  }))

  // 自动加载
  if (autoLoad) {
    loadData()
  }

  return {
    // 数据
    data,
    displayData,
    filteredData,
    loading,
    operationLoading,
    stats,

    // 搜索和筛选
    searchQuery,
    search,
    activeFilters,
    setFilter,
    clearFilter,

    // 分页
    ...(pagination || {}),

    // CRUD 操作
    loadData,
    refresh,
    create,
    update,
    remove,
    batchRemove,
    batchUpdate,

    // 工具方法
    getById,
    reset
  }
}
