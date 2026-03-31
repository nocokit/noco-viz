<script setup>
import { onMounted, computed } from 'vue'
import { useThemeStore } from '@/store'
import { lightTheme, darkTheme } from '@/config/theme'

const themeStore = useThemeStore()

// 计算当前主题配置
const currentTheme = computed(() =>
  themeStore.isDark ? darkTheme : lightTheme
)

// 初始化主题
onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <a-config-provider :theme="currentTheme">
    <router-view />
  </a-config-provider>
</template>

<style>
#app {
  height: 100vh;
  overflow: hidden;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: #0a0e27;
}

body.dark {
  background-color: #0a0a0a;
}
</style>
