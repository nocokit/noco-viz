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
            border: `${comp.borderWidth || 0}px solid ${comp.borderColor || 'transparent'}`,
            borderRadius: `${comp.borderRadius || 0}px`
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getChartComponent } from '@/components/charts/index'

const route = useRoute()
const router = useRouter()

const projectName = ref('大屏预览')
const components = ref([])
const canvasWidth = ref(1920)
const canvasHeight = ref(1080)
const screenBackground = ref('#0a0e27')
const isFullscreen = ref(false)

// 加载项目数据
const loadProject = async () => {
  try {
    const projectId = route.params.id
    const savedProjects = JSON.parse(localStorage.getItem('nocoviz_projects') || '{}')
    const projectData = savedProjects[projectId]

    if (projectData) {
      projectName.value = projectData.name || '大屏预览'
      components.value = projectData.components || []
    } else {
      ElMessage.warning('未找到项目数据')
    }
  } catch (error) {
    ElMessage.error(`加载失败: ${error.message}`)
  }
}

// 容器高度
const containerHeight = computed(() => {
  return isFullscreen.value ? '100vh' : 'calc(100vh - 60px)'
})

// 实际容器高度（数值）
const actualContainerHeight = computed(() => {
  return isFullscreen.value ? window.innerHeight : window.innerHeight - 60
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
  // 计算缩放比例以适应屏幕
  const containerWidth = window.innerWidth
  const scaleX = containerWidth / canvasWidth.value
  const scaleY = actualContainerHeight.value / canvasHeight.value
  const scale = Math.min(scaleX, scaleY, 1)

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
  ElMessage.success('数据已刷新')
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

// 监听ESC键退出全屏
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

onMounted(() => {
  loadProject()
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      isFullscreen.value = false
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.preview-screen {
  width: 100vw;
  height: 100vh;
  background: #0a0e27;
  overflow: hidden;
}

/* 工具栏 */
.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background: rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.toolbar-left .project-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.tool-btn svg {
  width: 20px;
  height: 20px;
}

/* 预览容器 */
.preview-container {
  position: relative;
}

.preview-canvas {
  position: relative;
  overflow: hidden;
}

.preview-component {
  position: absolute;
  overflow: hidden;
}

/* 全屏退出按钮 */
.exit-fullscreen-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.exit-fullscreen-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
