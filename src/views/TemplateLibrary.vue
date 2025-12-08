<template>
  <div class="template-library">
    <!-- 头部区域 -->
    <header class="library-header">
      <div class="header-top">
        <div class="header-title">
          <h1>企业模板库</h1>
          <p>浏览并使用企业内部标准化的数据大屏模板。所有模板均已通过安全审计，适配公司标准数据源。</p>
        </div>
        <div class="header-actions">
          <el-button class="btn" @click="handleImportTemplate">
            <el-icon><Upload /></el-icon>
            导入模板包
          </el-button>
          <el-button type="primary" class="btn-primary" @click="handlePublishTemplate">
            <el-icon><Plus /></el-icon>
            发布我的模板
          </el-button>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="filter-bar">
        <div
          v-for="filter in filters"
          :key="filter.id"
          :class="['filter-item', { active: activeFilter === filter.id }]"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
        </div>
      </div>
    </header>

    <!-- 模板滚动列表 -->
    <div class="template-scroll">
      <!-- 官方推荐 -->
      <div v-if="filteredOfficialTemplates.length > 0" class="category-section">
        <div class="section-title">
          官方推荐 <span class="section-badge">集团 IT 部发布</span>
        </div>
        <div class="template-grid">
          <TemplateCard
            v-for="template in filteredOfficialTemplates"
            :key="template.id"
            :template="template"
            @use="handleUseTemplate"
            @preview="handlePreviewTemplate"
          />
        </div>
      </div>

      <!-- 部门共享 -->
      <div v-if="filteredSharedTemplates.length > 0" class="category-section">
        <div class="section-title">
          部门共享 <span class="section-badge">内部贡献</span>
        </div>
        <div class="template-grid">
          <TemplateCard
            v-for="template in filteredSharedTemplates"
            :key="template.id"
            :template="template"
            @use="handleUseTemplate"
            @preview="handlePreviewTemplate"
          />
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="filteredOfficialTemplates.length === 0 && filteredSharedTemplates.length === 0"
        description="暂无模板"
      />
    </div>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      :title="previewTemplate?.name"
      width="80%"
      top="5vh"
    >
      <div class="preview-container">
        <img
          v-if="previewTemplate?.thumbnail"
          :src="previewTemplate.thumbnail"
          :alt="previewTemplate.name"
          class="preview-image"
        />
        <div class="preview-info">
          <p><strong>描述：</strong>{{ previewTemplate?.description }}</p>
          <p><strong>分辨率：</strong>{{ previewTemplate?.resolution }}</p>
          <p><strong>使用次数：</strong>{{ previewTemplate?.usageCount }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="previewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUseTemplate(previewTemplate)">使用模板</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'
import TemplateCard from '@/components/TemplateCard.vue'
import { officialTemplates, sharedTemplates } from '@/config/templates'

// 筛选器配置
const filters = [
  { id: 'all', label: '全部推荐' },
  { id: 'official', label: '官方预置 (System)' },
  { id: 'shared', label: '部门共享 (Shared)' },
  { id: 'mobile', label: '移动端报表' }
]

// 当前激活的筛选器
const activeFilter = ref('all')

// 预览对话框
const previewDialogVisible = ref(false)
const previewTemplate = ref(null)

// 筛选后的官方模板
const filteredOfficialTemplates = computed(() => {
  if (activeFilter.value === 'all' || activeFilter.value === 'official') {
    return officialTemplates
  }
  return []
})

// 筛选后的共享模板
const filteredSharedTemplates = computed(() => {
  if (activeFilter.value === 'all' || activeFilter.value === 'shared') {
    return sharedTemplates
  }
  return []
})

// 处理导入模板
const handleImportTemplate = () => {
  ElMessage.info('导入模板功能开发中...')
}

// 处理发布模板
const handlePublishTemplate = () => {
  ElMessage.info('发布模板功能开发中...')
}

// 处理使用模板
const handleUseTemplate = (template) => {
  ElMessage.success(`正在基于模板"${template.name}"创建项目...`)
  // TODO: 实现创建项目逻辑
}

// 处理预览模板
const handlePreviewTemplate = (template) => {
  previewTemplate.value = template
  previewDialogVisible.value = true
}
</script>

<style scoped>
/* =========================================
   全局样式变量 (Enterprise Dark Theme)
   ========================================= */
.template-library {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-bg-color);
}

/* Header Area */
.library-header {
  padding: 30px 40px;
  background: linear-gradient(180deg, rgba(64, 158, 255, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid var(--el-border-color);
  flex-shrink: 0;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-title h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.header-title p {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  max-width: 600px;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 30px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  padding-bottom: 2px;
}

.filter-item {
  padding-bottom: 12px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.filter-item:hover {
  color: var(--el-text-color-primary);
}

.filter-item.active {
  color: var(--el-color-primary);
  font-weight: 600;
}

.filter-item.active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--el-color-primary);
}

/* Template Scroll Area */
.template-scroll {
  flex: 1;
  padding: 30px 40px;
  overflow-y: auto;
}

.category-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);
}

.section-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
  font-weight: 400;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* Preview Dialog */
.preview-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}

.preview-info p {
  color: var(--el-text-color-regular);
}

.preview-info strong {
  color: var(--el-text-color-primary);
}

/* Scrollbar */
.template-scroll::-webkit-scrollbar {
  width: 6px;
}

.template-scroll::-webkit-scrollbar-thumb {
  background: var(--el-fill-color-darker);
  border-radius: 3px;
}

.template-scroll::-webkit-scrollbar-track {
  background: transparent;
}
</style>
