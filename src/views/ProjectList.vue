<template>
  <div class="project-list-page">
    <!-- Header (Moved from Layout to here for full control) -->
    <header class="header">
      <div class="view-tabs">
        <div class="tab-item active">全部项目 (5)</div>
        <div class="tab-item">我创建的</div>
        <div class="tab-item">协作项目</div>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            class="search-input"
            placeholder="搜索项目..."
            prefix-icon="Search"
          />
        </div>
        <button class="btn-create" @click="modalVisible = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          新建项目
        </button>
      </div>
    </header>

    <div class="content-scroll">
      <div class="grid-container">
        <!-- Project Cards -->
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card"
          :class="`type-${project.type}`"
        >
          <div class="card-type-line"></div>
          <div class="card-thumb">
            <img :src="project.thumbnail" class="thumb-img" :alt="project.title">
            <div class="card-overlay">
              <button class="overlay-btn btn-edit" @click="handleEnterEditor(project)">
                {{ project.type === 'screen' ? '进入大屏编辑器' : '进入报表编辑器' }}
              </button>
              <button class="overlay-btn btn-preview">预览</button>
            </div>
          </div>
          <div class="card-content">
            <div class="card-header-row">
              <div class="card-title">
                <component :is="getIcon(project.type)" class="type-icon" />
                {{ project.title }}
              </div>
              <span
                class="status-badge"
                :class="{ pub: project.status === 'published' }"
              >
                {{ project.status === 'published' ? '● 已发布' : '草稿' }}
              </span>
            </div>
            <div class="card-desc">{{ project.description }}</div>
            <div class="card-footer">
              <span>{{ project.type === 'screen' ? 'Screen Visualization' : 'Enterprise Report' }}</span>
              <span>{{ project.updatedAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div class="modal-overlay" :class="{ open: modalVisible }" @click.self="modalVisible = false">
      <div class="type-modal">
        <div class="modal-header">
          <h3>新建项目</h3>
          <div class="close-btn" @click="modalVisible = false">✕</div>
        </div>
        <div class="type-grid">
          <!-- Screen Option -->
          <div class="select-card screen" @click="handleCreate('screen')">
            <div class="select-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
            </div>
            <div class="select-info">
              <h4>数据可视化大屏</h4>
              <p>Screen Visualization</p>
              <div class="select-desc">适用于指挥中心、行业大屏、汇报演示。支持绝对定位画布、3D 模型集成及炫酷动效。</div>
            </div>
          </div>

          <!-- Report Option -->
          <div class="select-card report" @click="handleCreate('report')">
            <div class="select-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z"/></svg>
            </div>
            <div class="select-info">
              <h4>中国式复杂报表</h4>
              <p>Enterprise Report</p>
              <div class="select-desc">适用于业务清单、财务报表、数据填报。支持类 Excel 布局、分页打印及复杂表头。</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const modalVisible = ref(false)

// Icons components for direct usage in v-for
const ScreenIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
    h('path', { d: 'M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z' })
  ])
}

const ReportIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
    h('path', { d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z' })
  ])
}

const getIcon = (type) => {
  return type === 'screen' ? ScreenIcon : ReportIcon
}

// Mock Data
const projects = ref([
  {
    id: 1,
    title: '智慧城市交通大脑',
    type: 'screen',
    description: '展示全市交通流量、拥堵指数及实时摄像头画面，集成 3D 城市模型。',
    thumbnail: '/images/project-cover.svg',
    status: 'published',
    updatedAt: '2h ago'
  },
  {
    id: 2,
    title: 'Q4 财务与销售季报',
    type: 'report',
    description: '包含复杂表头、多级汇总及填报功能的财务报表，支持 A4 打印导出。',
    thumbnail: '/images/project-cover.svg', // In CSS we adjust hue for report
    status: 'draft',
    updatedAt: '1 day ago'
  },
  {
    id: 3,
    title: '数字化工厂监控',
    type: 'screen',
    description: '连接 IoT 设备，实时展示产线良率、设备运行状态及故障告警。',
    thumbnail: '/images/project-cover.svg',
    status: 'draft',
    updatedAt: '3 days ago'
  }
])

const handleCreate = (type) => {
  if (type === 'report') {
    // Mock new project ID
    router.push('/editor/report/new')
  } else {
    router.push('/editor/screen/new')
  }
  modalVisible.value = false
}

const handleEnterEditor = (project) => {
  if (project.type === 'report') {
    router.push(`/editor/report/${project.id}`)
  } else {
    router.push(`/editor/screen/${project.id}`)
  }
}
</script>

<style scoped>
/* Global Vars from root (implied) */
.project-list-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-body);
  position: relative;
}

/* Header */
.header {
  height: 64px;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);
  background: rgba(20, 21, 25, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10;
  flex-shrink: 0;
}

.view-tabs { display: flex; gap: 24px; height: 100%; }
.tab-item {
  display: flex; align-items: center; height: 100%; font-size: 14px; color: var(--el-text-color-regular); cursor: pointer; position: relative;
}
.tab-item:hover { color: #fff; }
.tab-item.active { color: #fff; font-weight: 500; }
.tab-item.active::after {
  content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--el-color-primary);
}

/* Actions */
.header-actions { display: flex; gap: 16px; align-items: center; }
.search-box { width: 240px; }

.btn-create {
  background: var(--el-color-primary); color: #fff; border: none; height: 32px; padding: 0 20px;
  border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px;
  transition: 0.2s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
.btn-create:hover { background: var(--el-color-primary-dark-2); transform: translateY(-1px); }

/* Content */
.content-scroll { flex: 1; padding: 32px; overflow-y: auto; }
.grid-container {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;
}

/* Project Card */
.project-card {
  background: var(--el-bg-color); border: 1px solid var(--el-border-color); border-radius: 12px;
  overflow: hidden; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative; display: flex; flex-direction: column;
}
.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.4);
  border-color: var(--el-text-color-secondary);
}

/* Type Line */
.card-type-line { height: 3px; width: 100%; }
.project-card.type-screen .card-type-line { background: var(--el-color-primary); }
.project-card.type-report .card-type-line { background: #10b981; }

/* Thumb */
.card-thumb {
  height: 180px; width: 100%; background: #111; position: relative; overflow: hidden;
}
.thumb-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: 0.4s; }
.project-card.type-report .thumb-img { filter: hue-rotate(120deg) brightness(0.8); }
.project-card:hover .thumb-img { opacity: 0.4; transform: scale(1.05); filter: blur(3px); }

/* Overlay */
.card-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px;
  opacity: 0; transition: 0.3s; transform: translateY(10px);
}
.project-card:hover .card-overlay { opacity: 1; transform: translateY(0); }

.overlay-btn {
  padding: 8px 24px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer;
  border: none; display: flex; align-items: center; gap: 6px; transition: 0.2s;
}
.project-card.type-screen .btn-edit { background: var(--el-color-primary); color: #fff; }
.project-card.type-report .btn-edit { background: #10b981; color: #fff; }
.btn-edit:hover { filter: brightness(1.1); transform: scale(1.05); }

.btn-preview { background: rgba(255,255,255,0.1); color: #fff; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); }
.btn-preview:hover { background: rgba(255,255,255,0.2); }

/* Card Body */
.card-content { padding: 16px; flex: 1; display: flex; flex-direction: column; }
.card-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.card-title {
  font-size: 15px; font-weight: 600; color: #fff; display: flex; align-items: center; gap: 6px;
}
.type-icon { width: 16px; height: 16px; }
.project-card.type-screen .type-icon { color: var(--el-color-primary); }
.project-card.type-report .type-icon { color: #10b981; }

.status-badge { font-size: 10px; padding: 2px 6px; border-radius: 3px; background: rgba(255,255,255,0.1); color: var(--el-text-color-secondary); }
.status-badge.pub { background: rgba(16, 185, 129, 0.15); color: #10b981; }

.card-desc { font-size: 12px; color: var(--el-text-color-secondary); margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.card-footer {
  margin-top: auto; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);
  display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--el-text-color-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 100;
  display: none; justify-content: center; align-items: center; opacity: 0; transition: 0.3s;
}
.modal-overlay.open { display: flex; opacity: 1; }

.type-modal {
  background: var(--el-bg-color); width: 700px; border-radius: 16px; border: 1px solid var(--el-border-color);
  box-shadow: 0 30px 80px rgba(0,0,0,0.6); overflow: hidden; transform: scale(0.95); transition: 0.3s;
}
.modal-overlay.open .type-modal { transform: scale(1); }

.modal-header {
  padding: 20px 30px; border-bottom: 1px solid var(--el-border-color); display: flex; justify-content: space-between; align-items: center;
}
.modal-header h3 { font-size: 18px; font-weight: 600; color: #fff; margin: 0; }
.close-btn { cursor: pointer; color: var(--el-text-color-secondary); font-size: 20px; transition: 0.2s; }
.close-btn:hover { color: #fff; }

.type-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 40px;
}

/* Select Card */
.select-card {
  background: var(--el-bg-color-page); border: 2px solid transparent; border-radius: 12px;
  padding: 30px 20px; cursor: pointer; transition: 0.2s; position: relative;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.select-card:hover { transform: translateY(-4px); background: var(--el-fill-color); }

.select-card.screen:hover { border-color: var(--el-color-primary); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15); }
.select-card.screen .select-icon { background: rgba(59, 130, 246, 0.1); color: var(--el-color-primary); }

.select-card.report:hover { border-color: #10b981; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.15); }
.select-card.report .select-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }

.select-icon {
  width: 80px; height: 80px; border-radius: 16px; display: flex; align-items: center; justify-content: center;
  margin-bottom: 20px; transition: 0.3s;
}
.select-icon svg { width: 40px; height: 40px; }
.select-card:hover .select-icon { transform: scale(1.1); }

.select-info h4 { font-size: 18px; color: #fff; margin-bottom: 6px; }
.select-info p { font-size: 12px; color: var(--el-text-color-secondary); margin-bottom: 16px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
.select-desc { font-size: 13px; color: var(--el-text-color-secondary); line-height: 1.6; }
</style>
