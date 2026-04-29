import { ref, computed, watch } from 'vue'
import { useDebounceFn } from './useDebounce'

function getNestedValue(obj, path) {
  if (!path) return obj
  let value = obj
  for (const key of path.split('.')) {
    if (value == null) return undefined
    value = value[key]
  }
  return value
}

export function useFilter(dataSource, options = {}) {
  const {
    searchFields = [],
    sortField = '',
    sortOrder = 'desc',
    debounceDelay = 300,
    customFilter = null,
    customSort = null
  } = options

  const searchQuery = ref('')
  const debouncedSearchQuery = ref('')
  const filters = ref({})
  const sortConfig = ref({ field: sortField, order: sortOrder })

  const updateDebouncedSearch = useDebounceFn((value) => {
    debouncedSearchQuery.value = value
  }, debounceDelay)

  watch(searchQuery, updateDebouncedSearch)

  const searchFilter = (item) => {
    if (!debouncedSearchQuery.value || !searchFields.length) return true
    const query = debouncedSearchQuery.value.toLowerCase().trim()
    return searchFields.some(field => {
      const value = getNestedValue(item, field)
      return value != null && String(value).toLowerCase().includes(query)
    })
  }

  const conditionFilter = (item) => {
    if (!Object.keys(filters.value).length) return true
    return Object.entries(filters.value).every(([field, filterValue]) => {
      if (filterValue === '' || filterValue == null) return true
      const itemValue = getNestedValue(item, field)
      if (Array.isArray(filterValue)) return !filterValue.length || filterValue.includes(itemValue)
      if (typeof filterValue === 'object') {
        const { min, max, start, end } = filterValue
        if (min !== undefined && itemValue < min) return false
        if (max !== undefined && itemValue > max) return false
        if (start !== undefined && itemValue < start) return false
        if (end !== undefined && itemValue > end) return false
        return true
      }
      return itemValue === filterValue
    })
  }

  const sortData = (data) => {
    if (!sortConfig.value.field) return data
    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.value.field)
      const bValue = getNestedValue(b, sortConfig.value.field)

      if (customSort) return customSort(a, b, sortConfig.value)
      if (aValue == null) return 1
      if (bValue == null) return -1

      const { order } = sortConfig.value
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue
      }
      if (aValue instanceof Date && bValue instanceof Date) {
        return order === 'asc' ? aValue - bValue : bValue - aValue
      }
      const cmp = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase())
      return order === 'asc' ? cmp : -cmp
    })
  }

  const filteredData = computed(() => {
    const source = Array.isArray(dataSource) ? dataSource : dataSource.value || []
    let result = source.filter(searchFilter).filter(conditionFilter)
    if (customFilter) result = result.filter(customFilter)
    return sortData(result)
  })

  const setFilter = (field, value) => { filters.value[field] = value }
  const setFilters = (newFilters) => { filters.value = { ...filters.value, ...newFilters } }
  const clearFilter = (field) => { delete filters.value[field] }
  const clearFilters = () => {
    filters.value = {}
    searchQuery.value = ''
    debouncedSearchQuery.value = ''
  }
  const setSort = (field, order = 'desc') => { sortConfig.value = { field, order } }
  const toggleSort = (field) => {
    sortConfig.value = sortConfig.value.field === field
      ? { field, order: sortConfig.value.order === 'asc' ? 'desc' : 'asc' }
      : { field, order: 'desc' }
  }
  const clearSort = () => { sortConfig.value = { field: '', order: 'desc' } }
  const reset = () => { clearFilters(); clearSort() }

  const filterStats = computed(() => {
    const source = Array.isArray(dataSource) ? dataSource : dataSource.value || []
    return {
      total: source.length,
      filtered: filteredData.value.length,
      hasFilters: !!Object.keys(filters.value).length || !!debouncedSearchQuery.value,
      activeFilters: Object.values(filters.value).filter(v => v !== '' && v != null).length
    }
  })

  return {
    searchQuery,
    filters,
    sortConfig,
    filteredData,
    filterStats,
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
