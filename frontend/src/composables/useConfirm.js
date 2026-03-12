/**
 * 确认对话框逻辑 Composable
 */

import { Modal, message } from 'ant-design-vue'

export function useConfirm() {
  const confirmDelete = async (itemName, callback) => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: '删除确认',
        content: `确定要删除 "${itemName}" 吗？此操作不可恢复。`,
        okText: '删除',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          try {
            await callback()
            message.success('删除成功')
            resolve(true)
          } catch (error) {
            resolve(false)
          }
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
  }

  const confirmAction = async (options) => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: options.title || '确认操作',
        content: options.message,
        okText: options.confirmText || '确认',
        cancelText: options.cancelText || '取消',
        okType: options.type === 'error' ? 'danger' : 'primary',
        onOk: async () => {
          try {
            if (options.callback) {
              await options.callback()
            }
            if (options.successMessage) {
              message.success(options.successMessage)
            }
            resolve(true)
          } catch (error) {
            resolve(false)
          }
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
  }

  return { confirmDelete, confirmAction }
}
