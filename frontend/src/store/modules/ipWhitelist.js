/**
 * IP白名单状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as ipWhitelistApi from '@/api/ipWhitelist'
import { success, error, confirmDelete } from '@/utils/message'

export const useIpWhitelistStore = defineStore('ipWhitelist', () => {
  // 状态
  const loading = ref(false)
  const ipList = ref([])
  const allData = ref([])

  // 分页状态
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 排序状态
  const sort = ref(null)

  // 计算属性：当前页数据
  const currentPageData = computed(() => {
    let data = [...allData.value]

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
      const listRes = await ipWhitelistApi.getIpWhitelistList()

      console.log('API返回的数据:', listRes)
      console.log('是否为数组:', Array.isArray(listRes))

      // 确保数据格式正确
      allData.value = Array.isArray(listRes) ? listRes.map(item => ({
        ...item,
        type: item.ip && item.ip.includes('/') ? 'cidr' : 'single'
      })) : []

      // 更新总数
      pagination.value.total = allData.value.length

      // 更新当前页数据
      ipList.value = currentPageData.value

      console.log('处理后的ipList:', ipList.value)
    } catch (err) {
      console.error('加载数据失败:', err)
      error('加载数据失败')
      ipList.value = []
      allData.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理页码变化
   */
  function handlePageChange(page) {
    pagination.value.page = page
    ipList.value = currentPageData.value
  }

  /**
   * 处理每页条数变化
   */
  function handlePageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1 // 重置到第一页
    ipList.value = currentPageData.value
  }

  /**
   * 处理排序变化
   */
  function handleSortChange(sortData) {
    sort.value = sortData
    pagination.value.page = 1 // 重置到第一页
    ipList.value = currentPageData.value
  }

  /**
   * 处理添加
   */
  async function handleAdd(formData) {
    try {
      await ipWhitelistApi.createIpWhitelist(formData)
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
      await ipWhitelistApi.updateIpWhitelist(editingItem.id, formData)
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
      await confirmDelete(`确定要删除 IP "${item.ip}" 吗？此操作不可恢复。`)
      await ipWhitelistApi.deleteIpWhitelist(item.id)
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
    ipList.value = []
    allData.value = []
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    sort.value = null
  }

  return {
    // 状态
    loading,
    ipList,
    pagination,
    sort,

    // 计算属性
    currentPageData,

    // Actions
    loadData,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleAdd,
    handleEdit,
    handleDelete,
    reset,
  }
})
