/**
 * 角色管理状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as roleApi from '@/api/role'
import { success, error } from '@/utils/message'
import { confirmDelete } from '@/utils/confirm'

export const useRoleStore = defineStore('role', () => {
  // 状态
  const loading = ref(false)
  const roleList = ref([])
  const allData = ref([])

  // 分页状态
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 排序状态
  const sort = ref(null)

  // 搜索条件
  const searchQuery = ref({
    name: '',
    scope: ''
  })

  // 格式化时间
  const formatTime = (time) => {
    if (!time) return '-'
    const date = new Date(time)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-')
  }

  // 计算属性：过滤后的数据
  const filteredData = computed(() => {
    let data = [...allData.value]

    // 应用搜索过滤
    if (searchQuery.value.name) {
      data = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.value.name.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.value.name.toLowerCase()))
      )
    }

    if (searchQuery.value.scope) {
      data = data.filter(item => item.scope === searchQuery.value.scope)
    }

    return data
  })

  // 计算属性：当前页数据
  const currentPageData = computed(() => {
    let data = [...filteredData.value]

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
      const listRes = await roleApi.getRoles()

      // 确保数据格式正确
      allData.value = Array.isArray(listRes) ? listRes.map(role => ({
        ...role,
        isSystem: role.isSystem || false,
        userCount: role.userCount || 0,
        createdAt: formatTime(role.createdAt),
        updatedAt: formatTime(role.updatedAt)
      })) : []

      // 更新总数（使用过滤后的数据）
      pagination.value.total = filteredData.value.length

      // 更新当前页数据
      roleList.value = currentPageData.value
    } catch (err) {
      console.error('加载数据失败:', err)
      error('加载数据失败')
      roleList.value = []
      allData.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理搜索
   */
  function handleSearch(query) {
    searchQuery.value = { ...query }
    pagination.value.page = 1 // 重置到第一页
    pagination.value.total = filteredData.value.length
    roleList.value = currentPageData.value
  }

  /**
   * 处理页码变化
   */
  function handlePageChange(page) {
    pagination.value.page = page
    roleList.value = currentPageData.value
  }

  /**
   * 处理每页条数变化
   */
  function handlePageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1 // 重置到第一页
    roleList.value = currentPageData.value
  }

  /**
   * 处理排序变化
   */
  function handleSortChange(sortData) {
    sort.value = sortData
    pagination.value.page = 1 // 重置到第一页
    roleList.value = currentPageData.value
  }

  /**
   * 处理添加
   */
  async function handleAdd(formData) {
    try {
      await roleApi.createRole(formData)
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
      await roleApi.updateRole(editingItem.id, formData)
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
      await confirmDelete(`确定要删除角色 "${item.name}" 吗？此操作不可恢复。`)
      await roleApi.deleteRole(item.id)
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
    roleList.value = []
    allData.value = []
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    sort.value = null
    searchQuery.value = {
      name: '',
      scope: ''
    }
  }

  return {
    // 状态
    loading,
    roleList,
    pagination,
    sort,
    searchQuery,

    // 计算属性
    currentPageData,
    filteredData,

    // Actions
    loadData,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleAdd,
    handleEdit,
    handleDelete,
    reset,
  }
})
