/**
 * 通用 CRUD 操作配置
 * 提供预定义的常用操作，支持扩展和自定义
 */

// 预定义操作
export const ACTIONS = {
  // 工具栏操作
  ADD: { key: 'add', label: '新增', type: 'primary', icon: 'plus' },
  IMPORT: { key: 'import', label: '导入', icon: 'upload' },
  EXPORT: { key: 'export', label: '导出', icon: 'download' },

  // 行操作
  EDIT: { key: 'edit', label: '编辑', icon: 'edit' },
  DELETE: { key: 'delete', label: '删除', icon: 'delete', danger: true },
  VIEW: { key: 'view', label: '查看', icon: 'eye' },
  COPY: { key: 'copy', label: '复制', icon: 'copy' }
}

/**
 * 创建工具栏操作
 * @param {Array<string|Object>} actions - 操作列表，可以是预定义的 key 或自定义对象
 * @returns {Array<Object>} 操作配置数组
 *
 * @example
 * // 使用预定义操作
 * createToolbarActions(['add', 'export'])
 *
 * // 混合使用预定义和自定义
 * createToolbarActions([
 *   'add',
 *   { key: 'custom', label: '自定义', icon: 'star' }
 * ])
 */
export const createToolbarActions = (actions = ['add']) => {
  return actions.map(action => {
    if (typeof action === 'string') {
      const predefined = ACTIONS[action.toUpperCase()]
      if (!predefined) {
        console.warn(`未找到预定义操作: ${action}`)
        return null
      }
      return predefined
    }
    return action
  }).filter(Boolean)
}

/**
 * 创建行操作
 * @param {Array<string|Object>} actions - 操作列表，可以是预定义的 key 或自定义对象
 * @returns {Array<Object>} 操作配置数组
 *
 * @example
 * // 使用预定义操作
 * createRowActions(['edit', 'delete'])
 *
 * // 混合使用预定义和自定义
 * createRowActions([
 *   'edit',
 *   { key: 'approve', label: '审批', icon: 'check' }
 * ])
 */
export const createRowActions = (actions = ['edit', 'delete']) => {
  return actions.map(action => {
    if (typeof action === 'string') {
      const predefined = ACTIONS[action.toUpperCase()]
      if (!predefined) {
        console.warn(`未找到预定义操作: ${action}`)
        return null
      }
      return predefined
    }
    return action
  }).filter(Boolean)
}
