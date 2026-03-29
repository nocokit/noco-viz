<template>
  <div class="screen-editor">
    <!-- 顶部导航栏 Header - 使用 EditorHeader 组件 -->
    <EditorHeader
      v-model:project-name="projectName"
      :save-status="saveStatus"
      :is-saving="isSaving"
      :can-undo="canUndo"
      :can-redo="canRedo"
      :selected-count="selectedComponentIds.length"
      :component-count="canvasComponents.length"
      :has-copied="!!copiedComponent"
      :canvas-scale="canvasScale"
      :canvas-pan-x="canvasPanX"
      :canvas-pan-y="canvasPanY"
      :grid-enabled="gridConfig.enabled"
      :grid-type="gridConfig.type"
      @save="handleSave"
      @undo="handleUndo"
      @redo="handleRedo"
      @copy="handleCopy"
      @paste="handlePaste"
      @duplicate="handleDuplicate"
      @align="alignSelectedComponents"
      @clear="handleClearCanvas"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @zoom-set="zoomSet"
      @zoom-reset="zoomReset"
      @fit-screen="fitToScreen"
      @preview="handlePreview"
      @toggle-grid="gridConfig.enabled = !gridConfig.enabled"
      @change-grid-type="(type) => gridConfig.type = type"
      @auto-layout="handleAutoLayout"
    />

    <!-- 主体容器 -->
    <div class="main-container">
    <!-- 1. 一级侧边栏 (Activity Bar) -->
    <ActivityBar
      :current-tab="currentTab"
      :is-panel-open="isPanelOpen"
      @switch-tab="switchTab"
      @toggle-panel="togglePanel"
      @exit="router.back()"
    />

    <!-- 2. 二级功能面板 (Left Side Panel) -->
    <aside :class="['side-panel', { collapsed: !isPanelOpen }]">
      <!-- 折叠按钮 -->
      <button class="panel-toggle-btn" @click="togglePanel" :title="isPanelOpen ? '收起面板' : '展开面板'">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path v-if="isPanelOpen" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          <path v-else d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>

      <div class="panel-content-wrapper">

        <!-- Panel A: 组件库 -->
        <ComponentsPanel v-if="currentTab === 'components'" />

        <!-- Panel B: 图层管理 -->
        <LayersPanel
          v-if="currentTab === 'layers'"
          :components="canvasComponents"
          :selected-ids="selectedComponentIds"
          @select="selectComponent"
          @toggle-lock="toggleLock"
          @delete="deleteComponent"
        />

        <!-- Panel C: 资源中心 -->
        <MediaLibraryPanel v-if="currentTab === 'assets'" />

      </div>
    </aside>

    <!-- 3. 画布区域 (Center Canvas with Rulers) -->
    <main class="canvas-area" @drop="handleDrop" @dragover.prevent @click.self="deselectComponent">
      <!-- Grid 布局：标尺 + 画布 -->
      <div class="ruler-container">
        <!-- 左上角死角 -->
        <div class="ruler-corner">px</div>

        <!-- 横向标尺 -->
        <div class="ruler-h-wrapper">
          <canvas ref="rulerH" class="ruler-canvas"></canvas>
        </div>

        <!-- 纵向标尺 -->
        <div class="ruler-v-wrapper">
          <canvas ref="rulerV" class="ruler-canvas"></canvas>
        </div>

        <!-- 画布视口容器 -->
        <div
          class="canvas-viewport"
          ref="canvasViewport"
          @mousedown="handleCanvasPanStart"
          @wheel="handleCanvasWheel"
          @click.self="deselectComponent"
          @contextmenu.prevent
          @mousemove="handleCanvasMouseMove"
          @mouseleave="handleCanvasMouseLeave"
          :style="{ cursor: isPanning ? 'grabbing' : (isSpacePressed ? 'grab' : 'default') }"
        >
          <!-- 游标线系统 -->
          <div class="crosshair-system">
            <!-- 横向辅助线 + Y轴标签 -->
            <div class="guide-h" ref="guideH">
              <div class="coord-label label-y" ref="labelY">0</div>
            </div>

            <!-- 纵向辅助线 + X轴标签 -->
            <div class="guide-v" ref="guideV">
              <div class="coord-label label-x" ref="labelX">0</div>
            </div>

            <!-- 跟随鼠标的HUD坐标显示 -->
            <div class="cursor-hud" ref="cursorHud">
              <span>X: <span class="hud-val" ref="hudX">0</span></span>
              <span>Y: <span class="hud-val" ref="hudY">0</span></span>
            </div>
          </div>

          <div
            class="canvas-transform-wrapper"
            :style="{
              transform: `translate(${canvasPanX}px, ${canvasPanY}px) scale(${canvasScale})`,
              transformOrigin: '0 0'
            }"
          >
            <div class="screen-container" :style="screenContainerStyle">
              <div v-if="canvasComponents.length === 0" class="screen-watermark">NocoViz Canvas</div>

              <!-- 网格辅助线 -->
              <svg v-if="gridConfig.enabled" class="grid-overlay" :style="{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }">
                <defs>
                  <pattern
                    v-if="gridConfig.type === '3x3'"
                    id="grid-3x3"
                    width="33.333%"
                    height="33.333%"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="100%" height="100%" fill="none" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  </pattern>
                  <pattern
                    v-if="gridConfig.type === '4x4'"
                    id="grid-4x4"
                    width="25%"
                    height="25%"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="100%" height="100%" fill="none" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  </pattern>
                  <pattern
                    v-if="gridConfig.type === '5x5'"
                    id="grid-5x5"
                    width="20%"
                    height="20%"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="100%" height="100%" fill="none" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  </pattern>
                </defs>

                <!-- 3x3 网格 -->
                <g v-if="gridConfig.type === '3x3'">
                  <line x1="33.333%" y1="0" x2="33.333%" y2="100%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="66.666%" y1="0" x2="66.666%" y2="100%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="0" y1="33.333%" x2="100%" y2="33.333%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="0" y1="66.666%" x2="100%" y2="66.666%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                </g>

                <!-- 4x4 网格 -->
                <g v-if="gridConfig.type === '4x4'">
                  <line x1="25%" y1="0" x2="25%" y2="100%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="75%" y1="0" x2="75%" y2="100%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="0" y1="25%" x2="100%" y2="25%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="0" y1="75%" x2="100%" y2="75%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                </g>

                <!-- 5x5 网格 -->
                <g v-if="gridConfig.type === '5x5'">
                  <line x1="20%" y1="0" x2="20%" y2="100%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="40%" y1="0" x2="40%" y2="100%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="60%" y1="0" x2="60%" y2="100%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="80%" y1="0" x2="80%" y2="100%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="0" y1="20%" x2="100%" y2="20%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="0" y1="40%" x2="100%" y2="40%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="0" y1="60%" x2="100%" y2="60%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                  <line x1="0" y1="80%" x2="100%" y2="80%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth" />
                </g>

                <!-- 黄金分割 -->
                <g v-if="gridConfig.type === 'golden'">
                  <line x1="38.2%" y1="0" x2="38.2%" y2="100%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth * 1.5" stroke-dasharray="5,5" />
                  <line x1="61.8%" y1="0" x2="61.8%" y2="100%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth * 1.5" stroke-dasharray="5,5" />
                  <line x1="0" y1="38.2%" x2="100%" y2="38.2%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth * 1.5" stroke-dasharray="5,5" />
                  <line x1="0" y1="61.8%" x2="100%" y2="61.8%" :stroke="gridConfig.color" :stroke-width="gridConfig.lineWidth * 1.5" stroke-dasharray="5,5" />
                </g>
              </svg>

              <!-- Rendered Components -->
              <div
                v-for="comp in canvasComponents"
                :key="comp.id"
                class="canvas-component"
                :class="{
                  selected: selectedComponentIds.includes(comp.id),
                  locked: comp.locked
                }"
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
                  padding: `${comp.paddingVertical ?? (/^(border|decoration|bgbox)-/.test(comp.type) ? 0 : 8)}px ${comp.paddingHorizontal ?? (/^(border|decoration|bgbox)-/.test(comp.type) ? 0 : 8)}px`,
                  zIndex: getComponentZIndex(comp)
                }"
                @click.stop="selectComponent(comp.id, $event)"
                @mousedown="startDrag($event, comp)"
              >
                <!-- 渲染真实的图表组件 -->
                <component
                  :is="getChartComponent(comp.type)"
                  :key="`${comp.id}-${comp.w}-${comp.h}`"
                  :config="comp.config"
                  :data="comp.data"
                  :width="getContentWidth(comp)"
                  :height="getContentHeight(comp)"
                />

                <!-- Resize handles - 仅单选且为主选中组件时显示 -->
                <template v-if="selectedComponentId === comp.id && selectedComponentIds.length === 1">
                  <div class="resize-handle n" @mousedown.stop="startResize($event, comp, 'n')"></div>
                  <div class="resize-handle ne" @mousedown.stop="startResize($event, comp, 'ne')"></div>
                  <div class="resize-handle e" @mousedown.stop="startResize($event, comp, 'e')"></div>
                  <div class="resize-handle se" @mousedown.stop="startResize($event, comp, 'se')"></div>
                  <div class="resize-handle s" @mousedown.stop="startResize($event, comp, 's')"></div>
                  <div class="resize-handle sw" @mousedown.stop="startResize($event, comp, 'sw')"></div>
                  <div class="resize-handle w" @mousedown.stop="startResize($event, comp, 'w')"></div>
                  <div class="resize-handle nw" @mousedown.stop="startResize($event, comp, 'nw')"></div>
                </template>
              </div>

              <!-- 框选工具 -->
              <div
                v-if="isSelecting"
                class="selection-box"
                :style="{
                  left: Math.min(selectionBox.startX, selectionBox.currentX) + 'px',
                  top: Math.min(selectionBox.startY, selectionBox.currentY) + 'px',
                  width: Math.abs(selectionBox.currentX - selectionBox.startX) + 'px',
                  height: Math.abs(selectionBox.currentY - selectionBox.startY) + 'px'
                }"
              ></div>

              <!-- 对齐辅助线 - 优化版：只在相关组件之间显示 -->
              <div
                v-for="(line, index) in alignmentLines.vertical"
                :key="'v-' + index"
                class="alignment-line alignment-line-vertical"
                :style="{
                  left: line.position + 'px',
                  top: (line.top || 0) + 'px',
                  height: (line.height || 1080) + 'px'
                }"
              ></div>
              <div
                v-for="(line, index) in alignmentLines.horizontal"
                :key="'h-' + index"
                class="alignment-line alignment-line-horizontal"
                :style="{
                  top: line.position + 'px',
                  left: (line.left || 0) + 'px',
                  width: (line.width || 1920) + 'px'
                }"
              ></div>

              <!-- 多选包围盒 - 战术锁定效果 -->
              <div
                v-if="multiSelectBox.visible"
                class="multi-select-box"
                :style="{
                  left: multiSelectBox.x + 'px',
                  top: multiSelectBox.y + 'px',
                  width: multiSelectBox.width + 'px',
                  height: multiSelectBox.height + 'px'
                }"
              >
                <!-- HUD 四角装饰 -->
                <div class="corner-bracket corner-tl"></div>
                <div class="corner-bracket corner-tr"></div>
                <div class="corner-bracket corner-bl"></div>
                <div class="corner-bracket corner-br"></div>

                <!-- 尺寸标签 -->
                <div class="multi-select-size-label">
                  {{ Math.round(multiSelectBox.width) }} × {{ Math.round(multiSelectBox.height) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 4. 右侧配置面板 (Right Config Panel) -->
    <ConfigPanel
      :selected-component="selectedComponent"
      :page-config="pageConfig"
      @update:selected-component="updateSelectedComponent"
      @update:page-config="updatePageConfig"
    />

    <!-- Mock 数据源编辑器弹窗 -->
    <MockDataEditor
      v-if="showMockEditor"
      :visible="showMockEditor"
      :data="currentMockData"
      :isEdit="!!currentMockData"
      @close="showMockEditor = false"
      @save="handleMockDataSave"
    />
    </div> <!-- 关闭 main-container -->
  </div> <!-- 关闭 screen-editor -->
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, nextTick, h, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message as ElMessage, Modal } from 'ant-design-vue'
const ElMessageBox = Modal
import { chartCategories, chartIcons, getChartByType } from '@/config/chartComponents'
import { getChartComponent } from '@/components/charts/index'
import { getComponentSchema, isChartComponent as checkIsChart } from '@/config/componentSchema'
import MockDataEditor from '@/components/data/MockDataEditor.vue'
import EditorHeader from './editor/components/EditorHeader.vue'
import ActivityBar from './editor/components/ActivityBar.vue'
import ComponentsPanel from './editor/components/ComponentsPanel.vue'
import LayersPanel from './editor/components/LayersPanel.vue'
import MediaLibraryPanel from './editor/components/MediaLibraryPanel.vue'
import ConfigPanel from './editor/components/ConfigPanel/index.vue'
import * as echarts from 'echarts'
import { getChartPreviewOption } from './editor/config/chartPreviewOptions'

// Composables
import { useHistory } from './editor/composables/useHistory'
import { useCanvasState } from './editor/composables/useCanvasState'
import { useCanvas } from './editor/composables/useCanvas'
import { useClipboard } from './editor/composables/useClipboard'
import { useAlignment } from './editor/composables/useAlignment'
import { useComponents } from './editor/composables/useComponents'
import { useKeyboardShortcuts } from './editor/composables/useKeyboardShortcuts'
import { showMessage } from './editor/composables/useMessage'
import { getProjectDetail, updateProject } from '@/api/project'

// 配置消息提示位置
ElMessage.config({
  top: '60px',
  duration: 2,
  maxCount: 1
})


const route = useRoute()
const router = useRouter()

const currentTab = ref('components')
const isPanelOpen = ref(true)

// 网格辅助线配置
const gridConfig = reactive({
  enabled: true, // 默认打开
  type: '3x3', // '3x3' | '4x4' | '5x5' | 'golden' | 'custom'
  color: 'rgba(100, 150, 255, 0.3)',
  lineWidth: 1
})

// 图表预览 refs
const chartPreviewRefs = reactive({})

// 项目状态
const projectName = ref('未命名大屏项目')

// ========== 使用 Composables ==========
// 画布状态管理
const {
  canvasComponents,
  selectedComponentIds,
  selectedComponentId,
  selectedComponent,
  selectedComponents,
  multiSelectBox,
  selectComponent,
  deselectComponent,
  selectMultipleComponents,
  updateMultiSelectBox,
  deleteComponent,
  toggleLock
} = useCanvasState()

// 历史记录管理
const {
  history,
  historyIndex,
  canUndo,
  canRedo,
  addHistory,
  handleUndo,
  handleRedo,
  clearHistory
} = useHistory(canvasComponents)

// 画布缩放和平移
const {
  canvasScale,
  canvasPanX,
  canvasPanY,
  isPanning,
  isSpacePressed,
  canvasViewport,
  rulerH,
  rulerV,
  guideH,
  guideV,
  labelX,
  labelY,
  hudX,
  hudY,
  cursorHud,
  mousePos,
  logicalPos,
  isSelecting,
  selectionBox,
  handleCanvasPanStart: _handleCanvasPanStart
} = useCanvas()

// 包装 handleCanvasPanStart 以提供必要的回调
const handleCanvasPanStart = (e) => {
  _handleCanvasPanStart(e, {
    onSelectionStart: (event) => {
      // 如果不是按住 Ctrl/Cmd，清空之前的选中
      if (!event.ctrlKey && !event.metaKey) {
        selectedComponentIds.value = []
      }
    },
    onSelectionMove: () => {
      updateSelectionFromBox()
    },
    drawRulers
  })
}

// 剪贴板操作
const {
  copiedComponent,
  handleCopy,
  handlePaste,
  handleDuplicate
} = useClipboard(canvasComponents, selectedComponentIds)

// 对齐功能
const {
  alignmentLines,
  alignSelectedComponents,
  calculateAlignmentLines,
  clearAlignmentLines
} = useAlignment(canvasComponents, selectedComponentIds)

// 组件操作
const {
  handleDrop,
  updateComponentSize,
  updateComponentPosition,
  startDrag: _startDrag,
  startResize
} = useComponents(canvasComponents, selectedComponentIds, canvasScale, isSpacePressed, selectedComponents)

// 保存功能 (需要在 useKeyboardShortcuts 之前定义)
const isSaving = ref(false)
const saveStatus = ref('未保存')
const handleSave = async () => {
  isSaving.value = true
  saveStatus.value = '保存中...'

  const projectId = route.params.id
  const canvasConfig = {
    components: canvasComponents.value,
    canvasWidth: pageConfig.width,
    canvasHeight: pageConfig.height,
    screenBackground: pageConfig.backgroundColor,
    screenBackgroundImage: pageConfig.backgroundImage,
    canvasScale: canvasScale.value,
    canvasPanX: canvasPanX.value,
    canvasPanY: canvasPanY.value,
  }

  try {
    await updateProject(projectId, {
      title: projectName.value,
      config: canvasConfig
    })
    isSaving.value = false
    saveStatus.value = '已保存'
    showMessage.success('大屏配置已保存')
  } catch (error) {
    // 后端不可用时降级到 localStorage
    try {
      const savedProjects = JSON.parse(localStorage.getItem('nocoviz_projects') || '{}')
      savedProjects[projectId] = { id: projectId, name: projectName.value, ...canvasConfig }
      localStorage.setItem('nocoviz_projects', JSON.stringify(savedProjects))
      isSaving.value = false
      saveStatus.value = '已保存(本地)'
      showMessage.success('大屏配置已保存（本地）')
    } catch {
      isSaving.value = false
      saveStatus.value = '保存失败'
      showMessage.error(`保存失败: ${error.message}`)
    }
  }
}

// 键盘快捷键
const {
  registerKeyboardEvents,
  unregisterKeyboardEvents
} = useKeyboardShortcuts({
  isSpacePressed,
  selectedComponent,
  selectedComponents,
  selectedComponentIds,
  copiedComponent,
  handleUndo,
  handleRedo,
  handleSave,
  deleteComponent,
  deselectComponent,
  handleCopy,
  handlePaste,
  handleDuplicate
})

// 包装 startDrag 以提供必要的回调
const startDrag = (event, comp) => {
  _startDrag(event, comp, {
    selectComponent,
    calculateAlignmentLines,
    clearAlignmentLines,
    updateMultiSelectBox
  })
}

// ========== 其他状态 ==========
// 返回工作台
const handleBackToHome = () => {
  router.push('/projects')
}

const SNAP_THRESHOLD = 5 // 吸附阈值(像素)

// 右侧配置面板状态
const openGroups = reactive({
  basic: true,
  visual: true,
  dataSource: true,
  dataMapping: true
})

// 页面配置
const pageConfig = reactive({
  width: 1920,
  height: 1080,
  backgroundColor: '#0a0e27',
  backgroundImage: '',
  title: '数据大屏'
})

// 更新选中组件
const updateSelectedComponent = (value) => {
  if (selectedComponent.value) {
    // 确保 w、h、x、y 为整数
    if (value.w !== undefined) value.w = Math.round(value.w)
    if (value.h !== undefined) value.h = Math.round(value.h)
    if (value.x !== undefined) value.x = Math.round(value.x)
    if (value.y !== undefined) value.y = Math.round(value.y)

    Object.assign(selectedComponent.value, value)
  }
}

// 更新页面配置
const updatePageConfig = (value) => {
  Object.assign(pageConfig, value)
}

// 画布背景样式
const screenContainerStyle = computed(() => {
  const style = {
    width: `${pageConfig.width}px`,
    height: `${pageConfig.height}px`,
    backgroundColor: pageConfig.backgroundColor
  }
  if (pageConfig.backgroundImage) {
    style.backgroundImage = `url(${pageConfig.backgroundImage})`
    style.backgroundSize = '100% 100%'
    style.backgroundRepeat = 'no-repeat'
    style.backgroundPosition = 'center'
  }
  return style
})

// 获取当前组件的配置 Schema
const currentComponentSchema = computed(() => {
  if (!selectedComponent.value) return {}
  return getComponentSchema(selectedComponent.value.type)
})

// 判断是否为图表组件
const isChartComponent = (type) => {
  return checkIsChart(type)
}

// 判断是否为边框/底图组件
const isBorderOrDecoration = (type) => {
  return /^(border|decoration|bgbox)-/.test(type)
}

// 获取组件的 z-index
const getComponentZIndex = (comp) => {
  // 如果组件有自定义 zIndex，使用自定义值
  if (comp.zIndex !== undefined && comp.zIndex !== null) {
    return comp.zIndex
  }

  // 如果是选中状态，提升到最上层（除非是边框/底图组件）
  const isSelected = selectedComponentIds.value.includes(comp.id)
  if (isSelected && !isBorderOrDecoration(comp.type)) {
    return 10
  }

  // 边框/底图组件默认在底层
  if (isBorderOrDecoration(comp.type)) {
    return 0
  }

  // 其他组件默认在内容层
  return 1
}

// 获取组件显示名称
const getComponentDisplayName = (comp) => {
  const chart = getChartByType(comp.type)
  return chart?.name || comp.type
}

// 计算组件内容区域的宽度（减去padding和border）
const getContentWidth = (comp) => {
  let width = comp.w
  // 减去左右padding
  const paddingH = comp.paddingHorizontal ?? (/^(border|decoration|bgbox)-/.test(comp.type) ? 0 : 8)
  width -= paddingH * 2
  // 减去左右border
  if (comp.showBorder && comp.borderWidth) {
    width -= comp.borderWidth * 2
  }
  return Math.max(0, width)
}

// 计算组件内容区域的高度（减去padding和border）
const getContentHeight = (comp) => {
  let height = comp.h
  // 减去上下padding
  const paddingV = comp.paddingVertical ?? (/^(border|decoration|bgbox)-/.test(comp.type) ? 0 : 8)
  height -= paddingV * 2
  // 减去上下border
  if (comp.showBorder && comp.borderWidth) {
    height -= comp.borderWidth * 2
  }
  return Math.max(0, height)
}

// 面板切换
const switchTab = (tabName) => {
  if (tabName === currentTab.value) {
    togglePanel()
    return
  }
  currentTab.value = tabName
  if (!isPanelOpen.value) isPanelOpen.value = true
}

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
}

// 初始化图表预览
const initChartPreviews = () => {
  chartCategories.forEach(category => {
    category.charts.forEach(chart => {
      const el = chartPreviewRefs[chart.type]
      if (!el) return

      const myChart = echarts.init(el)
      const option = getChartPreviewOption(chart.type, chart)
      myChart.setOption(option)
    })
  })
}

const handleDragStart = (event, chart) => {
  event.dataTransfer.setData('chartType', chart.type)
  event.dataTransfer.effectAllowed = 'copy'
}

// 根据框选范围更新选中的组件
const updateSelectionFromBox = () => {
  const minX = Math.min(selectionBox.startX, selectionBox.currentX)
  const maxX = Math.max(selectionBox.startX, selectionBox.currentX)
  const minY = Math.min(selectionBox.startY, selectionBox.currentY)
  const maxY = Math.max(selectionBox.startY, selectionBox.currentY)

  const selectedIds = canvasComponents.value
    .filter(comp => {
      // 判断组件是否与框选区域相交
      const compRight = comp.x + comp.w
      const compBottom = comp.y + comp.h

      return !(comp.x > maxX || compRight < minX || comp.y > maxY || compBottom < minY)
    })
    .map(comp => comp.id)

  selectedComponentIds.value = selectedIds
}

// 滚轮缩放和滚动处理
const handleCanvasWheel = (e) => {
  e.preventDefault()

  // Shift + 滚轮 = 左右滚动
  if (e.shiftKey) {
    const scrollAmount = e.deltaY
    canvasPanX.value -= scrollAmount
    return
  }

  // Ctrl/Cmd + 滚轮 = 缩放
  if (e.ctrlKey || e.metaKey) {
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    const newScale = Math.max(0.1, Math.min(3, canvasScale.value + delta))

    // 以鼠标位置为中心缩放
    if (canvasViewport.value) {
      const rect = canvasViewport.value.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // 计算缩放前鼠标在画布上的位置
      const canvasX = (mouseX - canvasPanX.value) / canvasScale.value
      const canvasY = (mouseY - canvasPanY.value) / canvasScale.value

      // 更新缩放
      canvasScale.value = newScale

      // 调整平移位置，使鼠标位置保持不变
      canvasPanX.value = mouseX - canvasX * newScale
      canvasPanY.value = mouseY - canvasY * newScale
    } else {
      canvasScale.value = newScale
    }
    return
  }

  // 普通滚轮 = 上下滚动
  canvasPanY.value -= e.deltaY

  // 如果有横向滚动值（触控板），也处理横向滚动
  if (e.deltaX) {
    canvasPanX.value -= e.deltaX
  }

  // 更新标尺
  drawRulers()
}

// 标尺绘制函数
const drawRuler = (canvas, type = 'horizontal') => {
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const parent = canvas.parentElement
  if (!parent) return

  const rect = parent.getBoundingClientRect()
  const width = rect.width
  const height = rect.height

  // 设置canvas尺寸（考虑高分屏）
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.width = width * dpr
  canvas.height = height * dpr
  ctx.scale(dpr, dpr)

  // 清空画布
  ctx.fillStyle = '#18181c'
  ctx.fillRect(0, 0, width, height)

  // 标尺配置
  const config = {
    tickMajor: '#666666',
    tickMinor: '#333333',
    text: '#888888',
    active: '#409eff',
    fontSize: 9,
    step: 10,
    segment: 50
  }

  const scale = canvasScale.value
  const offset = type === 'horizontal' ? canvasPanX.value : canvasPanY.value
  const startValue = -offset / scale
  const endValue = startValue + (type === 'horizontal' ? width : height) / scale
  const startTick = Math.floor(startValue / config.step) * config.step

  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.font = `${config.fontSize}px Inter, sans-serif`

  for (let val = startTick; val <= endValue; val += config.step) {
    const pos = (val * scale) + offset
    const pixelPos = Math.floor(pos) + 0.5
    const isMajor = val % config.segment === 0

    if (type === 'horizontal') {
      const tickHeight = isMajor ? 6 : 4
      ctx.strokeStyle = isMajor ? config.tickMajor : config.tickMinor
      ctx.moveTo(pixelPos, height)
      ctx.lineTo(pixelPos, height - tickHeight)

      if (isMajor) {
        ctx.fillStyle = config.text
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.fillText(val.toString(), pixelPos + 2, 2)
        ctx.stroke()
        ctx.beginPath()
      }
    } else {
      const tickWidth = isMajor ? 6 : 4
      ctx.strokeStyle = isMajor ? config.tickMajor : config.tickMinor
      ctx.moveTo(width, pixelPos)
      ctx.lineTo(width - tickWidth, pixelPos)

      if (isMajor) {
        ctx.save()
        ctx.translate(2, pixelPos + 2)
        ctx.rotate(-90 * Math.PI / 180)
        ctx.fillStyle = config.text
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.fillText(val.toString(), -12, 0)
        ctx.restore()
        ctx.stroke()
        ctx.beginPath()
      }
    }
  }
  ctx.stroke()

  // 绘制鼠标游标
  const cursorPos = type === 'horizontal' ? mousePos.x : mousePos.y
  if (cursorPos > 0) {
    ctx.beginPath()
    ctx.strokeStyle = config.active
    ctx.fillStyle = config.active

    if (type === 'horizontal') {
      ctx.moveTo(cursorPos, 0)
      ctx.lineTo(cursorPos, height)
      ctx.moveTo(cursorPos - 3, 0)
      ctx.lineTo(cursorPos + 3, 0)
      ctx.lineTo(cursorPos, 4)
    } else {
      ctx.moveTo(0, cursorPos)
      ctx.lineTo(width, cursorPos)
      ctx.moveTo(0, cursorPos - 3)
      ctx.lineTo(0, cursorPos + 3)
      ctx.lineTo(4, cursorPos)
    }
    ctx.stroke()
    ctx.fill()
  }
}

const drawRulers = () => {
  if (rulerH.value) drawRuler(rulerH.value, 'horizontal')
  if (rulerV.value) drawRuler(rulerV.value, 'vertical')
}

// 鼠标移动事件处理
// 使用 requestAnimationFrame 优化性能
let rafId = null

const handleCanvasMouseMove = (e) => {
  if (!canvasViewport.value) return

  const rect = canvasViewport.value.getBoundingClientRect()
  mousePos.x = e.clientX - rect.left
  mousePos.y = e.clientY - rect.top

  // 取消之前的动画帧
  if (rafId) {
    cancelAnimationFrame(rafId)
  }

  // 使用 requestAnimationFrame 批处理更新
  rafId = requestAnimationFrame(() => {
    updateCrosshair()
    drawRulers()
  })
}

const updateCrosshair = () => {
  // 计算逻辑坐标（画布内部坐标系）
  logicalPos.x = Math.round((mousePos.x - canvasPanX.value) / canvasScale.value)
  logicalPos.y = Math.round((mousePos.y - canvasPanY.value) / canvasScale.value)

  // 更新游标线位置 (使用 transform 性能更好)
  if (guideH.value) {
    guideH.value.style.opacity = '1'
    guideH.value.style.transform = `translateY(${mousePos.y}px)`

    // 边界检测 - 接近画布边缘时变红
    if (Math.abs(logicalPos.y) < 5 || Math.abs(logicalPos.y - 1080) < 5) {
      guideH.value.style.borderTopColor = 'rgba(255, 71, 87, 0.6)'
      guideH.value.style.filter = 'drop-shadow(0 0 4px rgba(255, 71, 87, 0.5))'
    } else {
      guideH.value.style.borderTopColor = 'rgba(64, 158, 255, 0.6)'
      guideH.value.style.filter = 'drop-shadow(0 0 4px rgba(64, 158, 255, 0.5))'
    }
  }

  if (guideV.value) {
    guideV.value.style.opacity = '1'
    guideV.value.style.transform = `translateX(${mousePos.x}px)`

    // 边界检测
    if (Math.abs(logicalPos.x) < 5 || Math.abs(logicalPos.x - 1920) < 5) {
      guideV.value.style.borderLeftColor = 'rgba(255, 71, 87, 0.6)'
      guideV.value.style.filter = 'drop-shadow(0 0 4px rgba(255, 71, 87, 0.5))'
    } else {
      guideV.value.style.borderLeftColor = 'rgba(64, 158, 255, 0.6)'
      guideV.value.style.filter = 'drop-shadow(0 0 4px rgba(64, 158, 255, 0.5))'
    }
  }

  // 更新坐标标签
  if (labelX.value) {
    labelX.value.textContent = logicalPos.x
  }
  if (labelY.value) {
    labelY.value.textContent = logicalPos.y
  }

  // 更新HUD显示
  if (hudX.value) {
    hudX.value.textContent = logicalPos.x
  }
  if (hudY.value) {
    hudY.value.textContent = logicalPos.y
  }
  if (cursorHud.value) {
    cursorHud.value.style.transform = `translate(${mousePos.x + 15}px, ${mousePos.y + 15}px)`
    cursorHud.value.style.opacity = '1'
  }
}

const handleCanvasMouseLeave = () => {
  mousePos.x = -1
  mousePos.y = -1

  // 隐藏十字线和HUD
  if (guideH.value) guideH.value.style.opacity = '0'
  if (guideV.value) guideV.value.style.opacity = '0'
  if (cursorHud.value) cursorHud.value.style.opacity = '0'

  // 取消未完成的动画帧
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }

  drawRulers()
}

// 缩放控制
const zoomIn = () => {
  if (canvasScale.value < 3) {
    canvasScale.value = Math.min(3, canvasScale.value + 0.1)
    drawRulers()
  }
}

const zoomOut = () => {
  if (canvasScale.value > 0.1) {
    canvasScale.value = Math.max(0.1, canvasScale.value - 0.1)
    drawRulers()
  }
}

const zoomSet = (scale) => {
  const clamped = Math.min(4, Math.max(0.1, scale))
  canvasScale.value = clamped
  drawRulers()
}

const zoomReset = () => {
  canvasScale.value = 1  // 重置为 100%
  canvasPanX.value = 20  // 左侧预留 20px 间距
  canvasPanY.value = 20  // 顶部预留 20px 间距
  drawRulers()
}

const resetZoom = () => {
  canvasScale.value = 1
  canvasPanX.value = 0
  canvasPanY.value = 0
  drawRulers()
}

const fitToScreen = () => {
  if (canvasViewport.value) {
    const rect = canvasViewport.value.getBoundingClientRect()
    const scaleX = rect.width / 1920
    const scaleY = rect.height / 1080
    canvasScale.value = Math.min(scaleX, scaleY) * 0.9

    // 居中显示
    canvasPanX.value = (rect.width - 1920 * canvasScale.value) / 2
    canvasPanY.value = (rect.height - 1080 * canvasScale.value) / 2
    drawRulers()
  }
}

// 从项目数据对象恢复画布状态
const restoreProjectData = (projectData) => {
  projectName.value = projectData.name || projectData.title || '未命名大屏项目'
  canvasComponents.value = projectData.components || []
  if (projectData.screenBackground) pageConfig.backgroundColor = projectData.screenBackground
  if (projectData.screenBackgroundImage) pageConfig.backgroundImage = projectData.screenBackgroundImage
  if (projectData.canvasWidth) pageConfig.width = projectData.canvasWidth
  if (projectData.canvasHeight) pageConfig.height = projectData.canvasHeight
  canvasScale.value = projectData.canvasScale || 0.4
  canvasPanX.value = projectData.canvasPanX || 0
  canvasPanY.value = projectData.canvasPanY || 0
  selectedComponentIds.value = []
}

// 加载项目
const loadProject = async () => {
  const projectId = route.params.id

  try {
    const res = await getProjectDetail(projectId)
    const project = res?.data || res
    if (project) {
      // config 字段存放画布数据，title/name 存放项目名
      const canvasData = project.config || project
      restoreProjectData({ ...canvasData, name: project.title || project.name })
      showMessage.success('项目已加载')
      return true
    }
  } catch {
    // 后端不可用时降级到 localStorage
    const savedProjects = JSON.parse(localStorage.getItem('nocoviz_projects') || '{}')
    const projectData = savedProjects[projectId]
    if (projectData) {
      restoreProjectData(projectData)
      showMessage.success('项目已加载（本地）')
      return true
    }
  }

  // 新项目默认值
  projectName.value = '未命名大屏项目'
  canvasComponents.value = []
  selectedComponentIds.value = []
  return false
}

// 清空画布
const handleClearCanvas = () => {
  if (canvasComponents.value.length === 0) {
    showMessage.warning('画布中没有组件')
    return
  }

  const hasSelection = selectedComponentIds.value.length > 0

  // 如果有选中的组件，显示选择菜单
  if (hasSelection) {
    Modal.confirm({
      title: '删除组件',
      content: h('div', { style: 'padding: 10px 0;' }, [
        h('p', { style: 'margin-bottom: 15px; font-size: 14px; color: #333;' },
          `当前已选中 ${selectedComponentIds.value.length} 个组件，画布共有 ${canvasComponents.value.length} 个组件。`
        ),
        h('p', { style: 'font-size: 13px; color: #666;' }, '确定要删除选中的组件吗？此操作不可撤销。')
      ]),
      okText: `删除选中 (${selectedComponentIds.value.length}个)`,
      cancelText: '取消',
      okType: 'danger',
      okButtonProps: {
        style: {
          backgroundColor: '#ff4757',
          borderColor: '#ff4757',
          color: '#fff',
          fontWeight: '500'
        }
      },
      onOk: () => {
        const count = selectedComponentIds.value.length
        const idsToRemove = [...selectedComponentIds.value]
        canvasComponents.value = canvasComponents.value.filter(
          c => !idsToRemove.includes(c.id)
        )
        selectedComponentIds.value = []
        showMessage.success(`已删除选中的 ${count} 个组件`)
      }
    })
  } else {
    // 没有选中组件，直接清空所有
    Modal.confirm({
      title: '清空画布',
      content: h('div', { style: 'padding: 10px 0;' }, [
        h('p', { style: 'margin-bottom: 15px; font-size: 14px; color: #333;' },
          `确定要清空画布吗？这将删除所有 ${canvasComponents.value.length} 个组件。`
        ),
        h('p', { style: 'font-size: 13px; color: #ff4757; font-weight: 500;' }, '此操作不可撤销！')
      ]),
      okText: '确定清空',
      cancelText: '取消',
      okType: 'danger',
      okButtonProps: {
        style: {
          backgroundColor: '#ff4757',
          borderColor: '#ff4757',
          color: '#fff',
          fontWeight: '500'
        }
      },
      onOk: () => {
        canvasComponents.value = []
        selectedComponentIds.value = []
        showMessage.success('画布已清空')
      }
    })
  }
}

// 自动保存
let autoSaveTimer = null
const enableAutoSave = () => {
  // 每30秒自动保存一次
  autoSaveTimer = setInterval(() => {
    if (canvasComponents.value.length > 0) {
      handleSave()
    }
  }, 30000)
}

// 组件挂载时加载项目
onMounted(async () => {
  const isExistingProject = await loadProject()

  registerKeyboardEvents()
  enableAutoSave()

  // 初始化画布和标尺
  setTimeout(() => {
    // 默认使用自适应屏幕布局
    fitToScreen()
    drawRulers()

    // 监听窗口大小变化，使用防抖优化性能
    let resizeTimer = null
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        fitToScreen()
        drawRulers()
      }, 300)
    }
    window.addEventListener('resize', handleResize)
  }, 100)
})

onUnmounted(() => {
  unregisterKeyboardEvents()
  window.removeEventListener('resize', drawRulers)
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
})

const handlePreview = () => {
  // 先保存项目
  handleSave()

  // 打开预览窗口
  const projectId = route.params.id
  const previewUrl = `${window.location.origin}${window.location.pathname}#/preview/${projectId}`
  window.open(previewUrl, '_blank')
}

// 智能网格布局
const handleAutoLayout = () => {
  if (canvasComponents.value.length === 0) {
    ElMessage.warning('画布中没有组件')
    return
  }

  const gridType = gridConfig.type
  let rows = 3
  let cols = 3
  switch (gridType) {
    case '4x4': rows = 4; cols = 4; break
    case '5x5': rows = 5; cols = 5; break
    default:    rows = 3; cols = 3
  }

  const canvasWidth = pageConfig.width
  const canvasHeight = pageConfig.height
  const gap = 8

  const cellWidth = Math.round((canvasWidth - gap * (cols + 1)) / cols)
  const cellHeight = Math.round((canvasHeight - gap * (rows + 1)) / rows)

  // 根据组件左上角坐标判断所在格子，将其对齐到该格子
  canvasComponents.value.forEach(comp => {
    // 组件中心点所在格子
    const centerX = comp.x + comp.w / 2
    const centerY = comp.y + comp.h / 2

    const col = Math.max(0, Math.min(Math.floor(centerX / (canvasWidth / cols)), cols - 1))
    const row = Math.max(0, Math.min(Math.floor(centerY / (canvasHeight / rows)), rows - 1))

    // 对齐到格子，保持间距 8px
    comp.x = Math.round(gap + col * (cellWidth + gap))
    comp.y = Math.round(gap + row * (cellHeight + gap))
    comp.w = cellWidth
    comp.h = cellHeight
  })

  addHistory(canvasComponents.value)
  ElMessage.success(`已按 ${gridType} 网格对齐 ${canvasComponents.value.length} 个组件`)
}

// 右侧配置面板方法
const toggleGroup = (groupKey) => {
  openGroups[groupKey] = !openGroups[groupKey]
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(String(text))
    showMessage.success('已复制到剪贴板')
  } catch (err) {
    showMessage.error('复制失败')
  }
}

const openMockEditor = () => {
  showMockEditor.value = true
}

const handleMockDataSave = (data) => {
  currentMockData.value = data
  showMessage.success('Mock 数据已保存')
}

</script>

<style src="./ScreenEditor.css"></style>