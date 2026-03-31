/**
 * 大屏编辑器主题配置系统
 * 支持多种预设主题和自定义主题
 */

// ==================== 主题定义 ====================

/**
 * 工业蓝主题 - 默认主题
 */
export const dataVTheme = {
  id: 'datav',
  name: '工业蓝',
  description: '专业可靠的工业蓝色主题',

  // 基础颜色
  colors: {
    // 主色调
    primary: '#3b82f6',           // 工业蓝
    secondary: '#2563eb',         // 深蓝
    accent: '#60a5fa',            // 浅蓝强调
    success: '#10b981',           // 成功绿
    warning: '#f59e0b',           // 警告橙
    danger: '#ef4444',            // 危险红
    info: '#3b82f6',              // 信息蓝

    // 背景色
    bgBody: '#0a0b0d',            // 深色底色
    bgCanvas: '#141519',          // 画布背景
    bgSidebar: '#1c1d21',         // 侧边栏背景
    bgCard: '#26272c',            // 卡片背景
    bgInput: '#0f1012',           // 输入框背景
    bgOverlay: 'rgba(10, 11, 13, 0.95)', // 遮罩层

    // 边框色
    border: 'rgba(59, 130, 246, 0.15)',      // 主边框
    borderLight: 'rgba(59, 130, 246, 0.08)', // 浅边框
    borderHover: 'rgba(59, 130, 246, 0.3)',  // 悬停边框
    borderActive: '#3b82f6',                 // 激活边框

    // 文字色
    textMain: '#ffffff',          // 主文字
    textSecondary: '#9ca3af',     // 次要文字
    textDisabled: '#6b7280',      // 禁用文字
    textPlaceholder: '#4b5563',   // 占位文字

    // 阴影色
    shadow: 'rgba(59, 130, 246, 0.2)',       // 主阴影
    shadowDark: 'rgba(0, 0, 0, 0.5)',       // 深色阴影

    // 图表配色
    chartColors: ['#3b82f6', '#60a5fa', '#2563eb', '#93c5fd', '#10b981', '#1d4ed8', '#8b5cf6'],
  },

  // 渐变配置
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    secondary: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    accent: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    background: 'linear-gradient(180deg, #0a0b0d 0%, #141519 100%)',
  },

  // 阴影配置
  shadows: {
    sm: '0 2px 8px rgba(59, 130, 246, 0.1)',
    md: '0 4px 16px rgba(59, 130, 246, 0.2)',
    lg: '0 8px 32px rgba(59, 130, 246, 0.3)',
    xl: '0 12px 48px rgba(59, 130, 246, 0.4)',
    glow: '0 0 20px rgba(59, 130, 246, 0.6)',
  },

  // 尺寸配置
  sizes: {
    borderRadius: {
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      round: '50%',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      xxl: '32px',
    },
  },
}

/**
 * 红色警戒主题
 */
export const redAlertTheme = {
  id: 'red-alert',
  name: '红色警戒',
  description: '醒目的红色系监控主题',

  colors: {
    primary: '#ff4466',
    secondary: '#cc3344',
    accent: '#ffaa00',
    success: '#00cc99',
    warning: '#ffaa00',
    danger: '#ff4466',
    info: '#ff88aa',

    bgBody: '#1a0a0f',
    bgCanvas: '#260f18',
    bgSidebar: '#2d1420',
    bgCard: '#381a29',
    bgInput: '#260f18',
    bgOverlay: 'rgba(26, 10, 15, 0.95)',

    border: 'rgba(255, 68, 102, 0.15)',
    borderLight: 'rgba(255, 68, 102, 0.08)',
    borderHover: 'rgba(255, 68, 102, 0.3)',
    borderActive: '#ff4466',

    textMain: '#ffffff',
    textSecondary: '#f0c5d4',
    textDisabled: '#6b7280',
    textPlaceholder: '#4b5563',

    shadow: 'rgba(255, 68, 102, 0.2)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',

    chartColors: ['#ff4466', '#cc3344', '#ffaa00', '#ff6699', '#ff88aa', '#ff99bb', '#ffaacc'],
  },

  gradients: {
    primary: 'linear-gradient(135deg, #ff4466 0%, #cc3344 100%)',
    secondary: 'linear-gradient(135deg, #cc3344 0%, #991122 100%)',
    accent: 'linear-gradient(135deg, #ffaa00 0%, #ff6600 100%)',
    background: 'linear-gradient(180deg, #1a0a0f 0%, #260f18 100%)',
  },

  shadows: {
    sm: '0 2px 8px rgba(255, 68, 102, 0.1)',
    md: '0 4px 16px rgba(255, 68, 102, 0.2)',
    lg: '0 8px 32px rgba(255, 68, 102, 0.3)',
    xl: '0 12px 48px rgba(255, 68, 102, 0.4)',
    glow: '0 0 20px rgba(255, 68, 102, 0.6)',
  },

  sizes: dataVTheme.sizes,
}

/**
 * 黄色活力主题
 */
export const yellowEnergyTheme = {
  id: 'yellow-energy',
  name: '黄色活力',
  description: '明亮活力的黄色系主题',

  colors: {
    primary: '#fbbf24',
    secondary: '#f59e0b',
    accent: '#fb923c',
    success: '#10b981',
    warning: '#fbbf24',
    danger: '#ef4444',
    info: '#fcd34d',

    bgBody: '#1a1508',
    bgCanvas: '#261f0f',
    bgSidebar: '#2d2614',
    bgCard: '#382f1a',
    bgInput: '#261f0f',
    bgOverlay: 'rgba(26, 21, 8, 0.95)',

    border: 'rgba(251, 191, 36, 0.15)',
    borderLight: 'rgba(251, 191, 36, 0.08)',
    borderHover: 'rgba(251, 191, 36, 0.3)',
    borderActive: '#fbbf24',

    textMain: '#ffffff',
    textSecondary: '#fde68a',
    textDisabled: '#6b7280',
    textPlaceholder: '#4b5563',

    shadow: 'rgba(251, 191, 36, 0.2)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',

    chartColors: ['#fbbf24', '#f59e0b', '#fb923c', '#fcd34d', '#fde047', '#facc15', '#eab308'],
  },

  gradients: {
    primary: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    secondary: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    accent: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
    background: 'linear-gradient(180deg, #1a1508 0%, #261f0f 100%)',
  },

  shadows: {
    sm: '0 2px 8px rgba(251, 191, 36, 0.1)',
    md: '0 4px 16px rgba(251, 191, 36, 0.2)',
    lg: '0 8px 32px rgba(251, 191, 36, 0.3)',
    xl: '0 12px 48px rgba(251, 191, 36, 0.4)',
    glow: '0 0 20px rgba(251, 191, 36, 0.6)',
  },

  sizes: dataVTheme.sizes,
}

/**
 * 绿色科技主题
 */
export const greenTechTheme = {
  id: 'green-tech',
  name: '绿色科技',
  description: '清新的绿色科技感主题',

  colors: {
    primary: '#00ff88',
    secondary: '#00cc66',
    accent: '#ffcc00',
    success: '#00ff88',
    warning: '#ffaa00',
    danger: '#ff4466',
    info: '#00ddaa',

    bgBody: '#0a1a0f',
    bgCanvas: '#0f2618',
    bgSidebar: '#142d20',
    bgCard: '#1a3829',
    bgInput: '#0f2618',
    bgOverlay: 'rgba(10, 26, 15, 0.95)',

    border: 'rgba(0, 255, 136, 0.15)',
    borderLight: 'rgba(0, 255, 136, 0.08)',
    borderHover: 'rgba(0, 255, 136, 0.3)',
    borderActive: '#00ff88',

    textMain: '#ffffff',
    textSecondary: '#c5f0dd',
    textDisabled: '#6b7280',
    textPlaceholder: '#4b5563',

    shadow: 'rgba(0, 255, 136, 0.2)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',

    chartColors: ['#00ff88', '#00cc66', '#ffcc00', '#00ddaa', '#88ffcc', '#66ff99', '#44dd77'],
  },

  gradients: {
    primary: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
    secondary: 'linear-gradient(135deg, #00cc66 0%, #009944 100%)',
    accent: 'linear-gradient(135deg, #ffcc00 0%, #ff9900 100%)',
    background: 'linear-gradient(180deg, #0a1a0f 0%, #0f2618 100%)',
  },

  shadows: {
    sm: '0 2px 8px rgba(0, 255, 136, 0.1)',
    md: '0 4px 16px rgba(0, 255, 136, 0.2)',
    lg: '0 8px 32px rgba(0, 255, 136, 0.3)',
    xl: '0 12px 48px rgba(0, 255, 136, 0.4)',
    glow: '0 0 20px rgba(0, 255, 136, 0.6)',
  },

  sizes: dataVTheme.sizes,
}

/**
 * 金色奢华主题
 */
export const goldLuxuryTheme = {
  id: 'gold-luxury',
  name: '金色奢华',
  description: '奢华典雅的金色系主题',

  colors: {
    primary: '#d4af37',
    secondary: '#b8941e',
    accent: '#ffd700',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#e5c100',

    bgBody: '#1a1508',
    bgCanvas: '#261f0f',
    bgSidebar: '#2d2614',
    bgCard: '#382f1a',
    bgInput: '#261f0f',
    bgOverlay: 'rgba(26, 21, 8, 0.95)',

    border: 'rgba(212, 175, 55, 0.15)',
    borderLight: 'rgba(212, 175, 55, 0.08)',
    borderHover: 'rgba(212, 175, 55, 0.3)',
    borderActive: '#d4af37',

    textMain: '#ffffff',
    textSecondary: '#f0e6c5',
    textDisabled: '#6b7280',
    textPlaceholder: '#4b5563',

    shadow: 'rgba(212, 175, 55, 0.2)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',

    chartColors: ['#d4af37', '#b8941e', '#ffd700', '#e5c100', '#c9a900', '#ad8e00', '#917300'],
  },

  gradients: {
    primary: 'linear-gradient(135deg, #d4af37 0%, #b8941e 100%)',
    secondary: 'linear-gradient(135deg, #b8941e 0%, #9c7a0a 100%)',
    accent: 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)',
    background: 'linear-gradient(180deg, #1a1508 0%, #261f0f 100%)',
  },

  shadows: {
    sm: '0 2px 8px rgba(212, 175, 55, 0.1)',
    md: '0 4px 16px rgba(212, 175, 55, 0.2)',
    lg: '0 8px 32px rgba(212, 175, 55, 0.3)',
    xl: '0 12px 48px rgba(212, 175, 55, 0.4)',
    glow: '0 0 20px rgba(212, 175, 55, 0.6)',
  },

  sizes: dataVTheme.sizes,
}

// ==================== 主题集合 ====================

export const themes = {
  datav: dataVTheme,
  'red-alert': redAlertTheme,
  'yellow-energy': yellowEnergyTheme,
  'green-tech': greenTechTheme,
  'gold-luxury': goldLuxuryTheme,
}

export const themeList = [
  dataVTheme,
  redAlertTheme,
  yellowEnergyTheme,
  greenTechTheme,
  goldLuxuryTheme,
]

// ==================== 主题工具函数 ====================

/**
 * 获取主题配置
 */
export function getTheme(themeId) {
  return themes[themeId] || dataVTheme
}

/**
 * 应用主题到 CSS 变量
 */
export function applyTheme(themeId) {
  const theme = getTheme(themeId)
  const root = document.documentElement

  // 应用颜色变量
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVar, value)
  })

  // 应用渐变变量
  Object.entries(theme.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--theme-gradient-${key}`, value)
  })

  // 应用阴影变量
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--theme-shadow-${key}`, value)
  })

  // 应用尺寸变量
  Object.entries(theme.sizes.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--theme-radius-${key}`, value)
  })

  Object.entries(theme.sizes.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--theme-spacing-${key}`, value)
  })

  // 保存到 localStorage
  localStorage.setItem('screen-editor-theme', themeId)

  return theme
}

/**
 * 获取当前主题 ID
 */
export function getCurrentThemeId() {
  return localStorage.getItem('screen-editor-theme') || 'datav'
}

/**
 * 初始化主题
 */
export function initTheme() {
  const themeId = getCurrentThemeId()
  return applyTheme(themeId)
}
