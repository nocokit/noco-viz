/**
 * 回收站状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getRecycleList,
  getRecycleStats,
  restoreItem as restoreItemApi,
  deleteItem as deleteItemApi,
  emptyRecycleBin as emptyRecycleBinApi
} from '@/api/recycle'

export const useRecycleStore = defineStore('recycle', () => {
  // 标签页配置
  const tabs = [
    { id: 'project', label: '大屏项目' },
    { id: 'datasource', label: '数据源' },
    { id: 'media', label: '媒体资源' },
    { id: 'component', label: '组件包' }
  ]

  // 状态
  const currentTab = ref('project')
  const recycleItems = ref([])
  const stats = ref({})
  const selectedRowKeys = ref([])
  const showDeleteModal = ref(false)
  const isEmptying = ref(false)
  const loading = ref(false)
  const searchParams = ref({})

  // 计算属性
  const currentTabLabel = computed(() => {
    const tab = tabs.find(t => t.id === currentTab.value)
    return tab ? tab.label : ''
  })

  const filteredItems = computed(() => {
    let items = recycleItems.value.filter(item => item.type === currentTab.value)

    // 应用搜索过滤
    if (searchParams.value.name) {
      const searchName = searchParams.value.name.toLowerCase()
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchName)
      )
    }

    if (searchParams.value.type) {
      items = items.filter(item => item.type === searchParams.value.type)
    }

    return items
  })

  const isAllSelected = computed(() => {
    return filteredItems.value.length > 0 &&
           filteredItems.value.every(item => selectedRowKeys.value.includes(item.id))
  })

  /**
   * 获取标签数量
   */
  function getTabCount(tabId) {
    return stats.value[tabId] || 0
  }

  /**
   * 加载数据
   */
  async function loadData() {
    try {
      loading.value = true
      const [items, statistics] = await Promise.all([
        getRecycleList(),
        getRecycleStats()
      ])
      recycleItems.value = items
      stats.value = statistics
    } catch (error) {
      console.error('加载回收站数据失败:', error)
      ElMessage.error('加载回收站数据失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 切换标签页
   */
  function switchTab(tabId) {
    currentTab.value = tabId
    selectedRowKeys.value = []
  }

  /**
   * 搜索处理
   */
  function handleSearch(params) {
    searchParams.value = params
    selectedRowKeys.value = []
  }

  /**
   * 重置搜索
   */
  function resetSearch() {
    searchParams.value = {}
    selectedRowKeys.value = []
  }

  /**
   * 选择操作
   */
  function toggleSelect(id) {
    const index = selectedRowKeys.value.indexOf(id)
    if (index > -1) {
      selectedRowKeys.value.splice(index, 1)
    } else {
      selectedRowKeys.value.push(id)
    }
  }

  function toggleSelectAll() {
    if (isAllSelected.value) {
      selectedRowKeys.value = []
    } else {
      selectedRowKeys.value = filteredItems.value.map(item => item.id)
    }
  }

  /**
   * 还原操作
   */
  async function restoreItem(item) {
    try {
      await restoreItemApi(item.id)
      ElMessage.success(`已还原 "${item.name}"`)
      await loadData()
      selectedRowKeys.value = []
    } catch (error) {
      console.error('还原失败:', error)
      ElMessage.error('还原失败')
      throw error
    }
  }

  async function batchRestore() {
    try {
      await Promise.all(selectedRowKeys.value.map(id => restoreItemApi(id)))
      ElMessage.success(`已还原 ${selectedRowKeys.value.length} 项`)
      await loadData()
      selectedRowKeys.value = []
    } catch (error) {
      console.error('批量还原失败:', error)
      ElMessage.error('批量还原失败')
      throw error
    }
  }

  /**
   * 删除操作
   */
  function openDeleteModal(empty) {
    isEmptying.value = empty
    showDeleteModal.value = true
  }

  function closeDeleteModal() {
    showDeleteModal.value = false
  }

  function handleDeleteSingle(item) {
    selectedRowKeys.value = [item.id]
    openDeleteModal(false)
  }

  async function confirmDelete() {
    try {
      if (isEmptying.value) {
        await emptyRecycleBinApi()
        ElMessage.success('回收站已清空')
      } else {
        await Promise.all(selectedRowKeys.value.map(id => deleteItemApi(id)))
        ElMessage.success(`已删除 ${selectedRowKeys.value.length} 项`)
      }
      await loadData()
      selectedRowKeys.value = []
      closeDeleteModal()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
      throw error
    }
  }

  /**
   * 重置状态
   */
  function reset() {
    currentTab.value = 'project'
    recycleItems.value = []
    stats.value = {}
    selectedRowKeys.value = []
    showDeleteModal.value = false
    isEmptying.value = false
    loading.value = false
    searchParams.value = {}
  }

  return {
    // 常量
    tabs,

    // 状态
    currentTab,
    recycleItems,
    stats,
    selectedRowKeys,
    showDeleteModal,
    isEmptying,
    loading,
    searchParams,

    // 计算属性
    currentTabLabel,
    filteredItems,
    isAllSelected,

    // Actions
    getTabCount,
    loadData,
    switchTab,
    handleSearch,
    resetSearch,
    toggleSelect,
    toggleSelectAll,
    restoreItem,
    batchRestore,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteSingle,
    confirmDelete,
    reset,
  }
})
