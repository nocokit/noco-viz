import { ref, watch } from 'vue'

// 主题配置
export const themes = {
  dark: {
    name: '暗黑模式',
    key: 'dark',
    colors: {
      // 主题颜色变量
      '--theme-primary': '#1890ff',
      '--theme-secondary': '#096dd9',
      '--theme-accent': '#40a9ff',
      '--theme-success': '#52c41a',
      '--theme-warning': '#faad14',
      '--theme-danger': '#ff4d4f',
      '--theme-info': '#1890ff',

      // 背景色 - 参考 Art Design Pro
      '--theme-bg-body': '#0a0a0a',
      '--theme-bg-canvas': '#141414',
      '--theme-bg-sidebar': '#1a1a1a',
      '--theme-bg-card': '#1f1f1f',
      '--theme-bg-panel': '#141414',
      '--theme-bg-input': '#1a1a1a',
      '--theme-bg-input-light': '#262626',
      '--theme-bg-overlay': 'rgba(0, 0, 0, 0.95)',

      // 边框色 - 非常细微的灰色
      '--theme-border': 'rgba(255, 255, 255, 0.06)',
      '--theme-border-light': 'rgba(255, 255, 255, 0.04)',
      '--theme-border-hover': 'rgba(255, 255, 255, 0.12)',
      '--theme-border-active': '#1890ff',

      // 文字色
      '--theme-text-main': 'rgba(255, 255, 255, 0.85)',
      '--theme-text-secondary': 'rgba(255, 255, 255, 0.45)',
      '--theme-text-disabled': 'rgba(255, 255, 255, 0.25)',
      '--theme-text-placeholder': 'rgba(255, 255, 255, 0.25)'
    }
  },
  light: {
    name: '明亮模式',
    key: 'light',
    colors: {
      // 主题颜色变量
      '--theme-primary': '#409eff',
      '--theme-secondary': '#3a8ee6',
      '--theme-accent': '#66b1ff',
      '--theme-success': '#67c23a',
      '--theme-warning': '#e6a23c',
      '--theme-danger': '#f56c6c',
      '--theme-info': '#909399',

      // 背景色
      '--theme-bg-body': '#f5f7fa',
      '--theme-bg-canvas': '#ffffff',
      '--theme-bg-sidebar': '#ffffff',
      '--theme-bg-card': '#ffffff',
      '--theme-bg-panel': '#fafafa',
      '--theme-bg-input': '#ffffff',
      '--theme-bg-overlay': 'rgba(0, 0, 0, 0.5)',

      // 边框色
      '--theme-border': '#e4e7ed',
      '--theme-border-light': '#ebeef5',
      '--theme-border-hover': '#c0c4cc',
      '--theme-border-active': '#409eff',

      // 文字色
      '--theme-text-main': '#303133',
      '--theme-text-secondary': '#606266',
      '--theme-text-disabled': '#c0c4cc',
      '--theme-text-placeholder': '#c0c4cc',

      // 主题色
      '--theme-primary-hover': '#66b1ff',
      '--theme-primary-active': '#3a8ee6'
    }
  },
  blue: {
    name: '蓝色科技',
    key: 'blue',
    colors: {
      // 主题颜色变量
      '--theme-primary': '#1890ff',
      '--theme-secondary': '#096dd9',
      '--theme-accent': '#40a9ff',
      '--theme-success': '#52c41a',
      '--theme-warning': '#faad14',
      '--theme-danger': '#f5222d',
      '--theme-info': '#1890ff',

      // 背景色
      '--theme-bg-body': '#0a1628',
      '--theme-bg-canvas': '#0f1d35',
      '--theme-bg-sidebar': '#0f1d35',
      '--theme-bg-card': '#162544',
      '--theme-bg-panel': '#0d1b32',
      '--theme-bg-input': '#0d1b32',
      '--theme-bg-overlay': 'rgba(10, 22, 40, 0.95)',

      // 边框色
      '--theme-border': 'rgba(24, 144, 255, 0.15)',
      '--theme-border-light': 'rgba(24, 144, 255, 0.08)',
      '--theme-border-hover': 'rgba(24, 144, 255, 0.3)',
      '--theme-border-active': '#1890ff',

      // 文字色
      '--theme-text-main': '#ffffff',
      '--theme-text-secondary': '#a8c5e2',
      '--theme-text-disabled': '#7a9bc0',
      '--theme-text-placeholder': '#5c7a9e',

      // 主题色
      '--theme-primary-hover': '#40a9ff',
      '--theme-primary-active': '#096dd9'
    }
  },
  red: {
    name: '红色警戒',
    key: 'red',
    colors: {
      // 主题颜色变量
      '--theme-primary': '#ff4466',
      '--theme-secondary': '#cc3344',
      '--theme-accent': '#ff6688',
      '--theme-success': '#52c41a',
      '--theme-warning': '#faad14',
      '--theme-danger': '#ff4466',
      '--theme-info': '#909399',

      // 背景色
      '--theme-bg-body': '#1a0a0f',
      '--theme-bg-canvas': '#260f18',
      '--theme-bg-sidebar': '#260f18',
      '--theme-bg-card': '#2d1420',
      '--theme-bg-panel': '#220d15',
      '--theme-bg-input': '#220d15',
      '--theme-bg-overlay': 'rgba(26, 10, 15, 0.95)',

      // 边框色
      '--theme-border': 'rgba(255, 68, 102, 0.15)',
      '--theme-border-light': 'rgba(255, 68, 102, 0.08)',
      '--theme-border-hover': 'rgba(255, 68, 102, 0.3)',
      '--theme-border-active': '#ff4466',

      // 文字色
      '--theme-text-main': '#ffffff',
      '--theme-text-secondary': '#f0c5d4',
      '--theme-text-disabled': '#c89aaa',
      '--theme-text-placeholder': '#a07080',

      // 主题色
      '--theme-primary-hover': '#ff6688',
      '--theme-primary-active': '#cc3344'
    }
  },
  yellow: {
    name: '黄色活力',
    key: 'yellow',
    colors: {
      // 主题颜色变量
      '--theme-primary': '#fbbf24',
      '--theme-secondary': '#f59e0b',
      '--theme-accent': '#fcd34d',
      '--theme-success': '#52c41a',
      '--theme-warning': '#fbbf24',
      '--theme-danger': '#f5222d',
      '--theme-info': '#909399',

      // 背景色
      '--theme-bg-body': '#1a1508',
      '--theme-bg-canvas': '#261f0f',
      '--theme-bg-sidebar': '#261f0f',
      '--theme-bg-card': '#2d2614',
      '--theme-bg-panel': '#221c0d',
      '--theme-bg-input': '#221c0d',
      '--theme-bg-overlay': 'rgba(26, 21, 8, 0.95)',

      // 边框色
      '--theme-border': 'rgba(251, 191, 36, 0.15)',
      '--theme-border-light': 'rgba(251, 191, 36, 0.08)',
      '--theme-border-hover': 'rgba(251, 191, 36, 0.3)',
      '--theme-border-active': '#fbbf24',

      // 文字色
      '--theme-text-main': '#ffffff',
      '--theme-text-secondary': '#fde68a',
      '--theme-text-disabled': '#d4b86a',
      '--theme-text-placeholder': '#a89050',

      // 主题色
      '--theme-primary-hover': '#fcd34d',
      '--theme-primary-active': '#f59e0b'
    }
  },
  green: {
    name: '绿色清新',
    key: 'green',
    colors: {
      // 主题颜色变量
      '--theme-primary': '#10b981',
      '--theme-secondary': '#059669',
      '--theme-accent': '#34d399',
      '--theme-success': '#10b981',
      '--theme-warning': '#faad14',
      '--theme-danger': '#f5222d',
      '--theme-info': '#909399',

      // 背景色
      '--theme-bg-body': '#0a1410',
      '--theme-bg-canvas': '#0f1a16',
      '--theme-bg-sidebar': '#0f1a16',
      '--theme-bg-card': '#16241e',
      '--theme-bg-panel': '#0d1914',
      '--theme-bg-input': '#0d1914',
      '--theme-bg-overlay': 'rgba(10, 20, 16, 0.95)',

      // 边框色
      '--theme-border': 'rgba(16, 185, 129, 0.15)',
      '--theme-border-light': 'rgba(16, 185, 129, 0.08)',
      '--theme-border-hover': 'rgba(16, 185, 129, 0.3)',
      '--theme-border-active': '#10b981',

      // 文字色
      '--theme-text-main': '#ffffff',
      '--theme-text-secondary': '#a8e2c5',
      '--theme-text-disabled': '#7ac09e',
      '--theme-text-placeholder': '#5c9e7a',

      // 主题色
      '--theme-primary-hover': '#34d399',
      '--theme-primary-active': '#059669'
    }
  }
}

// 当前主题
const currentTheme = ref(localStorage.getItem('noco-theme') || 'dark')

// 应用主题
const applyTheme = (themeName) => {
  const theme = themes[themeName]
  if (!theme) return

  const root = document.documentElement
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  // 更新 body 背景色
  document.body.style.backgroundColor = theme.colors['--theme-bg-body']

  // 根据主题添加或移除 dark 类名
  if (themeName === 'light') {
    document.body.classList.remove('dark')
    document.documentElement.classList.remove('dark')
  } else {
    document.body.classList.add('dark')
    document.documentElement.classList.add('dark')
  }

  // 保存到 localStorage
  localStorage.setItem('noco-theme', themeName)
  currentTheme.value = themeName
}

export function useTheme() {
  // 切换主题
  const setTheme = (themeName) => {
    applyTheme(themeName)
  }

  // 获取当前主题
  const getTheme = () => currentTheme.value

  // 获取所有主题
  const getAllThemes = () => Object.values(themes)

  // 初始化主题（从 localStorage 读取）
  const initTheme = () => {
    const savedTheme = localStorage.getItem('noco-theme') || 'dark'
    applyTheme(savedTheme)
  }

  return {
    currentTheme,
    setTheme,
    getTheme,
    getAllThemes,
    initTheme
  }
}
