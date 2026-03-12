/**
 * 组织架构状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDepartments, createDepartment, updateDepartment, deleteDepartment, getDepartmentTree } from '@/api/department'
import { success, error } from '@/utils/message'
import { confirmDelete } from '@/utils/confirm'

export const useDepartmentStore = defineStore('department', () => {
  // 状态
  const loading = ref(false)
  const departmentList = ref([])
  const allData = ref([])
  const treeData = ref([])

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
    label: '',
    isActive: ''
  })

  // 计算属性：过滤后的数据
  const filteredData = computed(() => {
    let data = [...allData.value]

    // 应用搜索过滤
    if (searchQuery.value.label) {
      const keyword = searchQuery.value.label.toLowerCase()
      data = data.filter(item =>
        item.label.toLowerCase().includes(keyword)
      )
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
   * 扁平化树形数据
   */
  function flattenTree(tree, result = []) {
    tree.forEach(node => {
      result.push(node)
      if (node.children && node.children.length > 0) {
        flattenTree(node.children, result)
      }
    })
    return result
  }

  /**
   * 加载数据
   */
  async function loadData() {
    try {
      loading.value = true
      const treeRes = await getDepartmentTree()

      // 保存树形数据
      treeData.value = Array.isArray(treeRes) ? treeRes : []

      // 扁平化为列表
      allData.value = flattenTree(treeData.value)

      // 更新总数（使用过滤后的数据）
      pagination.value.total = filteredData.value.length

      // 更新当前页数据
      departmentList.value = currentPageData.value
    } catch (err) {
      console.error('加载数据失败:', err)
      error('加载数据失败')
      departmentList.value = []
      allData.value = []
      treeData.value = []
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
    departmentList.value = currentPageData.value
  }

  /**
   * 处理页码变化
   */
  function handlePageChange(page) {
    pagination.value.page = page
    departmentList.value = currentPageData.value
  }

  /**
   * 处理每页条数变化
   */
  function handlePageSizeChange(pageSize) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1 // 重置到第一页
    departmentList.value = currentPageData.value
  }

  /**
   * 处理排序变化
   */
  function handleSortChange(sortData) {
    sort.value = sortData
    pagination.value.page = 1 // 重置到第一页
    departmentList.value = currentPageData.value
  }

  /**
   * 处理添加
   */
  async function handleAdd(formData) {
    try {
      await createDepartment(formData)
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
      await updateDepartment(editingItem.id, formData)
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
      await confirmDelete(`确定要删除部门 "${item.label}" 吗？此操作不可恢复。`)
      await deleteDepartment(item.id)
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
    departmentList.value = []
    allData.value = []
    treeData.value = []
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0
    }
    sort.value = null
    searchQuery.value = {
      label: '',
      isActive: ''
    }
  }

  return {
    // 状态
    loading,
    departmentList,
    pagination,
    sort,
    searchQuery,
    treeData,

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
