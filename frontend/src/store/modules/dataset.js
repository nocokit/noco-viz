/**
 * 数据集管理状态管理
 * 数据集 = 文件夹/分组
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as dataGroupApi from '@/api/dataGroups'
import { success, error } from '@/utils/message'
import { confirmDelete } from '@/utils/confirm'

export const useDatasetStore = defineStore('dataset', () => {
  const loading = ref(false)
  const datasetList = ref([])
  const allData = ref([])
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })
  const sort = ref(null)
  const searchQuery = ref({
    name: '',
    description: ''
  })

  const formatTime = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString()
  }

  const filteredData = computed(() => {
    let data = [...allData.value]

    if (searchQuery.value.name) {
      const keyword = searchQuery.value.name.toLowerCase()
      data = data.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.key.toLowerCase().includes(keyword)
      )
    }

    if (searchQuery.value.description) {
      const keyword = searchQuery.value.description.toLowerCase()
      data = data.filter(item =>
        (item.description || '').toLowerCase().includes(keyword)
      )
    }

    return data
  })

  const currentPageData = computed(() => {
    let data = [...filteredData.value]

    if (sort.value) {
      data = data.sort((a, b) => {
        const aVal = a[sort.value.key]
        const bVal = b[sort.value.key]
        if (aVal === bVal) return 0
        const comparison = aVal > bVal ? 1 : -1
        return sort.value.order === 'asc' ? comparison : -comparison
      })
    }

    const start = (pagination.value.page - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return data.slice(start, end)
  })

  async function loadData() {
    try {
      loading.value = true
      const [groups, items] = await Promise.all([
        dataGroupApi.getDataGroups(),
        dataGroupApi.getDataItems()
      ])

      const itemCountMap = new Map()
      const itemTypesMap = new Map()

      ;(items || []).forEach(item => {
        const count = itemCountMap.get(item.groupId) || 0
        itemCountMap.set(item.groupId, count + 1)

        const types = itemTypesMap.get(item.groupId) || new Set()
        types.add(item.type)
        itemTypesMap.set(item.groupId, types)
      })

      allData.value = (groups || []).map(group => ({
        id: group.id,
        name: group.name,
        key: `group_${group.id}`,
        description: group.description || '',
        itemCount: itemCountMap.get(group.id) || 0,
        itemTypes: Array.from(itemTypesMap.get(group.id) || []),
        itemTypesText: Array.from(itemTypesMap.get(group.id) || []).map(type => {
          const typeMap = {
            sql: 'SQL',
            api: 'API',
            excel: 'Excel',
            json: 'JSON'
          }
          return typeMap[type] || type
        }).join(' / ') || '-',
        updatedAt: formatTime(group.updatedAt)
      }))

      pagination.value.total = filteredData.value.length
      datasetList.value = currentPageData.value
    } catch (err) {
      console.error('加载数据集失败:', err)
      error('加载数据集失败')
      datasetList.value = []
      allData.value = []
    } finally {
      loading.value = false
    }
  }

  function handleSearch(query) {
    searchQuery.value = { ...searchQuery.value, ...query }
    pagination.value.page = 1
    pagination.value.total = filteredData.value.length
    datasetList.value = currentPageData.value
  }

  function handlePageChange(page) {
    pagination.value.page = page
    datasetList.value = currentPageData.value
  }

  function handlePageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
    datasetList.value = currentPageData.value
  }

  function handleSortChange(sortData) {
    sort.value = sortData
    pagination.value.page = 1
    datasetList.value = currentPageData.value
  }

  async function handleAdd(formData) {
    try {
      await dataGroupApi.createDataGroup({
        name: formData.name,
        description: formData.description
      })
      success('数据集创建成功')
      await loadData()
    } catch (err) {
      error('数据集创建失败')
      throw err
    }
  }

  async function handleEdit(formData, editingItem) {
    try {
      await dataGroupApi.updateDataGroup(editingItem.id, {
        name: formData.name,
        description: formData.description
      })
      success('数据集更新成功')
      await loadData()
    } catch (err) {
      error('数据集更新失败')
      throw err
    }
  }

  async function handleDelete(item) {
    try {
      await confirmDelete(`确定要删除数据集 "${item.name}" 吗？`)
      await dataGroupApi.deleteDataGroup(item.id)
      success('数据集删除成功')
      await loadData()
    } catch (err) {
      if (err !== 'cancel') {
        error('数据集删除失败')
      }
      throw err
    }
  }

  function reset() {
    loading.value = false
    datasetList.value = []
    allData.value = []
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    sort.value = null
    searchQuery.value = {
      name: '',
      description: ''
    }
  }

  return {
    loading,
    datasetList,
    pagination,
    sort,
    searchQuery,
    currentPageData,
    filteredData,
    loadData,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleAdd,
    handleEdit,
    handleDelete,
    reset
  }
})
