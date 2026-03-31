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
               <a-button size="small" plain>继续上传</a-button>
               <a-button size="small" plain>调试</a-button>
               <a-button size="small" danger>删除</a-button>
            </template>
            <template v-else>
              <a-button size="small" plain>版本历史</a-button>
              <a-button size="small" plain>配置</a-button>
              <a-button size="small" danger>下架</a-button>
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
            <a-select v-model:value="form.tech" placeholder="选择技术栈" style="width: 100%">
              <a-select-option label="Vue 3.x" value="vue3" />
              <a-select-option label="Vue 2.x" value="vue2" />
              <a-select-option label="React 18" value="react18" />
              <a-select-option label="原生 JS / JQuery" value="vanilla" />
            </a-select>
          </div>

          <div class="form-group">
            <label class="form-label">组件名称 (Display Name)</label>
            <a-input v-model:value="form.name" placeholder="例如：自定义水位图" />
          </div>

          <div class="form-group">
            <label class="form-label">唯一标识 (Package ID)</label>
            <a-input v-model:value="form.packageId" placeholder="com.company.chart.water" />
          </div>

          <div class="form-group">
            <label class="form-label">版本号</label>
            <a-input v-model:value="form.version" style="width: 120px" />
          </div>

          <div class="form-group">
            <label class="form-label">更新日志</label>
            <a-input v-model:value="form.changelog" type="textarea" :rows="3" placeholder="描述本次更新的内容..." resize="none" />
          </div>
        </div>
        <div class="drawer-footer">
          <a-button @click="closeDrawer">取消</a-button>
          <a-button type="primary">开始上传</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

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
  message.success('命令已复制到剪贴板')
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

