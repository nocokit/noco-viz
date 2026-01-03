<!--
  重构后的 ScreenEditor 主入口文件
  使用组件化架构和 Composables
-->
<template>
  <div class="screen-editor">
    <!-- 顶部导航栏 -->
    <EditorHeader
      :project-name="projectName"
      :last-saved="lastSaved"
      :can-undo="canUndo"
      :can-redo="canRedo"
      :selected-count="selectedComponentIds.length"
      :scale="canvasScale"
      @back="handleBackToHome"
      @undo="handleUndo"
      @redo="handleRedo"
      @align="handleAlign"
      @layer="handleLayer"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @zoom-fit="handleFitToScreen"
      @zoom-reset="resetZoom"
      @preview="handlePreview"
      @save="handleSave"
    />

    <div class="main-container">
      <!-- 左侧边栏 -->
      <SidebarContainer :width="280">
        <template #components>
          <ComponentLibrary />
        </template>
        <template #layers>
          <div class="placeholder">图层面板</div>
        </template>
        <template #assets>
          <div class="placeholder">资源面板</div>
        </template>
      </SidebarContainer>

      <!-- 画布区域 -->
      <EditorCanvas
        ref="canvasRef"
        :canvas-width="1920"
        :canvas-height="1080"
        :scale="canvasScale"
        :pan-x="canvasPanX"
        :pan-y="canvasPanY"
        :is-panning="isPanning"
        :is-space-pressed="isSpacePressed"
        :show-ruler="true"
        :show-crosshair="true"
        @mousedown="handleCanvasMouseDown"
        @wheel="handleCanvasWheel"
      >
        <!-- 渲染组件 -->
        <CanvasComponent
          v-for="comp in canvasComponents"
          :key="comp.id"
          :component="comp"
          :is-selected="selectedComponentIds.includes(comp.id)"
          @click="handleComponentClick"
          @drag-start="handleComponentDragStart"
          @resize-start="handleComponentResizeStart"
        >
          <div class="component-content">{{ comp.name }}</div>
        </CanvasComponent>

        <!-- 框选工具 -->
        <SelectionBox
          :visible="isSelecting"
          :start-x="selectionBox.startX"
          :start-y="selectionBox.startY"
          :current-x="selectionBox.currentX"
          :current-y="selectionBox.currentY"
        />

        <!-- 对齐辅助线 -->
        <AlignmentLines
          :vertical-lines="alignmentLines.vertical"
          :horizontal-lines="alignmentLines.horizontal"
        />

        <!-- 多选包围盒 -->
        <MultiSelectBox
          :visible="multiSelectBox.visible"
          :x="multiSelectBox.x"
          :y="multiSelectBox.y"
          :width="multiSelectBox.width"
          :height="multiSelectBox.height"
        />
      </EditorCanvas>

      <!-- 右侧配置面板 -->
      <ConfigPanel
        v-if="selectedComponent"
        :title="'组件配置'"
        :component-name="selectedComponent.name"
        :width="320"
      >
        <template #style>
          <StyleTab
            :component="selectedComponent"
            @update="handleStyleUpdate"
          />
        </template>
        <template #data>
          <DataTab
            :component="selectedComponent"
            @update="handleDataUpdate"
          />
        </template>
        <template #event>
          <EventTab
            :component="selectedComponent"
            @update="handleEventUpdate"
          />
        </template>
      </ConfigPanel>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 导入组件
import EditorHeader from './components/header/EditorHeader.vue'
import SidebarContainer from './components/sidebar/SidebarContainer.vue'
import ComponentLibrary from './components/sidebar/ComponentLibrary.vue'
import EditorCanvas from './components/canvas/EditorCanvas.vue'
import CanvasComponent from './components/canvas/CanvasComponent.vue'
import SelectionBox from './components/canvas/SelectionBox.vue'
import AlignmentLines from './components/canvas/AlignmentLines.vue'
import MultiSelectBox from './components/canvas/MultiSelectBox.vue'
import ConfigPanel from './components/config-panel/ConfigPanel.vue'
import StyleTab from './components/config-panel/StyleTab.vue'
import DataTab from './components/config-panel/DataTab.vue'
import EventTab from './components/config-panel/EventTab.vue'

// 导入 Composables
import { useCanvasZoom } from './composables/useCanvasZoom'
import { useCanvasPan } from './composables/useCanvasPan'
import { useComponentSelection } from './composables/useComponentSelection'
import { useComponentDrag } from './composables/useComponentDrag'
import { useComponentAlign } from './composables/useComponentAlign'
import { useHistory } from './composables/useHistory'
import { useEditorShortcuts } from './composables/useEditorShortcuts'

// 导入样式
import './styles/variables.css'
import './styles/common.css'

const router = useRouter()

// ===== 项目信息 =====
const projectName = ref('未命名项目')
const lastSaved = ref('刚刚')

// ===== 数据状态 =====
const canvasComponents = ref([
  { id: 1, name: '柱状图', x: 100, y: 100, w: 400, h: 300, locked: false },
  { id: 2, name: '折线图', x: 550, y: 100, w: 400, h: 300, locked: false },
  { id: 3, name: '饼图', x: 1000, y: 100, w: 400, h: 300, locked: false }
])

const canvasRef = ref(null)

// ===== 使用 Composables =====

// 1. 画布缩放
const {
  canvasScale,
  zoomIn,
  zoomOut,
  resetZoom,
  fitToScreen,
  handleWheelZoom
} = useCanvasZoom({
  initialScale: 0.5,
  minScale: 0.1,
  maxScale: 3,
  canvasWidth: 1920,
  canvasHeight: 1080
})

// 2. 画布平移
const {
  canvasPanX,
  canvasPanY,
  isPanning,
  isSpacePressed,
  setPan,
  startPan,
  handleWheelPan
} = useCanvasPan()

// 3. 组件选择
const {
  selectedComponentIds,
  selectedComponent,
  selectedComponents,
  isSelecting,
  selectionBox,
  multiSelectBox,
  selectComponent,
  deselectComponent,
  updateMultiSelectBox,
  startSelection
} = useComponentSelection(canvasComponents)

// 4. 组件对齐
const {
  calculateAlignmentLines,
  clearAlignmentLines,
  alignSelectedComponents
} = useComponentAlign({ snapThreshold: 5 })

// 5. 组件拖拽
const {
  alignmentLines,
  startDrag,
  startResize
} = useComponentDrag({
  canvasScale,
  selectedComponents,
  updateMultiSelectBox,
  calculateAlignmentLines: (components, lines) =>
    calculateAlignmentLines(components, lines, canvasComponents.value),
  clearAlignmentLines
})

// 6. 历史记录
const {
  canUndo,
  canRedo,
  pushHistory,
  undo,
  redo,
  initHistory
} = useHistory({ maxHistorySize: 50 })

// 初始化历史记录
initHistory(canvasComponents.value)

// 7. 快捷键
const shortcuts = useEditorShortcuts({
  onSave: handleSave,
  onUndo: handleUndo,
  onRedo: handleRedo,
  onCopy: handleCopy,
  onPaste: handlePaste,
  onDuplicate: handleDuplicate,
  onDelete: handleDelete,
  onEscape: deselectComponent,
  onArrowKey: handleArrowKey,
  onSpaceDown: () => { isSpacePressed.value = true },
  onSpaceUp: () => { isSpacePressed.value = false }
})

shortcuts.register()

// ===== 事件处理函数 =====

const handleBackToHome = () => {
  router.push('/projects')
}

const handleUndo = () => {
  const state = undo()
  if (state) {
    canvasComponents.value = state
  }
}

const handleRedo = () => {
  const state = redo()
  if (state) {
    canvasComponents.value = state
  }
}

const handleAlign = (type) => {
  alignSelectedComponents(type, selectedComponents.value, updateMultiSelectBox)
  pushHistory(canvasComponents.value)
}

const handleLayer = (action) => {
  // 图层操作逻辑
  ElMessage.info(`图层操作: ${action}`)
}

const handleFitToScreen = () => {
  const rect = canvasRef.value?.getCanvasRect()
  if (rect) {
    fitToScreen(rect)
  }
}

const handlePreview = () => {
  ElMessage.info('预览功能')
}

const handleSave = () => {
  lastSaved.value = new Date().toLocaleTimeString()
  ElMessage.success('保存成功')
  pushHistory(canvasComponents.value)
}

const handleCopy = () => {
  // 复制逻辑
  ElMessage.success('已复制')
}

const handlePaste = () => {
  // 粘贴逻辑
  ElMessage.success('已粘贴')
}

const handleDuplicate = () => {
  // 快速复制逻辑
  ElMessage.success('已复制')
}

const handleDelete = () => {
  if (selectedComponentIds.value.length > 0) {
    canvasComponents.value = canvasComponents.value.filter(
      c => !selectedComponentIds.value.includes(c.id)
    )
    deselectComponent()
    pushHistory(canvasComponents.value)
    ElMessage.success('已删除')
  }
}

const handleArrowKey = (direction, step) => {
  if (selectedComponent.value) {
    switch (direction) {
      case 'up': selectedComponent.value.y -= step; break
      case 'down': selectedComponent.value.y += step; break
      case 'left': selectedComponent.value.x -= step; break
      case 'right': selectedComponent.value.x += step; break
    }
    updateMultiSelectBox()
  }
}

const handleCanvasMouseDown = (e) => {
  const panStarted = startPan(e, () => {})

  if (!panStarted && e.button === 0) {
    const rect = canvasRef.value?.getCanvasRect()
    if (rect) {
      const handlers = startSelection(
        e,
        rect,
        canvasPanX.value,
        canvasPanY.value,
        canvasScale.value
      )

      const onMove = (moveEvent) => handlers.onMove(moveEvent)
      const onUp = () => {
        handlers.onEnd()
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    }
  }
}

const handleCanvasWheel = (e) => {
  e.preventDefault()

  if (e.ctrlKey || e.metaKey) {
    const rect = canvasRef.value?.getCanvasRect()
    if (rect) {
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const newPan = handleWheelZoom(
        e,
        { x: mouseX, y: mouseY },
        { x: canvasPanX.value, y: canvasPanY.value }
      )

      setPan(newPan.x, newPan.y)
    }
    return
  }

  handleWheelPan(e)
}

const handleComponentClick = (event, comp) => {
  selectComponent(comp.id, event)
}

const handleComponentDragStart = (event, comp) => {
  startDrag(event, comp, isSpacePressed.value)
}

const handleComponentResizeStart = (event, comp, direction) => {
  startResize(event, comp, direction)
}

const handleStyleUpdate = (updates) => {
  Object.assign(selectedComponent.value, updates)
  updateMultiSelectBox()
  pushHistory(canvasComponents.value)
}

const handleDataUpdate = (updates) => {
  Object.assign(selectedComponent.value, updates)
  pushHistory(canvasComponents.value)
}

const handleEventUpdate = (updates) => {
  Object.assign(selectedComponent.value, updates)
  pushHistory(canvasComponents.value)
}
</script>

<style scoped>
@import './styles/variables.css';
@import './styles/common.css';

.component-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  background: rgba(64, 158, 255, 0.1);
}

.placeholder {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-quaternary);
  font-size: 13px;
}
</style>
