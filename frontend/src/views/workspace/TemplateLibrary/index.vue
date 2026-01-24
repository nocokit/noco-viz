<template>
  <div class="template-library">
    <!-- 头部区域 -->
    <PageHeader
      title="企业模板库"
      description="浏览并使用企业内部标准化的数据大屏模板。所有模板均已通过安全审计，适配公司标准数据源。"
      :actions="headerActions"
    />

    <!-- 筛选和视图切换 -->
    <FilterBar
      v-model="activeFilter"
      :filters="filters"
      :search-value="searchKeyword"
      search-placeholder="搜索模板..."
      :view-modes="viewModes"
      :current-view="viewMode"
      @search="searchKeyword = $event"
      @view-change="viewMode = $event"
    />

    <!-- 网格视图 -->
    <div v-if="viewMode === 'grid'" class="template-grid-view">
      <div v-if="filteredTemplates.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="color: #6b7280; margin-bottom: 16px;">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
        </svg>
        <div class="empty-title">暂无模板</div>
        <div class="empty-desc">暂时没有找到符合条件的模板</div>
      </div>
      <div v-else class="template-grid">
        <TemplateCard
          v-for="template in filteredTemplates"
          :key="template.id"
          :template="template"
          :show-review="isAdmin"
          @use="handleUseTemplate"
          @preview="handlePreviewTemplate"
          @edit="handleEditTemplate"
          @delete="handleDeleteTemplate"
          @review="handleReviewTemplate"
        />
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-else-if="viewMode === 'list'" class="template-list-view">
      <div v-if="filteredTemplates.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="color: #6b7280; margin-bottom: 16px;">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
        </svg>
        <div class="empty-title">暂无模板</div>
        <div class="empty-desc">暂时没有找到符合条件的模板</div>
      </div>
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="template-list-item"
      >
        <div class="list-item-thumb">
          <img :src="getImageUrl(template.thumbnail)" :alt="template.title || template.name" />
        </div>
        <div class="list-item-content">
          <div class="list-item-header">
            <div class="list-item-title">
              {{ template.title || template.name }}
              <span :class="['item-badge', template.category === 'official' ? 'badge-official' : 'badge-shared']">
                {{ template.category === 'official' ? '官方' : '共享' }}
              </span>
            </div>
            <div class="list-item-actions">
              <el-button size="small" @click="handleUseTemplate(template)">
                <el-icon><Check /></el-icon>
                使用
              </el-button>
              <el-button size="small" @click="handlePreviewTemplate(template)">
                <el-icon><View /></el-icon>
                预览
              </el-button>
              <el-dropdown v-if="!template.isSystem" trigger="click" @command="(cmd) => handleDropdownCommand(cmd, template)">
                <el-button size="small">
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="edit">
                      <el-icon><Edit /></el-icon>
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item command="delete" divided>
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div class="list-item-desc">{{ template.description || '暂无描述' }}</div>
          <div class="list-item-meta">
            <span class="meta-item">
              <el-icon><Monitor /></el-icon>
              {{ template.metadata?.resolution || '1920 x 1080' }}
            </span>
            <span class="meta-item">
              <el-icon><View /></el-icon>
              {{ template.usageCount || 0 }} 次使用
            </span>
            <span v-if="template.metadata?.department" class="meta-item">
              <el-icon><OfficeBuilding /></el-icon>
              {{ template.metadata.department }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情视图（分栏模式） -->
    <div v-else-if="viewMode === 'detail'" class="layout-grid">
      <!-- 左侧：模板列表 -->
      <div class="template-list">
        <div class="list-header">
          <input
            v-model="searchKeyword"
            type="text"
            class="search-mini"
            placeholder="搜索模板..."
          >
        </div>

        <!-- 分类筛选标签 -->
        <div class="filter-tabs-mini">
          <div
            v-for="filter in filters"
            :key="filter.id"
            :class="['filter-tab-mini', { active: activeFilter === filter.id }]"
            @click="activeFilter = filter.id"
          >
            {{ filter.label }}
          </div>
        </div>

        <!-- 模板列表项 -->
        <div class="template-items">
          <div
            v-for="template in filteredTemplates"
            :key="template.id"
            class="template-item"
            :class="{ selected: selectedTemplate?.id === template.id }"
            @click="selectTemplate(template)"
          >
            <div class="item-thumb">
              <img :src="getImageUrl(template.thumbnail)" :alt="template.title || template.name" />
            </div>
            <div class="item-content">
              <div class="item-title">
                {{ template.title || template.name }}
                <span :class="['item-badge', template.category === 'official' ? 'badge-official' : 'badge-shared']">
                  {{ template.category === 'official' ? '官方' : '共享' }}
                </span>
              </div>
              <div class="item-meta">
                <span>{{ template.usageCount || 0 }} 次使用</span>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredTemplates.length === 0" class="empty-list">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="color: #6b7280; margin-bottom: 12px;">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            </svg>
            <div>暂无模板</div>
          </div>
        </div>
      </div>

      <!-- 右侧：预览详情区 -->
      <div class="preview-panel">
        <div v-if="selectedTemplate" class="preview-content">
          <div class="preview-toolbar">
            <div class="toolbar-title">{{ selectedTemplate.title || selectedTemplate.name }}</div>
            <div class="toolbar-actions">
              <el-button size="small" @click="handleUseTemplate(selectedTemplate)">
                <el-icon><Check /></el-icon>
                使用模板
              </el-button>
              <el-button v-if="!selectedTemplate.isSystem" size="small" @click="handleEditTemplate(selectedTemplate)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button v-if="!selectedTemplate.isSystem" size="small" type="danger" @click="handleDeleteTemplate(selectedTemplate)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>

          <div class="preview-image-container">
            <img :src="getImageUrl(selectedTemplate.thumbnail)" :alt="selectedTemplate.title || selectedTemplate.name" class="preview-image" />
          </div>

          <div class="preview-details">
            <div class="detail-section">
              <div class="detail-label">描述</div>
              <div class="detail-value">{{ selectedTemplate.description || '暂无描述' }}</div>
            </div>
            <div class="detail-section">
              <div class="detail-label">分辨率</div>
              <div class="detail-value">{{ selectedTemplate.metadata?.resolution || '1920 x 1080' }}</div>
            </div>
            <div class="detail-section">
              <div class="detail-label">使用次数</div>
              <div class="detail-value">{{ selectedTemplate.usageCount || 0 }} 次</div>
            </div>
            <div class="detail-section" v-if="selectedTemplate.metadata?.department">
              <div class="detail-label">所属部门</div>
              <div class="detail-value">{{ selectedTemplate.metadata.department }}</div>
            </div>
          </div>
        </div>

        <!-- 未选择状态 -->
        <div v-else class="preview-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="color: #6b7280; margin-bottom: 16px;">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
          </svg>
          <div class="empty-title">选择一个模板查看详情</div>
          <div class="empty-desc">点击左侧列表中的模板卡片</div>
        </div>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      :title="previewTemplate?.title || previewTemplate?.name"
      width="80%"
      top="5vh"
    >
      <div class="preview-container">
        <img
          v-if="previewTemplate?.thumbnail"
          :src="getImageUrl(previewTemplate.thumbnail)"
          :alt="previewTemplate.title || previewTemplate.name"
          class="preview-dialog-image"
        />
        <div class="preview-info">
          <p><strong>描述：</strong>{{ previewTemplate?.description }}</p>
          <p><strong>分辨率：</strong>{{ previewTemplate?.metadata?.resolution || '1920 x 1080' }}</p>
          <p><strong>使用次数：</strong>{{ previewTemplate?.usageCount || 0 }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="previewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUseTemplate(previewTemplate)">使用模板</el-button>
      </template>
    </el-dialog>

    <!-- 发布模板对话框 -->
    <PublishTemplateDialog
      v-model="publishDialogVisible"
      @success="handlePublishSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Check, Edit, Delete, View, Grid, Menu, List, Monitor, OfficeBuilding, MoreFilled } from '@element-plus/icons-vue'
import PublishTemplateDialog from '@/components/PublishTemplateDialog.vue'
import TemplateCard from '@/components/TemplateCard.vue'
import { getTemplates, deleteTemplate as deleteTemplateApi, incrementUsageCount, reviewTemplate } from '@/api/template'
import { useUserStore } from '@/store/modules/user'

// 获取用户信息
const userStore = useUserStore()
const isAdmin = computed(() => userStore.userInfo?.role === 'admin' || userStore.userInfo?.isAdmin)

// 视图模式: grid(网格), list(列表), detail(详情分栏)
const viewMode = ref('grid')

// 筛选器配置
const filters = [
  { id: 'all', label: '全部推荐' },
  { id: 'official', label: '官方预置' },
  { id: 'shared', label: '部门共享' },
  { id: 'mobile', label: '移动端报表' }
]

// 当前激活的筛选器
const activeFilter = ref('all')

// 搜索关键词
const searchKeyword = ref('')

// 选中的模板
const selectedTemplate = ref(null)

// 预览对话框
const previewDialogVisible = ref(false)
const previewTemplate = ref(null)

// 发布模板对话框
const publishDialogVisible = ref(false)

// 模板数据
const allTemplates = ref([])
const loading = ref(false)

// 处理导入模板
const handleImportTemplate = () => {
  ElMessage.info('导入模板功能开发中...')
}

// 处理发布模板
const handlePublishTemplate = () => {
  publishDialogVisible.value = true
}

// 头部操作按钮配置
const headerActions = [
  {
    text: '导入模板包',
    icon: 'Upload',
    handler: handleImportTemplate
  },
  {
    text: '发布我的模板',
    icon: 'Plus',
    type: 'primary',
    handler: handlePublishTemplate
  }
]

// 加载模板列表
const loadTemplates = async () => {
  try {
    loading.value = true
    const data = await getTemplates()
    allTemplates.value = data || []
  } catch (error) {
    console.error('加载模板失败:', error)
    ElMessage.error('加载模板列表失败')
  } finally {
    loading.value = false
  }
}

// 筛选后的官方模板
const filteredOfficialTemplates = computed(() => {
  if (activeFilter.value === 'all' || activeFilter.value === 'official') {
    return allTemplates.value.filter(t => t.status === 'published' && t.category !== 'shared')
  }
  return []
})

// 筛选后的共享模板
const filteredSharedTemplates = computed(() => {
  if (activeFilter.value === 'all' || activeFilter.value === 'shared') {
    return allTemplates.value.filter(t => t.status === 'published')
  }
  return []
})

// 统一的筛选模板列表（用于左侧列表显示）
const filteredTemplates = computed(() => {
  let templates = []

  // 根据筛选器选择模板
  if (activeFilter.value === 'all') {
    templates = allTemplates.value.filter(t => t.status === 'published')
  } else if (activeFilter.value === 'official') {
    templates = allTemplates.value.filter(t => t.status === 'published' && t.category === 'official')
  } else if (activeFilter.value === 'shared') {
    templates = allTemplates.value.filter(t => t.status === 'published' && t.category === 'shared')
  } else if (activeFilter.value === 'mobile') {
    templates = allTemplates.value.filter(t => t.status === 'published' && t.metadata?.isMobile)
  }

  // 根据搜索关键词过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    templates = templates.filter(t =>
      (t.title && t.title.toLowerCase().includes(keyword)) ||
      (t.name && t.name.toLowerCase().includes(keyword)) ||
      (t.description && t.description.toLowerCase().includes(keyword))
    )
  }

  return templates
})

// 选择模板
const selectTemplate = (template) => {
  selectedTemplate.value = template
}

// 获取图片完整URL
const getImageUrl = (url) => {
  if (!url) return getDefaultThumbnail()
  // 如果是完整URL,直接返回
  if (url.startsWith('http')) return url
  // 如果是相对路径,直接使用(由vite proxy处理)
  return url
}

// 获取默认缩略图
const getDefaultThumbnail = () => {
  // 返回一个默认的占位图
  return '/images/template-placeholder.svg'
}

// 检查是否没有模板
const hasNoTemplates = computed(() => {
  return filteredOfficialTemplates.value.length === 0 &&
         filteredSharedTemplates.value.length === 0
})

// 组件挂载时加载数据
onMounted(() => {
  loadTemplates()
})

// 发布成功回调
const handlePublishSuccess = (template) => {
  // 重新加载模板列表
  loadTemplates()
  ElMessage.success('模板已成功发布！')
}

// 处理使用模板
const handleUseTemplate = async (template) => {
  try {
    // 增加使用次数统计
    await incrementUsageCount(template.id)

    // 更新本地数据
    const templateInList = allTemplates.value.find(t => t.id === template.id)
    if (templateInList) {
      templateInList.usageCount = (templateInList.usageCount || 0) + 1
    }

    ElMessage.success(`正在基于模板"${template.title || template.name}"创建项目...`)
    // TODO: 实现创建项目逻辑
  } catch (error) {
    console.error('使用模板失败:', error)
    // 仍然允许用户使用模板，只是统计失败
    ElMessage.success(`正在基于模板"${template.title || template.name}"创建项目...`)
  }
}

// 处理预览模板
const handlePreviewTemplate = (template) => {
  previewTemplate.value = template
  previewDialogVisible.value = true
}

// 处理下拉菜单命令(列表视图使用)
const handleDropdownCommand = (command, template) => {
  if (command === 'edit') {
    handleEditTemplate(template)
  } else if (command === 'delete') {
    handleDeleteTemplate(template)
  }
}

// 处理编辑模板
const handleEditTemplate = (template) => {
  ElMessage.info(`编辑模板: ${template.title || template.name}`)
  // TODO: 打开编辑对话框
}

// 处理删除模板
const handleDeleteTemplate = async (template) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除模板 "${template.title}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteTemplateApi(template.id)
    ElMessage.success('模板已删除')
    // 重新加载模板列表
    loadTemplates()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除模板失败:', error)
      ElMessage.error('删除模板失败')
    }
  }
}

// 处理审核模板
const handleReviewTemplate = async (template) => {
  try {
    const { value: reviewAction } = await ElMessageBox.prompt(
      `审核模板 "${template.title || template.name}"`,
      '模板审核',
      {
        confirmButtonText: '通过',
        cancelButtonText: '拒绝',
        inputPlaceholder: '请输入审核意见（可选）',
        inputType: 'textarea',
        distinguishCancelAndClose: true
      }
    )

    // 通过审核
    await reviewTemplate(template.id, {
      status: 'approved',
      comments: reviewAction || '审核通过'
    })

    ElMessage.success('模板审核通过')
    // 重新加载模板列表
    await loadTemplates()
  } catch (error) {
    if (error === 'cancel') {
      // 用户点击了"拒绝"按钮
      try {
        const { value: rejectReason } = await ElMessageBox.prompt(
          `请输入拒绝原因`,
          '拒绝模板',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入拒绝原因',
            inputType: 'textarea',
            inputValidator: (value) => {
              if (!value || value.trim() === '') {
                return '请输入拒绝原因'
              }
              return true
            }
          }
        )

        await reviewTemplate(template.id, {
          status: 'rejected',
          comments: rejectReason
        })

        ElMessage.success('已拒绝该模板')
        await loadTemplates()
      } catch (rejectError) {
        if (rejectError !== 'cancel' && rejectError !== 'close') {
          console.error('拒绝模板失败:', rejectError)
          ElMessage.error('操作失败')
        }
      }
    } else if (error !== 'close') {
      console.error('审核模板失败:', error)
      ElMessage.error('审核失败')
    }
  }
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
  padding: 24px;
}

/* Header Area */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

.header h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.header p {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  min-width: 600px;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 筛选和视图切换头部 */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: all 0.2s;
  white-space: nowrap;
  border: 1px solid transparent;
}

.filter-tab:hover {
  background: var(--el-fill-color);
  color: var(--el-text-color-primary);
}

.filter-tab.active {
  background: var(--el-color-primary);
  color: #fff;
  border-color: var(--el-color-primary);
}

.view-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  width: 260px;
}

.view-switcher {
  display: flex;
  gap: 4px;
  background: var(--el-fill-color);
  border-radius: 6px;
  padding: 4px;
}

.view-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: all 0.2s;
}

.view-btn:hover {
  background: var(--el-fill-color-darker);
  color: var(--el-text-color-primary);
}

.view-btn.active {
  background: var(--el-color-primary);
  color: #fff;
}

/* 网格视图 */
.template-grid-view {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* 列表视图 */
.template-list-view {
  flex: 1;
  overflow-y: auto;
  padding: 4px;
}

.template-list-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  margin-bottom: 16px;
  background: var(--el-bg-color-page);
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  transition: all 0.3s;
}

.template-list-item:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.list-item-thumb {
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--el-fill-color-darker);
}

.list-item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.list-item-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-item-actions {
  display: flex;
  gap: 8px;
}

.list-item-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-item-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-top: auto;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

.badge-official {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.badge-shared {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--el-text-color-secondary);
  text-align: center;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.empty-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

/* 布局网格 (详情视图) */
.layout-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  height: calc(100% - 180px);
  overflow: hidden;
}

/* 左侧模板列表 (详情视图) */
.template-list {
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color-page);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
}

.list-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
}

.search-mini {
  width: 100%;
  padding: 8px 12px;
  background: var(--el-fill-color);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  color: var(--el-text-color-primary);
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.search-mini:focus {
  border-color: var(--el-color-primary);
  background: var(--el-bg-color);
}

.search-mini::placeholder {
  color: var(--el-text-color-placeholder);
}

/* 筛选标签 (详情视图小版本) */
.filter-tabs-mini {
  display: flex;
  gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color);
  flex-wrap: wrap;
}

.filter-tab-mini {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-tab-mini:hover {
  background: var(--el-fill-color);
  color: var(--el-text-color-primary);
}

.filter-tab-mini.active {
  background: var(--el-color-primary);
  color: #fff;
}

/* 模板列表项容器 */
.template-items {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.template-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.template-item:hover {
  background: var(--el-fill-color);
  border-color: var(--el-border-color);
}

.template-item.selected {
  background: var(--el-fill-color-darker);
  border-color: var(--el-color-primary);
}

.item-thumb {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--el-fill-color-darker);
}

.item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 空状态 */
.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--el-text-color-secondary);
}

/* 右侧预览面板 */
.preview-panel {
  background: var(--el-bg-color-page);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
}

.toolbar-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.preview-image-container {
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color);
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.preview-details {
  padding: 20px;
  border-top: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.detail-value {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

/* 未选择状态 */
.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--el-text-color-secondary);
  text-align: center;
}

/* 预览对话框 */
.preview-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-dialog-image {
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
.template-grid-view::-webkit-scrollbar,
.template-list-view::-webkit-scrollbar,
.template-items::-webkit-scrollbar,
.preview-image-container::-webkit-scrollbar {
  width: 6px;
}

.template-grid-view::-webkit-scrollbar-thumb,
.template-list-view::-webkit-scrollbar-thumb,
.template-items::-webkit-scrollbar-thumb,
.preview-image-container::-webkit-scrollbar-thumb {
  background: var(--el-fill-color-darker);
  border-radius: 3px;
}

.template-grid-view::-webkit-scrollbar-track,
.template-list-view::-webkit-scrollbar-track,
.template-items::-webkit-scrollbar-track,
.preview-image-container::-webkit-scrollbar-track {
  background: transparent;
}
</style>
