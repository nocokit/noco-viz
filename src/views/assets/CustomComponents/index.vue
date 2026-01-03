<template>
  <div class="custom-components-view">
    <header class="header">
      <h2>
        自定义组件 (Custom Components)
      </h2>
      <div class="doc-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
        开发者文档 & API
      </div>
    </header>

    <div class="content-body">
      <!-- CLI 推广条 -->
      <div class="cli-banner">
        <div class="cli-info">
          <h3>使用 NocoViz CLI 快速开发</h3>
          <p>推荐使用脚手架工具在本地创建、调试组件，一键打包上传。</p>
        </div>
        <div class="cli-code" title="点击复制" @click="copyCliCommand">
          <span style="color:#a5b3ce">$</span> npm install nocoviz-cli -g
          <span class="copy-hint">Copy</span>
        </div>
      </div>

      <div class="comp-grid">
        <!-- Create New -->
        <div class="create-card" @click="openDrawer">
          <div class="plus-icon">+</div>
          <div class="create-text">上传新组件</div>
        </div>

        <!-- Component Cards -->
        <div v-for="comp in componentsList" :key="comp.id" class="comp-card">
          <div class="card-top">
            <div class="comp-icon" :style="{ color: comp.iconColor }">{{ comp.iconText }}</div>
            <div class="comp-info">
              <div :class="['tech-badge', comp.techClass]">{{ comp.techLabel }}</div>
              <div class="comp-name">{{ comp.name }}</div>
              <span class="comp-id">{{ comp.packageId }}</span>
              <div class="comp-desc">{{ comp.description }}</div>
            </div>
          </div>
          <div class="card-meta">
            <span :class="comp.statusClass">
              <span class="status-dot"></span>{{ comp.statusText }}
            </span>
            <span>{{ comp.size }}</span>
          </div>
          <div class="card-actions">
            <template v-if="comp.isDev">
               <el-button size="small" plain>继续上传</el-button>
               <el-button size="small" plain>调试</el-button>
               <el-button size="small" type="danger" plain>删除</el-button>
            </template>
            <template v-else>
              <el-button size="small" plain>版本历史</el-button>
              <el-button size="small" plain>配置</el-button>
              <el-button size="small" type="danger" plain>下架</el-button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Drawer (Using el-drawer for consistency, or custom div if preferred, but refactoring to el-drawer is better) -->
    <!-- Keeping custom drawer structure but using el- components inside -->
    <div :class="['drawer-overlay', { open: drawerVisible }]">
      <div class="drawer">
        <div class="drawer-header">
          <div class="drawer-title">上传组件包</div>
          <div style="cursor:pointer; color:#888" @click="closeDrawer">✕</div>
        </div>
        <div class="drawer-body">
          <div class="form-group">
            <label class="form-label">组件包文件 (.zip)</label>
            <div class="file-drop">
              <div class="file-icon">📦</div>
              <div>拖拽文件到此处，或点击上传</div>
              <div class="file-hint">支持 .zip 格式，最大 20MB</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">技术栈</label>
            <el-select v-model="form.tech" placeholder="选择技术栈" style="width: 100%">
              <el-option label="Vue 3.x" value="vue3" />
              <el-option label="Vue 2.x" value="vue2" />
              <el-option label="React 18" value="react18" />
              <el-option label="原生 JS / JQuery" value="vanilla" />
            </el-select>
          </div>

          <div class="form-group">
            <label class="form-label">组件名称 (Display Name)</label>
            <el-input v-model="form.name" placeholder="例如：自定义水位图" />
          </div>

          <div class="form-group">
            <label class="form-label">唯一标识 (Package ID)</label>
            <el-input v-model="form.packageId" placeholder="com.company.chart.water" />
          </div>

          <div class="form-group">
            <label class="form-label">版本号</label>
            <el-input v-model="form.version" style="width: 120px" />
          </div>

          <div class="form-group">
            <label class="form-label">更新日志</label>
            <el-input v-model="form.changelog" type="textarea" :rows="3" placeholder="描述本次更新的内容..." resize="none" />
          </div>
        </div>
        <div class="drawer-footer">
          <el-button @click="closeDrawer">取消</el-button>
          <el-button type="primary">开始上传</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const drawerVisible = ref(false)

const form = ref({
  tech: 'vue3',
  name: '',
  packageId: '',
  version: '1.0.0',
  changelog: ''
})

const openDrawer = () => {
  drawerVisible.value = true
}

const closeDrawer = () => {
  drawerVisible.value = false
}

const copyCliCommand = () => {
  navigator.clipboard.writeText('npm install nocoviz-cli -g')
  ElMessage.success('命令已复制到剪贴板')
}

// Mock Data
const componentsList = ref([
  {
    id: 1,
    name: '3D 涡轮风扇',
    packageId: 'com.nocoviz.turbine',
    description: '基于 Three.js 开发的工业风扇模型，支持转速控制和告警变色。',
    iconText: '3D',
    iconColor: '#06b6d4',
    techLabel: 'Vue 3',
    techClass: 'tech-vue',
    statusText: '已发布 v1.2.0',
    statusClass: 'status-pub',
    size: '245KB',
    isDev: false
  },
  {
    id: 2,
    name: '高德地图-轨迹回放',
    packageId: 'com.nocoviz.amap.trace',
    description: '封装高德地图 API，支持车辆历史轨迹回放、暂停、倍速播放功能。',
    iconText: 'Map',
    iconColor: '#8b5cf6',
    techLabel: 'React',
    techClass: 'tech-react',
    statusText: '开发中 v0.9.0',
    statusClass: 'status-dev',
    size: '1.2MB',
    isDev: true
  },
  {
    id: 3,
    name: 'ECharts 扩展热力图',
    packageId: 'com.nocoviz.heatmap.pro',
    description: '针对大屏优化的热力图，支持大规模数据点渲染，性能优化版。',
    iconText: 'E',
    iconColor: '#10b981',
    techLabel: 'Vue 2',
    techClass: 'tech-vue',
    statusText: '已发布 v2.0.1',
    statusClass: 'status-pub',
    size: '85KB',
    isDev: false
  }
])
</script>

<style scoped>
/* =========================================
   Scoped CSS - Reduced as global styles handle forms
   ========================================= */
.custom-components-view {
  /* Reuse global theme vars where possible */
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--el-bg-color-page);
}

/* Header */
.header {
  height: 64px; padding: 0 32px; border-bottom: 1px solid var(--el-border-color);
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(20, 21, 25, 0.9);
  flex-shrink: 0;
}
.header h2 { font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 10px; margin: 0; color: #fff;}
.doc-link { font-size: 13px; color: var(--el-color-primary); cursor: pointer; display: flex; align-items: center; gap: 4px; }
.doc-link:hover { text-decoration: underline; }

/* Content Body */
.content-body { padding: 32px; flex: 1; overflow-y: auto; }

/* CLI Promo Banner */
.cli-banner {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 20px 24px;
  margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between;
}
.cli-info h3 { font-size: 15px; margin-bottom: 6px; color: #fff; margin-top: 0;}
.cli-info p { font-size: 13px; color: var(--el-text-color-regular); margin: 0;}

.cli-code {
  background: #000; border: 1px solid var(--el-border-color); padding: 10px 16px; border-radius: 6px;
  font-family: monospace; color: var(--el-color-success); font-size: 13px; cursor: pointer;
  display: flex; align-items: center; gap: 10px;
}
.cli-code:hover { border-color: var(--el-text-color-regular); }
.copy-hint { font-size: 11px; color: var(--el-text-color-placeholder); }

/* Grid */
.comp-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;
}

/* Component Card */
.comp-card {
  background: var(--el-bg-color); border: 1px solid var(--el-border-color); border-radius: 12px;
  overflow: hidden; transition: 0.2s; position: relative;
}
.comp-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-color: var(--el-color-primary); }

.card-top { padding: 20px; display: flex; gap: 16px; border-bottom: 1px solid var(--el-border-color); }
.comp-icon {
  width: 56px; height: 56px; border-radius: 10px; background: #2a2d35;
  display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
  flex-shrink: 0;
}
.comp-info { flex: 1; }
.comp-name { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 4px; }
.comp-id { font-family: monospace; font-size: 12px; color: var(--el-text-color-placeholder); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 8px;}
.comp-desc { font-size: 12px; color: var(--el-text-color-regular); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5; }

.tech-badge {
  position: absolute; top: 16px; right: 16px; font-size: 10px; padding: 2px 6px; border-radius: 3px; font-weight: 600; text-transform: uppercase; border: 1px solid transparent;
}
.tech-vue { color: #42b883; background: rgba(66, 184, 131, 0.1); border-color: rgba(66, 184, 131, 0.2); }
.tech-react { color: #61dafb; background: rgba(97, 218, 251, 0.1); border-color: rgba(97, 218, 251, 0.2); }

.card-meta {
  padding: 12px 20px; background: rgba(0,0,0,0.2); display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--el-text-color-regular);
}
.status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-right: 6px; }
.status-pub { color: var(--el-color-success); } .status-pub .status-dot { background: var(--el-color-success); }
.status-dev { color: var(--el-color-warning); } .status-dev .status-dot { background: var(--el-color-warning); }

.card-actions {
  padding: 12px 20px; display: flex; gap: 8px;
}

/* Create New Card (Empty State style) */
.create-card {
  background: rgba(255,255,255,0.02); border: 1px dashed var(--el-border-color); border-radius: 12px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; transition: 0.2s; min-height: 200px;
}
.create-card:hover { border-color: var(--el-color-primary); background: rgba(59,130,246,0.05); }
.plus-icon { font-size: 32px; color: var(--el-text-color-placeholder); margin-bottom: 10px; }
.create-text { font-size: 14px; font-weight: 500; color: var(--el-text-color-regular); }

/* Drawer: Upload */
.drawer-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(2px); z-index: 100;
  display: none; justify-content: flex-end;
}
.drawer-overlay.open { display: flex; }

.drawer {
  width: 500px; background: var(--el-bg-color); height: 100%; box-shadow: -10px 0 30px rgba(0,0,0,0.5);
  display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.3s;
  border-left: 1px solid var(--el-border-color);
}
.drawer-overlay.open .drawer { transform: translateX(0); }

.drawer-header {
  padding: 20px 24px; border-bottom: 1px solid var(--el-border-color);
  display: flex; justify-content: space-between; align-items: center;
}
.drawer-title { font-size: 16px; font-weight: 600; color: #fff; }
.drawer-body { flex: 1; overflow-y: auto; padding: 24px; }

.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 13px; color: var(--el-text-color-regular); margin-bottom: 8px; }

.file-drop {
  border: 2px dashed var(--el-border-color); border-radius: 8px; padding: 30px; text-align: center;
  background: var(--el-fill-color-blank); cursor: pointer; transition: 0.2s;
}
.file-drop:hover { border-color: var(--el-color-primary); background: rgba(59,130,246,0.05); }
.file-icon { font-size: 24px; color: var(--el-text-color-placeholder); margin-bottom: 8px; }
.file-hint { font-size: 12px; color: var(--el-text-color-placeholder); }

.drawer-footer { padding: 16px 24px; border-top: 1px solid var(--el-border-color); display: flex; justify-content: flex-end; gap: 12px; background: var(--el-bg-color-overlay); }
</style>