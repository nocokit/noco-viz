/**
 * 分页 Composable
 * 提供分页相关的状态和方法
 */
import { reactive, computed } from 'vue'

export function usePagination(options = {}) {
  const {
    pageSize = 10,
    pageSizes = [10, 20, 50, 100],
    layout = 'total, sizes, prev, pager, next, jumper'
  } = options

  // 分页状态
  const pagination = reactive({
    currentPage: 1,
    pageSize: pageSize,
    total: 0,
    pageSizes: pageSizes,
    layout: layout
  })

  // 总页数
  const totalPages = computed(() => {
    return Math.ceil(pagination.total / pagination.pageSize)
  })

  // 是否有上一页
  const hasPrev = computed(() => {
    return pagination.currentPage > 1
  })

  // 是否有下一页
  const hasNext = computed(() => {
    return pagination.currentPage < totalPages.value
  })

  // 当前页的起始索引
  const startIndex = computed(() => {
    return (pagination.currentPage - 1) * pagination.pageSize
  })

  // 当前页的结束索引
  const endIndex = computed(() => {
    return Math.min(startIndex.value + pagination.pageSize, pagination.total)
  })

  /**
   * 设置总数
   */
  const setTotal = (total) => {
    pagination.total = total
  }

  /**
   * 重置分页
   */
  const reset = () => {
    pagination.currentPage = 1
    pagination.total = 0
  }

  /**
   * 跳转到指定页
   */
  const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    pagination.currentPage = page
  }

  /**
   * 上一页
   */
  const prevPage = () => {
    if (hasPrev.value) {
      pagination.currentPage--
    }
  }

  /**
   * 下一页
   */
  const nextPage = () => {
    if (hasNext.value) {
      pagination.currentPage++
    }
  }

  /**
   * 改变每页数量
   */
  const changePageSize = (size) => {
    pagination.pageSize = size
    pagination.currentPage = 1
  }

  return {
    // 状态
    pagination,

    // 计算属性
    totalPages,
    hasPrev,
    hasNext,
    startIndex,
    endIndex,

    // 方法
    setTotal,
    reset,
    goToPage,
    prevPage,
    nextPage,
    changePageSize
  }
}
