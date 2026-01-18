<template>
  <div class="template-library">
    <!-- 头部区域 -->
    <div class="header">
      <div>
        <h2>企业模板库</h2>
        <p>浏览并使用企业内部标准化的数据大屏模板。所有模板均已通过安全审计，适配公司标准数据源。</p>
      </div>
      <div class="header-actions">
        <el-button @click="handleImportTemplate">
          <el-icon><Upload /></el-icon>
          导入模板包
        </el-button>
        <el-button type="primary" @click="handlePublishTemplate">
          <el-icon><Plus /></el-icon>
          发布我的模板
        </el-button>
      </div>
    </div>

    <!-- 布局容器：左列表，右预览 -->
    <div class="layout-grid">
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
        <div class="filter-tabs">
          <div
            v-for="filter in filters"
            :key="filter.id"
            :class="['filter-tab', { active: activeFilter === filter.id }]"
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
              <img :src="template.thumbnail" :alt="template.title || template.name" />
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
            <img :src="selectedTemplate.thumbnail" :alt="selectedTemplate.title || selectedTemplate.name" class="preview-image" />
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
          :src="previewTemplate.thumbnail"
          :alt="previewTemplate.title || previewTemplate.name"
          class="preview-image"
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
import { Plus, Upload, Check, Edit, Delete } from '@element-plus/icons-vue'
import PublishTemplateDialog from '@/components/PublishTemplateDialog.vue'
import { getTemplates, deleteTemplate as deleteTemplateApi, incrementUsageCount, reviewTemplate } from '@/api/template'
import { useUserStore } from '@/store/modules/user'

// 获取用户信息
const userStore = useUserStore()
const isAdmin = computed(() => userStore.userInfo?.role === 'admin' || userStore.userInfo?.isAdmin)

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

// 检查是否没有模板
const hasNoTemplates = computed(() => {
  return filteredOfficialTemplates.value.length === 0 &&
         filteredSharedTemplates.value.length === 0
})

// 组件挂载时加载数据
onMounted(() => {
  loadTemplates()
})

// 处理导入模板
const handleImportTemplate = () => {
  ElMessage.info('导入模板功能开发中...')
}

// 处理发布模板
const handlePublishTemplate = () => {
  publishDialogVisible.value = true
}

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
