import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
  }),

  getters: {
    currentTheme: (state) => state.isDark ? 'dark' : 'light',
  },

  actions: {
    /**
     * 切换主题
     */
    toggleTheme() {
      this.isDark = !this.isDark
      this.saveTheme()
      this.applyTheme()
    },

    /**
     * 设置主题
     * @param {boolean} isDark - 是否为暗色主题
     */
    setTheme(isDark) {
      this.isDark = isDark
      this.saveTheme()
      this.applyTheme()
    },

    /**
     * 初始化主题
     */
    initTheme() {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.isDark = savedTheme === 'dark'
      } else {
        // 默认使用亮色主题
        this.isDark = false
        // 保存默认主题到 localStorage
        localStorage.setItem('theme', 'light')
      }
      this.applyTheme()
    },

    /**
     * 保存主题到本地存储
     */
    saveTheme() {
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },

    /**
     * 应用主题到 body
     */
    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.body.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.body.classList.remove('dark')
      }
    },
  },
})
