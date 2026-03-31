<template>
  <a-switch
    v-model:checked="isDark"
    @change="handleThemeChange"
    checked-children="🌙"
    un-checked-children="☀️"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/store'

const themeStore = useThemeStore()

const isDark = computed({
  get: () => themeStore.isDark,
  set: (value) => themeStore.setTheme(value)
})

function handleThemeChange(checked) {
  themeStore.setTheme(checked)
}
</script>

