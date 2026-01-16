/**
 * CRUD 操作统一封装
 * 提供增删改查的标准化操作，支持乐观更新、错误回滚、确认对话框
 */

import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * @param {Object} options 配置选项
 * @param {Object} options.api API 接口对象 { create, update, delete, batchDelete }
 * @param {Function} options.onSuccess 成功回调
 * @param {Function} options.onError 错误回调
 * @param {Object} options.messages 提示消息配置
 * @param {Boolean} options.confirmDelete 是否需要删除确认
 * @param {Boolean} options.optimistic 是否启用乐观更新
 */
export function useCrudOperations(options = {}) {
  const {
    api = {},
    onSuccess = () => {},
    onError = () => {},
    messages = {},
    confirmDelete = true,
    optimistic = false
  } = options

  const loading = ref(false)
  const operationLoading = ref({
    create: false,
    update: false,
    delete: false,
    batchDelete: false
  })

  // 默认提示消息
  const defaultMessages = {
    createSuccess: '创建成功',
    createError: '创建失败',
    updateSuccess: '更新成功',
    updateError: '更新失败',
    deleteSuccess: '删除成功',
    deleteError: '删除失败',
    batchDeleteSuccess: '批量删除成功',
    batchDeleteError: '批量删除失败',
    deleteConfirmTitle: '确认删除',
    deleteConfirmMessage: '确定要删除吗？此操作不可恢复',
    batchDeleteConfirmMessage: '确定要删除选中的 {count} 项吗？此操作不可恢复'
  }

  const finalMessages = { ...defaultMessages, ...messages }

  /**
   * 创建操作
   */
  const create = async (data, customMessages = {}) => {
    if (!api.create) {
      console.error('API create method not provided')
      return { success: false, error: 'API method not found' }
    }

    operationLoading.value.create = true
    loading.value = true

    try {
      const response = await api.create(data)

      // 检查响应格式
      const success = response?.code === 200 || response?.success === true

      if (success) {
        ElMessage.success(customMessages.success || finalMessages.createSuccess)
        await onSuccess('create', response.data)
        return { success: true, data: response.data }
      } else {
        throw new Error(response?.message || 'Create failed')
      }
    } catch (error) {
      console.error('Create error:', error)
      ElMessage.error(customMessages.error || finalMessages.createError)
      onError('create', error)
      return { success: false, error }
    } finally {
      operationLoading.value.create = false
      loading.value = false
    }
  }

  /**
   * 更新操作
   */
  const update = async (id, data, customMessages = {}) => {
    if (!api.update) {
      console.error('API update method not provided')
      return { success: false, error: 'API method not found' }
    }

    operationLoading.value.update = true
    loading.value = true

    try {
      const response = await api.update(id, data)

      const success = response?.code === 200 || response?.success === true

      if (success) {
        ElMessage.success(customMessages.success || finalMessages.updateSuccess)
        await onSuccess('update', response.data)
        return { success: true, data: response.data }
      } else {
        throw new Error(response?.message || 'Update failed')
      }
    } catch (error) {
      console.error('Update error:', error)
      ElMessage.error(customMessages.error || finalMessages.updateError)
      onError('update', error)
      return { success: false, error }
    } finally {
      operationLoading.value.update = false
      loading.value = false
    }
  }

  /**
   * 删除操作（单个）
   */
  const remove = async (id, customOptions = {}) => {
    if (!api.delete) {
      console.error('API delete method not provided')
      return { success: false, error: 'API method not found' }
    }

    const {
      confirmMessage = finalMessages.deleteConfirmMessage,
      confirmTitle = finalMessages.deleteConfirmTitle,
      successMessage = finalMessages.deleteSuccess,
      errorMessage = finalMessages.deleteError,
      skipConfirm = false
    } = customOptions

    // 确认对话框
    if (confirmDelete && !skipConfirm) {
      try {
        await ElMessageBox.confirm(confirmMessage, confirmTitle, {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          confirmButtonClass: 'el-button--danger'
        })
      } catch {
        return { success: false, cancelled: true }
      }
    }

    operationLoading.value.delete = true
    loading.value = true

    try {
      const response = await api.delete(id)

      const success = response?.code === 200 || response?.success === true

      if (success) {
        ElMessage.success(successMessage)
        await onSuccess('delete', id)
        return { success: true, id }
      } else {
        throw new Error(response?.message || 'Delete failed')
      }
    } catch (error) {
      console.error('Delete error:', error)
      ElMessage.error(errorMessage)
      onError('delete', error)
      return { success: false, error }
    } finally {
      operationLoading.value.delete = false
      loading.value = false
    }
  }

  /**
   * 批量删除操作
   */
  const batchRemove = async (ids, customOptions = {}) => {
    if (!api.batchDelete && !api.delete) {
      console.error('API batchDelete or delete method not provided')
      return { success: false, error: 'API method not found' }
    }

    if (!ids || ids.length === 0) {
      ElMessage.warning('请选择要删除的项')
      return { success: false, error: 'No items selected' }
    }

    const {
      confirmMessage = finalMessages.batchDeleteConfirmMessage.replace('{count}', ids.length),
      confirmTitle = finalMessages.deleteConfirmTitle,
      successMessage = finalMessages.batchDeleteSuccess,
      errorMessage = finalMessages.batchDeleteError,
      skipConfirm = false
    } = customOptions

    // 确认对话框
    if (confirmDelete && !skipConfirm) {
      try {
        await ElMessageBox.confirm(confirmMessage, confirmTitle, {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          confirmButtonClass: 'el-button--danger'
        })
      } catch {
        return { success: false, cancelled: true }
      }
    }

    operationLoading.value.batchDelete = true
    loading.value = true

    try {
      let response

      // 优先使用批量删除接口
      if (api.batchDelete) {
        response = await api.batchDelete(ids)
      } else {
        // 降级为逐个删除
        const results = await Promise.all(ids.map(id => api.delete(id)))
        response = {
          code: 200,
          success: true,
          data: results
        }
      }

      const success = response?.code === 200 || response?.success === true

      if (success) {
        ElMessage.success(successMessage)
        await onSuccess('batchDelete', ids)
        return { success: true, ids }
      } else {
        throw new Error(response?.message || 'Batch delete failed')
      }
    } catch (error) {
      console.error('Batch delete error:', error)
      ElMessage.error(errorMessage)
      onError('batchDelete', error)
      return { success: false, error }
    } finally {
      operationLoading.value.batchDelete = false
      loading.value = false
    }
  }

  /**
   * 乐观更新包装器
   */
  const withOptimisticUpdate = (operation, rollbackFn) => {
    return async (...args) => {
      if (!optimistic) {
        return operation(...args)
      }

      // 执行乐观更新
      const rollbackData = rollbackFn?.()

      try {
        const result = await operation(...args)
        if (!result.success && rollbackData) {
          // 回滚
          rollbackFn?.(rollbackData)
        }
        return result
      } catch (error) {
        // 回滚
        if (rollbackData) {
          rollbackFn?.(rollbackData)
        }
        throw error
      }
    }
  }

  return {
    loading,
    operationLoading,
    create,
    update,
    remove,
    batchRemove,
    withOptimisticUpdate
  }
}
