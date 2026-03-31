<template>
  <div v-if="shouldShow" class="canvas-toolbar" :class="{ floating }">
    <!-- 网格控制 -->
    <GridControl
      :enabled="gridEnabled"
      :type="gridType"
      @toggle="$emit('toggle-grid')"
      @change-type="$emit('change-grid-type', $event)"
    />

    <!-- 智能布局 -->
    <template v-if="gridEnabled">
      <div class="toolbar-divider"></div>
      <AutoLayout
        :component-count="componentCount"
        @auto-layout="$emit('auto-layout')"
      />
    </template>

    <div class="toolbar-divider"></div>

    <!-- 缩放控制 -->
    <ZoomControl
      :scale="scale"
      @zoom-in="$emit('zoom-in')"
      @zoom-out="$emit('zoom-out')"
      @zoom-set="$emit('zoom-set', $event)"
      @zoom-reset="$emit('zoom-reset')"
      @fit-screen="$emit('fit-screen')"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import GridControl from './GridControl.vue'
import AutoLayout from './AutoLayout.vue'
import ZoomControl from './ZoomControl.vue'
import { useIsLargeScreen } from '../composables/useResponsive.js'

const props = defineProps({
  gridEnabled: Boolean,
  gridType: String,
  componentCount: Number,
  scale: Number,
  floating: Boolean
})

defineEmits([
  'toggle-grid',
  'change-grid-type',
  'auto-layout',
  'zoom-out',
  'zoom-in',
  'zoom-set',
  'zoom-reset',
  'fit-screen'
])

// 使用响应式 composable 判断是否显示
const isLargeScreen = useIsLargeScreen()

// 根据屏幕尺寸和 floating 属性决定是否显示
const shouldShow = computed(() => {
  if (props.floating) {
    // 浮动版本：小屏幕显示
    return !isLargeScreen.value
  } else {
    // 顶部版本：大屏幕显示
    return isLargeScreen.value
  }
})
</script>

<style scoped>
.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: var(--bg-hover, rgba(255, 255, 255, 0.04));
  border-radius: var(--radius-md, 6px);
}

.canvas-toolbar.floating {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: var(--bg-overlay, rgba(24, 24, 28, 0.9));
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  z-index: var(--z-toolbar, 100);
}

.toolbar-divider {
  width: 1px;
  height: 14px;
  background: var(--border, rgba(255, 255, 255, 0.12));
  margin: 0 4px;
}
</style>
