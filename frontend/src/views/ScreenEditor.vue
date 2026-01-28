<template>
  <div class="screen-editor">
    <!-- 顶部导航栏 Header - 重构版 -->
    <header class="editor-header">
      <!-- 左侧：导航与历史 -->
      <div class="header-left">
        <!-- 返回工作台 -->
        <button class="home-btn" @click="handleBackToHome" title="返回工作台">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <div class="divider-v"></div>

        <!-- 撤销重做 -->
        <div class="history-controls">
          <button class="icon-btn" :class="{ disabled: !canUndo }" @click="handleUndo" title="撤销 (Ctrl+Z)">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-9 9"/>
            </svg>
          </button>
          <button class="icon-btn" :class="{ disabled: !canRedo }" @click="handleRedo" title="重做 (Ctrl+Y)">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 7v6h-6M3 17a9 9 0 0 1 9-9 9 9 0 0 1 9 9"/>
            </svg>
          </button>
        </div>

        <div class="divider-v"></div>

        <!-- 项目名称 -->
        <div class="project-info">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="color: var(--primary)">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
          <input
            type="text"
            class="project-title"
            v-model="projectName"
            placeholder="未命名大屏项目"
            @blur="handleSave"
          />
          <span class="status-badge">草稿</span>
        </div>
      </div>

      <!-- 中间：对齐工具和状态指示 -->
      <div class="header-center">
        <!-- 复制粘贴工具 -->
        <div class="edit-controls">
          <!-- 复制 -->
          <button
            class="icon-btn"
            :class="{ disabled: selectedComponentIds.length === 0 }"
            @click="handleCopy"
            title="复制 (Ctrl+C)"
            :disabled="selectedComponentIds.length === 0"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
          <!-- 粘贴 -->
          <button
            class="icon-btn"
            :class="{ disabled: !copiedComponent }"
            @click="handlePaste"
            title="粘贴 (Ctrl+V)"
            :disabled="!copiedComponent"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>
            </svg>
          </button>
          <!-- 快速复制 -->
          <button
            class="icon-btn"
            :class="{ disabled: selectedComponentIds.length === 0 }"
            @click="handleDuplicate"
            title="快速复制 (Ctrl+D)"
            :disabled="selectedComponentIds.length === 0"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z"/>
            </svg>
          </button>
        </div>

        <div class="divider-v" style="margin: 0 12px;"></div>

        <!-- 对齐和分布工具 -->
        <div class="align-controls">
          <!-- 左对齐 -->
          <button
            class="icon-btn"
            :class="{ disabled: selectedComponentIds.length < 2 }"
            @click="alignSelectedComponents('left')"
            title="左对齐"
            :disabled="selectedComponentIds.length < 2"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M4 22H2V2h2v20zM22 7H6v3h16V7zm-6 7H6v3h10v-3z"/>
            </svg>
          </button>
          <!-- 水平居中 -->
          <button
            class="icon-btn"
            :class="{ disabled: selectedComponentIds.length < 2 }"
            @click="alignSelectedComponents('center-x')"
            title="水平居中"
            :disabled="selectedComponentIds.length < 2"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M11 2h2v5h8v3h-8v4h5v3h-5v5h-2v-5H6v-3h5v-4H3V7h8z"/>
            </svg>
          </button>
          <!-- 右对齐 -->
          <button
            class="icon-btn"
            :class="{ disabled: selectedComponentIds.length < 2 }"
            @click="alignSelectedComponents('right')"
            title="右对齐"
            :disabled="selectedComponentIds.length < 2"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 2h2v20h-2V2zM2 7h16v3H2V7zm6 7h10v3H8v-3z"/>
            </svg>
          </button>

          <div class="divider-mini"></div>

          <!-- 顶对齐 -->
          <button
            class="icon-btn"
            :class="{ disabled: selectedComponentIds.length < 2 }"
            @click="alignSelectedComponents('top')"
            title="顶对齐"
            :disabled="selectedComponentIds.length < 2"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M2 2h20v2H2V2zm5 16h3V6H7v12zm7-6h3V6h-3v6z"/>
            </svg>
          </button>
          <!-- 垂直居中 -->
          <button
            class="icon-btn"
            :class="{ disabled: selectedComponentIds.length < 2 }"
            @click="alignSelectedComponents('center-y')"
            title="垂直居中"
            :disabled="selectedComponentIds.length < 2"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M22 11v2h-5v8h-3v-8H10v5H7v-5H2v-2h5V6h3v5h4V3h3v8z"/>
            </svg>
          </button>
          <!-- 底对齐 -->
          <button
            class="icon-btn"
            :class="{ disabled: selectedComponentIds.length < 2 }"
            @click="alignSelectedComponents('bottom')"
            title="底对齐"
            :disabled="selectedComponentIds.length < 2"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M22 22H2v-2h20v2zM7 6h3v12H7V6zm7 6h3v6h-3v-6z"/>
            </svg>
          </button>

          <div class="divider-mini"></div>

          <!-- 水平分布 -->
          <button
            class="icon-btn"
            :class="{ disabled: selectedComponentIds.length < 3 }"
            @click="alignSelectedComponents('dist-h')"
            title="水平分布"
            :disabled="selectedComponentIds.length < 3"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M4 22H2V2h2v20zM22 2h-2v20h2V2zm-5 5H7v10h10V7z"/>
            </svg>
          </button>
          <!-- 垂直分布 -->
          <button
            class="icon-btn"
            :class="{ disabled: selectedComponentIds.length < 3 }"
            @click="alignSelectedComponents('dist-v')"
            title="垂直分布"
            :disabled="selectedComponentIds.length < 3"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M22 4v2H2V4h20zM2 22h20v-2H2v2zm5-5h10V7H7v10z"/>
            </svg>
          </button>
        </div>

        <div class="divider-v" style="margin: 0 12px;"></div>

        <!-- 清空画布 -->
        <button
          class="icon-btn danger"
          :class="{ disabled: canvasComponents.length === 0 }"
          @click="handleClearCanvas"
          title="清空画布"
          :disabled="canvasComponents.length === 0"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>

        <div class="divider-v" style="margin: 0 12px;"></div>

        <!-- 状态指示 -->
        <div class="save-status">
          <div v-if="isSaving" class="saving-spinner"></div>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="color: var(--text-sub)">
            <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
          </svg>
          <span class="status-text">{{ saveStatus }}</span>
        </div>
      </div>

      <!-- 右侧：协作与发布 -->
      <div class="header-right">
        <!-- 主题切换器 -->
        <ThemeSwitcher />

        <div class="divider-v"></div>

        <!-- 画布缩放工具 -->
        <div class="canvas-zoom-controls">
          <button class="zoom-btn" @click="zoomOut" title="缩小">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <span
            class="zoom-text"
            :title="`缩放: ${Math.round(canvasScale * 100)}%\n偏移: X=${Math.round(canvasPanX)}px, Y=${Math.round(canvasPanY)}px`"
          >
            {{ Math.round(canvasScale * 100) }}%
          </span>
          <button class="zoom-btn" @click="zoomIn" title="放大">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <button class="zoom-btn" @click="fitToScreen" title="适应屏幕">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
        </div>

        <div class="divider-v"></div>

        <!-- 核心操作按钮 -->
        <button class="btn btn-ghost" @click="handlePreview">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          预览
        </button>

        <button class="btn btn-primary" @click="handleSave" :disabled="isSaving">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M9.5 3.5L4 4v16l5.5-.5 6 1.5 5.5-1V4l-5.5 1-6-1.5z"/>
          </svg>
          {{ isSaving ? '发布中...' : '发布' }}
        </button>

        <!-- 更多设置 -->
        <button class="btn btn-ghost btn-more">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81a.488.488 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- 主体容器 -->
    <div class="main-container">
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
        <div class="nav-item" @click="router.back()" title="退出编辑器">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </div>
        <div class="nav-item" @click="togglePanel" title="收起/展开">
          <svg class="nav-icon" :style="{ transform: isPanelOpen ? 'rotate(0deg)' : 'rotate(180deg)' }" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"></path></svg>
        </div>
      </div>
    </aside>

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
        <div v-if="currentTab === 'components'" class="panel-view">
          <div class="panel-header">
            <span>组件列表</span>
            <svg style="width:16px;height:16px;cursor:pointer" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></svg>
          </div>
          <div class="search-box">
            <input
              type="text"
              class="panel-search-input"
              placeholder="搜索图表..."
              v-model="searchQuery"
              @input="handleSearch"
            >
          </div>
          <div class="panel-body">
            <!-- 动态渲染分类 -->
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              :class="['category-block', { closed: closedCategories[category.id] }]"
            >
              <div class="category-title" @click="toggleCategory(category.id)">
                <svg class="caret" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"></path>
                </svg>
                {{ category.name }} ({{ category.charts.length }})
              </div>
              <div class="comp-grid">
                <div
                  v-for="chart in category.charts"
                  :key="chart.type"
                  class="comp-item"
                  draggable="true"
                  @dragstart="handleDragStart($event, chart)"
                  :title="chart.description"
                >
                  <div class="chart-preview" >
                             <svg class="chart-icon-mini" :viewBox="getChartIconViewBox(chart.icon)" v-html="getChartIcon(chart.icon)"></svg>
                  </div>
                  <div class="comp-label">

                    <span class="comp-name">{{ chart.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 搜索无结果 -->
            <div v-if="filteredCategories.length === 0" class="no-results">
              <svg style="width:40px;height:40px;opacity:0.3;margin-bottom:10px" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <div>未找到匹配的组件</div>
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
              :class="[
                'layer-item',
                {
                  selected: selectedComponentIds.includes(comp.id),
                  locked: comp.locked
                }
              ]"
              @click="selectComponent(comp.id, $event)"
            >
              <svg class="layer-icon" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2"></path></svg>
              <span class="layer-name">{{ comp.name }}</span>
              <div class="layer-actions">
                <!-- 锁定/解锁按钮 -->
                <svg
                  v-if="comp.locked"
                  class="action-mini"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  @click.stop="toggleLock(comp.id)"
                  title="解锁"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                </svg>
                <svg
                  v-else
                  class="action-mini"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  @click.stop="toggleLock(comp.id)"
                  title="锁定"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                </svg>
                <!-- 删除按钮 -->
                <svg
                  class="action-mini"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  @click.stop="deleteComponent(comp.id)"
                  title="删除"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
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
            <div class="screen-container">
              <div v-if="canvasComponents.length === 0" class="screen-watermark">NocoViz Canvas</div>

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
                  border: `${comp.borderWidth || 0}px solid ${comp.borderColor || 'transparent'}`,
                  borderRadius: `${comp.borderRadius || 0}px`
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
                  :width="comp.w"
                  :height="comp.h"
                />
                <!-- Resize handles -->
                <template v-if="selectedComponentId === comp.id">
                  <div class="resize-handle n" @mousedown.stop="startResize($event, comp, 'n')"></div>
                  <div class="resize-handle ne" @mousedown.stop="startResize($event, comp, 'ne')"></div>
                  <div class="resize-handle e" @mousedown.stop="startResize($event, comp, 'e')"></div>
                  <div class="resize-handle se" @mousedown.stop="startResize($event, comp, 'se')"></div>
                  <div class="resize-handle s" @mousedown.stop="startResize($event, comp, 's')"></div>
                  <div class="resize-handle sw" @mousedown.stop="startResize($event, comp, 'sw')"></div>
                  <div class="resize-handle w" @mousedown.stop="startResize($event, comp, 'w')"></div>
                  <div class="resize-handle nw" @mousedown.stop="startResize($event, comp, 'nw')"></div>

                  <!-- 尺寸标注 -->
                  <div class="size-label size-label-top">{{ Math.round(comp.w) }}</div>
                  <div class="size-label size-label-left">{{ Math.round(comp.h) }}</div>
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
    <aside class="config-panel" v-if="selectedComponent">
      <!-- 顶部 Tabs -->
      <div class="panel-tabs">
        <div :class="['tab-item', { active: configTab === 'style' }]" @click="configTab = 'style'">样式</div>
        <div :class="['tab-item', { active: configTab === 'data' }]" @click="configTab = 'data'">数据</div>
        <div :class="['tab-item', { active: configTab === 'event' }]" @click="configTab = 'event'">事件</div>
      </div>

      <div class="panel-content">
        <!-- Tab 1: 样式配置 -->
        <div v-show="configTab === 'style'">
          <!-- 基础属性 - 始终展示不折叠 -->
          <div class="form-group">
            <div class="form-label">
              <span>组件ID</span>
              <svg class="icon-copy" viewBox="0 0 1024 1024" width="12" height="12" @click="copyToClipboard(selectedComponent.id)">
                <path fill="currentColor" d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h352c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32z"/>
              </svg>
            </div>
            <input type="text" class="form-input" :value="selectedComponent.id" readonly>
          </div>

          <div class="form-group">
            <div class="form-label">组件名称</div>
            <input type="text" class="form-input" v-model="selectedComponent.name">
          </div>

          <div class="divider"></div>

          <!-- 布局与变换标题 -->
          <div class="section-title">布局与变换</div>

          <!-- 尺寸与位置 2x2 网格 -->
          <div class="form-group grid-2">
            <div class="grid-item">
              <span class="grid-label">W</span>
              <input
                type="number"
                class="form-input"
                :value="selectedComponent.w"
                @input="e => updateComponentSize('w', e.target.value)"
                @blur="e => selectedComponent.w = Math.round(Number(e.target.value) || 50)"
              >
            </div>
            <div class="grid-item">
              <span class="grid-label">H</span>
              <input
                type="number"
                class="form-input"
                :value="selectedComponent.h"
                @input="e => updateComponentSize('h', e.target.value)"
                @blur="e => selectedComponent.h = Math.round(Number(e.target.value) || 50)"
              >
            </div>
          </div>
          <div class="form-group grid-2">
            <div class="grid-item">
              <span class="grid-label">X</span>
              <input
                type="number"
                class="form-input"
                :value="selectedComponent.x"
                @input="e => updateComponentPosition('x', e.target.value)"
                @blur="e => selectedComponent.x = Math.round(Number(e.target.value) || 0)"
              >
            </div>
            <div class="grid-item">
              <span class="grid-label">Y</span>
              <input
                type="number"
                class="form-input"
                :value="selectedComponent.y"
                @input="e => updateComponentPosition('y', e.target.value)"
                @blur="e => selectedComponent.y = Math.round(Number(e.target.value) || 0)"
              >
            </div>
          </div>

          <!-- 旋转角度 -->
          <div class="form-group">
            <div class="form-label">旋转角度</div>
            <div class="slider-container">
              <input type="range" min="0" max="360" v-model.number="selectedComponent.rotation" class="dv-slider">
              <input type="number" class="form-input-small" v-model.number="selectedComponent.rotation">
              <span class="input-unit">°</span>
            </div>
          </div>

          <div class="divider"></div>

          <!-- 视觉样式 - 使用新的紧凑布局 -->
          <div class="form-group">
            <div class="form-label">背景色</div>
            <div class="color-picker-group">
              <div class="color-preview" :style="{ background: selectedComponent.bgColor || 'transparent' }"></div>
              <input type="text" class="form-input color-input" v-model="selectedComponent.bgColor" placeholder="transparent">
            </div>
          </div>

          <div class="form-group">
            <div class="form-label">透明度</div>
            <div class="slider-container">
              <input type="range" min="0" max="100" v-model.number="selectedComponent.opacity" class="dv-slider">
              <span class="input-unit">%</span>
            </div>
          </div>

          <div class="form-group">
            <div class="form-label">边框样式</div>
            <div class="grid-2" style="margin-bottom: 8px;">
              <div class="input-wrapper">
                <input type="number" class="form-input" v-model.number="selectedComponent.borderWidth" min="0" max="20" placeholder="宽">
                <span class="input-suffix">px</span>
              </div>
              <div class="input-wrapper">
                <input type="number" class="form-input" v-model.number="selectedComponent.borderRadius" min="0" max="100" placeholder="圆角">
                <span class="input-suffix">px</span>
              </div>
            </div>
            <div class="color-picker-group">
              <div class="color-preview" :style="{ background: selectedComponent.borderColor || '#3b82f6' }"></div>
              <input type="text" class="form-input color-input" v-model="selectedComponent.borderColor" placeholder="#3b82f6">
            </div>
          </div>

          <div class="divider"></div>

          <!-- 分组 3: 图表配置 (仅图表组件) -->
          <ConfigFormRenderer
            v-if="isChartComponent(selectedComponent.type)"
            :schema="currentComponentSchema"
            v-model="selectedComponent.config"
          />
        </div>

        <!-- Tab 2: 数据 - 全新三模式架构 -->
        <div v-show="configTab === 'data'" class="data-tab-container">
          <!-- 模式切换 Tabs -->
          <div class="mode-tabs">
            <div :class="['mode-tab', { active: dataMode === 'ref' }]" @click="dataMode = 'ref'">引用数据集</div>
            <div :class="['mode-tab', { active: dataMode === 'static' }]" @click="dataMode = 'static'">静态 JSON</div>
            <div :class="['mode-tab', { active: dataMode === 'local' }]" @click="dataMode = 'local'">临时 API</div>
          </div>

          <!-- 场景 A: 引用数据集 (推荐) -->
          <div v-if="dataMode === 'ref'" class="mode-content">
            <div class="form-group">
              <div class="form-label">选择数据集</div>
              <div class="input-with-button">
                <select class="form-input" v-model="selectedDatasetId" style="flex: 1;">
                  <option value="">请选择数据集...</option>
                  <option value="dataset_1">比亚迪_车辆实时监控</option>
                  <option value="dataset_2">腾讯_服务器热力图</option>
                  <option value="dataset_3">2025Q1_销售总表</option>
                </select>
                <button class="btn-icon-square" @click="editCurrentDataset" title="编辑数据集">✎</button>
              </div>
            </div>

            <div v-if="selectedDatasetId" class="data-status-info">
              <div class="form-label" style="margin-bottom: 8px;">数据状态:
                <span class="status-success">● 正常 ({{ dataRowCount }} 行)</span>
              </div>
            </div>

            <div v-if="selectedDatasetId" class="divider"></div>

            <div v-if="selectedDatasetId" class="form-group">
              <div class="form-label">字段映射 (Mapping)</div>
              <div class="field-mapping-simple">
                <div class="mapping-item">X轴: <span class="field-value">category</span></div>
                <div class="mapping-item">Y轴: <span class="field-value">value</span></div>
              </div>
            </div>
          </div>

          <!-- 场景 B: 静态 JSON -->
          <div v-if="dataMode === 'static'" class="mode-content">
            <div class="tip-box">
              适用于展示固定内容或开发调试。数据保存在组件内部,不会随数据源更新。
            </div>

            <div class="form-group">
              <div class="form-label">JSON 数据</div>
              <textarea
                class="code-editor"
                v-model="staticJsonData"
                placeholder='[
  {"name": "A", "value": 10},
  {"name": "B", "value": 20}
]'
                rows="8"
              ></textarea>
            </div>

            <div class="form-group grid-2">
              <button class="btn-secondary" @click="formatJSON">格式化</button>
              <button class="btn-primary" @click="applyStaticJSON">应用数据</button>
            </div>
          </div>

          <!-- 场景 C: 临时 API -->
          <div v-if="dataMode === 'local'" class="mode-content">
            <div class="tip-box">
              注意:此配置仅当前组件可见。如需复用或统一管理 Token,建议保存为公共数据集。
            </div>

            <div class="form-group">
              <div class="form-label">接口地址</div>
              <input type="text" class="form-input" v-model="apiUrl" placeholder="https://api.example.com/test">
            </div>

            <div class="form-group">
              <div class="form-label">Method</div>
              <select class="form-input" v-model="apiMethod">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>

            <div class="form-group">
              <button class="btn-secondary btn-full" @click="testAPIConnection">测试请求</button>
            </div>

            <div class="divider"></div>

            <!-- 核心功能:转正 -->
            <div class="form-group" style="text-align: center;">
              <button class="btn-upgrade" @click="saveAsDataset">
                ⬆ 保存为公共数据集
              </button>
            </div>
          </div>

          <!-- Datasets 视图 -->
          <div v-show="dataLayerTab === 'datasets'" class="datasets-view">
            <div class="datasets-header">
              <span class="datasets-title">业务数据集</span>
              <button class="create-dataset-btn" @click="createDataset">
                <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
                  <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"/>
                  <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"/>
                </svg>
                新建数据集
              </button>
            </div>

            <!-- 数据集列表 -->
            <div class="datasets-list">
              <div v-if="datasets.length === 0" class="empty-datasets">
                <svg viewBox="0 0 1024 1024" width="40" height="40" fill="currentColor">
                  <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136V232h752v560z"/>
                </svg>
                <p>暂无数据集</p>
                <p class="hint">创建数据集来组织和处理数据连接</p>
              </div>

              <div v-for="dataset in datasets" :key="dataset.id" class="dataset-card">
                <div class="dataset-header">
                  <div class="dataset-title-row">
                    <span class="dataset-name">{{ dataset.name }}</span>
                    <div class="dataset-actions">
                      <button class="icon-btn" @click="editDataset(dataset.id)" title="编辑">
                        <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
                          <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z"/>
                        </svg>
                      </button>
                      <button class="icon-btn" @click="deleteDataset(dataset.id)" title="删除">
                        <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
                          <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p class="dataset-desc">{{ dataset.description }}</p>
                </div>

                <div class="dataset-body">
                  <!-- 数据源血缘 -->
                  <div class="dataset-lineage">
                    <div class="lineage-label">数据来源</div>
                    <div class="lineage-connection">
                      <span :class="['connection-badge', dataset.sourceType]">
                        {{ dataset.sourceType === 'database' ? 'SQL' : dataset.sourceType === 'file' ? 'XLS' : 'API' }}
                      </span>
                      <span class="connection-name">{{ dataset.sourceName }}</span>
                    </div>
                  </div>

                  <!-- 更新策略 -->
                  <div class="dataset-strategy">
                    <div class="strategy-label">更新策略</div>
                    <div class="strategy-value">
                      <span :class="['strategy-badge', dataset.updateStrategy]">
                        <span class="strategy-dot"></span>
                        {{ getStrategyText(dataset.updateStrategy) }}
                      </span>
                      <span v-if="dataset.cacheTime" class="cache-time">TTL: {{ dataset.cacheTime }}s</span>
                    </div>
                  </div>

                  <!-- 数据统计 -->
                  <div class="dataset-stats">
                    <div class="stat-item">
                      <span class="stat-label">数据行数</span>
                      <span class="stat-value">{{ dataset.rowCount || '-' }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">数据大小</span>
                      <span class="stat-value">{{ dataset.dataSize || '-' }}</span>
                    </div>
                  </div>

                  <button class="use-dataset-btn" @click="useDataset(dataset.id)">使用此数据集</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 数据映射配置 -->
          <div class="group-section open">
            <div class="group-header" @click="toggleGroup('dataMapping')">
              <div class="group-arrow"></div>
              <div class="group-title">数据映射</div>
            </div>
            <div class="group-body" v-show="openGroups.dataMapping">
              <div class="prop-row-full">
                <div class="prop-label">X轴字段</div>
                <div class="input-group">
                  <input type="text" class="dv-input" v-model="dataMapping.xField" placeholder="categories">
                </div>
              </div>

              <div class="prop-row-full">
                <div class="prop-label">Y轴字段</div>
                <div class="input-group">
                  <input type="text" class="dv-input" v-model="dataMapping.yField" placeholder="values">
                </div>
              </div>

              <div class="mapping-info">
                <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
                  <path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"/>
                </svg>
                <span>数据映射用于指定如何从数据源提取图表所需字段</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: 交互事件 -->
        <div v-show="configTab === 'event'" class="event-config-container">
          <!-- 事件列表 -->
          <div class="event-list-section">
            <div class="section-header">
              <span class="section-title">事件列表</span>
              <button class="btn-add-event" @click="addEvent">
                <svg viewBox="0 0 1024 1024" width="12" height="12" fill="currentColor">
                  <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"/>
                  <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"/>
                </svg>
                添加事件
              </button>
            </div>

            <div v-if="componentEvents.length === 0" class="empty-events">
              <svg viewBox="0 0 1024 1024" width="32" height="32" fill="currentColor" style="opacity: 0.3;">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
              </svg>
              <p style="margin-top: 8px; color: #666; font-size: 12px;">暂无事件，点击上方按钮添加</p>
            </div>

            <div v-else class="event-items">
              <div
                v-for="(event, index) in componentEvents"
                :key="index"
                :class="['event-item', { active: currentEventIndex === index }]"
                @click="selectEvent(index)"
              >
                <div class="event-item-header">
                  <span class="event-trigger">{{ getEventTriggerLabel(event.trigger) }}</span>
                  <button class="btn-delete-event" @click.stop="deleteEvent(index)" title="删除事件">
                    <svg viewBox="0 0 1024 1024" width="12" height="12" fill="currentColor">
                      <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32z"/>
                    </svg>
                  </button>
                </div>
                <div class="event-item-body">
                  <span class="event-action">{{ getEventActionLabel(event.action) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 事件配置面板 -->
          <div v-if="currentEventIndex !== null && componentEvents[currentEventIndex]" class="event-config-panel">
            <div class="form-group">
              <div class="form-label">触发条件</div>
              <select class="form-input" v-model="componentEvents[currentEventIndex].trigger">
                <option value="click">点击 (Click)</option>
                <option value="dblclick">双击 (Double Click)</option>
                <option value="mouseenter">鼠标移入 (Mouse Enter)</option>
                <option value="mouseleave">鼠标移出 (Mouse Leave)</option>
                <option value="dataUpdate">数据更新 (Data Update)</option>
              </select>
            </div>

            <div class="form-group">
              <div class="form-label">执行动作</div>
              <select class="form-input" v-model="componentEvents[currentEventIndex].action" @change="handleActionChange">
                <option value="navigate">跳转链接</option>
                <option value="toggleComponent">显示/隐藏组件</option>
                <option value="refreshData">刷新数据</option>
                <option value="showMessage">弹出提示</option>
                <option value="runScript">执行脚本</option>
              </select>
            </div>

            <!-- 动作参数配置 -->
            <div class="form-group" v-if="componentEvents[currentEventIndex].action === 'navigate'">
              <div class="form-label">跳转地址</div>
              <input type="text" class="form-input" v-model="componentEvents[currentEventIndex].params.url" placeholder="https://example.com">
              <div style="margin-top: 6px;">
                <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #909399; cursor: pointer;">
                  <input type="checkbox" v-model="componentEvents[currentEventIndex].params.newWindow">
                  <span>在新窗口打开</span>
                </label>
              </div>
            </div>

            <div class="form-group" v-if="componentEvents[currentEventIndex].action === 'toggleComponent'">
              <div class="form-label">目标组件ID</div>
              <input type="text" class="form-input" v-model="componentEvents[currentEventIndex].params.targetId" placeholder="输入组件ID">
              <div class="form-label" style="margin-top: 12px;">操作类���</div>
              <select class="form-input" v-model="componentEvents[currentEventIndex].params.operation">
                <option value="toggle">切换显示/隐藏</option>
                <option value="show">显示</option>
                <option value="hide">隐藏</option>
              </select>
            </div>

            <div class="form-group" v-if="componentEvents[currentEventIndex].action === 'showMessage'">
              <div class="form-label">提示内容</div>
              <textarea class="form-input" v-model="componentEvents[currentEventIndex].params.message" placeholder="输入提示内容" rows="3" style="resize: vertical;"></textarea>
              <div class="form-label" style="margin-top: 12px;">提示类型</div>
              <select class="form-input" v-model="componentEvents[currentEventIndex].params.type">
                <option value="success">成功</option>
                <option value="warning">警告</option>
                <option value="info">信息</option>
                <option value="error">错误</option>
              </select>
            </div>

            <div class="form-group" v-if="componentEvents[currentEventIndex].action === 'runScript'">
              <div class="form-label">JavaScript 代码</div>
              <textarea class="code-editor" v-model="componentEvents[currentEventIndex].params.script" placeholder="// 输入 JavaScript 代码&#10;console.log('Hello World');" rows="6"></textarea>
            </div>
          </div>

          <div v-else class="event-config-empty">
            <svg viewBox="0 0 1024 1024" width="32" height="32" fill="currentColor" style="opacity: 0.3;">
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
            </svg>
            <p style="margin-top: 8px; color: #666; font-size: 12px;">请选择或添加事件进行配置</p>
          </div>
        </div>
      </div>
    </aside>

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
import { ref, computed, reactive, onMounted, onUnmounted, nextTick, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { chartCategories, chartIcons, getChartByType } from '@/config/chartComponents'
import { getChartComponent } from '@/components/charts/index'
import { getComponentSchema, isChartComponent as checkIsChart } from '@/config/componentSchema'
import ConfigFormRenderer from '@/components/editor/ConfigFormRenderer.vue'
import { generateMockDataByTemplate, formatJSONString, validateJSON } from '@/utils/mockDataGenerator'
import MockDataEditor from '@/components/data/MockDataEditor.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import * as echarts from 'echarts'
import * as datasetApi from '@/api/dataset'

const route = useRoute()
const router = useRouter()

const currentTab = ref('components')
const isPanelOpen = ref(true)
const searchQuery = ref('')

// 记录每个分类的折叠状态
const closedCategories = reactive({})

// 图表预览 refs
const chartPreviewRefs = reactive({})

// 项目状态
const projectName = ref('未命名大屏项目')
const saveStatus = ref('所有更改已保存')

// 历史记录（撤销/重做）
const history = ref([])
const historyIndex = ref(-1)
const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

// 返回工作台
const handleBackToHome = () => {
  router.push('/projects')
}

// 撤销操作
const handleUndo = () => {
  if (canUndo.value) {
    historyIndex.value--
    canvasComponents.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    ElMessage.success('已撤销')
  }
}

// 重做操作
const handleRedo = () => {
  if (canRedo.value) {
    historyIndex.value++
    canvasComponents.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    ElMessage.success('已重做')
  }
}
const isSaving = ref(false)
const canvasScale = ref(0.4)

// 画布平移和缩放状态
const canvasPanX = ref(0)
const canvasPanY = ref(0)
const isPanning = ref(false)
const isSpacePressed = ref(false)
const canvasViewport = ref(null)

// 标尺相关 refs
const rulerH = ref(null)
const rulerV = ref(null)
const guideH = ref(null)
const guideV = ref(null)
const labelX = ref(null)
const labelY = ref(null)
const hudX = ref(null)
const hudY = ref(null)
const cursorHud = ref(null)
const mousePos = reactive({ x: -1, y: -1 })
const logicalPos = reactive({ x: 0, y: 0 }) // 逻辑坐标（画布内）

// 框选状态
const isSelecting = ref(false)
const selectionBox = reactive({
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0
})

// 对齐辅助线状态
const alignmentLines = reactive({
  vertical: [], // 垂直辅助线 [{ position: number, type: 'left'|'center'|'right' }]
  horizontal: [] // 水平辅助线 [{ position: number, type: 'top'|'middle'|'bottom' }]
})
const SNAP_THRESHOLD = 5 // 吸附阈值（像素）

// 多选包围盒状态
const multiSelectBox = reactive({
  visible: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0
})

// Canvas State
// 添加一个测试组件，方便查看右侧配置面板
const canvasComponents = ref([])

// 多选支持
const selectedComponentIds = ref([])

// 兼容单选逻辑
const selectedComponentId = computed(() => {
  return selectedComponentIds.value.length === 1 ? selectedComponentIds.value[0] : null
})

const selectedComponent = computed(() => {
  return canvasComponents.value.find(c => c.id === selectedComponentId.value)
})

// 多选组件列表
const selectedComponents = computed(() => {
  return canvasComponents.value.filter(c => selectedComponentIds.value.includes(c.id))
})

// 右侧配置面板状态
const configTab = ref('style')
const openGroups = reactive({
  basic: true,
  visual: true,
  dataSource: true,
  dataMapping: true
})

// 数据源配置状态
const dataLayerTab = ref('connections') // 'connections' | 'datasets'
const dataSourceType = ref('file')
const dataMode = ref('ref') // 'ref' | 'static' | 'local'
const selectedDatasetId = ref('')
const dataRowCount = ref(2845)
const autoRefreshInterval = ref(0)
const staticJsonData = ref('')
const mappingFields = reactive({
  xAxis: 'category_name',
  yAxis: 'sales_amount',
  group: ''
})

// 本地文件
const fileType = ref('excel')
const currentMockData = ref('')
const showMockEditor = ref(false)
const mockDataCount = computed(() => {
  if (!currentMockData.value) return 0
  try {
    const data = JSON.parse(currentMockData.value)
    return Array.isArray(data) ? data.length : 1
  } catch {
    return 0
  }
})

// 数据库
const dbType = ref('mysql')
const dbHost = ref('')
const dbName = ref('')
const dbUser = ref('')
const dbPassword = ref('')
const dbQuery = ref('')

// API接口
const apiMethod = ref('GET')
const apiUrl = ref('')
const apiHeaders = ref('')
const apiBody = ref('')
const apiRefreshInterval = ref(0)

// 数据映射
const dataMapping = reactive({
  xField: 'categories',
  yField: 'values'
})

// 业务数据集
const datasets = ref([
  {
    id: 1,
    name: '华东区_2025Q1_销售汇总',
    description: '已清洗数据，过滤掉退款订单，按城市聚合计算总额',
    sourceType: 'database', // 'database' | 'file' | 'api'
    sourceName: '阿里云_交易主库',
    updateStrategy: 'realtime', // 'realtime' | 'cached' | 'static'
    cacheTime: null,
    rowCount: '2,845',
    dataSize: '125 KB'
  },
  {
    id: 2,
    name: 'Q1销售数据_Excel导入',
    description: '2025年第一季度销售原始数据',
    sourceType: 'file',
    sourceName: 'sales_q1_2025.xlsx',
    updateStrategy: 'static',
    cacheTime: null,
    rowCount: '1,200',
    dataSize: '86 KB'
  },
  {
    id: 3,
    name: '天气API_实时数据',
    description: '从第三方API获取的实时天气数据',
    sourceType: 'api',
    sourceName: 'weather.api.com/v3',
    updateStrategy: 'cached',
    cacheTime: 300,
    rowCount: '50',
    dataSize: '12 KB'
  }
])

// 获取当前组件的配置 Schema
const currentComponentSchema = computed(() => {
  if (!selectedComponent.value) return {}
  return getComponentSchema(selectedComponent.value.type)
})

// 判断是否为图表组件
const isChartComponent = (type) => {
  return checkIsChart(type)
}

// 过滤后的分类（根据搜索）
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return chartCategories
  }

  const query = searchQuery.value.toLowerCase()
  return chartCategories
    .map(category => ({
      ...category,
      charts: category.charts.filter(chart =>
        chart.name.toLowerCase().includes(query) ||
        chart.description.toLowerCase().includes(query)
      )
    }))
    .filter(category => category.charts.length > 0)
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

const toggleCategory = (categoryId) => {
  closedCategories[categoryId] = !closedCategories[categoryId]
}

const handleSearch = () => {
  // 搜索时自动展开所有分类
  Object.keys(closedCategories).forEach(key => {
    closedCategories[key] = false
  })
}

const getChartIcon = (iconName) => {
  return chartIcons[iconName] || chartIcons.bar
}

const getChartIconViewBox = (iconName) => {
  // 饼图、词云图、面积图、折线图、桑基图、数字翻牌器、进度条、数据表格、仪表盘、KPI指标卡、文本标题使用 1024x1024 viewBox
  if (iconName === 'pie' || iconName === 'word-cloud' || iconName === 'area' || iconName === 'line' || iconName === 'sankey' || iconName === 'number' || iconName === 'progress' || iconName === 'table' || iconName === 'gauge' || iconName === 'kpi' || iconName === 'text') {
    return '0 0 1024 1024'
  }
  // 漏斗图使用 1101x1024 viewBox
  if (iconName === 'funnel') {
    return '0 0 1101 1024'
  }
  // 其他使用 24x24
  return '0 0 24 24'
}

// 初始化图表预览
const initChartPreviews = () => {
  const colors = {
    primary: '#00f2f2',
    secondary: '#ffaa00',
    bg: 'transparent'
  }

  chartCategories.forEach(category => {
    category.charts.forEach(chart => {
      const el = chartPreviewRefs[chart.type]
      if (!el) return

      const myChart = echarts.init(el)
      let option = {}

      switch (chart.type) {
        case 'bar':
          option = {
            backgroundColor: colors.bg,
            grid: { top: 10, bottom: 10, left: 15, right: 10 },
            xAxis: { show: false },
            yAxis: { show: false },
            series: [{
              type: 'bar',
              data: [120, 200, 150, 80, 70],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: colors.primary },
                  { offset: 1, color: 'rgba(0, 242, 242, 0.1)' }
                ]),
                borderRadius: [4, 4, 0, 0]
              },
              barWidth: '35%'
            }]
          }
          break

        case 'line':
          option = {
            backgroundColor: colors.bg,
            grid: { top: 10, bottom: 10, left: 15, right: 10 },
            xAxis: { show: false, boundaryGap: false },
            yAxis: { show: false },
            series: [
              {
                type: 'line',
                data: [320, 450, 380, 520, 600],
                smooth: true,
                showSymbol: false,
                lineStyle: { width: 2, color: '#29B983' }
              },
              {
                type: 'line',
                data: [220, 350, 280, 420, 500],
                smooth: true,
                showSymbol: false,
                lineStyle: { width: 2, color: '#706EE7' }
              }
            ]
          }
          break

        case 'pie':
          option = {
            backgroundColor: colors.bg,
            series: [{
              type: 'pie',
              radius: ['40%', '60%'],
              center: ['50%', '50%'],
              data: [
                { value: 483, itemStyle: { color: '#706EE7' } },
                { value: 540, itemStyle: { color: '#29C287' } }
              ],
              label: { show: false }
            }]
          }
          break

        case 'area':
          option = {
            backgroundColor: colors.bg,
            grid: { top: 10, bottom: 10, left: 15, right: 10 },
            xAxis: { show: false, boundaryGap: false },
            yAxis: { show: false },
            series: [
              {
                type: 'line',
                data: [300, 450, 380, 500, 600],
                smooth: true,
                showSymbol: false,
                lineStyle: { width: 0 },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(41, 194, 135, 0.6)' },
                    { offset: 1, color: 'rgba(41, 194, 135, 0.1)' }
                  ])
                }
              },
              {
                type: 'line',
                data: [200, 280, 250, 320, 400],
                smooth: true,
                showSymbol: false,
                lineStyle: { width: 0 },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(112, 110, 231, 0.6)' },
                    { offset: 1, color: 'rgba(112, 110, 231, 0.1)' }
                  ])
                }
              }
            ]
          }
          break

        case 'scatter':
          option = {
            backgroundColor: colors.bg,
            grid: { top: 10, bottom: 10, left: 15, right: 10 },
            xAxis: { show: false },
            yAxis: { show: false },
            series: [{
              type: 'scatter',
              data: [[10, 8, 20], [8, 6, 30], [13, 7, 15], [9, 8, 25], [11, 8, 40]],
              symbolSize: val => val[2],
              itemStyle: { color: 'rgba(255, 107, 157, 0.8)' }
            }]
          }
          break

        case 'radar':
          option = {
            backgroundColor: colors.bg,
            radar: {
              indicator: [
                { max: 100 }, { max: 100 }, { max: 100 }, { max: 100 }, { max: 100 }
              ],
              splitArea: { show: false },
              axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
              splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            series: [{
              type: 'radar',
              data: [{
                value: [70, 85, 60, 90, 75],
                areaStyle: { color: 'rgba(0, 242, 242, 0.3)' },
                lineStyle: { color: colors.primary }
              }]
            }]
          }
          break

        case 'gauge':
          option = {
            backgroundColor: colors.bg,
            series: [{
              type: 'gauge',
              startAngle: 180,
              endAngle: 0,
              min: 0,
              max: 100,
              splitNumber: 2,
              axisLine: { lineStyle: { width: 6, color: [[0.3, colors.secondary], [0.7, '#006699'], [1, colors.primary]] } },
              pointer: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              detail: { show: false },
              data: [{ value: 70 }]
            }]
          }
          break

        case 'funnel':
          option = {
            backgroundColor: colors.bg,
            series: [{
              type: 'funnel',
              data: [
                { value: 100, itemStyle: { color: '#706EE7' } },
                { value: 80, itemStyle: { color: '#FFC107' } },
                { value: 60, itemStyle: { color: '#29C287' } }
              ],
              label: { show: false },
              left: '10%',
              width: '80%'
            }]
          }
          break

        case 'heatmap':
          option = {
            backgroundColor: colors.bg,
            grid: { top: 5, bottom: 5, left: 5, right: 5 },
            xAxis: {
              type: 'category',
              data: ['A', 'B', 'C'],
              show: false,
              axisLine: { show: false },
              axisTick: { show: false }
            },
            yAxis: {
              type: 'category',
              data: ['X', 'Y'],
              show: false,
              axisLine: { show: false },
              axisTick: { show: false }
            },
            visualMap: { show: false, min: 0, max: 5, inRange: { color: ['#0d213c', colors.primary] } },
            series: [{
              type: 'heatmap',
              data: [[0, 0, 5], [0, 1, 1], [1, 0, 0], [1, 1, 3], [2, 0, 2], [2, 1, 4]],
              itemStyle: { borderColor: '#050d19', borderWidth: 2 }
            }]
          }
          break

        case 'liquid':
          option = {
            backgroundColor: colors.bg,
            series: [{
              type: 'pie',
              radius: ['60%', '70%'],
              data: [
                { value: 75, itemStyle: { color: colors.primary } },
                { value: 25, itemStyle: { color: 'rgba(255,255,255,0.05)' } }
              ],
              label: { show: false }
            }]
          }
          break

        case 'word-cloud':
          option = {
            backgroundColor: colors.bg,
            series: [{
              type: 'scatter',
              data: [[1, 8, '#706EE7'], [2, 6, '#29C287'], [3, 9, '#706EE7'], [4, 5, '#5AD651'], [5, 7, '#706EE7'], [6, 10, '#29C287'], [7, 4, '#5AD651']],
              symbolSize: val => val[1] * 3,
              itemStyle: { color: params => params.data[2], opacity: 0.8 }
            }],
            xAxis: { show: false },
            yAxis: { show: false },
            grid: { top: 10, bottom: 10, left: 10, right: 10 }
          }
          break

        case 'sankey':
          option = {
            backgroundColor: colors.bg,
            series: [{
              type: 'sankey',
              data: [
                { name: 'A' },
                { name: 'B' },
                { name: 'C' },
                { name: 'D' }
              ],
              links: [
                { source: 'A', target: 'C', value: 10 },
                { source: 'A', target: 'D', value: 5 },
                { source: 'B', target: 'C', value: 8 },
                { source: 'B', target: 'D', value: 3 }
              ],
              itemStyle: {
                color: '#6E72DF',
                borderColor: '#6E72DF'
              },
              lineStyle: {
                color: 'source',
                curveness: 0.5
              },
              label: { show: false },
              left: '5%',
              right: '5%',
              top: '10%',
              bottom: '10%'
            }]
          }
          break

        case 'treemap':
        case 'sunburst':
          option = {
            backgroundColor: colors.bg,
            series: [{
              type: 'pie',
              radius: ['30%', '50%'],
              data: [
                { value: 40, itemStyle: { color: '#003366' } },
                { value: 30, itemStyle: { color: '#006699' } },
                { value: 20, itemStyle: { color: '#0099cc' } },
                { value: 10, itemStyle: { color: colors.primary } }
              ],
              label: { show: false }
            }]
          }
          break

        case 'number-flip':
          option = {
            backgroundColor: colors.bg,
            graphic: [
              {
                type: 'text',
                left: 'center',
                top: 'middle',
                style: {
                  text: '60%',
                  fontSize: 28,
                  fontWeight: 'bold',
                  fill: '#706EE7'
                }
              },
              {
                type: 'rect',
                left: 10,
                bottom: 10,
                shape: { width: 60, height: 6 },
                style: { fill: '#29C287' }
              }
            ]
          }
          break

        case 'text':
        case 'kpi-card':
        case 'progress-bar':
        case 'table':
          // 信息组件用简单的矩形表示
          option = {
            backgroundColor: colors.bg,
            graphic: [{
              type: 'rect',
              left: 'center',
              top: 'middle',
              shape: { width: 60, height: 30 },
              style: { fill: 'rgba(0, 242, 242, 0.2)', stroke: colors.primary, lineWidth: 1 }
            }]
          }
          break

        // 底图装饰组件
        case 'border-01':
          option = {
            backgroundColor: colors.bg,
            graphic: [{
              type: 'rect',
              left: 5,
              top: 5,
              shape: { width: 70, height: 60 },
              style: { fill: 'none', stroke: colors.primary, lineWidth: 1.5 }
            }, {
              type: 'line',
              left: 5,
              top: 5,
              shape: { x1: 0, y1: 0, x2: 8, y2: 8 },
              style: { stroke: colors.primary, lineWidth: 1.5 }
            }, {
              type: 'line',
              left: 75,
              top: 5,
              shape: { x1: 0, y1: 0, x2: -8, y2: 8 },
              style: { stroke: colors.primary, lineWidth: 1.5 }
            }]
          }
          break

        case 'border-02':
          option = {
            backgroundColor: colors.bg,
            graphic: [{
              type: 'rect',
              left: 8,
              top: 8,
              shape: { width: 64, height: 54 },
              style: { fill: 'none', stroke: colors.primary, lineWidth: 1 }
            }, {
              type: 'rect',
              left: 5,
              top: 5,
              shape: { width: 70, height: 60 },
              style: { fill: 'none', stroke: colors.primary, lineWidth: 0.5 }
            }]
          }
          break

        case 'border-03':
          option = {
            backgroundColor: colors.bg,
            graphic: [
              // 四角短线
              { type: 'line', left: 5, top: 5, shape: { x1: 0, y1: 0, x2: 15, y2: 0 }, style: { stroke: colors.secondary, lineWidth: 2 } },
              { type: 'line', left: 5, top: 5, shape: { x1: 0, y1: 0, x2: 0, y2: 15 }, style: { stroke: colors.secondary, lineWidth: 2 } },
              { type: 'line', left: 60, top: 5, shape: { x1: 0, y1: 0, x2: 15, y2: 0 }, style: { stroke: colors.secondary, lineWidth: 2 } },
              { type: 'line', left: 75, top: 5, shape: { x1: 0, y1: 0, x2: 0, y2: 15 }, style: { stroke: colors.secondary, lineWidth: 2 } },
              { type: 'line', left: 5, top: 50, shape: { x1: 0, y1: 0, x2: 0, y2: 15 }, style: { stroke: colors.secondary, lineWidth: 2 } },
              { type: 'line', left: 5, top: 65, shape: { x1: 0, y1: 0, x2: 15, y2: 0 }, style: { stroke: colors.secondary, lineWidth: 2 } },
              { type: 'line', left: 75, top: 50, shape: { x1: 0, y1: 0, x2: 0, y2: 15 }, style: { stroke: colors.secondary, lineWidth: 2 } },
              { type: 'line', left: 60, top: 65, shape: { x1: 0, y1: 0, x2: 15, y2: 0 }, style: { stroke: colors.secondary, lineWidth: 2 } }
            ]
          }
          break

        case 'border-04':
          option = {
            backgroundColor: colors.bg,
            graphic: [{
              type: 'rect',
              left: 5,
              top: 5,
              shape: { width: 70, height: 60 },
              style: { fill: 'none', stroke: colors.primary, lineWidth: 1.5 }
            }, {
              type: 'line',
              left: 5,
              top: 35,
              shape: { x1: 0, y1: 0, x2: 75, y2: 0 },
              style: { stroke: colors.primary, lineWidth: 0.5 }
            }, {
              type: 'line',
              left: 40,
              top: 5,
              shape: { x1: 0, y1: 0, x2: 0, y2: 65 },
              style: { stroke: colors.primary, lineWidth: 0.5 }
            }]
          }
          break

        case 'decoration-01':
          option = {
            backgroundColor: colors.bg,
            graphic: [{
              type: 'line',
              left: 10,
              top: 35,
              shape: { x1: 0, y1: 0, x2: 60, y2: 0 },
              style: { stroke: colors.primary, lineWidth: 2 }
            }, {
              type: 'line',
              left: 25,
              top: 25,
              shape: { x1: 0, y1: 0, x2: 30, y2: 0 },
              style: { stroke: colors.primary, lineWidth: 1, opacity: 0.5 }
            }, {
              type: 'line',
              left: 25,
              top: 45,
              shape: { x1: 0, y1: 0, x2: 30, y2: 0 },
              style: { stroke: colors.primary, lineWidth: 1, opacity: 0.5 }
            }]
          }
          break

        case 'decoration-02':
          option = {
            backgroundColor: colors.bg,
            graphic: [{
              type: 'polygon',
              left: 20,
              top: 20,
              shape: { points: [[0, 0], [40, 0], [40, 40], [0, 40]] },
              style: { fill: 'none', stroke: colors.secondary, lineWidth: 2 }
            }, {
              type: 'line',
              left: 20,
              top: 20,
              shape: { x1: 0, y1: 0, x2: 40, y2: 40 },
              style: { stroke: colors.secondary, lineWidth: 1, opacity: 0.5 }
            }]
          }
          break

        case 'decoration-03':
          option = {
            backgroundColor: colors.bg,
            graphic: [{
              type: 'line',
              left: 5,
              top: 35,
              shape: { x1: 0, y1: 0, x2: 70, y2: 0 },
              style: { stroke: colors.primary, lineWidth: 2 }
            }, {
              type: 'polygon',
              left: 5,
              top: 30,
              shape: { points: [[0, 5], [8, 0], [0, 10]] },
              style: { fill: colors.primary }
            }, {
              type: 'polygon',
              left: 67,
              top: 30,
              shape: { points: [[8, 5], [0, 0], [8, 10]] },
              style: { fill: colors.primary }
            }]
          }
          break

        case 'bg-box':
          option = {
            backgroundColor: colors.bg,
            graphic: [{
              type: 'rect',
              left: 5,
              top: 5,
              shape: { width: 70, height: 60 },
              style: { fill: 'rgba(0, 51, 102, 0.3)', stroke: 'rgba(0, 242, 242, 0.3)', lineWidth: 1 }
            }, {
              type: 'line',
              left: 5,
              top: 5,
              shape: { x1: 0, y1: 0, x2: 70, y2: 60 },
              style: { stroke: 'rgba(0, 242, 242, 0.1)', lineWidth: 1 }
            }, {
              type: 'line',
              left: 5,
              top: 65,
              shape: { x1: 0, y1: 0, x2: 70, y2: -60 },
              style: { stroke: 'rgba(0, 242, 242, 0.1)', lineWidth: 1 }
            }]
          }
          break

        default:
          option = {
            backgroundColor: colors.bg,
            series: [{
              type: 'bar',
              data: [1, 2, 3],
              itemStyle: { color: chart.color || colors.primary }
            }],
            xAxis: { show: false },
            yAxis: { show: false }
          }
      }

      myChart.setOption(option)
    })
  })
}

const handleDragStart = (event, chart) => {
  event.dataTransfer.setData('chartType', chart.type)
  event.dataTransfer.effectAllowed = 'copy'
}

const handleDrop = (event) => {
  const chartType = event.dataTransfer.getData('chartType')
  if (!chartType) return

  const chartConfig = getChartByType(chartType)
  if (!chartConfig) return

  // 计算相对于画布容器的位置
  let dropX, dropY
  if (event.target.classList.contains('screen-container')) {
    dropX = event.offsetX - chartConfig.defaultSize.w / 2
    dropY = event.offsetY - chartConfig.defaultSize.h / 2
  } else {
    // 如果拖放到画布区域外，默认居中
    dropX = 380
    dropY = 200
  }

  // 创建新组件，所有位置和尺寸取整
  const newComp = {
    id: Date.now(),
    type: chartType,
    name: chartConfig.name,
    x: Math.round(Math.max(0, dropX)),
    y: Math.round(Math.max(0, dropY)),
    w: Math.round(chartConfig.defaultSize.w),
    h: Math.round(chartConfig.defaultSize.h),
    rotation: 0, // 旋转角度

    // 视觉样式
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderColor: '#3b82f6',
    borderRadius: 4,

    color: chartConfig.color,
    config: {}, // 图表配置项
    data: null // 后续绑定数据
  }

  canvasComponents.value.push(newComp)
  selectComponent(newComp.id)
  ElMessage.success(`已添加 ${newComp.name}`)
}

// 选择组件（支持多选）
const selectComponent = (id, event) => {
  if (event && (event.ctrlKey || event.metaKey)) {
    // Ctrl/Cmd + 点击：切换选中状态
    const index = selectedComponentIds.value.indexOf(id)
    if (index > -1) {
      selectedComponentIds.value.splice(index, 1)
    } else {
      selectedComponentIds.value.push(id)
    }
  } else if (event && event.shiftKey) {
    // Shift + 点击：添加到选中列表（保留其他选中）
    if (!selectedComponentIds.value.includes(id)) {
      selectedComponentIds.value.push(id)
    }
  } else {
    // 普通点击：仅选中当前组件
    selectedComponentIds.value = [id]
  }
  updateMultiSelectBox()
}

// 取消所有选中
const deselectComponent = () => {
  selectedComponentIds.value = []
  updateMultiSelectBox()
}

// 批量选择组件
const selectMultipleComponents = (ids) => {
  selectedComponentIds.value = [...ids]
  updateMultiSelectBox()
}

// 更新多选包围盒
const updateMultiSelectBox = () => {
  if (selectedComponentIds.value.length < 2) {
    multiSelectBox.visible = false
    return
  }

  const selectedComps = canvasComponents.value.filter(c =>
    selectedComponentIds.value.includes(c.id)
  )

  // 计算包围盒
  let minX = Infinity, minY = Infinity
  let maxX = -Infinity, maxY = -Infinity

  selectedComps.forEach(comp => {
    minX = Math.min(minX, comp.x)
    minY = Math.min(minY, comp.y)
    maxX = Math.max(maxX, comp.x + comp.w)
    maxY = Math.max(maxY, comp.y + comp.h)
  })

  multiSelectBox.x = minX
  multiSelectBox.y = minY
  multiSelectBox.width = maxX - minX
  multiSelectBox.height = maxY - minY
  multiSelectBox.visible = true
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

// 实时更新组件尺寸
const updateComponentSize = (prop, value) => {
  const numValue = Number(value)
  if (!isNaN(numValue) && selectedComponent.value) {
    selectedComponent.value[prop] = Math.round(Math.max(50, numValue))
  }
}

// 实时更新组件位置
const updateComponentPosition = (prop, value) => {
  const numValue = Number(value)
  if (!isNaN(numValue) && selectedComponent.value) {
    const maxX = 1920 - (selectedComponent.value.w || 100)
    const maxY = 1080 - (selectedComponent.value.h || 100)

    if (prop === 'x') {
      selectedComponent.value.x = Math.round(Math.max(0, Math.min(maxX, numValue)))
    } else if (prop === 'y') {
      selectedComponent.value.y = Math.round(Math.max(0, Math.min(maxY, numValue)))
    }
  }
}

const deleteComponent = (id) => {
  canvasComponents.value = canvasComponents.value.filter(c => c.id !== id)
  if (selectedComponentId.value === id) selectedComponentId.value = null
  updateMultiSelectBox()
}

// 锁定/解锁组件
const toggleLock = (id) => {
  const comp = canvasComponents.value.find(c => c.id === id)
  if (comp) {
    comp.locked = !comp.locked
    ElMessage.success(comp.locked ? '已锁定组件' : '已解锁组件')
  }
}

// 计算对齐辅助线 - 优化版：只显示最近组件的辅助线
const calculateAlignmentLines = (draggingComponents) => {
  // 获取所有未被拖动的组件
  const draggingIds = draggingComponents.map(c => c.id)
  let otherComponents = canvasComponents.value.filter(c => !draggingIds.includes(c.id))

  // 添加画布中心线作为虚拟参照物
  const canvasCenter = {
    id: 'canvas-center',
    x: 960 - 1, // 1920 / 2 (虚拟宽度为1)
    y: 540 - 1, // 1080 / 2 (虚拟高度为1)
    w: 1,
    h: 1,
    isCanvas: true
  }
  otherComponents = [...otherComponents, canvasCenter]

  // 清空当前辅助线
  alignmentLines.vertical = []
  alignmentLines.horizontal = []

  if (otherComponents.length === 0) return { snapX: null, snapY: null }

  // 获取拖动组件的边界
  const draggingComp = draggingComponents[0] // 以第一个组件为参考
  const draggingLeft = draggingComp.x
  const draggingRight = draggingComp.x + draggingComp.w
  const draggingCenterX = draggingComp.x + draggingComp.w / 2
  const draggingTop = draggingComp.y
  const draggingBottom = draggingComp.y + draggingComp.h
  const draggingCenterY = draggingComp.y + draggingComp.h / 2

  let snapX = null
  let snapY = null
  let minDistX = SNAP_THRESHOLD
  let minDistY = SNAP_THRESHOLD
  let nearestCompX = null // 最近的X轴对齐组件
  let nearestCompY = null // 最近的Y轴对齐组件
  let alignTypeX = '' // 对齐类型
  let alignTypeY = ''

  // 检测与其他组件的对齐
  otherComponents.forEach(comp => {
    const compLeft = comp.x
    const compRight = comp.x + comp.w
    const compCenterX = comp.x + comp.w / 2
    const compTop = comp.y
    const compBottom = comp.y + comp.h
    const compCenterY = comp.y + comp.h / 2

    // 垂直方向对齐检测（X轴）
    // 左对齐
    const distLeft = Math.abs(draggingLeft - compLeft)
    if (distLeft < minDistX) {
      minDistX = distLeft
      snapX = compLeft
      nearestCompX = comp
      alignTypeX = 'left'
    }

    // 右对齐
    const distRight = Math.abs(draggingRight - compRight)
    if (distRight < minDistX) {
      minDistX = distRight
      snapX = compRight - draggingComp.w
      nearestCompX = comp
      alignTypeX = 'right'
    }

    // 中心对齐
    const distCenterX = Math.abs(draggingCenterX - compCenterX)
    if (distCenterX < minDistX) {
      minDistX = distCenterX
      snapX = compCenterX - draggingComp.w / 2
      nearestCompX = comp
      alignTypeX = 'center'
    }

    // 水平方向对齐检测（Y轴）
    // 顶对齐
    const distTop = Math.abs(draggingTop - compTop)
    if (distTop < minDistY) {
      minDistY = distTop
      snapY = compTop
      nearestCompY = comp
      alignTypeY = 'top'
    }

    // 底对齐
    const distBottom = Math.abs(draggingBottom - compBottom)
    if (distBottom < minDistY) {
      minDistY = distBottom
      snapY = compBottom - draggingComp.h
      nearestCompY = comp
      alignTypeY = 'bottom'
    }

    // 中心对齐
    const distCenterY = Math.abs(draggingCenterY - compCenterY)
    if (distCenterY < minDistY) {
      minDistY = distCenterY
      snapY = compCenterY - draggingComp.h / 2
      nearestCompY = comp
      alignTypeY = 'middle'
    }
  })

  // 只绘制最近组件的辅助线，并且辅助线只在两个组件之间显示
  if (nearestCompX) {
    const lineX = alignTypeX === 'left'
      ? nearestCompX.x
      : alignTypeX === 'right'
      ? nearestCompX.x + nearestCompX.w
      : nearestCompX.x + nearestCompX.w / 2

    // 计算辅助线的范围（只在拖动组件和参照组件之间）
    const dragCurrentTop = snapY !== null ? snapY : draggingComp.y
    const dragCurrentBottom = dragCurrentTop + draggingComp.h

    const minTop = Math.min(dragCurrentTop, nearestCompX.y)
    const maxBottom = Math.max(dragCurrentBottom, nearestCompX.y + nearestCompX.h)

    alignmentLines.vertical = [{
      position: lineX,
      type: alignTypeX,
      top: minTop,
      height: maxBottom - minTop
    }]
  }

  if (nearestCompY) {
    const lineY = alignTypeY === 'top'
      ? nearestCompY.y
      : alignTypeY === 'bottom'
      ? nearestCompY.y + nearestCompY.h
      : nearestCompY.y + nearestCompY.h / 2

    // 计算辅助线的范围（只在拖动组件和参照组件之间）
    const dragCurrentLeft = snapX !== null ? snapX : draggingComp.x
    const dragCurrentRight = dragCurrentLeft + draggingComp.w

    const minLeft = Math.min(dragCurrentLeft, nearestCompY.x)
    const maxRight = Math.max(dragCurrentRight, nearestCompY.x + nearestCompY.w)

    alignmentLines.horizontal = [{
      position: lineY,
      type: alignTypeY,
      left: minLeft,
      width: maxRight - minLeft
    }]
  }

  return { snapX, snapY }
}

// 清除对齐辅助线
const clearAlignmentLines = () => {
  alignmentLines.vertical = []
  alignmentLines.horizontal = []
}

// 对齐选中的组件
const alignSelectedComponents = (type) => {
  if (selectedComponentIds.value.length < 2) return

  const comps = canvasComponents.value.filter(c =>
    selectedComponentIds.value.includes(c.id)
  )

  // 计算边界
  const minX = Math.min(...comps.map(c => c.x))
  const maxX = Math.max(...comps.map(c => c.x + c.w))
  const minY = Math.min(...comps.map(c => c.y))
  const maxY = Math.max(...comps.map(c => c.y + c.h))
  const midX = (minX + maxX) / 2
  const midY = (minY + maxY) / 2

  comps.forEach(comp => {
    switch (type) {
      case 'left':
        comp.x = minX
        break
      case 'right':
        comp.x = maxX - comp.w
        break
      case 'center-x':
        comp.x = midX - comp.w / 2
        break
      case 'top':
        comp.y = minY
        break
      case 'bottom':
        comp.y = maxY - comp.h
        break
      case 'center-y':
        comp.y = midY - comp.h / 2
        break
      case 'dist-h':
      case 'dist-v':
        // 分布逻辑在下面统一处理
        break
    }
  })

  // 分布逻辑
  if (type === 'dist-h' || type === 'dist-v') {
    const sorted = [...comps].sort((a, b) =>
      type === 'dist-h' ? a.x - b.x : a.y - b.y
    )

    const n = sorted.length
    if (n > 2) {
      if (type === 'dist-h') {
        const totalDist = sorted[n - 1].x - sorted[0].x
        const step = totalDist / (n - 1)
        sorted.forEach((comp, index) => {
          comp.x = sorted[0].x + index * step
        })
      } else {
        const totalDist = sorted[n - 1].y - sorted[0].y
        const step = totalDist / (n - 1)
        sorted.forEach((comp, index) => {
          comp.y = sorted[0].y + index * step
        })
      }
    }
  }

  // 更新多选包围盒
  updateMultiSelectBox()
  ElMessage.success('已对齐组件')
}

// Basic Dragging Logic on Canvas - 支持多选拖动
const startDrag = (event, comp) => {
  // 阻止空格键拖动画布
  if (isSpacePressed.value) {
    return
  }

  // 如果组件被锁定,禁止拖动
  if (comp.locked) {
    ElMessage.warning('组件已锁定,无法拖动')
    return
  }

  event.stopPropagation()

  // 如果点击的组件不在选中列表中，单独选中它
  if (!selectedComponentIds.value.includes(comp.id)) {
    selectComponent(comp.id, event)
  }

  // 检查选中的组件中是否有锁定的
  const hasLockedComponent = selectedComponents.value.some(c => c.locked)
  if (hasLockedComponent) {
    ElMessage.warning('选中的组件中包含已锁定的组件')
    return
  }

  const startX = event.clientX
  const startY = event.clientY

  // 记录所有选中组件的起始位置
  const startPositions = selectedComponents.value.map(c => ({
    id: c.id,
    x: c.x,
    y: c.y
  }))

  const onMouseMove = (e) => {
    // 考虑画布缩放比例
    const dx = (e.clientX - startX) / canvasScale.value
    const dy = (e.clientY - startY) / canvasScale.value

    // 批量移动所有选中的组件（先不应用吸附）
    startPositions.forEach(pos => {
      const component = canvasComponents.value.find(c => c.id === pos.id)
      if (component) {
        component.x = Math.max(0, Math.min(1920 - component.w, pos.x + dx))
        component.y = Math.max(0, Math.min(1080 - component.h, pos.y + dy))
      }
    })

    // 计算对齐并应用吸附
    const { snapX, snapY } = calculateAlignmentLines(selectedComponents.value)

    if (snapX !== null) {
      const offsetX = snapX - selectedComponents.value[0].x
      selectedComponents.value.forEach(c => {
        c.x = Math.max(0, Math.min(1920 - c.w, c.x + offsetX))
      })
    }

    if (snapY !== null) {
      const offsetY = snapY - selectedComponents.value[0].y
      selectedComponents.value.forEach(c => {
        c.y = Math.max(0, Math.min(1080 - c.h, c.y + offsetY))
      })
    }

    // 实时更新多选包围盒
    updateMultiSelectBox()
  }

  const onMouseUp = () => {
    // 拖动结束后取整所有选中组件的位置
    selectedComponents.value.forEach(c => {
      c.x = Math.round(c.x)
      c.y = Math.round(c.y)
    })

    // 清除对齐辅助线
    clearAlignmentLines()

    // 更新多选包围盒
    updateMultiSelectBox()

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// 调整大小逻辑
const startResize = (event, comp, direction) => {
  event.preventDefault()
  event.stopPropagation()

  // 如果组件被锁定,禁止调整大小
  if (comp.locked) {
    ElMessage.warning('组件已锁定,无法调整大小')
    return
  }

  const startX = event.clientX
  const startY = event.clientY
  const startWidth = comp.w
  const startHeight = comp.h
  const startLeft = comp.x
  const startTop = comp.y

  const onMouseMove = (e) => {
    const dx = (e.clientX - startX) / canvasScale.value
    const dy = (e.clientY - startY) / canvasScale.value

    // 根据方向调整组件的位置和大小，不取整以保持流畅性
    switch (direction) {
      case 'n': // 上
        comp.y = startTop + dy
        comp.h = Math.max(50, startHeight - dy)
        break
      case 'ne': // 右上
        comp.y = startTop + dy
        comp.w = Math.max(50, startWidth + dx)
        comp.h = Math.max(50, startHeight - dy)
        break
      case 'e': // 右
        comp.w = Math.max(50, startWidth + dx)
        break
      case 'se': // 右下
        comp.w = Math.max(50, startWidth + dx)
        comp.h = Math.max(50, startHeight + dy)
        break
      case 's': // 下
        comp.h = Math.max(50, startHeight + dy)
        break
      case 'sw': // 左下
        comp.x = startLeft + dx
        comp.w = Math.max(50, startWidth - dx)
        comp.h = Math.max(50, startHeight + dy)
        break
      case 'w': // 左
        comp.x = startLeft + dx
        comp.w = Math.max(50, startWidth - dx)
        break
      case 'nw': // 左上
        comp.x = startLeft + dx
        comp.y = startTop + dy
        comp.w = Math.max(50, startWidth - dx)
        comp.h = Math.max(50, startHeight - dy)
        break
    }
  }

  const onMouseUp = () => {
    // 拖动结束后取整
    comp.x = Math.round(comp.x)
    comp.y = Math.round(comp.y)
    comp.w = Math.round(comp.w)
    comp.h = Math.round(comp.h)

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// 画布平移处理
const handleCanvasPanStart = (e) => {
  // 鼠标中键、右键或空格+左键拖动画布
  if (e.button === 1 || e.button === 2 || (e.button === 0 && isSpacePressed.value)) {
    e.preventDefault()
    isPanning.value = true

    const startX = e.clientX
    const startY = e.clientY
    const startPanX = canvasPanX.value
    const startPanY = canvasPanY.value

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      canvasPanX.value = startPanX + dx
      canvasPanY.value = startPanY + dy
      drawRulers()
    }

    const onMouseUp = () => {
      isPanning.value = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      drawRulers()
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return
  }

  // 左键点击空白区域：开始框选
  if (e.button === 0 && e.target.classList.contains('screen-container')) {
    e.preventDefault()

    const rect = e.target.getBoundingClientRect()
    const startX = (e.clientX - rect.left - canvasPanX.value) / canvasScale.value
    const startY = (e.clientY - rect.top - canvasPanY.value) / canvasScale.value

    isSelecting.value = true
    selectionBox.startX = startX
    selectionBox.startY = startY
    selectionBox.currentX = startX
    selectionBox.currentY = startY

    // 如果不是按住 Ctrl/Cmd，清空之前的选中
    if (!e.ctrlKey && !e.metaKey) {
      selectedComponentIds.value = []
    }

    const onMouseMove = (moveEvent) => {
      selectionBox.currentX = (moveEvent.clientX - rect.left - canvasPanX.value) / canvasScale.value
      selectionBox.currentY = (moveEvent.clientY - rect.top - canvasPanY.value) / canvasScale.value

      // 实时计算框选范围内的组件
      updateSelectionFromBox()
    }

    const onMouseUp = () => {
      isSelecting.value = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
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

// 保存和预览
const handleSave = async () => {
  isSaving.value = true
  saveStatus.value = '保存中...'

  try {
    const projectId = route.params.id
    const projectData = {
      id: projectId,
      name: projectName.value,
      components: canvasComponents.value,
      canvasScale: canvasScale.value,
      canvasPanX: canvasPanX.value,
      canvasPanY: canvasPanY.value,
      updatedAt: new Date().toISOString()
    }

    // 保存到 localStorage (实际项目应该调用API保存到后端)
    const savedProjects = JSON.parse(localStorage.getItem('nocoviz_projects') || '{}')
    savedProjects[projectId] = projectData
    localStorage.setItem('nocoviz_projects', JSON.stringify(savedProjects))

    isSaving.value = false
    saveStatus.value = '已保存'
    ElMessage.success('大屏配置已保存')
  } catch (error) {
    isSaving.value = false
    saveStatus.value = '保存失败'
    ElMessage.error(`保存失败: ${error.message}`)
  }
}

const loadProject = async () => {
  try {
    const projectId = route.params.id
    const savedProjects = JSON.parse(localStorage.getItem('nocoviz_projects') || '{}')
    const projectData = savedProjects[projectId]

    if (projectData) {
      projectName.value = projectData.name || '未命名大屏项目'
      canvasComponents.value = projectData.components || []

      // 恢复画布视图状态
      canvasScale.value = projectData.canvasScale || 0.4
      canvasPanX.value = projectData.canvasPanX || 0
      canvasPanY.value = projectData.canvasPanY || 0

      selectedComponentIds.value = []
      ElMessage.success('项目已加载')
      return true // 返回 true 表示加载了已有项目
    } else {
      // 新项目,使用默认值
      projectName.value = '未命名大屏项目'
      canvasComponents.value = []
      selectedComponentIds.value = []
      return false // 返回 false 表示是新项目
    }
  } catch (error) {
    ElMessage.error(`加载项目失败: ${error.message}`)
    return false
  }
}

// 键盘快捷键
const copiedComponent = ref(null)

// 复制组件 - 工具栏按钮和快捷键共用
const handleCopy = () => {
  if (selectedComponents.value.length > 0) {
    copiedComponent.value = JSON.parse(JSON.stringify(selectedComponents.value))
    ElMessage.success(`已复制 ${selectedComponents.value.length} 个组件`)
  }
}

// 粘贴组件 - 工具栏按钮和快捷键共用
const handlePaste = () => {
  if (!copiedComponent.value) return

  const newIds = []
  const components = Array.isArray(copiedComponent.value) ? copiedComponent.value : [copiedComponent.value]

  components.forEach((comp, index) => {
    const newComp = {
      ...JSON.parse(JSON.stringify(comp)),
      id: Date.now() + index,
      x: comp.x + 20,
      y: comp.y + 20,
      name: comp.name + ' (副本)'
    }
    canvasComponents.value.push(newComp)
    newIds.push(newComp.id)
  })

  // 选中新粘贴的组件
  selectedComponentIds.value = newIds
  ElMessage.success(`已粘贴 ${components.length} 个组件`)
}

// 快速复制组件 - 工具栏按钮和快捷键共用
const handleDuplicate = () => {
  if (selectedComponents.value.length === 0) return

  const newIds = []
  selectedComponents.value.forEach((comp, index) => {
    const newComp = {
      ...JSON.parse(JSON.stringify(comp)),
      id: Date.now() + index,
      x: comp.x + 20,
      y: comp.y + 20,
      name: comp.name + ' (副本)'
    }
    canvasComponents.value.push(newComp)
    newIds.push(newComp.id)
  })

  // 选中新复制的组件
  selectedComponentIds.value = newIds
  ElMessage.success(`已快速复制 ${selectedComponents.value.length} 个组件`)
}

// 清空画布
const handleClearCanvas = async () => {
  console.log('[清空画布] 函数被调用', {
    组件总数: canvasComponents.value.length,
    选中数量: selectedComponentIds.value.length
  })

  if (canvasComponents.value.length === 0) {
    ElMessage.warning('画布中没有组件')
    return
  }

  const hasSelection = selectedComponentIds.value.length > 0

  try {
    // 如果有选中的组件，显示选择菜单
    if (hasSelection) {
      console.log('[清空画布] 有选中组件，显示选择对话框')
      // 使用自定义HTML内容创建三个按钮的对话框
      const result = await ElMessageBox({
        title: '清空画布',
        message: h('div', { style: 'padding: 10px 0;' }, [
          h('p', { style: 'margin-bottom: 15px; font-size: 14px;' },
            `当前已选中 ${selectedComponentIds.value.length} 个组件，画布共有 ${canvasComponents.value.length} 个组件。`
          ),
          h('p', { style: 'font-size: 13px; color: #666;' }, '请选择操作：')
        ]),
        showCancelButton: true,
        showClose: true,
        confirmButtonText: `删除选中 (${selectedComponentIds.value.length}个)`,
        cancelButtonText: `清空全部 (${canvasComponents.value.length}个)`,
        confirmButtonClass: 'el-button--primary',
        cancelButtonClass: 'el-button--danger',
        distinguishCancelAndClose: true,
        type: 'warning'
      })

      console.log('[清空画布] 对话框返回结果:', result)

      // 点击了"删除选中"按钮
      if (result === 'confirm') {
        console.log('[清空画布] 开始删除选中的组件')
        const count = selectedComponentIds.value.length
        const idsToRemove = [...selectedComponentIds.value]
        console.log('[清空画布] 删除前组件数:', canvasComponents.value.length)
        canvasComponents.value = canvasComponents.value.filter(
          c => !idsToRemove.includes(c.id)
        )
        console.log('[清空画布] 删除后组件数:', canvasComponents.value.length)
        selectedComponentIds.value = []
        ElMessage.success(`已删除选中的 ${count} 个组件`)
      }
    } else {
      console.log('[清空画布] 无选中组件，显示清空所有对话框')
      // 没有选中组件，直接清空所有
      await ElMessageBox.confirm(
        `确定要清空画布吗？这将删除所有 ${canvasComponents.value.length} 个组件。`,
        '清空画布',
        {
          confirmButtonText: '确定清空',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'el-button--danger'
        }
      )

      console.log('[清空画布] 用户确认清空，开始执行')
      console.log('[清空画布] 清空前组件数:', canvasComponents.value.length)
      const count = canvasComponents.value.length
      canvasComponents.value = []
      console.log('[清空画布] 清空后组件数:', canvasComponents.value.length)
      selectedComponentIds.value = []
      ElMessage.success(`已清空画布，删除了 ${count} 个组件`)
    }
  } catch (action) {
    console.log('[清空画布] catch 捕获:', action)
    // action === 'cancel' 表示点击了"清空全部"按钮
    if (action === 'cancel' && hasSelection) {
      console.log('[清空画布] 用户选择清空全部（从选择对话框）')
      try {
        // 二次确认清空所有
        await ElMessageBox.confirm(
          `确定要清空画布吗？这将删除所有 ${canvasComponents.value.length} 个组件。`,
          '清空全部组件',
          {
            confirmButtonText: '确定清空',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'el-button--danger'
          }
        )

        console.log('[清空画布] 确认清空全部，开始执行')
        console.log('[清空画布] 清空前组件数:', canvasComponents.value.length)
        const count = canvasComponents.value.length
        canvasComponents.value = []
        console.log('[清空画布] 清空后组件数:', canvasComponents.value.length)
        selectedComponentIds.value = []
        ElMessage.success(`已清空画布，删除了 ${count} 个组件`)
      } catch (err) {
        console.log('[清空画布] 用户取消了清空所有操作', err)
      }
    } else {
      console.log('[清空画布] 用户关闭对话框或取消')
    }
  }
}

const handleKeyDown = (e) => {
  // 空格键: 启用画布拖动模式
  if (e.code === 'Space' && !isSpacePressed.value) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault()
      isSpacePressed.value = true
    }
    return
  }

  // Ctrl/Cmd + S: 保存
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    handleSave()
    return
  }

  // Delete/Backspace: 批量删除选中组件
  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentIds.value.length > 0) {
    // 避免在输入框中误删除
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault()
      // 批量删除
      selectedComponentIds.value.forEach(id => {
        deleteComponent(id)
      })
      ElMessage.success(`已删除 ${selectedComponentIds.value.length} 个组件`)
      deselectComponent()
    }
    return
  }

  // Ctrl/Cmd + C: 批量复制组件
  if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedComponents.value.length > 0) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault()
      handleCopy()
    }
    return
  }

  // Ctrl/Cmd + V: 批量粘贴组件
  if ((e.ctrlKey || e.metaKey) && e.key === 'v' && copiedComponent.value) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault()
      handlePaste()
    }
    return
  }

  // Ctrl/Cmd + D: 批量快速复制组件
  if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedComponents.value.length > 0) {
    e.preventDefault()
    handleDuplicate()
    return
  }

  // ESC: 取消选中
  if (e.key === 'Escape') {
    deselectComponent()
    return
  }

  // 方向键: 移动组件
  if (selectedComponent.value && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault()
      const step = e.shiftKey ? 10 : 1
      switch (e.key) {
        case 'ArrowUp':
          selectedComponent.value.y -= step
          break
        case 'ArrowDown':
          selectedComponent.value.y += step
          break
        case 'ArrowLeft':
          selectedComponent.value.x -= step
          break
        case 'ArrowRight':
          selectedComponent.value.x += step
          break
      }
    }
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

// 键盘抬起事件
const handleKeyUp = (e) => {
  if (e.code === 'Space') {
    isSpacePressed.value = false
  }
}

// 组件挂载时加载项目
onMounted(async () => {
  const isExistingProject = await loadProject()

  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
  enableAutoSave()

  // 初始化画布和标尺
  setTimeout(() => {
    // 只有新项目才自动居中,已有项目使用保存的视图状态
    if (!isExistingProject) {
      fitToScreen()
    }
    drawRulers()

    // 监听窗口大小变化
    window.addEventListener('resize', drawRulers)
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
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
  const previewUrl = `/preview/${projectId}`
  window.open(previewUrl, '_blank')
}

// 右侧配置面板方法
const toggleGroup = (groupKey) => {
  openGroups[groupKey] = !openGroups[groupKey]
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(String(text))
    ElMessage.success('已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

// Mock 数据源管理方法
// 数据集模式相关方法
const handleDatasetChange = async () => {
  if (!selectedDatasetId.value) {
    ElMessage.warning('请先选择数据集')
    return
  }

  try {
    ElMessage.info('正在加载数据集...')

    // Load dataset preview data
    const response = await datasetApi.previewDataset(selectedDatasetId.value, {
      page: 1,
      pageSize: 100
    })

    if (response && response.data) {
      // Apply data to selected component
      if (selectedComponent.value) {
        selectedComponent.value.data = response.data
      }

      // Update field mapping if available
      if (response.fields) {
        mappingFields.xAxis = response.fields.xAxis || 'category_name'
        mappingFields.yAxis = response.fields.yAxis || 'sales_amount'
      }

      // Update row count
      dataRowCount.value = response.total || response.data.length
      ElMessage.success(`数据集已加载 (${dataRowCount.value} 行)`)
    }
  } catch (error) {
    ElMessage.error(`加载数据集失败: ${error.message}`)
  }
}

const editCurrentDataset = () => {
  if (!selectedDatasetId.value) {
    ElMessage.warning('请先选择数据集')
    return
  }
  // Navigate to dataset edit page
  router.push(`/datasets/edit/${selectedDatasetId.value}`)
}

const createDataset = () => {
  ElMessage.info('跳转到创建数据集页面...')
  router.push('/datasets/create')
}

const refreshData = () => {
  if (!selectedDatasetId.value) {
    ElMessage.warning('请先选择数据集')
    return
  }
  // Reload current dataset by calling existing method
  handleDatasetChange()
}

const openMockEditor = () => {
  showMockEditor.value = true
}

const handleMockDataSave = (data) => {
  currentMockData.value = data
  ElMessage.success('Mock 数据已保存')
}

const getMockDataSize = () => {
  const bytes = new Blob([currentMockData.value]).size
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const applyMockData = () => {
  if (!selectedComponent.value || !currentMockData.value) {
    ElMessage.warning('请先创建 Mock 数据')
    return
  }

  try {
    const data = JSON.parse(currentMockData.value)
    selectedComponent.value.data = data
    ElMessage.success('Mock数据已应用到组件')
  } catch (err) {
    ElMessage.error('数据格式错误')
  }
}

// 数据库方法
const testDBConnection = async () => {
  if (!dbHost.value || !dbName.value) {
    ElMessage.warning('请填写主机地址和数据库名')
    return
  }

  try {
    ElMessage.info('测试连接中...')
    const config = {
      type: dbType.value,
      host: dbHost.value,
      database: dbName.value,
      user: dbUser.value,
      password: dbPassword.value
    }
    await datasetApi.testConnectionConfig(config)
    ElMessage.success('数据库连接成功')
  } catch (error) {
    ElMessage.error(`数据库连接失败: ${error.message}`)
  }
}

const applyDBData = async () => {
  if (!selectedComponent.value || !dbQuery.value) {
    ElMessage.warning('请输入 SQL 查询语句')
    return
  }

  try {
    ElMessage.info('查询数据中...')
    // Note: This requires a connection ID. For now, we'll use a placeholder.
    // In a real implementation, you'd need to select or create a connection first.
    const connectionId = 'default' // TODO: Get actual connection ID from UI

    // Validate SQL query
    const response = await datasetApi.validateSQL(dbQuery.value, connectionId)

    if (response && response.data) {
      selectedComponent.value.data = response.data
      ElMessage.success('数据已应用到组件')
    } else {
      ElMessage.warning('查询返回空数据')
    }
  } catch (error) {
    ElMessage.error(`数据库查询失败: ${error.message}`)
  }
}

// API方法
const testAPIConnection = async () => {
  if (!apiUrl.value) {
    ElMessage.warning('请输入接口地址')
    return
  }

  try {
    ElMessage.info('测试请求中...')
    const response = await fetch(apiUrl.value, {
      method: apiMethod.value,
      headers: apiHeaders.value ? JSON.parse(apiHeaders.value) : {},
    })

    if (response.ok) {
      ElMessage.success('接口请求成功')
    } else {
      ElMessage.error(`请求失败: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    ElMessage.error(`接口请求失败: ${error.message}`)
  }
}

const applyAPIData = async () => {
  if (!selectedComponent.value || !apiUrl.value) {
    ElMessage.warning('请输入接口地址')
    return
  }

  try {
    ElMessage.info('获取接口数据中...')
    const response = await fetch(apiUrl.value, {
      method: apiMethod.value,
      headers: apiHeaders.value ? JSON.parse(apiHeaders.value) : {},
      body: apiMethod.value !== 'GET' && apiBody.value ? apiBody.value : undefined
    })

    if (response.ok) {
      const data = await response.json()

      // 处理数据路径
      let finalData = data
      if (apiDataPath.value) {
        const paths = apiDataPath.value.split('.')
        for (const path of paths) {
          if (finalData && typeof finalData === 'object') {
            finalData = finalData[path]
          }
        }
      }

      selectedComponent.value.data = finalData
      ElMessage.success('接口数据已应用到组件')
    } else {
      ElMessage.error(`请求失败: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    ElMessage.error(`接口数据获取失败: ${error.message}`)
  }
}

// 业务数据集方法
const editDataset = (id) => {
  if (!id) {
    ElMessage.warning('数据集ID无效')
    return
  }

  try {
    // Navigate to dataset edit page
    router.push(`/datasets/edit/${id}`)
    ElMessage.info('正在跳转到数据集编辑页面...')
  } catch (error) {
    ElMessage.error(`跳转失败: ${error.message}`)
  }
}

const deleteDataset = (id) => {
  datasets.value = datasets.value.filter(d => d.id !== id)
  ElMessage.success('数据集已删除')
}

const useDataset = async (id) => {
  if (!selectedComponent.value) {
    ElMessage.warning('请先选择一个组件')
    return
  }

  try {
    ElMessage.info('正在加载数据集...')

    // 加载数据集详情和数据
    const datasetResponse = await datasetApi.getDataset(id)

    if (datasetResponse && datasetResponse.data) {
      // 应用数据集到选中的组件
      selectedComponent.value.data = datasetResponse.data

      // 更新数据集引用ID
      if (!selectedComponent.value.datasetId) {
        selectedComponent.value.datasetId = id
      }

      ElMessage.success(`数据集已应用: ${datasetResponse.name || '未命名数据集'}`)
    } else {
      ElMessage.warning('数据集数据为空')
    }
  } catch (error) {
    ElMessage.error(`加载数据集失败: ${error.message}`)
  }
}

// 新增方法:格式化JSON
const formatJSON = () => {
  try {
    const parsed = JSON.parse(staticJsonData.value)
    staticJsonData.value = JSON.stringify(parsed, null, 2)
    ElMessage.success('JSON 已格式化')
  } catch (error) {
    ElMessage.error('JSON 格式错误')
  }
}

// 应用静态JSON数据
const applyStaticJSON = () => {
  try {
    const data = JSON.parse(staticJsonData.value)
    if (selectedComponent.value) {
      selectedComponent.value.data = data
      ElMessage.success('静态数据已应用')
    }
  } catch (error) {
    ElMessage.error('JSON 格式错误')
  }
}

// 保存为公共数据集
const saveAsDataset = async () => {
  if (!apiUrl.value) {
    ElMessage.warning('请先配置接口地址')
    return
  }

  try {
    ElMessage.info('正在创建数据集...')

    // 准备数据集配置
    const datasetConfig = {
      name: `API数据集_${new Date().toLocaleString('zh-CN')}`,
      description: `从临时API配置创建: ${apiUrl.value}`,
      sourceType: 'api',
      sourceName: apiUrl.value,
      updateStrategy: 'cached',
      cacheTime: 300,
      config: {
        url: apiUrl.value,
        method: apiMethod.value,
        headers: apiHeaders.value ? JSON.parse(apiHeaders.value) : {},
        body: apiBody.value || ''
      }
    }

    // 调用API创建数据集
    const response = await datasetApi.createDataset(datasetConfig)

    if (response && response.id) {
      ElMessage.success('数据集创建成功')

      // 自动应用新创建的数据集到当前组件
      if (selectedComponent.value) {
        selectedComponent.value.datasetId = response.id
        selectedDatasetId.value = response.id
      }

      // 跳转到数据集编辑页面
      router.push(`/datasets/edit/${response.id}`)
    } else {
      ElMessage.warning('数据集创建成功，但未返回ID')
    }
  } catch (error) {
    ElMessage.error(`创建数据集失败: ${error.message}`)
  }
}

const getStrategyText = (strategy) => {
  const strategyMap = {
    realtime: '实时直连',
    cached: '缓存模式',
    static: '静态数据'
  }
  return strategyMap[strategy] || strategy
}

// 交互事件管理
const componentEvents = ref([])
const currentEventIndex = ref(null)

// 添加事件
const addEvent = () => {
  const newEvent = {
    trigger: 'click',
    action: 'navigate',
    params: {
      url: '',
      newWindow: false,
      targetId: '',
      operation: 'toggle',
      message: '',
      type: 'info',
      script: ''
    }
  }
  componentEvents.value.push(newEvent)
  currentEventIndex.value = componentEvents.value.length - 1
  ElMessage.success('已添加新事件')
}

// 删除事件
const deleteEvent = (index) => {
  componentEvents.value.splice(index, 1)
  if (currentEventIndex.value === index) {
    currentEventIndex.value = null
  } else if (currentEventIndex.value > index) {
    currentEventIndex.value--
  }
  ElMessage.success('已删除事件')
}

// 选择事件
const selectEvent = (index) => {
  currentEventIndex.value = index
}

// 获取触发条件标签
const getEventTriggerLabel = (trigger) => {
  const labels = {
    click: '点击',
    dblclick: '双击',
    mouseenter: '鼠标移入',
    mouseleave: '鼠标移出',
    dataUpdate: '数据更新'
  }
  return labels[trigger] || trigger
}

// 获取动作标签
const getEventActionLabel = (action) => {
  const labels = {
    navigate: '跳转链接',
    toggleComponent: '显示/隐藏组件',
    refreshData: '刷新数据',
    showMessage: '弹出提示',
    runScript: '执行脚本'
  }
  return labels[action] || action
}

// 动作改变处理
const handleActionChange = () => {
  // Reset params when action changes
  if (currentEventIndex.value !== null) {
    const event = componentEvents.value[currentEventIndex.value]
    event.params = {
      url: '',
      newWindow: false,
      targetId: '',
      operation: 'toggle',
      message: '',
      type: 'info',
      script: ''
    }
  }
}
</script>

<style scoped>
/* ==================== 全新设计系统：大厂级 UI 规范 ==================== */
.screen-editor {
  /* 品牌色 - 科技蓝 */
  --primary: #1677ff;
  --primary-hover: #4096ff;
  --primary-bg: #e6f4ff;
  --primary-border: #91caff;

  /* 中性色 - 浅色主题 */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* 功能色 */
  --success: #52c41a;
  --success-bg: #f6ffed;
  --warning: #faad14;
  --warning-bg: #fffbe6;
  --error: #ff4d4f;
  --error-bg: #fff2f0;

  /* 布局尺寸 */
  --header-height: 48px;
  --sidebar-width: 260px;
  --prop-width: 300px;
  --activity-width: 48px;
  --panel-width: 260px;

  /* 深色主题色 */
  --bg-activity-bar: #0f1115;
  --bg-side-panel: #14161a;
  --bg-item: #1a1d24;
  --bg-item-hover: #20242c;
  --border-color: #2a2e35;
  --accent-color: #3b82f6;
  --accent-bg: rgba(59, 130, 246, 0.1);
  --text-main: #e5e7eb;
  --text-muted: #9ca3af;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  /* 字体 */
  --font-xs: 11px;
  --font-sm: 12px;
  --font-md: 13px;
  --font-lg: 14px;

  /* 阴影 */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);

  /* 过渡 */
  --transition-fast: 0.15s;
  --transition-base: 0.2s;
  --transition-slow: 0.3s;

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--gray-50);
  color: var(--gray-700);
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  font-size: var(--font-md);
}

* { box-sizing: border-box; outline: none; }

/* ==================== 1. 顶部导航栏 Header - 重构版 ==================== */
.editor-header {
  height: 56px;
  background: #18181c;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.home-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  color: #e5e5e5;
  background: transparent;
  border: none;
  padding: 0;
}

.home-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.divider-v {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.08);
}

.history-controls {
  display: flex;
  gap: 4px;
}

.align-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.divider-mini {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.06);
  margin: 0 2px;
}

.icon-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #909399;
  cursor: pointer;
  transition: 0.2s;
  background: transparent;
  border: none;
  padding: 0;
}

.icon-btn:hover:not(.disabled) {
  color: #e5e5e5;
  background: rgba(255, 255, 255, 0.05);
}

.icon-btn.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.icon-btn.danger {
  color: #f56c6c;
}

.icon-btn.danger:hover:not(.disabled) {
  color: #fff;
  background: rgba(245, 108, 108, 0.15);
}

.project-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.project-title {
  background: transparent;
  border: 1px solid transparent;
  color: #e5e5e5;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  width: 200px;
  transition: 0.2s;
  outline: none;
}

.project-title:hover {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
}

.project-title:focus {
  border-color: #409eff;
  background: #000;
}

.status-badge {
  background: #333;
  color: #888;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: 500;
}

/* 中间：对齐工具和状态指示 */
.header-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #909399;
  opacity: 0.8;
}

.saving-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-text {
  font-family: monospace;
}

/* 右侧：操作按钮 */
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
}

.canvas-zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 12px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.zoom-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #909399;
  cursor: pointer;
  transition: 0.2s;
  padding: 0;
}

.zoom-btn:hover {
  color: #e5e5e5;
  background: rgba(255, 255, 255, 0.05);
}

.zoom-text {
  font-size: 11px;
  color: #909399;
  min-width: 40px;
  text-align: center;
  font-family: monospace;
  font-weight: 500;
}

.btn {
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
  color: #e5e5e5;
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: #909399;
}

.btn-primary {
  background: linear-gradient(135deg, #409eff, #3b82f6);
  color: white;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.4);
}

.btn-primary:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.4);
}

.btn-more {
  width: 32px;
  padding: 0;
  justify-content: center;
  color: #909399;
}

.btn-more:hover {
  color: white;
}

/* ==================== 2. 主体容器 ==================== */
.main-container {
  flex: 1;
  display: flex;
  height: calc(100vh - var(--header-height));
  overflow: hidden;
}

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

/* 面板折叠按钮 */
.panel-toggle-btn {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: var(--bg-side-panel);
  border: 1px solid var(--border-color);
  border-left: none;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  padding: 0;
  color: #666;
}
.panel-toggle-btn:hover {
  background: #2a2a2e;
  color: #e5e5e5;
  width: 26px;
}
.panel-toggle-btn svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}
.side-panel.collapsed .panel-toggle-btn {
  right: -24px;
  border-radius: 0 8px 8px 0;
}
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
.caret { width: 20px; height: 20px; margin-right: 6px; transition: 0.2s; }
.category-block.closed .caret { transform: rotate(-90deg); }
.category-block.closed .comp-grid { display: none; }
.comp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.comp-item {
  background: rgba(10, 28, 48, 0.4);
  border: 1px solid rgba(0, 242, 242, 0.1);
  border-radius: 4px;
  padding: 0;
  display: flex;
  flex-direction: column;
  cursor: grab;
  transition: all 0.2s;
  overflow: hidden;
  position: relative;
}
.comp-item:hover {
  background: rgba(10, 28, 48, 0.6);
  border-color: rgba(0, 242, 242, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 242, 242, 0.2);
}

/* 图表预览区域 */
.chart-preview {
  width: 100%;
  height: 80px;
  background: rgba(5, 13, 25, 0.6);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-preview .chart-icon-mini {
  width: 48px;
  height: 48px;
  opacity: 0.8;
}

/* 图表标签栏 */
.comp-label {
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.chart-icon-mini {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.9;
}

.chart-icon-mini path {
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.comp-name {
  font-size: 11px;
  color: #bcd0e3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.no-results {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 40px 20px; color: #666; font-size: 13px; text-align: center;
}

.layer-item {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  color: var(--text-muted);
  border-left: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.layer-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-main);
}

.layer-item.selected {
  background: var(--accent-bg);
  color: var(--text-main);
  border-left-color: var(--accent-color);
  font-weight: 500;
}

/* 锁定状态 */
.layer-item.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.layer-item.locked .layer-name {
  text-decoration: line-through;
}

.layer-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  opacity: 0.7;
  flex-shrink: 0;
}

.layer-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layer-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.15s ease;
  flex-shrink: 0;
}

.layer-item:hover .layer-actions {
  opacity: 1;
}

.layer-item.locked .layer-actions {
  opacity: 1;
}

.action-mini {
  width: 14px;
  height: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-mini:hover {
  color: var(--accent-color);
  transform: scale(1.2);
}

/* Canvas */
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: #0a0b0d;
}

/* 标尺容器 - Grid布局 */
.ruler-container {
  flex: 1;
  display: grid;
  grid-template-columns: 24px 1fr;
  grid-template-rows: 24px 1fr;
  width: 100%;
  height: 100%;
}

/* 左上角死角 */
.ruler-corner {
  background: #18181c;
  border-right: 1px solid #303033;
  border-bottom: 1px solid #303033;
  z-index: 20;
  color: #409eff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* 横向标尺容器 */
.ruler-h-wrapper {
  position: relative;
  background: #18181c;
  border-bottom: 1px solid #303033;
  overflow: hidden;
}

/* 纵向标尺容器 */
.ruler-v-wrapper {
  position: relative;
  background: #18181c;
  border-right: 1px solid #303033;
  overflow: hidden;
}

/* 标尺 Canvas */
.ruler-canvas {
  display: block;
}

/* 画布视口容器 */
.canvas-viewport {
  position: relative;
  overflow: hidden;
  background-color: #0f1014;

  /* 优化后的轻量网格背景 */
  background-image:
    /* 1. 十字准星角标记 (更低透明度，更轻盈) */
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h6v1H1v5h-1z' fill='%23409eff' fill-opacity='0.2'/%3E%3Cpath d='M94 0h6v6h-1V1h-5z' fill='%23409eff' fill-opacity='0.2'/%3E%3Cpath d='M94 100h6v-6h-1v5h-5z' fill='%23409eff' fill-opacity='0.2'/%3E%3Cpath d='M0 100h6v-1H1v-5h-1z' fill='%23409eff' fill-opacity='0.2'/%3E%3C/svg%3E"),

    /* 2. 小网格线 (极低透明度，视觉更轻) */
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);

  /* 背景尺寸控制 */
  background-size:
    100px 100px,  /* 十字准星间距 100px */
    20px 20px,    /* 小网格间距 20px */
    20px 20px;

  background-position: -1px -1px;
}

/* 游标线 */
/* 十字辅助线系统容器 */
.crosshair-system {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}

/* 横向辅助线 */
.guide-h {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  border-top: 1px dashed rgba(64, 158, 255, 0.6);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, border-color 0.1s ease;
  filter: drop-shadow(0 0 4px rgba(64, 158, 255, 0.5));
  will-change: transform;
}

/* 纵向辅助线 */
.guide-v {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  border-left: 1px dashed rgba(64, 158, 255, 0.6);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, border-color 0.1s ease;
  filter: drop-shadow(0 0 4px rgba(64, 158, 255, 0.5));
  will-change: transform;
}

/* 坐标标签通用样式 */
.coord-label {
  position: absolute;
  background: rgba(64, 158, 255, 0.95);
  color: #ffffff;
  font-size: 10px;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 3px;
  white-space: nowrap;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
}

/* X轴标签（顶部） */
.label-x {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-top: 2px solid rgba(255, 255, 255, 0.8);
}

/* Y轴标签（左侧） */
.label-y {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  border-left: 2px solid rgba(255, 255, 255, 0.8);
}

/* 跟随鼠标的HUD坐标显示 */
.cursor-hud {
  position: absolute;
  opacity: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(64, 158, 255, 0.3);
  color: #e5e5e5;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  display: flex;
  gap: 12px;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: opacity 0.15s ease;
  will-change: transform;
}

.cursor-hud span {
  color: #999;
}

.hud-val {
  color: #409eff !important;
  font-weight: 700;
}

/* 画布变换包装器 */
.canvas-transform-wrapper {
  position: absolute;
  inset: 0;
  will-change: transform;
  transition: transform 0.1s ease-out;
}

.canvas-transform-wrapper.panning {
  transition: none;
}

.screen-container {
  width: 1920px;
  height: 1080px;
  background: #0f1115;
  position: relative;
  margin: 0;

  /* 科技感边框 */
  border: 1px solid rgba(64, 158, 255, 0.2);
  box-shadow:
    0 0 0 1px rgba(64, 158, 255, 0.1),
    0 0 40px rgba(0, 0, 0, 0.5),
    inset 0 0 60px rgba(64, 158, 255, 0.02);

  /* 四角标记 */
  background-image:
    linear-gradient(to right, #409eff 12px, transparent 12px),
    linear-gradient(to right, #409eff 12px, transparent 12px),
    linear-gradient(to bottom, #409eff 12px, transparent 12px),
    linear-gradient(to bottom, #409eff 12px, transparent 12px),
    linear-gradient(to right, #409eff 12px, transparent 12px),
    linear-gradient(to right, #409eff 12px, transparent 12px),
    linear-gradient(to bottom, #409eff 12px, transparent 12px),
    linear-gradient(to bottom, #409eff 12px, transparent 12px);

  background-size:
    12px 2px, 12px 2px,
    2px 12px, 2px 12px,
    12px 2px, 12px 2px,
    2px 12px, 2px 12px;

  background-position:
    0 0, 0 100%,
    0 0, 100% 0,
    100% 0, 100% 100%,
    0 100%, 100% 100%;

  background-repeat: no-repeat;
}
.screen-watermark {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  font-size: 24px; font-weight: bold; letter-spacing: 2px; opacity: 0.3; color: #444; pointer-events: none;
}

/* 框选工具 */
.selection-box {
  position: absolute;
  border: 2px solid #409eff;
  background: rgba(64, 158, 255, 0.1);
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.3), 0 0 20px rgba(64, 158, 255, 0.3);
}

/* 对齐辅助线 - 优化版 */
.alignment-line {
  position: absolute;
  pointer-events: none;
  z-index: 999;
  background: #ff4757;
  box-shadow: 0 0 4px rgba(255, 71, 87, 0.5);
  animation: alignmentFadeIn 0.15s ease;
}

@keyframes alignmentFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.alignment-line-vertical {
  width: 1px;
  /* height 和 top 由内联样式动态设置 */
}

.alignment-line-horizontal {
  height: 1px;
  /* width 和 left 由内联样式动态设置 */
}

/* 多选包围盒 - 战术锁定效果 */
.multi-select-box {
  position: absolute;
  z-index: 900;
  pointer-events: none;
  border: 1px dashed #409eff;
  background: rgba(64, 158, 255, 0.03);
  animation: multiSelectFadeIn 0.2s ease;
}

@keyframes multiSelectFadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* HUD 科技感四角装饰 */
.corner-bracket {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid #409eff;
  transition: all 0.2s ease;
}

.corner-bracket.corner-tl {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

.corner-bracket.corner-tr {
  top: -1px;
  right: -1px;
  border-left: none;
  border-bottom: none;
}

.corner-bracket.corner-bl {
  bottom: -1px;
  left: -1px;
  border-right: none;
  border-top: none;
}

.corner-bracket.corner-br {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
}

.multi-select-box:hover .corner-bracket {
  width: 16px;
  height: 16px;
  border-width: 3px;
}

/* 尺寸标签 */
.multi-select-size-label {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(64, 158, 255, 0.95);
  color: #ffffff;
  font-size: 11px;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 3px;
  white-space: nowrap;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
}

/* 悬浮对齐工具栏 */
.align-toolbar {
  position: absolute;
  top: -48px;
  left: 50%;
  transform: translateX(-50%);
  height: 38px;
  background: rgba(30, 30, 35, 0.95);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  gap: 2px;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  pointer-events: auto;
  white-space: nowrap;
}

/* 工具按钮 */
.tool-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  color: #999;
  transition: all 0.15s ease;
}

.tool-btn:hover {
  background: rgba(64, 158, 255, 0.15);
  color: #409eff;
}

.tool-btn:active {
  transform: scale(0.95);
}

.tool-btn svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 4px;
}

/* Rendered Components on Canvas */
.canvas-component {
  position: absolute;
  border: 2px solid transparent;
  cursor: move;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 4px;
  transition: box-shadow 0.2s ease, transform 0.1s ease;
}

.canvas-component:hover {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.3);
}

.canvas-component.selected {
  z-index: 10;
  outline: 2px solid #409eff !important;
  outline-offset: -2px;
}

/* 锁定组件样式 */
.canvas-component.locked {
  cursor: not-allowed;
  opacity: 0.7;
}

.canvas-component.locked::after {
  content: '';
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(255, 193, 7, 0.9);
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z'/%3E%3C/svg%3E");
  background-size: 14px 14px;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
}

.canvas-component.locked:hover {
  box-shadow: 0 0 0 1px rgba(255, 193, 7, 0.3);
}

.canvas-component > * {
  pointer-events: none;
}

/* Resize handles - 专业级控制点 */
.resize-handle {
  position: absolute;
  background: #ffffff;
  border: 2px solid #409eff;
  border-radius: 2px;
  pointer-events: auto;
  z-index: 100;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(64, 158, 255, 0.1);
  opacity: 0.95;
}

.resize-handle:hover {
  background: #409eff;
  border-color: #66b1ff;
  box-shadow:
    0 0 0 4px rgba(64, 158, 255, 0.25),
    0 4px 16px rgba(64, 158, 255, 0.4);
  transform: scale(1.2);
  opacity: 1;
}

/* Corner handles */
.resize-handle.n,
.resize-handle.s {
  width: 40px;
  height: 6px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

.resize-handle.e,
.resize-handle.w {
  width: 6px;
  height: 40px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.resize-handle.n {
  top: -3px;
}

.resize-handle.s {
  bottom: -3px;
}

.resize-handle.e {
  right: -3px;
}

.resize-handle.w {
  left: -3px;
}

/* Diagonal corners */
.resize-handle.ne,
.resize-handle.nw,
.resize-handle.se,
.resize-handle.sw {
  width: 8px;
  height: 8px;
}

.resize-handle.ne {
  top: -4px;
  right: -4px;
  cursor: nesw-resize;
}

.resize-handle.nw {
  top: -4px;
  left: -4px;
  cursor: nwse-resize;
}

.resize-handle.se {
  bottom: -4px;
  right: -4px;
  cursor: nwse-resize;
}

.resize-handle.sw {
  bottom: -4px;
  left: -4px;
  cursor: nesw-resize;
}

/* 尺寸标注标签 */
.size-label {
  position: absolute;
  background: rgba(64, 158, 255, 0.95);
  color: #fff;
  font-size: 11px;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 3px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 101;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
}

.size-label-top {
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
}

.size-label-left {
  left: -42px;
  top: 50%;
  transform: translateY(-50%);
}

/* Right Config Panel - 科技感重构 */
.config-panel {
  width: 300px;
  background: linear-gradient(180deg, #16171b 0%, #18181c 100%);
  border-left: 1px solid rgba(64, 158, 255, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 20;
  box-shadow:
    -1px 0 0 rgba(64, 158, 255, 0.1),
    inset 1px 0 20px rgba(0, 0, 0, 0.3);
}

/* 顶部 Tabs - 科技感设计 */
.panel-tabs {
  display: flex;
  border-bottom: 1px solid rgba(64, 158, 255, 0.15);
  background: linear-gradient(180deg, #1a1b1f 0%, #18181c 100%);
  height: 40px;
  line-height: 40px;
  flex-shrink: 0;
  box-shadow:
    0 1px 0 rgba(64, 158, 255, 0.1),
    inset 0 -1px 10px rgba(0, 0, 0, 0.2);
}
.tab-item {
  flex: 1;
  text-align: center;
  cursor: pointer;
  color: #808590;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
  font-size: 13px;
  font-weight: 500;
  position: relative;
}
.tab-item:hover {
  color: #c0c4cc;
  background: rgba(64, 158, 255, 0.05);
}
.tab-item.active {
  color: #409eff;
  background: linear-gradient(180deg, rgba(64, 158, 255, 0.08) 0%, rgba(64, 158, 255, 0.02) 100%);
  border-bottom-color: #409eff;
  box-shadow:
    inset 0 1px 0 rgba(64, 158, 255, 0.1),
    0 2px 8px rgba(64, 158, 255, 0.15);
}

/* 内容滚动区 */
.panel-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 12px 20px 12px;
}

/* 滚动条美化 */
.panel-content::-webkit-scrollbar {
  width: 4px;
}
.panel-content::-webkit-scrollbar-track {
  background: transparent;
}
.panel-content::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 2px;
}
.panel-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 分组折叠头 - 紧凑版本 */
.group-section {
  border-bottom: 1px solid #2a2e35;
  padding: 4px 0;
}
.group-section:last-child { border-bottom: none; }

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  height: auto;
  background: transparent;
  border: none;
  cursor: pointer;
  user-select: none;
  margin-bottom: 6px;
}
.group-header:hover .group-title { color: #fff; }

.group-arrow {
  width: 0; height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #666;
  transition: transform 0.2s;
  margin-right: 6px;
}
.group-section:not(.open) .group-arrow { transform: rotate(-90deg); }

.group-title {
  font-size: 11px;
  font-weight: 600;
  color: #ccc;
  flex: 1;
  display: flex;
  align-items: center;
}

.group-body {
  background: transparent;
}

/* ===== 表单样式 - 科技感重构 ===== */
.form-group {
  margin-bottom: 14px;
}

.form-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.form-input {
  width: 100%;
  background: #0a0b0d;
  border: 1px solid rgba(64, 158, 255, 0.25);
  color: #e5e5e5;
  padding: 0 10px;
  height: 28px;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
  transition: all 0.2s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.4),
    0 0 0 0 rgba(64, 158, 255, 0);
}

.form-input:focus {
  border-color: #409eff;
  background: #0f1012;
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.3),
    0 0 0 3px rgba(64, 158, 255, 0.1),
    0 0 12px rgba(64, 158, 255, 0.2);
}

.form-input:hover {
  border-color: rgba(64, 158, 255, 0.3);
  background: #0f1012;
}

.form-input:disabled,
.form-input[readonly] {
  opacity: 0.5;
  cursor: not-allowed;
  color: #666;
  background: #0a0b0d;
}

.form-input-small {
  width: 50px;
  background: linear-gradient(180deg, #0d0e10 0%, #111113 100%);
  border: 1px solid rgba(64, 158, 255, 0.15);
  color: #e5e5e5;
  padding: 0 6px;
  height: 28px;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  outline: none;
  transition: all 0.2s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.form-input-small:focus {
  border-color: #409eff;
  background: #0f1012;
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(64, 158, 255, 0.1),
    0 0 8px rgba(64, 158, 255, 0.2);
}

.form-input-small:hover {
  border-color: rgba(64, 158, 255, 0.3);
}

/* Textarea 样式 */
.form-textarea {
  width: 100%;
  background: #3c3c3c;
  border: 1px solid transparent;
  color: #e0e0e0;
  padding: 8px;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
}

.form-textarea:focus {
  border-color: #3b82f6;
}

/* 按钮样式 */
.btn-primary-full {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary-full:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(118, 75, 162, 0.4);
}

.btn-primary {
  background: #3b82f6;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #374151;
  border: 1px solid #4b5563;
  color: #e0e0e0;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* 数据信息卡片 */
.data-info-card {
  background: #2d2d2d;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 11px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #90a0a5;
}

.info-value {
  color: #e0e0e0;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
}

.input-suffix {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #90a0a5;
  font-size: 10px;
  pointer-events: none;
}

.input-unit {
  font-size: 10px;
  color: #666;
}

.icon-copy {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  color: #909399;
}

.icon-copy:hover {
  opacity: 1;
  color: #e5e5e5;
}

/* 节标题样式 */
.section-title {
  font-weight: 600;
  font-size: 12px;
  color: #e5e5e5;
  margin-bottom: 8px;
}

.divider {
  height: 1px;
  background: #303033;
  margin: 16px 0;
  border: 0;
}

/* 模式切换 Tabs */
.mode-tabs {
  display: flex;
  background: #252529;
  border-bottom: 1px solid var(--border);
  padding: 4px;
  gap: 4px;
  margin-bottom: 0;
}

.mode-tab {
  flex: 1;
  text-align: center;
  padding: 6px;
  font-size: 12px;
  cursor: pointer;
  color: #909399;
  border-radius: 4px;
  transition: all 0.2s;
}

.mode-tab.active {
  background: #3a3a3f;
  color: white;
  font-weight: 600;
}

.mode-content {
  padding: 16px;
}

/* 提示框 */
.tip-box {
  background: rgba(230, 162, 60, 0.1);
  border: 1px solid rgba(230, 162, 60, 0.2);
  color: #e6a23c;
  padding: 8px;
  border-radius: 4px;
  font-size: 11px;
  margin-bottom: 12px;
  line-height: 1.4;
}

/* 代码编辑器 */
.code-editor {
  width: 100%;
  background: #111;
  border: 1px solid #333;
  color: #a9b7c6;
  font-family: monospace;
  padding: 8px;
  font-size: 12px;
  resize: vertical;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}

.code-editor:focus {
  border-color: #409eff;
}

/* 升级按钮 */
.btn-upgrade {
  width: 100%;
  padding: 8px;
  background: #e6a23c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;
  margin-top: 12px;
}

.btn-upgrade:hover {
  background: #d39530;
}

/* 输入框与按钮组合 */
.input-with-button {
  display: flex;
  gap: 6px;
  align-items: center;
}

.btn-icon-square {
  width: 28px;
  height: 28px;
  background: #3a3a3f;
  border: 1px solid #444;
  border-radius: 4px;
  color: #e0e0e0;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-icon-square:hover {
  background: #4a4a4f;
  border-color: #555;
}

/* 状态指示器 */
.status-success {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #67c23a;
  font-size: 11px;
}

.status-success::before {
  content: '●';
  font-size: 8px;
}

/* 简化的字段映射 */
.field-mapping-simple {
  background: #2d2d2d;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  padding: 8px;
  margin-top: 8px;
  font-size: 11px;
}

.field-mapping-simple .mapping-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  color: #909399;
}

.field-mapping-simple .mapping-row span:first-child {
  color: #67c23a;
}

/* 全宽按钮组 */
.btn-full {
  width: 100%;
  padding: 8px;
  background: #3a3a3f;
  border: 1px solid #444;
  border-radius: 4px;
  color: #e0e0e0;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.btn-full:hover {
  background: #4a4a4f;
  border-color: #555;
}

/* 颜色选择器组 - 按模板重写 */
.color-picker-group {
  display: flex;
  align-items: center;
  background: #111113;
  border: 1px solid #333;
  border-radius: 3px;
  padding: 2px;
  width: 100%;
  transition: border 0.2s;
}

.color-picker-group:hover {
  border-color: #444;
}

.color-picker-group:focus-within {
  border-color: #409eff;
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  margin: 0 6px 0 2px;
  border: 1px solid #444;
  cursor: pointer;
  flex-shrink: 0;
}

.color-input {
  border: none !important;
  background: transparent !important;
  flex: 1;
  height: 20px;
  padding: 0 !important;
  color: #e5e5e5 !important;
}

/* 网格布局优化 - 按模板 */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.grid-item {
  position: relative;
}

.grid-label {
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  font-size: 10px;
  pointer-events: none;
  z-index: 1;
}

.grid-item .form-input {
  padding-left: 20px;
}

/* 滑块容器 - 按模板重写 */
.slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dv-slider {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
  flex: 1;
}

.dv-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #e5e5e5;
  cursor: pointer;
  margin-top: -4px;
}

.dv-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  background: #333;
  border-radius: 2px;
}

/* 属性行布局 - 按模板 */
.prop-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.prop-row:last-child { margin-bottom: 0; }

.prop-label {
  font-size: 12px;
  color: #909399;
  min-width: 50px;
  flex-shrink: 0;
}
.prop-control {
  flex: 1;
  display: flex;
  align-items: center;
}

/* 控件：输入框 - 按模板统一 */
.input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: #111113;
  border: 1px solid #333;
  border-radius: 3px;
  padding: 0 6px;
  height: 24px;
  width: 100%;
  transition: border 0.2s;
}
.input-group:hover {
  border-color: #444;
}
.input-group:focus-within {
  border-color: #409eff;
}
.input-group.readonly {
  background: transparent;
  border: 1px solid #333;
  padding: 0 6px;
}
.dv-input {
  background: transparent;
  border: none;
  color: #e5e5e5;
  width: 100%;
  height: 100%;
  font-size: 12px;
  outline: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
.dv-input:disabled {
  color: #666;
  cursor: not-allowed;
}
.input-suffix {
  font-size: 10px;
  color: #666;
  margin-left: 4px;
  flex-shrink: 0;
}

.copy-icon {
  width: 12px;
  height: 12px;
  fill: #909399;
  cursor: pointer;
  flex-shrink: 0;
  margin-left: 4px;
  transition: fill 0.2s;
}
.copy-icon:hover {
  fill: #409eff;
}
.color-picker-wrap .dv-input {
  font-family: monospace;
  font-size: 12px;
}

/* 旧的滑块样式已合并到新样式中 */

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #666;
  font-size: 12px;
}

/* 数据源配置样式 - 按模板统一 */
.dv-segment {
  display: flex;
  background: #111113;
  border-radius: 3px;
  padding: 2px;
  border: 1px solid #333;
  width: 100%;
}
.segment-item {
  flex: 1;
  text-align: center;
  font-size: 12px;
  padding: 4px 8px;
  cursor: pointer;
  color: #909399;
  border-radius: 3px;
  transition: all 0.2s;
}
.segment-item.active {
  background: #333;
  color: #409eff;
}
.segment-item:hover:not(.active) {
  color: #e5e5e5;
  background: rgba(255,255,255,0.05);
}

.dv-select {
  width: 100%;
  background: #111113;
  border: 1px solid #333;
  border-radius: 3px;
  padding: 0 6px;
  height: 24px;
  color: #e5e5e5;
  font-size: 12px;
  outline: none;
  cursor: pointer;
  transition: border 0.2s;
}
.dv-select:hover {
  border-color: #444;
}
.dv-select:focus {
  border-color: #409eff;
}

/* ===== 数据源面板 - 重构样式 ===== */

/* 1. 模式切换器 */
.mode-switch {
  background: #111113;
  padding: 3px;
  border-radius: 4px;
  display: flex;
  border: 1px solid #333;
  margin-bottom: 16px;
}
.mode-btn {
  flex: 1;
  text-align: center;
  padding: 4px;
  cursor: pointer;
  border-radius: 2px;
  color: #909399;
  font-size: 12px;
  transition: all 0.2s;
}
.mode-btn.active {
  background: #333;
  color: #fff;
  font-weight: 500;
}
.mode-btn:hover:not(.active) {
  color: #e5e5e5;
}

/* 2. 数据集模式内容 */
.dataset-mode-content,
.static-mode-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 3. 标签和操作链接 */
.label {
  color: #909399;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.action-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
  font-size: 11px;
}
.action-link:hover {
  text-decoration: underline;
}

/* 4. 选择器包装器 */
.select-wrapper {
  display: flex;
  gap: 8px;
}
.btn-icon {
  width: 28px;
  height: 28px;
  background: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-icon:hover {
  border-color: #409eff;
  color: #409eff;
  background: #3a3a3d;
}

/* 5. 数据状态反馈 */
.data-status {
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.2);
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.status-info {
  display: flex;
  align-items: center;
  color: #e5e5e5;
  font-size: 12px;
}
.status-dot {
  width: 6px;
  height: 6px;
  background: #67c23a;
  border-radius: 50%;
  margin-right: 6px;
  display: inline-block;
}
.refresh-icon {
  cursor: pointer;
  opacity: 0.7;
  font-size: 16px;
  color: #909399;
  transition: all 0.3s;
}
.refresh-icon:hover {
  opacity: 1;
  transform: rotate(180deg);
  color: #409eff;
}

/* 6. 字段映射区域 */
.mapping-box {
  border-top: 1px solid #303033;
  padding-top: 12px;
}
.mapping-title {
  font-weight: bold;
  margin-bottom: 8px;
}
.mapping-row {
  margin-bottom: 10px;
}
.mapping-row:last-child {
  margin-bottom: 0;
}

/* 7. 字段标签和拖拽区域 */
.field-tag {
  background: #2d2d30;
  padding: 2px 6px;
  border-radius: 2px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  color: #e6a23c;
  border: 1px solid #444;
  font-size: 11px;
}
.drop-zone {
  background: #111113;
  border: 1px dashed #444;
  padding: 6px;
  border-radius: 4px;
  margin-top: 4px;
  min-height: 28px;
  display: flex;
  align-items: center;
  color: #555;
  font-size: 11px;
  transition: all 0.2s;
}
.drop-zone.filled {
  border-style: solid;
  color: #e5e5e5;
  background: #18181c;
}
.drop-zone:hover {
  border-color: #666;
}
.drop-placeholder {
  color: #666;
  font-size: 11px;
}

/* 8. 提示信息 */
.tips {
  font-size: 11px;
  color: #666;
  line-height: 1.4;
  background: #202020;
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.data-config-section {
  padding: 0;
}

.data-preview-section {
  margin: 10px 0;
  border: 1px solid #303033;
  border-radius: 3px;
  overflow: hidden;
}

.preview-header,
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: #202024;
  border-bottom: 1px solid #303033;
  font-size: 12px;
  color: #909399;
}

.preview-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 1px solid #333;
  color: #909399;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.preview-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.preview-content {
  padding: 10px;
  max-height: 150px;
  overflow-y: auto;
  background: #000;
}

.preview-content pre {
  margin: 0;
  font-size: 11px;
  color: #10b981;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.json-editor-section {
  margin: 10px 0;
  border: 1px solid #303033;
  border-radius: 3px;
  overflow: hidden;
}

.json-editor {
  width: 100%;
  min-height: 120px;
  max-height: 200px;
  background: #000;
  border: none;
  color: #10b981;
  padding: 10px;
  font-size: 11px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  resize: vertical;
  outline: none;
}

.error-message {
  padding: 6px 10px;
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  font-size: 11px;
  border-top: 1px solid #2a2e35;
}

.apply-btn,
.test-btn {
  width: 100%;
  background: #26d0ff;
  border: none;
  color: #000;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.apply-btn:hover,
.test-btn:hover {
  background: #1fb6e0;
  transform: translateY(-1px);
}

.test-btn {
  background: #10b981;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.test-btn:hover {
  background: #059669;
}

.prop-row-full {
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
  gap: 6px;
}
.prop-row-full:last-child { margin-bottom: 0; }
.prop-row-full .prop-label {
  font-size: 12px;
  color: #90a0a5;
}

.mapping-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: rgba(38, 208, 255, 0.05);
  border-radius: 4px;
  margin: 10px 0;
  font-size: 11px;
  color: #90a0a5;
  line-height: 1.4;
}
.mapping-info svg {
  flex-shrink: 0;
  fill: #26d0ff;
  width: 14px;
  height: 14px;
}

/* Mock 数据源样式 - 优化版本 */
.create-mock-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.create-mock-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(118, 75, 162, 0.4);
}

.mock-data-info {
  margin: 10px 0;
  border: 1px solid #2a2e35;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(102, 126, 234, 0.05);
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid #2a2e35;
  font-size: 11px;
  color: #90a0a5;
}

.edit-link {
  background: transparent;
  border: none;
  color: #667eea;
  font-size: 11px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  transition: all 0.2s;
}
.edit-link:hover {
  color: #764ba2;
  background: rgba(102, 126, 234, 0.1);
}

.info-content {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 11px;
}

.info-label {
  color: #90a0a5;
  margin-right: 6px;
  min-width: 56px;
}

.info-value {
  color: #fff;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 11px;
}

.data-preview-mini {
  padding: 8px 10px;
  background: #000;
  border-top: 1px solid #2a2e35;
  max-height: 100px;
  overflow: auto;
}

.data-preview-mini pre {
  margin: 0;
  font-size: 10px;
  color: #10b981;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.3;
}

/* 双层架构样式 - 优化版本 */
.data-source-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.data-layer-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #2a2e35;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 12px 0 12px;
}

.data-layer-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  font-size: 11px;
  color: #909099;
  cursor: pointer;
  background: transparent;
  border-radius: 4px 4px 0 0;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.data-layer-tab:hover {
  color: #e5e5e5;
  background: rgba(255, 255, 255, 0.03);
}

.data-layer-tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.data-layer-tab svg {
  opacity: 0.7;
}

/* Datasets 视图 - 优化版本 */
.datasets-view {
  flex: 1;
  overflow: auto;
  padding: 0;
}

.datasets-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #2a2e35;
}

.datasets-title {
  font-size: 12px;
  font-weight: 600;
  color: #e5e5e5;
}

.create-dataset-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #3b82f6;
  border: none;
  color: #fff;
  padding: 4px 10px;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.create-dataset-btn:hover {
  background: #2563eb;
}

/* 数据集列表 - 优化版本 */
.datasets-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-datasets {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
  text-align: center;
}

.empty-datasets svg {
  margin-bottom: 10px;
  opacity: 0.5;
}

.empty-datasets p {
  margin: 3px 0;
  font-size: 12px;
}

.empty-datasets .hint {
  font-size: 11px;
  color: #555;
}

/* 数据集卡片 - 优化版本 */
.dataset-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #2a2e35;
  border-left: 3px solid #f59e0b;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s;
}

.dataset-card:hover {
  border-color: #3a3e45;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.dataset-header {
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid #2a2e35;
}

.dataset-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.dataset-name {
  font-size: 12px;
  font-weight: 600;
  color: #e5e5e5;
}

.dataset-actions {
  display: flex;
  gap: 2px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #909099;
  cursor: pointer;
  padding: 3px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e5e5e5;
}

.icon-btn svg {
  width: 14px;
  height: 14px;
}

.dataset-desc {
  font-size: 11px;
  color: #909099;
  margin: 0;
  line-height: 1.4;
}

.dataset-body {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 数据源血缘 - 优化版本 */
.dataset-lineage {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lineage-label {
  font-size: 11px;
  color: #909099;
  min-width: 52px;
  flex-shrink: 0;
}

.lineage-connection {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
}

.connection-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 2px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  flex-shrink: 0;
}

.connection-badge.database {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.connection-badge.file {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.connection-badge.api {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
}

.connection-name {
  font-size: 11px;
  color: #e5e5e5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 更新策略 - 优化版本 */
.dataset-strategy {
  display: flex;
  align-items: center;
  gap: 6px;
}

.strategy-label {
  font-size: 11px;
  color: #909099;
  min-width: 52px;
  flex-shrink: 0;
}

.strategy-value {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.strategy-badge {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
}

.strategy-badge.realtime {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.strategy-badge.cached {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.strategy-badge.static {
  background: rgba(107, 114, 128, 0.2);
  color: #9ca3af;
}

.strategy-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.strategy-badge.realtime .strategy-dot {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.cache-time {
  font-size: 10px;
  color: #666;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

/* 数据统计 */
.dataset-stats {
  display: flex;
  gap: 16px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  color: #666;
}

.stat-value {
  font-size: 12px;
  font-weight: 600;
  color: #e5e5e5;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

.use-dataset-btn {
  width: 100%;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  padding: 6px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.use-dataset-btn:hover {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.5);
}
</style>