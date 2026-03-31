/**
 * 统一搜索、筛选、排序逻辑
 * 支持多字段搜索、多条件筛选、自定义排序、防抖处理
 */

import { ref, computed, watch } from 'vue'
import { useDebounceFn } from './useDebounce'

/**
 * @param {Ref|Array} dataSource 数据源
 * @param {Object} options 配置选项
 * @param {Array<string>} options.searchFields 搜索字段列表
 * @param {Array<string>} options.filterFields 筛选字段列表
 * @param {string} options.sortField 默认排序字段
 * @param {string} options.sortOrder 默认排序方向 'asc' | 'desc'
 * @param {number} options.debounceDelay 搜索防抖延迟（毫秒）
 * @param {Function} options.customFilter 自定义筛选函数
 * @param {Function} options.customSort 自定义排序函数
 */
export function useFilter(dataSource, options = {}) {
  const {
    searchFields = [],
    filterFields = [],
    sortField = '',
    sortOrder = 'desc',
    debounceDelay = 300,
    customFilter = null,
    customSort = null
  } = options

  // 搜索关键词
  const searchQuery = ref('')
  const debouncedSearchQuery = ref('')

  // 筛选条件 { fieldName: value }
  const filters = ref({})

  // 排序配置
  const sortConfig = ref({
    field: sortField,
    order: sortOrder // 'asc' | 'desc'
  })

  // 防抖搜索
  const updateDebouncedSearch = useDebounceFn((value) => {
    debouncedSearchQuery.value = value
  }, debounceDelay)

  watch(searchQuery, (newValue) => {
    updateDebouncedSearch(newValue)
  })

  /**
   * 搜索过滤
   */
  const searchFilter = (item) => {
    if (!debouncedSearchQuery.value || searchFields.length === 0) {
      return true
    }

    const query = debouncedSearchQuery.value.toLowerCase().trim()

    return searchFields.some(field => {
      const value = getNestedValue(item, field)
      if (value === null || value === undefined) return false

      return String(value).toLowerCase().includes(query)
    })
  }

  /**
   * 条件筛选
   */
  const conditionFilter = (item) => {
    if (Object.keys(filters.value).length === 0) {
      return true
    }

    return Object.entries(filters.value).every(([field, filterValue]) => {
      // 跳过空值
      if (filterValue === '' || filterValue === null || filterValue === undefined) {
        return true
      }

      const itemValue = getNestedValue(item, field)

      // 数组类型筛选（多选）
      if (Array.isArray(filterValue)) {
        if (filterValue.length === 0) return true
        return filterValue.includes(itemValue)
      }

      // 对象类型筛选（范围）
      if (typeof filterValue === 'object' && filterValue !== null) {
        const { min, max, start, end } = filterValue

        if (min !== undefined && itemValue < min) return false
        if (max !== undefined && itemValue > max) return false
        if (start !== undefined && itemValue < start) return false
        if (end !== undefined && itemValue > end) return false

        return true
      }

      // 普通值筛选
      return itemValue === filterValue
    })
  }

  /**
   * 排序函数
   */
  const sortData = (data) => {
    if (!sortConfig.value.field) {
      return data
    }

    const sorted = [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.value.field)
      const bValue = getNestedValue(b, sortConfig.value.field)

      // 自定义排序
      if (customSort) {
        return customSort(a, b, sortConfig.value)
      }

      // 处理 null/undefined
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      // 数字排序
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.value.order === 'asc' ? aValue - bValue : bValue - aValue
      }

      // 日期排序
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.value.order === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      // 字符串排序
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()

      if (sortConfig.value.order === 'asc') {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })

    return sorted
  }

  /**
   * 过滤后的数据
   */
  const filteredData = computed(() => {
    const source = Array.isArray(dataSource) ? dataSource : dataSource.value || []

    let result = source

    // 搜索过滤
    result = result.filter(searchFilter)

    // 条件筛选
    result = result.filter(conditionFilter)

    // 自定义筛选
    if (customFilter) {
      result = result.filter(customFilter)
    }

    // 排序
    result = sortData(result)

    return result
  })

  /**
   * 设置筛选条件
   */
  const setFilter = (field, value) => {
    filters.value[field] = value
  }

  /**
   * 批量设置筛选条件
   */
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  /**
   * 清除单个筛选条件
   */
  const clearFilter = (field) => {
    delete filters.value[field]
  }

  /**
   * 清除所有筛选条件
   */
  const clearFilters = () => {
    filters.value = {}
    searchQuery.value = ''
    debouncedSearchQuery.value = ''
  }

  /**
   * 设置排序
   */
  const setSort = (field, order = 'desc') => {
    sortConfig.value = { field, order }
  }

  /**
   * 切换排序方向
   */
  const toggleSort = (field) => {
    if (sortConfig.value.field === field) {
      sortConfig.value.order = sortConfig.value.order === 'asc' ? 'desc' : 'asc'
    } else {
      sortConfig.value = { field, order: 'desc' }
    }
  }

  /**
   * 清除排序
   */
  const clearSort = () => {
    sortConfig.value = { field: '', order: 'desc' }
  }

  /**
   * 重置所有筛选和排序
   */
  const reset = () => {
    clearFilters()
    clearSort()
  }

  /**
   * 获取嵌套对象的值
   */
  function getNestedValue(obj, path) {
    if (!path) return obj

    const keys = path.split('.')
    let value = obj

    for (const key of keys) {
      if (value === null || value === undefined) {
        return undefined
      }
      value = value[key]
    }

    return value
  }

  /**
   * 获取筛选统计信息
   */
  const filterStats = computed(() => {
    const source = Array.isArray(dataSource) ? dataSource : dataSource.value || []

    return {
      total: source.length,
      filtered: filteredData.value.length,
      hasFilters: Object.keys(filters.value).length > 0 || !!debouncedSearchQuery.value,
      activeFilters: Object.keys(filters.value).filter(key => {
        const value = filters.value[key]
        return value !== '' && value !== null && value !== undefined
      }).length
    }
  })

  return {
    // 状态
    searchQuery,
    filters,
    sortConfig,
    filteredData,
    filterStats,

    // 方法
    setFilter,
    setFilters,
    clearFilter,
    clearFilters,
    setSort,
    toggleSort,
    clearSort,
    reset
  }
}
