/**
 * 用户列表状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'
import { success, error } from '@/utils/message'
import { confirmDelete } from '@/utils/confirm'

export const useUserListStore = defineStore('userList', () => {
  // 状态
  const loading = ref(false)
  const userList = ref([])
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
    username: '',
    email: '',
    departmentId: '',
    isActive: ''
  })

  // 计算属性：过滤后的数据
  const filteredData = computed(() => {
    let data = [...allData.value]

    // 应用搜索过滤
    if (searchQuery.value.username) {
      const keyword = searchQuery.value.username.toLowerCase()
      data = data.filter(item =>
        item.username.toLowerCase().includes(keyword)
      )
    }

    if (searchQuery.value.email) {
      const keyword = searchQuery.value.email.toLowerCase()
      data = data.filter(item =>
        item.email && item.email.toLowerCase().includes(keyword)
      )
    }

    if (searchQuery.value.departmentId) {
      data = data.filter(item => item.departmentId === searchQuery.value.departmentId)
    }

    if (searchQuery.value.isActive !== '') {
      data = data.filter(item => item.isActive === searchQuery.value.isActive)
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
      const res = await getUserList()
      allData.value = Array.isArray(res) ? res : (res.data || [])

      // 更新总数（使用过滤后的数据）
      pagination.value.total = filteredData.value.length

      // 更新当前页数据
      userList.value = currentPageData.value
    } catch (err) {
      console.error('加载数据失败:', err)
      error('加载数据失败')
      userList.value = []
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
    userList.value = currentPageData.value
  }

  /**
   * 处理页码变化
   */
  function handlePageChange(page) {
    pagination.value.page = page
    userList.value = currentPageData.value
  }

  /**
   * 处理每页条数变化
   */
  function handlePageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1 // 重置到第一页
    userList.value = currentPageData.value
  }

  /**
   * 处理排序变化
   */
  function handleSortChange(sortData) {
    sort.value = sortData
    pagination.value.page = 1 // 重置到第一页
    userList.value = currentPageData.value
  }

  /**
   * 处理添加
   */
  async function handleAdd(formData) {
    try {
      await createUser(formData)
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
      await updateUser(editingItem.id, formData)
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
      await confirmDelete(`确定要删除用户 "${item.username}" 吗？此操作不可恢复。`)
      await deleteUser(item.id)
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
    userList.value = []
    allData.value = []
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    sort.value = null
    searchQuery.value = {
      username: '',
      email: '',
      departmentId: '',
      isActive: ''
    }
  }

  return {
    // 状态
    loading,
    userList,
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
