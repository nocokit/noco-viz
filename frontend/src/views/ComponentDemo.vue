<template>
  <div class="component-demo-page">
    <PageLayout>
      <template #header>
        <PageHeader
          title="组件演示中心"
          subtitle="查看所有公共组件的使用示例和效果"
        >
          <template #actions>
            <SearchBar v-model="searchKeyword" placeholder="搜索组件..." style="width: 300px" />
          </template>
        </PageHeader>

        <FilterBar
          v-model="activeCategory"
          :filters="categories"
          style="tabs"
        />
      </template>

      <div class="demo-content">
        <!-- 组件列表 -->
        <div class="component-grid">
          <div
            v-for="component in filteredComponents"
            :key="component.id"
            class="component-card"
            @click="showDemo(component)"
          >
            <div class="component-card__header">
              <el-icon class="component-icon" :size="32">
                <component :is="component.icon" />
              </el-icon>
              <div class="component-info">
                <h3>{{ component.name }}</h3>
                <p>{{ component.description }}</p>
              </div>
              <el-tag v-if="component.isNew" type="success" size="small">New</el-tag>
            </div>
            <div class="component-card__footer">
              <span class="category">{{ component.category }}</span>
              <el-button link type="primary">查看演示</el-button>
            </div>
          </div>
        </div>

        <!-- 演示弹窗 -->
        <el-dialog
          v-model="demoVisible"
          :title="currentComponent?.name"
          width="90%"
          class="demo-dialog"
        >
          <div class="demo-container">
            <!-- 左侧：实时演示 -->
            <div class="demo-preview">
              <h4>实时预览</h4>
              <div class="preview-area">
                <component
                  :is="currentComponent?.component"
                  v-bind="demoProps"
                  @click="handleDemoEvent"
                />
              </div>
            </div>

            <!-- 右侧：配置和代码 -->
            <div class="demo-controls">
              <el-tabs v-model="activeTab">
                <el-tab-pane label="属性配置" name="props">
                  <div class="props-config">
                    <div
                      v-for="prop in currentComponent?.props"
                      :key="prop.name"
                      class="prop-item"
                    >
                      <label>{{ prop.label }}</label>
                      <component
                        :is="getControlComponent(prop.type)"
                        v-model="demoProps[prop.name]"
                        v-bind="prop.options"
                      />
                    </div>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="示例代码" name="code">
                  <div class="code-preview">
                    <pre><code>{{ generateCode() }}</code></pre>
                    <el-button @click="copyCode" type="primary" size="small">
                      <el-icon><DocumentCopy /></el-icon>
                      复制代码
                    </el-button>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="API文档" name="api">
                  <div class="api-docs">
                    <h5>Props</h5>
                    <el-table :data="currentComponent?.apiProps" border>
                      <el-table-column prop="name" label="属性名" width="120" />
                      <el-table-column prop="type" label="类型" width="100" />
                      <el-table-column prop="default" label="默认值" width="100" />
                      <el-table-column prop="description" label="说明" />
                    </el-table>

                    <h5 style="margin-top: 20px">Events</h5>
                    <el-table :data="currentComponent?.apiEvents" border>
                      <el-table-column prop="name" label="事件名" width="120" />
                      <el-table-column prop="params" label="参数" width="200" />
                      <el-table-column prop="description" label="说明" />
                    </el-table>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-dialog>
      </div>
    </PageLayout>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Monitor,
  Grid,
  Filter,
  Document,
  Upload,
  Loading,
  Location,
  DataLine,
  DocumentCopy
} from '@element-plus/icons-vue'

// 导入所有组件
import PageLayout from '@/components/common/PageLayout'
import PageHeader from '@/components/PageHeader.vue'
import FilterBar from '@/components/common/FilterBar'
import SearchBar from '@/components/common/SearchBar'
import StepModal from '@/components/common/StepModal'
import InfoCard from '@/components/common/InfoCard'
import LoadingState from '@/components/common/LoadingState'
import Breadcrumb from '@/components/common/Breadcrumb'
import ActionDropdown from '@/components/common/ActionDropdown'

const searchKeyword = ref('')
const activeCategory = ref('all')
const demoVisible = ref(false)
const currentComponent = ref(null)
const demoProps = ref({})
const activeTab = ref('props')

// 组件分类
const categories = [
  { id: 'all', label: '全部组件', count: 23 },
  { id: 'layout', label: '布局组件', count: 3 },
  { id: 'navigation', label: '筛选导航', count: 5 },
  { id: 'modal', label: '弹窗组件', count: 3 },
  { id: 'data', label: '数据展示', count: 7 },
  { id: 'action', label: '操作组件', count: 2 },
  { id: 'upload', label: '文件上传', count: 3 }
]

// 组件列表
const components = [
  {
    id: 'step-modal',
    name: 'StepModal',
    description: '多步骤弹窗，支持向导式流程',
    category: 'modal',
    icon: Document,
    isNew: true,
    component: StepModal,
    props: [
      { name: 'title', label: '标题', type: 'input', options: { placeholder: '请输入标题' } },
      { name: 'width', label: '宽度', type: 'input', options: { placeholder: '700px' } }
    ],
    apiProps: [
      { name: 'modelValue', type: 'Boolean', default: 'false', description: '是否显示' },
      { name: 'steps', type: 'Array', default: '[]', description: '步骤配置' },
      { name: 'title', type: 'String', default: '', description: '弹窗标题' }
    ],
    apiEvents: [
      { name: 'finish', params: 'formData', description: '完成所有步骤时触发' },
      { name: 'cancel', params: '-', description: '取消时触发' }
    ]
  },
  {
    id: 'filter-bar',
    name: 'FilterBar',
    description: '增强型筛选栏，支持3种风格',
    category: 'navigation',
    icon: Filter,
    isNew: true,
    component: FilterBar,
    props: [
      {
        name: 'style',
        label: '风格',
        type: 'select',
        options: {
          options: [
            { label: 'Tabs', value: 'tabs' },
            { label: 'Pills', value: 'pills' },
            { label: 'Buttons', value: 'buttons' }
          ]
        }
      }
    ],
    apiProps: [
      { name: 'modelValue', type: 'String|Number', default: '', description: '当前选中值' },
      { name: 'filters', type: 'Array', default: '[]', description: '筛选项配置' },
      { name: 'style', type: 'String', default: 'tabs', description: '风格类型' }
    ],
    apiEvents: [
      { name: 'change', params: 'value, filter', description: '切换时触发' }
    ]
  },
  {
    id: 'info-card',
    name: 'InfoCard',
    description: '信息卡片，展示统计数据',
    category: 'data',
    icon: DataLine,
    isNew: true,
    component: InfoCard,
    props: [
      { name: 'title', label: '标题', type: 'input' },
      { name: 'value', label: '数值', type: 'input' },
      { name: 'trend', label: '趋势', type: 'input' }
    ],
    apiProps: [
      { name: 'title', type: 'String', default: '', description: '卡片标题' },
      { name: 'value', type: 'Number|String', default: '', description: '主要数值' },
      { name: 'trend', type: 'Number', default: '', description: '趋势百分比' }
    ],
    apiEvents: [
      { name: 'click', params: 'event', description: '点击时触发（hoverable=true时）' }
    ]
  },
  {
    id: 'loading-state',
    name: 'LoadingState',
    description: '加载状态，支持多种动画',
    category: 'data',
    icon: Loading,
    isNew: true,
    component: LoadingState,
    props: [
      {
        name: 'type',
        label: '类型',
        type: 'select',
        options: {
          options: [
            { label: 'Spinner', value: 'spinner' },
            { label: 'Dots', value: 'dots' },
            { label: 'Pulse', value: 'pulse' },
            { label: 'Skeleton', value: 'skeleton' }
          ]
        }
      },
      { name: 'text', label: '文字', type: 'input' }
    ],
    apiProps: [
      { name: 'type', type: 'String', default: 'spinner', description: '加载类型' },
      { name: 'text', type: 'String', default: '加载中...', description: '加载文字' },
      { name: 'fullscreen', type: 'Boolean', default: 'false', description: '全屏显示' }
    ],
    apiEvents: []
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    description: '面包屑导航',
    category: 'navigation',
    icon: Location,
    isNew: true,
    component: Breadcrumb,
    props: [],
    apiProps: [
      { name: 'items', type: 'Array', default: '[]', description: '面包屑项' },
      { name: 'separator', type: 'String', default: '/', description: '分隔符' }
    ],
    apiEvents: [
      { name: 'click', params: 'item, index', description: '点击项时触发' }
    ]
  }
  // 更多组件...
]

const filteredComponents = computed(() => {
  let result = components

  // 分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(c => c.category === activeCategory.value)
  }

  // 搜索筛选
  if (searchKeyword.value) {
    result = result.filter(c =>
      c.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      c.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  return result
})

const showDemo = (component) => {
  currentComponent.value = component
  demoProps.value = {}
  demoVisible.value = true
}

const getControlComponent = (type) => {
  const map = {
    input: 'el-input',
    select: 'el-select',
    switch: 'el-switch',
    slider: 'el-slider'
  }
  return map[type] || 'el-input'
}

const generateCode = () => {
  const comp = currentComponent.value
  if (!comp) return ''

  const propsStr = Object.entries(demoProps.value)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      if (typeof value === 'string') return `  ${key}="${value}"`
      return `  :${key}="${value}"`
    })
    .join('\n')

  return `<${comp.name}\n${propsStr}\n/>`
}

const copyCode = () => {
  navigator.clipboard.writeText(generateCode())
  ElMessage.success('代码已复制到剪贴板')
}

const handleDemoEvent = () => {
  console.log('Demo event triggered')
}
</script>

<style scoped>
.component-demo-page {
  min-height: 100vh;
  background: var(--bg-page, #141517);
}

.demo-content {
  padding: 24px;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.component-card {
  background: var(--bg-card, #1a1b1e);
  border: 1px solid var(--border, #35363a);
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.component-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-color: var(--el-color-primary);
}

.component-card__header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.component-icon {
  color: var(--el-color-primary);
  flex-shrink: 0;
}

.component-info {
  flex: 1;
  min-width: 0;
}

.component-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: var(--text-primary, #e8eaed);
}

.component-info p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
  line-height: 1.5;
}

.component-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border, #35363a);
}

.category {
  font-size: 12px;
  color: var(--text-tertiary, #5f6368);
}

.demo-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  min-height: 500px;
}

.demo-preview {
  border: 1px solid var(--border, #35363a);
  border-radius: 8px;
  padding: 20px;
}

.demo-preview h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--text-primary, #e8eaed);
}

.preview-area {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  padding: 20px;
}

.demo-controls {
  display: flex;
  flex-direction: column;
}

.props-config {
  padding: 16px 0;
}

.prop-item {
  margin-bottom: 20px;
}

.prop-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
}

.code-preview {
  position: relative;
  background: #1e1e1e;
  border-radius: 6px;
  padding: 16px;
}

.code-preview pre {
  margin: 0;
  overflow-x: auto;
}

.code-preview code {
  color: #d4d4d4;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.code-preview .el-button {
  position: absolute;
  top: 16px;
  right: 16px;
}

.api-docs {
  padding: 16px 0;
}

.api-docs h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-primary, #e8eaed);
}

@media (max-width: 1024px) {
  .demo-container {
    grid-template-columns: 1fr;
  }

  .component-grid {
    grid-template-columns: 1fr;
  }
}
</style>
