/**
 * 确认对话框逻辑 Composable
 */

import { ElMessageBox, ElMessage } from 'element-plus'

export function useConfirm() {
  const confirmDelete = async (itemName, callback) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除 "${itemName}" 吗？此操作不可恢复。`,
        '删除确认',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'el-button--danger'
        }
      )
      await callback()
      ElMessage.success('删除成功')
      return true
    } catch {
      return false
    }
  }

  const confirmAction = async (options) => {
    try {
      await ElMessageBox.confirm(
        options.message,
        options.title || '确认操作',
        {
          confirmButtonText: options.confirmText || '确认',
          cancelButtonText: options.cancelText || '取消',
          type: options.type || 'warning'
        }
      )
      if (options.callback) {
        await options.callback()
      }
      if (options.successMessage) {
        ElMessage.success(options.successMessage)
      }
      return true
    } catch {
      return false
    }
  }

  return { confirmDelete, confirmAction }
}
