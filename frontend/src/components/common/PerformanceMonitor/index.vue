/**
 * PerformanceMonitor - 性能监控组件
 * 实时显示 FPS、内存使用、组件数量等性能指标
 */
<template>
  <Teleport to="body">
    <div v-if="showMonitor" class="performance-monitor" :class="{ collapsed }">
      <div class="monitor-header" @click="collapsed = !collapsed">
        <span class="monitor-title">⚡ Performance</span>
        <span class="monitor-toggle">{{ collapsed ? '▼' : '▲' }}</span>
      </div>

      <div v-if="!collapsed" class="monitor-body">
        <!-- FPS -->
        <div class="monitor-item">
          <span class="item-label">FPS:</span>
          <span class="item-value" :class="fpsClass">{{ fps }}</span>
        </div>

        <!-- 内存 -->
        <div v-if="memorySupported" class="monitor-item">
          <span class="item-label">Memory:</span>
          <span class="item-value">{{ memory }} MB</span>
        </div>

        <!-- 组件数量 -->
        <div class="monitor-item">
          <span class="item-label">Components:</span>
          <span class="item-value">{{ componentCount }}</span>
        </div>

        <!-- 渲染时间 -->
        <div class="monitor-item">
          <span class="item-label">Render:</span>
          <span class="item-value">{{ renderTime }} ms</span>
        </div>

        <!-- 网络状态 -->
        <div v-if="networkSupported" class="monitor-item">
          <span class="item-label">Network:</span>
          <span class="item-value" :class="{ offline: !online }">
            {{ online ? effectiveType || 'Online' : 'Offline' }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useNetwork } from '@/composables'

const props = defineProps({
  enabled: {
    type: Boolean,
    default: import.meta.env.DEV
  }
})

const showMonitor = ref(props.enabled)
const collapsed = ref(false)

// FPS 监控
const fps = ref(60)
const fpsClass = computed(() => {
  if (fps.value >= 55) return 'good'
  if (fps.value >= 30) return 'warning'
  return 'bad'
})

// 内存监控
const memory = ref(0)
const memorySupported = ref(!!performance.memory)

// 组件数量
const componentCount = ref(0)

// 渲染时间
const renderTime = ref(0)

// 网络状态
const { online, effectiveType } = useNetwork()
const networkSupported = ref(!!navigator.connection)

// FPS 计算
let frameCount = 0
let lastTime = performance.now()
let rafId = null

const measureFPS = () => {
  frameCount++
  const currentTime = performance.now()

  if (currentTime >= lastTime + 1000) {
    fps.value = Math.round((frameCount * 1000) / (currentTime - lastTime))
    frameCount = 0
    lastTime = currentTime

    // 测量内存
    if (performance.memory) {
      memory.value = Math.round(performance.memory.usedJSHeapSize / 1048576)
    }

    // 测量组件数量
    const instance = getCurrentInstance()
    if (instance) {
      componentCount.value = countComponents(instance.appContext.app._instance)
    }
  }

  rafId = requestAnimationFrame(measureFPS)
}

// 计算组件数量
const countComponents = (instance) => {
  if (!instance) return 0

  let count = 1
  if (instance.subTree && instance.subTree.children) {
    instance.subTree.children.forEach(child => {
      if (child.component) {
        count += countComponents(child.component)
      }
    })
  }

  return count
}

// 测量渲染时间
const measureRenderTime = () => {
  const entries = performance.getEntriesByType('measure')
  if (entries.length > 0) {
    const lastEntry = entries[entries.length - 1]
    renderTime.value = Math.round(lastEntry.duration)
  }
}

onMounted(() => {
  if (showMonitor.value) {
    measureFPS()

    // 定期测量渲染时间
    setInterval(measureRenderTime, 1000)
  }
})

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
})
</script>

<style scoped>
.performance-monitor {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  border-radius: 8px;
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  z-index: 99999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  min-width: 200px;
  transition: all 0.3s ease;
}

.performance-monitor.collapsed {
  min-width: auto;
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.monitor-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.monitor-title {
  font-weight: bold;
  font-size: 13px;
}

.monitor-toggle {
  opacity: 0.6;
  font-size: 10px;
}

.monitor-body {
  padding: 8px 12px;
}

.monitor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  gap: 12px;
}

.item-label {
  opacity: 0.7;
  font-size: 11px;
}

.item-value {
  font-weight: bold;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.good {
  color: #67c23a;
}

.warning {
  color: #e6a23c;
}

.bad {
  color: #f56c6c;
}

.offline {
  color: #f56c6c;
}

/* 响应式 */
@media (max-width: 768px) {
  .performance-monitor {
    top: auto;
    bottom: 10px;
    right: 10px;
    font-size: 11px;
  }
}
</style>
