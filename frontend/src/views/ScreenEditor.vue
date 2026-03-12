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
      @fit-screen="fitToScreen"
      @preview="handlePreview"
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
        <div :class="['tab-item', { active: configTab === 'animation' }]" @click="configTab = 'animation'">动画</div>
      </div>

      <div class="panel-content">
        <!-- Tab 1: 样式配置 -->
        <div v-show="configTab === 'style'">
          <!-- 使用 EditorFormRenderer 渲染完整配置 -->
          <EditorFormRenderer
            v-if="selectedComponent"
            :schema="fullComponentSchema"
            v-model="selectedComponent"
          />

          <div class="divider"></div>

          <!-- 分组 3: 图表配置 (仅图表组件，排除动画) -->
          <ConfigFormRenderer
            v-if="isChartComponent(selectedComponent.type)"
            :schema="chartSchemaWithoutAnimation"
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
                <a-select
                  v-model:value="selectedDatasetId"
                  placeholder="请选择数据集..."
                  size="small"
                  style="flex: 1"
                >
                  <a-select-option value="">请选择数据集...</a-select-option>
                  <a-select-option value="dataset_1">比亚迪_车辆实时监控</a-select-option>
                  <a-select-option value="dataset_2">腾讯_服务器热力图</a-select-option>
                  <a-select-option value="dataset_3">2025Q1_销售总表</a-select-option>
                </a-select>
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
              <a-textarea
                v-model:value="staticJsonData"
                placeholder='[
  {"name": "A", "value": 10},
  {"name": "B", "value": 20}
]'
                :rows="8"
                size="small"
              />
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
              <a-input
                v-model:value="apiUrl"
                placeholder="https://api.example.com/test"
                size="small"
              />
            </div>

            <div class="form-group">
              <div class="form-label">Method</div>
              <a-select
                v-model:value="apiMethod"
                size="small"
              >
                <a-select-option value="GET">GET</a-select-option>
                <a-select-option value="POST">POST</a-select-option>
              </a-select>
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
        <div v-show="configTab === 'event'" class="empty-state">
          <svg viewBox="0 0 1024 1024" width="40" height="40" fill="rgba(255,255,255,0.2)">
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
            <path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"/>
          </svg>
          <div style="margin-top: 16px; color: #666;">交互事件配置开发中...</div>
        </div>

        <!-- Tab 4: 动画效果 -->
        <div v-show="configTab === 'animation'">
          <!-- 图表动画配置 (仅图表组件) -->
          <ConfigFormRenderer
            v-if="isChartComponent(selectedComponent.type) && chartAnimationSchema"
            :schema="chartAnimationSchema"
            v-model="selectedComponent.config"
          />

          <!-- 非图表组件的空状态 -->
          <div v-if="!isChartComponent(selectedComponent.type)" class="empty-state">
            <svg viewBox="0 0 1024 1024" width="40" height="40" fill="rgba(255,255,255,0.2)">
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
              <path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"/>
            </svg>
            <div style="margin-top: 16px; color: #666;">此组件暂无动画配置</div>
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
import { message as ElMessage, Modal } from 'ant-design-vue'
const ElMessageBox = Modal
import { chartCategories, chartIcons, getChartByType } from '@/config/chartComponents'
import { getChartComponent } from '@/components/charts/index'
import { getComponentSchema, isChartComponent as checkIsChart } from '@/config/componentSchema'
import ConfigFormRenderer from '@/components/editor/ConfigFormRenderer.vue'
import { generateMockDataByTemplate, formatJSONString, validateJSON } from '@/utils/mockDataGenerator'
import MockDataEditor from '@/components/data/MockDataEditor.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import EditorHeader from './editor/components/EditorHeader.vue'
import ActivityBar from './editor/components/ActivityBar.vue'
import ComponentsPanel from './editor/components/ComponentsPanel.vue'
import LayersPanel from './editor/components/LayersPanel.vue'
import EditorFormRenderer from '@/components/editor/EditorFormRenderer.vue'
import { fullComponentSchema } from '@/components/editor/formSchemas.js'
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

// 统一的消息提示函数 - 确保同时只显示一个消息
const showMessage = {
  success: (content) => {
    ElMessage.destroy()
    ElMessage.success(content)
  },
  error: (content) => {
    ElMessage.destroy()
    ElMessage.error(content)
  },
  warning: (content) => {
    ElMessage.destroy()
    ElMessage.warning(content)
  },
  info: (content) => {
    ElMessage.destroy()
    ElMessage.info(content)
  }
}


const route = useRoute()
const router = useRouter()

const currentTab = ref('components')
const isPanelOpen = ref(true)

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
    showMessage.success('大屏配置已保存')
  } catch (error) {
    isSaving.value = false
    saveStatus.value = '保存失败'
    showMessage.error(`保存失败: ${error.message}`)
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

// 获取排除动画的图表配置 Schema
const chartSchemaWithoutAnimation = computed(() => {
  if (!selectedComponent.value) return {}
  const schema = getComponentSchema(selectedComponent.value.type)
  const { animation, ...rest } = schema
  return rest
})

// 获取仅动画的图表配置 Schema
const chartAnimationSchema = computed(() => {
  if (!selectedComponent.value) return null
  const schema = getComponentSchema(selectedComponent.value.type)
  return schema.animation ? { animation: schema.animation } : null
})

// 判断是否为图表组件
const isChartComponent = (type) => {
  return checkIsChart(type)
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

// 加载项目
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
      showMessage.success('项目已加载')
      return true // 返回 true 表示加载了已有项目
    } else {
      // 新项目,使用默认值
      projectName.value = '未命名大屏项目'
      canvasComponents.value = []
      selectedComponentIds.value = []
      return false // 返回 false 表示是新项目
    }
  } catch (error) {
    showMessage.error(`加载项目失败: ${error.message}`)
    return false
  }
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
      title: '清空画布',
      content: h('div', { style: 'padding: 10px 0;' }, [
        h('p', { style: 'margin-bottom: 15px; font-size: 14px;' },
          `当前已选中 ${selectedComponentIds.value.length} 个组件，画布共有 ${canvasComponents.value.length} 个组件。`
        ),
        h('p', { style: 'font-size: 13px; color: #666;' }, '确定要删除选中的组件吗？')
      ]),
      okText: `删除选中 (${selectedComponentIds.value.length}个)`,
      cancelText: '取消',
      okType: 'danger',
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
      content: `确定要清空画布吗？这将删除所有 ${canvasComponents.value.length} 个组件。`,
      okText: '确定清空',
      cancelText: '取消',
      okType: 'danger',
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
    showMessage.success('已复制到剪贴板')
  } catch (err) {
    showMessage.error('复制失败')
  }
}

// Mock 数据源管理方法
// 数据集模式相关方法
const handleDatasetChange = () => {
  if (selectedDatasetId.value) {
    showMessage.success('数据集已加载')
    // TODO: 实际加载数据集数据
    // 模拟设置字段映射
    mappingFields.xAxis = 'category_name'
    mappingFields.yAxis = 'sales_amount'
  }
}

const editCurrentDataset = () => {
  if (!selectedDatasetId.value) {
    showMessage.warning('请先选择数据集')
    return
  }
  showMessage.info('跳转到数据集编辑页面...')
  // TODO: 跳转到数据集管理页面
}

const createDataset = () => {
  showMessage.info('跳转到创建数据集页面...')
  router.push('/datasets/create')
}

const refreshData = () => {
  showMessage.success('数据已刷新')
  // TODO: 实际刷新数据
}

const openMockEditor = () => {
  showMockEditor.value = true
}

const handleMockDataSave = (data) => {
  currentMockData.value = data
  showMessage.success('Mock 数据已保存')
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
    showMessage.warning('请先创建 Mock 数据')
    return
  }

  try {
    const data = JSON.parse(currentMockData.value)
    selectedComponent.value.data = data
    showMessage.success('Mock数据已应用到组件')
  } catch (err) {
    showMessage.error('数据格式错误')
  }
}

// 数据库方法
const testDBConnection = async () => {
  if (!dbHost.value || !dbName.value) {
    showMessage.warning('请填写主机地址和数据库名')
    return
  }

  showMessage.info('测试连接中...')
  // TODO: 实际数据库连接测试
  setTimeout(() => {
    showMessage.success('数据库连接成功')
  }, 1000)
}

const applyDBData = async () => {
  if (!selectedComponent.value || !dbQuery.value) {
    showMessage.warning('请输入 SQL 查询语句')
    return
  }

  showMessage.info('查询数据中...')
  // TODO: 实际数据库查询
  setTimeout(() => {
    showMessage.success('数据已应用到组件')
  }, 1000)
}

// API方法
const testAPIConnection = async () => {
  if (!apiUrl.value) {
    showMessage.warning('请输入接口地址')
    return
  }

  try {
    showMessage.info('测试请求中...')
    const response = await fetch(apiUrl.value, {
      method: apiMethod.value,
      headers: apiHeaders.value ? JSON.parse(apiHeaders.value) : {},
    })

    if (response.ok) {
      showMessage.success('接口请求成功')
    } else {
      showMessage.error(`请求失败: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    showMessage.error(`接口请求失败: ${error.message}`)
  }
}

const applyAPIData = async () => {
  if (!selectedComponent.value || !apiUrl.value) {
    showMessage.warning('请输入接口地址')
    return
  }

  try {
    showMessage.info('获取接口数据中...')
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
      showMessage.success('接口数据已应用到组件')
    } else {
      showMessage.error(`请求失败: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    showMessage.error(`接口数据获取失败: ${error.message}`)
  }
}

// 业务数据集方法
const editDataset = (id) => {
  showMessage.info(`编辑数据集 ${id}`)
  // TODO: 打开数据集编辑弹窗
}

const deleteDataset = (id) => {
  datasets.value = datasets.value.filter(d => d.id !== id)
  showMessage.success('数据集已删除')
}

const useDataset = (id) => {
  if (!selectedComponent.value) {
    showMessage.warning('请先选择一个组件')
    return
  }
  const dataset = datasets.value.find(d => d.id === id)
  if (dataset) {
    showMessage.success(`已应用数据集: ${dataset.name}`)
    // TODO: 实际应用数据集到组件
  }
}

// 新增方法:格式化JSON
const formatJSON = () => {
  try {
    const parsed = JSON.parse(staticJsonData.value)
    staticJsonData.value = JSON.stringify(parsed, null, 2)
    showMessage.success('JSON 已格式化')
  } catch (error) {
    showMessage.error('JSON 格式错误')
  }
}

// 应用静态JSON数据
const applyStaticJSON = () => {
  try {
    const data = JSON.parse(staticJsonData.value)
    if (selectedComponent.value) {
      selectedComponent.value.data = data
      showMessage.success('静态数据已应用')
    }
  } catch (error) {
    showMessage.error('JSON 格式错误')
  }
}

// 保存为公共数据集
const saveAsDataset = () => {
  if (!apiUrl.value) {
    showMessage.warning('请先配置接口地址')
    return
  }
  showMessage.info('保存为数据集功能开发中...')
  // TODO: 打开数据集创建弹窗并预填API配置
}

const getStrategyText = (strategy) => {
  const strategyMap = {
    realtime: '实时直连',
    cached: '缓存模式',
    static: '静态数据'
  }
  return strategyMap[strategy] || strategy
}
</script>

<style scoped src="./ScreenEditor.css"></style>