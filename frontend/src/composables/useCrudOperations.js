import { ref } from 'vue'
import { message, Modal } from 'ant-design-vue'

const isOk = (res) => res?.code === 200 || res?.success === true

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

  const msgs = { ...defaultMessages, ...messages }

  const withLoading = async (key, fn) => {
    operationLoading.value[key] = true
    loading.value = true
    try {
      return await fn()
    } finally {
      operationLoading.value[key] = false
      loading.value = false
    }
  }

  const withConfirm = (title, content, fn) => {
    return new Promise((resolve) => {
      Modal.confirm({
        title,
        content,
        okText: '删除',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => fn().then(resolve).catch(resolve),
        onCancel: () => resolve({ success: false, cancelled: true })
      })
    })
  }

  const create = async (data, customMessages = {}) => {
    if (!api.create) return { success: false, error: 'API method not found' }

    return withLoading('create', async () => {
      try {
        const res = await api.create(data)
        if (!isOk(res)) throw new Error(res?.message || 'Create failed')
        message.success(customMessages.success || msgs.createSuccess)
        await onSuccess('create', res.data)
        return { success: true, data: res.data }
      } catch (error) {
        message.error(customMessages.error || msgs.createError)
        onError('create', error)
        return { success: false, error }
      }
    })
  }

  const update = async (id, data, customMessages = {}) => {
    if (!api.update) return { success: false, error: 'API method not found' }

    return withLoading('update', async () => {
      try {
        const res = await api.update(id, data)
        if (!isOk(res)) throw new Error(res?.message || 'Update failed')
        message.success(customMessages.success || msgs.updateSuccess)
        await onSuccess('update', res.data)
        return { success: true, data: res.data }
      } catch (error) {
        message.error(customMessages.error || msgs.updateError)
        onError('update', error)
        return { success: false, error }
      }
    })
  }

  const doDelete = async (id, successMsg, errorMsg) => {
    return withLoading('delete', async () => {
      try {
        const res = await api.delete(id)
        if (!isOk(res)) throw new Error(res?.message || 'Delete failed')
        message.success(successMsg)
        await onSuccess('delete', id)
        return { success: true, id }
      } catch (error) {
        message.error(errorMsg)
        onError('delete', error)
        return { success: false, error }
      }
    })
  }

  const remove = async (id, customOptions = {}) => {
    if (!api.delete) return { success: false, error: 'API method not found' }

    const {
      confirmMessage = msgs.deleteConfirmMessage,
      confirmTitle = msgs.deleteConfirmTitle,
      successMessage = msgs.deleteSuccess,
      errorMessage = msgs.deleteError,
      skipConfirm = false
    } = customOptions

    if (confirmDelete && !skipConfirm) {
      return withConfirm(confirmTitle, confirmMessage, () => doDelete(id, successMessage, errorMessage))
    }
    return doDelete(id, successMessage, errorMessage)
  }

  const doBatchDelete = async (ids, successMsg, errorMsg) => {
    return withLoading('batchDelete', async () => {
      try {
        let res
        if (api.batchDelete) {
          res = await api.batchDelete(ids)
        } else {
          await Promise.all(ids.map(id => api.delete(id)))
          res = { code: 200 }
        }
        if (!isOk(res)) throw new Error(res?.message || 'Batch delete failed')
        message.success(successMsg)
        await onSuccess('batchDelete', ids)
        return { success: true, ids }
      } catch (error) {
        message.error(errorMsg)
        onError('batchDelete', error)
        return { success: false, error }
      }
    })
  }

  const batchRemove = async (ids, customOptions = {}) => {
    if (!api.batchDelete && !api.delete) return { success: false, error: 'API method not found' }
    if (!ids?.length) {
      message.warning('请选择要删除的项')
      return { success: false, error: 'No items selected' }
    }

    const {
      confirmMessage = msgs.batchDeleteConfirmMessage.replace('{count}', ids.length),
      confirmTitle = msgs.deleteConfirmTitle,
      successMessage = msgs.batchDeleteSuccess,
      errorMessage = msgs.batchDeleteError,
      skipConfirm = false
    } = customOptions

    if (confirmDelete && !skipConfirm) {
      return withConfirm(confirmTitle, confirmMessage, () => doBatchDelete(ids, successMessage, errorMessage))
    }
    return doBatchDelete(ids, successMessage, errorMessage)
  }

  const withOptimisticUpdate = (operation, rollbackFn) => {
    return async (...args) => {
      if (!optimistic) return operation(...args)

      const rollbackData = rollbackFn?.()
      try {
        const result = await operation(...args)
        if (!result.success && rollbackData) rollbackFn?.(rollbackData)
        return result
      } catch (error) {
        if (rollbackData) rollbackFn?.(rollbackData)
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
