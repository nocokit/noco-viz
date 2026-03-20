<template>
  <div class="preview-screen" :style="{ background: screenBackground }">
    <!-- 顶部工具栏 -->
    <div class="preview-toolbar" v-if="!isFullscreen">
      <div class="toolbar-left">
        <h3 class="project-title">{{ projectName }}</h3>
      </div>
      <div class="toolbar-right">
        <button class="tool-btn" @click="toggleFullscreen" title="全屏">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
        </button>
        <button class="tool-btn" @click="handleRefresh" title="刷新">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>
        <button class="tool-btn" @click="handleExit" title="退出预览">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 画布容器 -->
    <div class="preview-container" :style="containerStyle">
      <div class="preview-canvas" :style="canvasStyle">
        <!-- 渲染所有组件 -->
        <div
          v-for="comp in components"
          :key="comp.id"
          class="preview-component"
          :style="{
            left: comp.x + 'px',
            top: comp.y + 'px',
            width: comp.w + 'px',
            height: comp.h + 'px',
            transform: `rotate(${comp.rotation || 0}deg)`,
            background: comp.bgColor || 'transparent',
            opacity: (comp.opacity || 100) / 100,
            border: `${comp.showBorder && comp.borderWidth ? comp.borderWidth : 0}px solid ${comp.borderColor || 'transparent'}`,
            borderRadius: `${comp.borderRadius || 0}px`,
            padding: `${comp.paddingVertical ?? 8}px ${comp.paddingHorizontal ?? 8}px`,
            zIndex: comp.zIndex || 1
          }"
        >
          <!-- 渲染图表组件 -->
          <component
            :is="getChartComponent(comp.type)"
            :config="comp.config"
            :data="comp.data"
            :width="comp.w"
            :height="comp.h"
          />
        </div>
      </div>
    </div>

    <!-- 全屏时显示退出按钮 -->
    <button v-if="isFullscreen" class="exit-fullscreen-btn" @click="toggleFullscreen">
      退出全屏 (ESC)
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getChartComponent } from '@/components/charts/index'

const route = useRoute()
const router = useRouter()

const projectName = ref('大屏预览')
const components = ref([])
const canvasWidth = ref(1920)
const canvasHeight = ref(1080)
const screenBackground = ref('#0a0e27')
const isFullscreen = ref(false)

// 窗口尺寸响应式数据
const windowSize = reactive({
  width: window.innerWidth,
  height: window.innerHeight
})

// 加载项目数据
const loadProject = async () => {
  try {
    const projectId = route.params.id
    const savedProjects = JSON.parse(localStorage.getItem('nocoviz_projects') || '{}')
    const projectData = savedProjects[projectId]

    if (projectData) {
      projectName.value = projectData.name || '大屏预览'
      components.value = projectData.components || []
      canvasWidth.value = projectData.canvasWidth || 1920
      canvasHeight.value = projectData.canvasHeight || 1080
      screenBackground.value = projectData.screenBackground || '#0a0e27'

      console.log('预览加载成功:', {
        projectName: projectName.value,
        componentCount: components.value.length,
        canvasSize: `${canvasWidth.value}×${canvasHeight.value}`
      })
    } else {
      message.warning('未找到项目数据')
    }
  } catch (error) {
    console.error('加载失败:', error)
    message.error(`加载失败: ${error.message}`)
  }
}

// 容器高度
const containerHeight = computed(() => {
  return isFullscreen.value ? '100vh' : 'calc(100vh - 48px)'
})

// 实际容器高度（数值）
const actualContainerHeight = computed(() => {
  return isFullscreen.value ? windowSize.height : windowSize.height - 48
})

// 画布样式
const containerStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: containerHeight.value,
  overflow: 'hidden'
}))

const canvasStyle = computed(() => {
  // 计算缩放比例以适应屏幕（填满100%）
  const containerWidth = windowSize.width
  const containerHeightValue = actualContainerHeight.value

  const scaleX = containerWidth / canvasWidth.value
  const scaleY = containerHeightValue / canvasHeight.value

  // 使用较小的缩放比例，保持宽高比，确保完整显示
  const scale = Math.min(scaleX, scaleY)

  return {
    position: 'relative',
    width: `${canvasWidth.value}px`,
    height: `${canvasHeight.value}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    background: screenBackground.value,
    boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)'
  }
})

// 全屏切换
const toggleFullscreen = () => {
  if (!isFullscreen.value) {
    document.documentElement.requestFullscreen?.()
    isFullscreen.value = true
  } else {
    document.exitFullscreen?.()
    isFullscreen.value = false
  }
}

// 刷新数据
const handleRefresh = () => {
  loadProject()
  message.success('数据已刷新')
}

// 退出预览
const handleExit = () => {
  if (isFullscreen.value) {
    toggleFullscreen()
  }
  // 尝试关闭窗口
  if (window.opener) {
    window.close()
  } else {
    // 如果无法关闭，尝试返回上一页
    router.push('/')
  }
}

// 监听窗口尺寸变化
const handleResize = () => {
  windowSize.width = window.innerWidth
  windowSize.height = window.innerHeight
}

// 监听ESC键退出全屏
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

onMounted(() => {
  loadProject()
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      isFullscreen.value = false
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.preview-screen {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #0a0e27;
}

.preview-toolbar {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  z-index: 100;
}

.project-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn svg {
  width: 16px;
  height: 16px;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.preview-component {
  position: absolute;
  box-sizing: border-box;
  overflow: hidden;
}

.exit-fullscreen-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  cursor: pointer;
  z-index: 9999;
  transition: all 0.2s;
}

.exit-fullscreen-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
}
</style>
