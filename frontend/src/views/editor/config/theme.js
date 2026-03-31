/**
 * 编辑器主题配置
 * 统一管理颜色、间距、断点等主题相关配置
 */

// 响应式断点
export const breakpoints = {
  small: 1900,    // 小屏幕阈值
  medium: 2560,   // 中等屏幕阈值
  large: 3840     // 大屏幕阈值
}

// z-index 层级管理
export const zIndex = {
  canvas: 1,
  toolbar: 100,
  panel: 200,
  dropdown: 500,
  modal: 1000,
  toast: 2000
}

// 颜色系统
export const colors = {
  primary: '#1890ff',
  primaryHover: '#40a9ff',
  success: '#52c41a',
  warning: '#ffa940',
  danger: '#ff6b6b',

  // 背景色
  bgDark: '#18181c',
  bgDarker: '#000',
  bgOverlay: 'rgba(24, 24, 28, 0.9)',

  // 边框色
  border: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(255, 255, 255, 0.15)',

  // 文字色
  textPrimary: '#e5e5e5',
  textSecondary: '#909399',
  textDisabled: '#888'
}

// 间距系统
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px'
}

// 圆角
export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px'
}

// 动画时长
export const transition = {
  fast: '0.15s',
  normal: '0.2s',
  slow: '0.3s'
}
