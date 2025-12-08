<template>
  <div class="screen-editor">
    <!-- 1. 一级侧边栏 (Activity Bar) -->
    <aside class="activity-bar">
      <div class="nav-group">
        <div 
          :class="['nav-item', { active: currentTab === 'components' }]" 
          @click="switchTab('components')" 
          title="组件库"
        >
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z" fill="currentColor"></path></svg>
        </div>
        <div 
          :class="['nav-item', { active: currentTab === 'layers' }]" 
          @click="switchTab('layers')" 
          title="图层管理"
        >
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" fill="currentColor"></path></svg>
        </div>
        <div 
          :class="['nav-item', { active: currentTab === 'assets' }]" 
          @click="switchTab('assets')" 
          title="资源中心"
        >
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"></path></svg>
        </div>
      </div>

      <div class="nav-group">
        <div class="nav-item" @click="$router.back()" title="退出编辑器">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </div>
        <div class="nav-item" @click="togglePanel" title="收起/展开">
          <svg class="nav-icon" :style="{ transform: isPanelOpen ? 'rotate(0deg)' : 'rotate(180deg)' }" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"></path></svg>
        </div>
      </div>
    </aside>

    <!-- 2. 二级功能面板 (Left Side Panel) -->
    <aside :class="['side-panel', { collapsed: !isPanelOpen }]">
      <div class="panel-content-wrapper">
        
        <!-- Panel A: 组件库 -->
        <div v-if="currentTab === 'components'" class="panel-view">
          <div class="panel-header">
            <span>组件列表</span>
            <svg style="width:16px;height:16px;cursor:pointer" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></svg>
          </div>
          <div class="search-box">
            <input type="text" class="panel-search-input" placeholder="搜索图表...">
          </div>
          <div class="panel-body">
            <div :class="['category-block', { closed: isChartsClosed }]">
              <div class="category-title" @click="isChartsClosed = !isChartsClosed">
                <svg class="caret" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"></path></svg>
                图表 / Charts
              </div>
              <div class="comp-grid">
                <div class="comp-item" draggable="true" @dragstart="handleDragStart($event, 'bar')">
                  <div class="thumb-box"><div class="icon-bar"><i style="height:12px;opacity:0.5"></i><i style="height:18px"></i><i style="height:10px;opacity:0.7"></i></div></div>
                  <span class="comp-name">基础柱状图</span>
                </div>
                <div class="comp-item" draggable="true" @dragstart="handleDragStart($event, 'line')">
                  <div class="thumb-box"><div class="icon-line"></div></div>
                  <span class="comp-name">折线图</span>
                </div>
                <div class="comp-item" draggable="true" @dragstart="handleDragStart($event, 'pie')">
                  <div class="thumb-box"><div class="icon-pie"></div></div>
                  <span class="comp-name">基础饼图</span>
                </div>
                <div class="comp-item" draggable="true" @dragstart="handleDragStart($event, 'liquid')">
                  <div class="thumb-box"><span style="color:#a855f7;font-weight:bold">%</span></div>
                  <span class="comp-name">水波图</span>
                </div>
              </div>
            </div>
            
            <div :class="['category-block', { closed: isInfoClosed }]">
              <div class="category-title" @click="isInfoClosed = !isInfoClosed">
                <svg class="caret" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"></path></svg>
                信息 / Info
              </div>
              <div class="comp-grid">
                <div class="comp-item" draggable="true" @dragstart="handleDragStart($event, 'text')">
                  <div class="thumb-box"><span style="font-size:18px;font-weight:bold;color:#fff">T</span></div>
                  <span class="comp-name">通用标题</span>
                </div>
                <div class="comp-item" draggable="true" @dragstart="handleDragStart($event, 'number')">
                  <div class="thumb-box"><div style="display:flex;gap:2px"><span style="background:#444;padding:2px">1</span><span style="background:#444;padding:2px">2</span></div></div>
                  <span class="comp-name">翻牌器</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel B: 图层管理 -->
        <div v-if="currentTab === 'layers'" class="panel-view flex-col">
          <div class="panel-header">
            <span>图层管理 ({{ canvasComponents.length }})</span>
            <svg style="width:16px;height:16px;cursor:pointer" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
          </div>
          <div class="panel-body" style="padding: 8px 0;">
            <div 
              v-for="comp in canvasComponents.slice().reverse()" 
              :key="comp.id"
              :class="['layer-item', { selected: selectedComponentId === comp.id }]"
              @click="selectComponent(comp.id)"
            >
              <svg class="layer-icon" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2"></path></svg>
              {{ comp.name }}
              <div class="layer-actions">
                <svg class="action-mini" viewBox="0 0 24 24" fill="currentColor" @click.stop="deleteComponent(comp.id)"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
              </div>
            </div>
            <div v-if="canvasComponents.length === 0" style="padding: 20px; text-align: center; color: #666;">暂无图层</div>
          </div>
        </div>

        <!-- Panel C: 资源中心 -->
        <div v-if="currentTab === 'assets'" class="panel-view center-flex">
          <div style="text-align:center">
            <svg style="width:40px;height:40px;margin-bottom:10px;opacity:0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></svg>
            <div>暂无上传素材</div>
          </div>
        </div>

      </div>
    </aside>

    <!-- 3. 画布区域 (Center Canvas) -->
    <main class="canvas-area" @drop="handleDrop" @dragover.prevent @click.self="deselectComponent">
      <div class="screen-container" style="position: relative;">
        <div v-if="canvasComponents.length === 0" class="screen-watermark">NocoViz Canvas</div>
        
        <!-- Rendered Components -->
        <div
          v-for="comp in canvasComponents"
          :key="comp.id"
          class="canvas-component"
          :class="{ selected: selectedComponentId === comp.id }"
          :style="{ 
            left: comp.x + 'px', 
            top: comp.y + 'px', 
            width: comp.w + 'px', 
            height: comp.h + 'px',
            backgroundColor: comp.bgColor
          }"
          @click.stop="selectComponent(comp.id)"
          @mousedown="startDrag($event, comp)"
        >
          <div class="comp-content">{{ comp.name }}</div>
          <!-- Resize handles (mock) -->
          <div v-if="selectedComponentId === comp.id" class="resize-handle"></div>
        </div>
      </div>
    </main>

    <!-- 4. 右侧配置面板 (Right Config Panel) -->
    <aside class="config-panel" v-if="selectedComponent">
      <div class="panel-header">属性配置</div>
      <div class="config-body">
        <div class="config-group">
          <label>名称</label>
          <input type="text" class="config-input" v-model="selectedComponent.name">
        </div>
        <div class="config-group">
          <label>位置 X</label>
          <input type="number" class="config-input" v-model.number="selectedComponent.x">
        </div>
        <div class="config-group">
          <label>位置 Y</label>
          <input type="number" class="config-input" v-model.number="selectedComponent.y">
        </div>
        <div class="config-group">
          <label>宽度 W</label>
          <input type="number" class="config-input" v-model.number="selectedComponent.w">
        </div>
        <div class="config-group">
          <label>高度 H</label>
          <input type="number" class="config-input" v-model.number="selectedComponent.h">
        </div>
        <div class="config-group">
          <label>背景色</label>
          <input type="color" class="config-input" v-model="selectedComponent.bgColor">
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const currentTab = ref('components')
const isPanelOpen = ref(true)
const isChartsClosed = ref(false)
const isInfoClosed = ref(false)

// Canvas State
const canvasComponents = ref([])
const selectedComponentId = ref(null)

const selectedComponent = computed(() => {
  return canvasComponents.value.find(c => c.id === selectedComponentId.value)
})

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

const handleDragStart = (event, type) => {
  event.dataTransfer.setData('componentType', type)
}

const handleDrop = (event) => {
  const type = event.dataTransfer.getData('componentType')
  if (type) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left - 480 // Approximate center offset or relative to screen container
    const y = event.clientY - rect.top - 270

    // Add new component
    const newComp = {
      id: Date.now(),
      type,
      name: getComponentName(type),
      x: Math.max(0, event.offsetX), // Simplification: use offsetX relative to drop target
      y: Math.max(0, event.offsetY),
      w: 200,
      h: 150,
      bgColor: '#2b2b30'
    }
    
    // Adjust coordinates to be relative to the screen container if dropped directly on it
    // Since we have @drop on .canvas-area, we need to check target.
    // For this prototype, we'll just place it somewhat intelligently.
    if (event.target.classList.contains('screen-container')) {
        newComp.x = event.offsetX - 100
        newComp.y = event.offsetY - 75
    } else {
        // Dropped on canvas area outside screen, default to center
        newComp.x = 380
        newComp.y = 200
    }

    canvasComponents.value.push(newComp)
    selectComponent(newComp.id)
    ElMessage.success(`Added ${newComp.name}`)
  }
}

const getComponentName = (type) => {
  const map = {
    bar: '基础柱状图',
    line: '折线图',
    pie: '基础饼图',
    liquid: '水波图',
    text: '通用标题',
    number: '翻牌器'
  }
  return map[type] || '未知组件'
}

const selectComponent = (id) => {
  selectedComponentId.value = id
}

const deselectComponent = () => {
  selectedComponentId.value = null
}

const deleteComponent = (id) => {
  canvasComponents.value = canvasComponents.value.filter(c => c.id !== id)
  if (selectedComponentId.value === id) selectedComponentId.value = null
}

// Basic Dragging Logic on Canvas
const startDrag = (event, comp) => {
  const startX = event.clientX
  const startY = event.clientY
  const startLeft = comp.x
  const startTop = comp.y

  const onMouseMove = (e) => {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    comp.x = startLeft + dx
    comp.y = startTop + dy
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
</script>

<style scoped>
/* ... (Previous styles remain, appending new ones) ... */
.screen-editor {
  --bg-activity-bar: #18181c;
  --bg-side-panel: #1f1f23;
  --bg-canvas: #0b0c0e;
  --bg-item: #2b2b30;
  --bg-item-hover: #36363c;
  --border-color: #303035;
  --accent-color: #3b82f6;
  --accent-bg: rgba(59, 130, 246, 0.15);
  --text-main: #e5e5e5;
  --text-muted: #909099;
  --panel-width: 280px;
  --activity-width: 50px;

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--bg-canvas);
  color: var(--text-main);
  height: 100vh;
  overflow: hidden;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

* { box-sizing: border-box; outline: none; user-select: none; }

/* Activity Bar & Side Panel Styles (Same as before) */
.activity-bar {
  width: var(--activity-width);
  min-width: var(--activity-width);
  background-color: var(--bg-activity-bar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 20;
  padding: 10px 0;
}
.nav-group { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.nav-item {
  width: 42px; height: 42px; display: flex; justify-content: center; align-items: center;
  cursor: pointer; color: var(--text-muted); border-radius: 4px; transition: all 0.2s; position: relative;
}
.nav-item:hover { color: var(--text-main); }
.nav-item.active { color: var(--text-main); }
.nav-item.active::before {
  content: ''; position: absolute; left: 0; top: 10px; bottom: 10px; width: 3px;
  background: var(--accent-color); border-radius: 0 2px 2px 0;
}
.nav-icon { width: 22px; height: 22px; fill: currentColor; transition: transform 0.3s; }

.side-panel {
  width: var(--panel-width); background-color: var(--bg-side-panel); border-right: 1px solid var(--border-color);
  display: flex; flex-direction: column; transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden; position: relative;
}
.side-panel.collapsed { width: 0; border-right: none; }
.panel-content-wrapper { min-width: var(--panel-width); height: 100%; display: flex; flex-direction: column; }
.panel-header {
  height: 44px; min-height: 44px; border-bottom: 1px solid var(--border-color); display: flex;
  align-items: center; justify-content: space-between; padding: 0 16px; font-size: 13px; font-weight: 600;
  letter-spacing: 0.5px; color: var(--text-muted); text-transform: uppercase;
}
.search-box { padding: 12px; border-bottom: 1px solid var(--border-color); }
.panel-search-input {
  width: 100%; background: #121214; border: 1px solid var(--border-color); border-radius: 4px;
  padding: 6px 10px; color: var(--text-main); font-size: 12px; outline: none;
}
.panel-search-input:focus { border-color: var(--accent-color); }
.panel-body { flex: 1; overflow-y: auto; }
.panel-view { height: 100%; display: flex; flex-direction: column; }
.flex-col { flex-direction: column; }
.center-flex { justify-content: center; align-items: center; color: #666; font-size: 12px; }

.category-block { padding: 0 12px 16px 12px; }
.category-title { padding: 12px 4px 8px 4px; font-size: 12px; color: var(--text-muted); font-weight: bold; display: flex; align-items: center; cursor: pointer; }
.category-title:hover { color: var(--text-main); }
.caret { width: 10px; height: 10px; margin-right: 6px; transition: 0.2s; }
.category-block.closed .caret { transform: rotate(-90deg); }
.category-block.closed .comp-grid { display: none; }
.comp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.comp-item {
  background: var(--bg-item); border: 1px solid transparent; border-radius: 4px; padding: 10px;
  display: flex; flex-direction: column; align-items: center; cursor: grab; transition: all 0.2s;
}
.comp-item:hover { background: var(--bg-item-hover); border-color: #555; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.thumb-box { width: 100%; height: 50px; background: rgba(255,255,255,0.03); margin-bottom: 8px; border-radius: 2px; display: flex; justify-content: center; align-items: center; }
.comp-name { font-size: 12px; color: #ccc; }
.icon-bar { display: flex; align-items: flex-end; gap: 2px; height: 20px; }
.icon-bar i { width: 6px; background: var(--accent-color); border-radius: 1px 1px 0 0; }
.icon-line { width: 30px; height: 2px; background: #22c55e; transform: rotate(-15deg); }
.icon-pie { width: 20px; height: 20px; border-radius: 50%; border: 3px solid #eab308; border-right-color: transparent; }

.layer-item {
  display: flex; align-items: center; height: 32px; padding: 0 12px; font-size: 13px;
  color: var(--text-muted); border-left: 2px solid transparent; cursor: pointer;
}
.layer-item:hover { background: rgba(255,255,255,0.04); color: var(--text-main); }
.layer-item.selected { background: var(--accent-bg); color: var(--text-main); border-left-color: var(--accent-color); }
.layer-icon { width: 14px; height: 14px; margin-right: 8px; opacity: 0.7; }
.layer-actions { margin-left: auto; display: flex; gap: 8px; opacity: 0; }
.layer-item:hover .layer-actions { opacity: 1; }
.action-mini { width: 14px; height: 14px; cursor: pointer; }
.action-mini:hover { color: var(--accent-color); }

/* Canvas */
.canvas-area {
  flex: 1;
  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 20px 20px; background-position: -1px -1px;
  display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden;
}
.screen-container {
  width: 960px; height: 540px; background: #000; box-shadow: 0 0 100px rgba(0,0,0,0.8);
  border: 1px solid #333; position: relative;
}
.screen-watermark {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  font-size: 24px; font-weight: bold; letter-spacing: 2px; opacity: 0.3; color: #444; pointer-events: none;
}

/* Rendered Components on Canvas */
.canvas-component {
  position: absolute;
  border: 1px solid transparent;
  cursor: move;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  overflow: hidden;
}
.canvas-component.selected {
  border-color: var(--accent-color);
  z-index: 10;
}
.comp-content { pointer-events: none; }

/* Right Config Panel */
.config-panel {
  width: 240px;
  background: var(--bg-side-panel);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 20;
}
.config-body { padding: 16px; }
.config-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px; }
.config-group label { font-size: 12px; color: var(--text-muted); }
.config-input {
  background: #121214; border: 1px solid var(--border-color); color: #fff;
  padding: 6px; border-radius: 4px; font-size: 12px; width: 100%;
}
.config-input:focus { border-color: var(--accent-color); }
</style>