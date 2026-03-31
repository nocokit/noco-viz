/**
 * 编辑器工具栏配置
 * 统一管理编辑器头部的所有按钮和工具配置
 */

/**
 * 撤销重做按钮配置
 */
export const historyButtonsConfig = [
  {
    action: 'undo',
    title: '撤销 (Ctrl+Z)',
    iconPath: 'M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-9 9'
  },
  {
    action: 'redo',
    title: '重做 (Ctrl+Y)',
    iconPath: 'M21 7v6h-6M3 17a9 9 0 0 1 9-9 9 9 0 0 1 9 9'
  }
]

/**
 * 编辑控制按钮配置（复制、粘贴、快速复制）
 */
export const editButtonsConfig = [
  {
    action: 'copy',
    title: '复制 (Ctrl+C)',
    iconPath: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'
  },
  {
    action: 'paste',
    title: '粘贴 (Ctrl+V)',
    iconPath: 'M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z'
  },
  {
    action: 'duplicate',
    title: '快速复制 (Ctrl+D)',
    iconPath: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z'
  }
]

/**
 * 对齐和分布按钮配置
 */
export const alignButtonsConfig = [
  { type: 'left', title: '左对齐', minCount: 2, iconPath: 'M4 22H2V2h2v20zM22 7H6v3h16V7zm-6 7H6v3h10v-3z' },
  { type: 'center-x', title: '水平居中', minCount: 2, iconPath: 'M11 2h2v5h8v3h-8v4h5v3h-5v5h-2v-5H6v-3h5v-4H3V7h8z' },
  { type: 'right', title: '右对齐', minCount: 2, iconPath: 'M20 2h2v20h-2V2zM2 7h16v3H2V7zm6 7h10v3H8v-3z' },
  { divider: true },
  { type: 'top', title: '顶对齐', minCount: 2, iconPath: 'M2 2h20v2H2V2zm5 16h3V6H7v12zm7-6h3V6h-3v6z' },
  { type: 'center-y', title: '垂直居中', minCount: 2, iconPath: 'M22 11v2h-5v8h-3v-8H10v5H7v-5H2v-2h5V6h3v5h4V3h3v8z' },
  { type: 'bottom', title: '底对齐', minCount: 2, iconPath: 'M22 22H2v-2h20v2zM7 6h3v12H7V6zm7 6h3v6h-3v-6z' },
  { divider: true },
  { type: 'same-width', title: '等宽', minCount: 2, iconPath: 'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6zM2 2v2h20V2H2zm0 18v2h20v-2H2z' },
  { type: 'same-height', title: '等高', minCount: 2, iconPath: 'M4 4h6v6H4V4zm0 10h6v6H4v-6zm10-10h6v6h-6V4zm0 10h6v6h-6v-6zM2 2h2v20H2V2zm18 0h2v20h-2V2z' },
  { divider: true },
  { type: 'dist-h', title: '水平分布', minCount: 3, iconPath: 'M4 22H2V2h2v20zM22 2h-2v20h2V2zm-5 5H7v10h10V7z' },
  { type: 'dist-v', title: '垂直分布', minCount: 3, iconPath: 'M22 4v2H2V4h20zM2 22h20v-2H2v2zm5-5h10V7H7v10z' }
]

/**
 * 缩放按钮配置（放大、重置、适应屏幕）
 */
export const zoomButtonsConfig = [
  {
    action: 'zoom-in',
    title: '放大',
    iconPaths: ['M12 5v14', 'M5 12h14']
  },
  {
    action: 'zoom-reset',
    title: '重置为100%',
    iconPaths: ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5']
  },
  {
    action: 'fit-screen',
    title: '适应屏幕',
    iconPaths: ['M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3']
  }
]

/**
 * 网格类型选项配置
 */
export const gridTypeOptionsConfig = [
  { key: '3x3', label: '3×3 网格' },
  { key: '4x4', label: '4×4 网格' },
  { key: '5x5', label: '5×5 网格' }
]
