import { ref, computed } from 'vue'
import * as message from '@/utils/message'

/**
 * CRUD 操作通用 Composable
 * 提供标准的增删改查功能，减少重复代码
 *
 * @param {Object} apiService - API 服务对象，需包含 getList, getOne, create, update, delete 方法
 * @param {Object} options - 配置选项
 * @returns {Object} CRUD 相关的状态和方法
 */
export function useCrud(apiService, options = {}) {
  const {
    // 是否自动加载数据
    autoLoad = true,
    // 成功消息配置
    messages = {
      createSuccess: '创建成功',
      updateSuccess: '更新成功',
      deleteSuccess: '删除成功',
      batchDeleteSuccess: '批量删除成功'
    },
    // 数据转换函数
    transformData = null,
    // 初始查询参数
    initialParams = {}
  } = options

  // 状态
  const list = ref([])
  const total = ref(0)
  const loading = ref(false)
  const currentItem = ref(null)
  const params = ref({ ...initialParams })

  // 计算属性
  const isEmpty = computed(() => list.value.length === 0)
  const hasData = computed(() => list.value.length > 0)

  /**
   * 获取列表数据
   * @param {Object} queryParams - 查询参数
   */
  const fetchList = async (queryParams = {}) => {
    loading.value = true
    try {
      const mergedParams = { ...params.value, ...queryParams }
      const response = await apiService.getList(mergedParams)

      // 处理响应数据
      if (Array.isArray(response)) {
        list.value = transformData ? response.map(transformData) : response
        total.value = response.length
      } else if (response.data && Array.isArray(response.data)) {
        list.value = transformData ? response.data.map(transformData) : response.data
        total.value = response.total || response.data.length
      } else {
        list.value = []
        total.value = 0
      }

      return list.value
    } catch (error) {
      console.error('获取列表失败:', error)
      message.error(error.message || '获取数据失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取单条数据
   * @param {number|string} id - 记录ID
   */
  const fetchOne = async (id) => {
    loading.value = true
    try {
      const response = await apiService.getOne(id)
      currentItem.value = transformData ? transformData(response) : response
      return currentItem.value
    } catch (error) {
      console.error('获取详情失败:', error)
      message.error(error.message || '获取详情失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建记录
   * @param {Object} data - 创建数据
   */
  const create = async (data) => {
    loading.value = true
    try {
      const response = await apiService.create(data)
      message.success(messages.createSuccess)

      // 刷新列表
      await fetchList()

      return response
    } catch (error) {
      console.error('创建失败:', error)
      message.error(error.message || '创建失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新记录
   * @param {number|string} id - 记录ID
   * @param {Object} data - 更新数据
   */
  const update = async (id, data) => {
    loading.value = true
    try {
      const response = await apiService.update(id, data)
      message.success(messages.updateSuccess)

      // 刷新列表
      await fetchList()

      return response
    } catch (error) {
      console.error('更新失败:', error)
      message.error(error.message || '更新失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除记录
   * @param {number|string} id - 记录ID
   * @param {boolean} confirm - 是否需要确认
   */
  const remove = async (id, confirm = true) => {
    try {
      if (confirm) {
        await message.confirmDelete()
      }

      loading.value = true
      await apiService.delete(id)
      message.success(messages.deleteSuccess)

      // 刷新列表
      await fetchList()
    } catch (error) {
      if (error === 'cancel') {
        // 用户取消删除
        return
      }
      console.error('删除失败:', error)
      message.error(error.message || '删除失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 批量删除
   * @param {Array} ids - 记录ID数组
   * @param {boolean} confirm - 是否需要确认
   */
  const batchRemove = async (ids, confirm = true) => {
    if (!ids || ids.length === 0) {
      message.warn'请选择要删除的数据')
      return
    }

    try {
      if (confirm) {
        await message.confirmDelete(`确定要删除选中的 ${ids.length} 条数据吗？`)
      }

      loading.value = true

      // 如果 API 支持批量删除
      if (apiService.batchDelete) {
        await apiService.batchDelete(ids)
      } else {
        // 否则逐个删除
        await Promise.all(ids.map(id => apiService.delete(id)))
      }

      message.success(messages.batchDeleteSuccess)

      // 刷新列表
      await fetchList()
    } catch (error) {
      if (error === 'cancel') {
        return
      }
      console.error('批量删除失败:', error)
      message.error(error.message || '批量删除失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新列表
   */
  const refresh = () => {
    return fetchList()
  }

  /**
   * 重置查询参数并刷新
   */
  const reset = () => {
    params.value = { ...initialParams }
    return fetchList()
  }

  /**
   * 搜索
   * @param {string} keyword - 搜索关键词
   */
  const search = (keyword) => {
    params.value.search = keyword
    return fetchList()
  }

  /**
   * 分页
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   */
  const paginate = (page, pageSize) => {
    params.value.page = page
    params.value.limit = pageSize
    return fetchList()
  }

  // 自动加载数据
  if (autoLoad) {
    fetchList()
  }

  return {
    // 状态
    list,
    total,
    loading,
    currentItem,
    params,

    // 计算属性
    isEmpty,
    hasData,

    // 方法
    fetchList,
    fetchOne,
    create,
    update,
    remove,
    batchRemove,
    refresh,
    reset,
    search,
    paginate
  }
}
