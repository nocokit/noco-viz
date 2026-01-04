/**
 * 搜索筛选逻辑 Composable
 */

import { ref, computed, reactive } from 'vue'

export function useSearch(dataSource, options = {}) {
  const { searchFields = [], defaultFilters = {} } = options

  const searchQuery = ref('')
  const filters = reactive({ ...defaultFilters })

  const filteredData = computed(() => {
    let result = dataSource.value || []

    // 关键词搜索
    if (searchQuery.value && searchFields.length > 0) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = getNestedValue(item, field)
          return value && String(value).toLowerCase().includes(query)
        })
      })
    }

    // 筛选器
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key]
      if (filterValue !== '' && filterValue !== null && filterValue !== undefined) {
        result = result.filter(item => {
          const itemValue = getNestedValue(item, key)
          if (Array.isArray(filterValue)) {
            return filterValue.includes(itemValue)
          }
          return itemValue === filterValue
        })
      }
    })

    return result
  })

  const resetFilters = () => {
    searchQuery.value = ''
    Object.keys(filters).forEach(key => {
      filters[key] = defaultFilters[key] || ''
    })
  }

  return { searchQuery, filters, filteredData, resetFilters }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}
