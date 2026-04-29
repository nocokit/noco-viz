import { ref, computed } from 'vue'
import { useCrudOperations } from './useCrudOperations'
import { useFilter } from './useFilter'
import { usePagination } from './usePagination'

const isOk = (res) => res?.code === 200 || res?.success === true

export function useDataManagement(options = {}) {
  const {
    api = {},
    searchFields = ['name', 'description'],
    transformData = (data) => data,
    autoLoad = true,
    enablePagination = false,
    pageSize = 10
  } = options

  const data = ref([])
  const loading = ref(false)
  const searchQuery = ref('')
  const activeFilters = ref({})

  const { create, update, remove, batchRemove, operationLoading } = useCrudOperations({
    api,
    onSuccess: async (operation) => {
      if (['create', 'update', 'delete', 'batchDelete'].includes(operation)) {
        await loadData()
      }
    }
  })

  const { filteredData } = useFilter(data, {
    searchFields,
    searchQuery,
    customFilters: computed(() =>
      Object.entries(activeFilters.value).map(([key, value]) =>
        (item) => {
          if (value === null || value === undefined || value === '') return true
          if (Array.isArray(value)) return !value.length || value.includes(item[key])
          return item[key] === value
        }
      )
    )
  })

  const pagination = enablePagination ? usePagination({ data: filteredData, pageSize }) : null

  const displayData = computed(() =>
    enablePagination ? pagination.paginatedData.value : filteredData.value
  )

  const loadData = async (params = {}) => {
    if (!api.list) return { success: false, error: 'API method not found' }

    loading.value = true
    try {
      const res = await api.list(params)
      if (!isOk(res)) throw new Error(res?.message || 'Load failed')
      data.value = transformData(res.data || [])
      return { success: true, data: data.value }
    } catch (error) {
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const batchUpdate = async (ids, updateData) => {
    if (!api.batchUpdate && !api.update) return { success: false, error: 'API method not found' }

    loading.value = true
    try {
      let res
      if (api.batchUpdate) {
        res = await api.batchUpdate(ids, updateData)
      } else {
        await Promise.all(ids.map(id => api.update(id, updateData)))
        res = { code: 200 }
      }
      if (!isOk(res)) throw new Error(res?.message || 'Batch update failed')
      await loadData()
      return { success: true }
    } catch (error) {
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const stats = computed(() => ({
    total: data.value.length,
    filtered: filteredData.value.length,
    displayed: displayData.value.length
  }))

  const search = (query) => { searchQuery.value = query }
  const setFilter = (key, value) => { activeFilters.value[key] = value }
  const clearFilter = (key) => {
    if (key) delete activeFilters.value[key]
    else activeFilters.value = {}
  }
  const reset = () => {
    data.value = []
    searchQuery.value = ''
    activeFilters.value = {}
    if (pagination) pagination.currentPage.value = 1
  }
  const getById = (id) => data.value.find(item => item.id === id)
  const refresh = () => loadData()

  if (autoLoad) loadData()

  return {
    data,
    displayData,
    filteredData,
    loading,
    operationLoading,
    stats,
    searchQuery,
    search,
    activeFilters,
    setFilter,
    clearFilter,
    ...(pagination || {}),
    loadData,
    refresh,
    create,
    update,
    remove,
    batchRemove,
    batchUpdate,
    getById,
    reset
  }
}
