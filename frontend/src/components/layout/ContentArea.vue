<template>
  <div :class="['content-area', { scrollable: scrollable }]" :style="contentStyle">
    <div v-if="loading" class="loading-overlay">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const props = defineProps({
  padding: {
    type: String,
    default: ''
  },
  scrollable: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const contentStyle = computed(() => {
  const style = {}
  if (props.padding) {
    style.padding = props.padding
  }
  return style
})
</script>

<style scoped>
.content-area {
  flex: 1;
  position: relative;
  min-height: 0;
}

.content-area.scrollable {
  overflow-y: auto;
  overflow-x: hidden;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-bg-color);
  z-index: 10;
}

.loading-overlay .el-icon {
  font-size: 32px;
  color: var(--el-color-primary);
}
</style>
