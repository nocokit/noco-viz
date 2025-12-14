/**
 * 大屏编辑器主题配置系统
 * 支持多种预设主题和自定义主题
 */

// ==================== 主题定义 ====================

/**
 * DataV 科技蓝主题 - 默认主题
 */
export const dataVTheme = {
  id: 'datav',
  name: 'DataV 科技蓝',
  description: '经典大屏主题，科技感十足',

  // 基础颜色
  colors: {
    // 主色调
    primary: '#00f2f2',           // DataV 青色
    secondary: '#0099cc',         // 科技蓝
    accent: '#ffaa00',            // 橙色强调
    success: '#00cc99',           // 成功绿
    warning: '#ffaa00',           // 警告橙
    danger: '#ff4466',            // 危险红
    info: '#66ffff',              // 信息亮青

    // 背景色
    bgBody: '#050d19',            // 深蓝黑底色
    bgCanvas: '#0a1628',          // 画布背景
    bgSidebar: '#0d1a2d',         // 侧边栏背景
    bgCard: '#0f1f3a',            // 卡片背景
    bgInput: '#0a1628',           // 输入框背景
    bgOverlay: 'rgba(5, 13, 25, 0.95)', // 遮罩层

    // 边框色
    border: 'rgba(0, 242, 242, 0.15)',      // 主边框
    borderLight: 'rgba(0, 242, 242, 0.08)', // 浅边框
    borderHover: 'rgba(0, 242, 242, 0.3)',  // 悬停边框
    borderActive: '#00f2f2',                 // 激活边框

    // 文字色
    textMain: '#ffffff',          // 主文字
    textSecondary: '#bcd0e3',     // 次要文字
    textDisabled: '#6b7280',      // 禁用文字
    textPlaceholder: '#4b5563',   // 占位文字

    // 阴影色
    shadow: 'rgba(0, 242, 242, 0.2)',       // 主阴影
    shadowDark: 'rgba(0, 0, 0, 0.5)',       // 深色阴影

    // 图表配色
    chartColors: ['#00f2f2', '#0099cc', '#ffaa00', '#ff6b9d', '#00cc99', '#66ffff', '#9966ff'],
  },

  // 渐变配置
  gradients: {
    primary: 'linear-gradient(135deg, #00f2f2 0%, #0099cc 100%)',
    secondary: 'linear-gradient(135deg, #0099cc 0%, #006699 100%)',
    accent: 'linear-gradient(135deg, #ffaa00 0%, #ff6600 100%)',
    background: 'linear-gradient(180deg, #050d19 0%, #0a1628 100%)',
  },

  // 阴影配置
  shadows: {
    sm: '0 2px 8px rgba(0, 242, 242, 0.1)',
    md: '0 4px 16px rgba(0, 242, 242, 0.2)',
    lg: '0 8px 32px rgba(0, 242, 242, 0.3)',
    xl: '0 12px 48px rgba(0, 242, 242, 0.4)',
    glow: '0 0 20px rgba(0, 242, 242, 0.6)',
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
 * 紫色梦幻主题
 */
export const purpleDreamTheme = {
  id: 'purple-dream',
  name: '紫色梦幻',
  description: '神秘优雅的紫色系大屏主题',

  colors: {
    primary: '#9966ff',
    secondary: '#6633cc',
    accent: '#ff66cc',
    success: '#66cc99',
    warning: '#ffaa66',
    danger: '#ff6699',
    info: '#66ccff',

    bgBody: '#0f0820',
    bgCanvas: '#1a0f35',
    bgSidebar: '#1f1245',
    bgCard: '#2a1755',
    bgInput: '#1a0f35',
    bgOverlay: 'rgba(15, 8, 32, 0.95)',

    border: 'rgba(153, 102, 255, 0.15)',
    borderLight: 'rgba(153, 102, 255, 0.08)',
    borderHover: 'rgba(153, 102, 255, 0.3)',
    borderActive: '#9966ff',

    textMain: '#ffffff',
    textSecondary: '#d4c5f9',
    textDisabled: '#6b7280',
    textPlaceholder: '#4b5563',

    shadow: 'rgba(153, 102, 255, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',

    chartColors: ['#9966ff', '#6633cc', '#ff66cc', '#66ccff', '#66cc99', '#ffaa66', '#ff99cc'],
  },

  gradients: {
    primary: 'linear-gradient(135deg, #9966ff 0%, #6633cc 100%)',
    secondary: 'linear-gradient(135deg, #6633cc 0%, #4422aa 100%)',
    accent: 'linear-gradient(135deg, #ff66cc 0%, #cc3399 100%)',
    background: 'linear-gradient(180deg, #0f0820 0%, #1a0f35 100%)',
  },

  shadows: {
    sm: '0 2px 8px rgba(153, 102, 255, 0.1)',
    md: '0 4px 16px rgba(153, 102, 255, 0.2)',
    lg: '0 8px 32px rgba(153, 102, 255, 0.3)',
    xl: '0 12px 48px rgba(153, 102, 255, 0.4)',
    glow: '0 0 20px rgba(153, 102, 255, 0.6)',
  },

  sizes: dataVTheme.sizes, // 继承默认尺寸配置
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
 * 金色奢华主题
 */
export const goldLuxuryTheme = {
  id: 'gold-luxury',
  name: '金色奢华',
  description: '高端大气的金色主题',

  colors: {
    primary: '#ffd700',
    secondary: '#daa520',
    accent: '#ff8800',
    success: '#00cc99',
    warning: '#ffaa00',
    danger: '#ff4466',
    info: '#ffdd88',

    bgBody: '#1a1510',
    bgCanvas: '#261f18',
    bgSidebar: '#2d2620',
    bgCard: '#382f28',
    bgInput: '#261f18',
    bgOverlay: 'rgba(26, 21, 16, 0.95)',

    border: 'rgba(255, 215, 0, 0.15)',
    borderLight: 'rgba(255, 215, 0, 0.08)',
    borderHover: 'rgba(255, 215, 0, 0.3)',
    borderActive: '#ffd700',

    textMain: '#ffffff',
    textSecondary: '#f0e5c5',
    textDisabled: '#6b7280',
    textPlaceholder: '#4b5563',

    shadow: 'rgba(255, 215, 0, 0.2)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',

    chartColors: ['#ffd700', '#daa520', '#ff8800', '#ffdd88', '#ffcc66', '#ffbb44', '#ffaa22'],
  },

  gradients: {
    primary: 'linear-gradient(135deg, #ffd700 0%, #daa520 100%)',
    secondary: 'linear-gradient(135deg, #daa520 0%, #b8860b 100%)',
    accent: 'linear-gradient(135deg, #ff8800 0%, #cc6600 100%)',
    background: 'linear-gradient(180deg, #1a1510 0%, #261f18 100%)',
  },

  shadows: {
    sm: '0 2px 8px rgba(255, 215, 0, 0.1)',
    md: '0 4px 16px rgba(255, 215, 0, 0.2)',
    lg: '0 8px 32px rgba(255, 215, 0, 0.3)',
    xl: '0 12px 48px rgba(255, 215, 0, 0.4)',
    glow: '0 0 20px rgba(255, 215, 0, 0.6)',
  },

  sizes: dataVTheme.sizes,
}

// ==================== 主题集合 ====================

export const themes = {
  datav: dataVTheme,
  'purple-dream': purpleDreamTheme,
  'green-tech': greenTechTheme,
  'red-alert': redAlertTheme,
  'gold-luxury': goldLuxuryTheme,
}

export const themeList = [
  dataVTheme,
  purpleDreamTheme,
  greenTechTheme,
  redAlertTheme,
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
