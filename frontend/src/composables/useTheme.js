import { ref, watch } from 'vue'

// 主题配置
export const themes = {
  dark: {
    name: '暗黑模式',
    key: 'dark',
    colors: {
      // 背景色
      '--noco-bg-body': '#0a0b0d',
      '--noco-bg-sidebar': '#141519',
      '--noco-bg-card': '#1c1d21',
      '--noco-bg-input': '#0f1012',
      '--noco-bg-hover': '#26272c',

      // 边框色
      '--noco-border': '#2d2e33',
      '--noco-border-light': '#333439',

      // 文字色
      '--noco-text-main': '#ffffff',
      '--noco-text-secondary': '#9ca3af',
      '--noco-text-muted': '#6b7280',
      '--noco-text-placeholder': '#4b5563',

      // 主题色
      '--noco-primary': '#3b82f6',
      '--noco-primary-hover': '#2563eb',
      '--noco-primary-active': '#1d4ed8',

      // Element Plus 变量覆盖
      '--el-bg-color': '#1c1d21',
      '--el-bg-color-page': '#0a0b0d',
      '--el-bg-color-overlay': '#1c1d21',
      '--el-fill-color-blank': '#0f1012',
      '--el-fill-color': '#26272c',
      '--el-fill-color-light': '#2d2e33',
      '--el-text-color-primary': '#ffffff',
      '--el-text-color-regular': '#e5e7eb',
      '--el-text-color-secondary': '#9ca3af',
      '--el-text-color-placeholder': '#6b7280',
      '--el-border-color': '#2d2e33',
      '--el-color-primary': '#3b82f6'
    }
  },
  light: {
    name: '明亮模式',
    key: 'light',
    colors: {
      // 背景色
      '--noco-bg-body': '#f5f7fa',
      '--noco-bg-sidebar': '#ffffff',
      '--noco-bg-card': '#ffffff',
      '--noco-bg-input': '#ffffff',
      '--noco-bg-hover': '#f5f7fa',

      // 边框色
      '--noco-border': '#e4e7ed',
      '--noco-border-light': '#ebeef5',

      // 文字色
      '--noco-text-main': '#303133',
      '--noco-text-secondary': '#606266',
      '--noco-text-muted': '#909399',
      '--noco-text-placeholder': '#c0c4cc',

      // 主题色
      '--noco-primary': '#409eff',
      '--noco-primary-hover': '#66b1ff',
      '--noco-primary-active': '#3a8ee6',

      // Element Plus 变量覆盖
      '--el-bg-color': '#ffffff',
      '--el-bg-color-page': '#f5f7fa',
      '--el-bg-color-overlay': '#ffffff',
      '--el-fill-color-blank': '#ffffff',
      '--el-fill-color': '#f5f7fa',
      '--el-fill-color-light': '#fafafa',
      '--el-text-color-primary': '#303133',
      '--el-text-color-regular': '#606266',
      '--el-text-color-secondary': '#909399',
      '--el-text-color-placeholder': '#c0c4cc',
      '--el-border-color': '#dcdfe6',
      '--el-color-primary': '#409eff'
    }
  },
  blue: {
    name: '蓝色科技',
    key: 'blue',
    colors: {
      // 背景色
      '--noco-bg-body': '#0a1628',
      '--noco-bg-sidebar': '#0f1d35',
      '--noco-bg-card': '#162544',
      '--noco-bg-input': '#0d1b32',
      '--noco-bg-hover': '#1a2f4f',

      // 边框色
      '--noco-border': '#1e3a5f',
      '--noco-border-light': '#254266',

      // 文字色
      '--noco-text-main': '#ffffff',
      '--noco-text-secondary': '#a8c5e2',
      '--noco-text-muted': '#7a9bc0',
      '--noco-text-placeholder': '#5c7a9e',

      // 主题色
      '--noco-primary': '#1890ff',
      '--noco-primary-hover': '#40a9ff',
      '--noco-primary-active': '#096dd9',

      // Element Plus 变量覆盖
      '--el-bg-color': '#162544',
      '--el-bg-color-page': '#0a1628',
      '--el-bg-color-overlay': '#162544',
      '--el-fill-color-blank': '#0d1b32',
      '--el-fill-color': '#1a2f4f',
      '--el-fill-color-light': '#1e3a5f',
      '--el-text-color-primary': '#ffffff',
      '--el-text-color-regular': '#e8f4ff',
      '--el-text-color-secondary': '#a8c5e2',
      '--el-text-color-placeholder': '#7a9bc0',
      '--el-border-color': '#1e3a5f',
      '--el-color-primary': '#1890ff'
    }
  },
  purple: {
    name: '紫色梦幻',
    key: 'purple',
    colors: {
      // 背景色
      '--noco-bg-body': '#13111a',
      '--noco-bg-sidebar': '#1a1625',
      '--noco-bg-card': '#251f35',
      '--noco-bg-input': '#1c1829',
      '--noco-bg-hover': '#2d2640',

      // 边框色
      '--noco-border': '#3a2f54',
      '--noco-border-light': '#453863',

      // 文字色
      '--noco-text-main': '#ffffff',
      '--noco-text-secondary': '#c8b8e8',
      '--noco-text-muted': '#9d89c7',
      '--noco-text-placeholder': '#7864a6',

      // 主题色
      '--noco-primary': '#8b5cf6',
      '--noco-primary-hover': '#a78bfa',
      '--noco-primary-active': '#7c3aed',

      // Element Plus 变量覆盖
      '--el-bg-color': '#251f35',
      '--el-bg-color-page': '#13111a',
      '--el-bg-color-overlay': '#251f35',
      '--el-fill-color-blank': '#1c1829',
      '--el-fill-color': '#2d2640',
      '--el-fill-color-light': '#3a2f54',
      '--el-text-color-primary': '#ffffff',
      '--el-text-color-regular': '#ede9fe',
      '--el-text-color-secondary': '#c8b8e8',
      '--el-text-color-placeholder': '#9d89c7',
      '--el-border-color': '#3a2f54',
      '--el-color-primary': '#8b5cf6'
    }
  },
  green: {
    name: '绿色清新',
    key: 'green',
    colors: {
      // 背景色
      '--noco-bg-body': '#0a1410',
      '--noco-bg-sidebar': '#0f1a16',
      '--noco-bg-card': '#16241e',
      '--noco-bg-input': '#0d1914',
      '--noco-bg-hover': '#1a2f26',

      // 边框色
      '--noco-border': '#1e3a2e',
      '--noco-border-light': '#254235',

      // 文字色
      '--noco-text-main': '#ffffff',
      '--noco-text-secondary': '#a8e2c5',
      '--noco-text-muted': '#7ac09e',
      '--noco-text-placeholder': '#5c9e7a',

      // 主题色
      '--noco-primary': '#10b981',
      '--noco-primary-hover': '#34d399',
      '--noco-primary-active': '#059669',

      // Element Plus 变量覆盖
      '--el-bg-color': '#16241e',
      '--el-bg-color-page': '#0a1410',
      '--el-bg-color-overlay': '#16241e',
      '--el-fill-color-blank': '#0d1914',
      '--el-fill-color': '#1a2f26',
      '--el-fill-color-light': '#1e3a2e',
      '--el-text-color-primary': '#ffffff',
      '--el-text-color-regular': '#e8fff4',
      '--el-text-color-secondary': '#a8e2c5',
      '--el-text-color-placeholder': '#7ac09e',
      '--el-border-color': '#1e3a2e',
      '--el-color-primary': '#10b981'
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
  document.body.style.backgroundColor = theme.colors['--noco-bg-body']

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
