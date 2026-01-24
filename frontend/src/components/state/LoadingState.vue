<template>
  <div class="loading-state" :class="{ fullscreen: fullscreen }" :style="loadingStyle">
    <div class="loading-content">
      <el-icon class="is-loading loading-icon">
        <Loading />
      </el-icon>
      <div v-if="text" class="loading-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const props = defineProps({
  text: {
    type: String,
    default: '加载中...'
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  background: {
    type: String,
    default: ''
  }
})

const loadingStyle = computed(() => {
  const style = {}
  if (props.background) {
    style.background = props.background
  }
  return style
})
</script>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: var(--el-bg-color);
}

.loading-state.fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-icon {
  font-size: 48px;
  color: var(--el-color-primary);
}

.loading-text {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.fullscreen .loading-text {
  color: #fff;
}
</style>
