<template>
  <div class="simple-crud-page-wrapper">
    <!-- 面包屑导航 - 在 padding 外面 -->
    <BreadcrumbHeader v-if="breadcrumb" :items="breadcrumb" />

    <div class="simple-crud-page">
      <!-- 简单标题 -->
      <PageHeader v-if="!breadcrumb" :title="title" />

      <!-- 面包屑下方的自定义内容插槽 -->
      <div v-if="$slots.headerBottom" class="header-bottom">
        <slot name="headerBottom"></slot>
      </div>

      <div class="content-body">
        <SimpleCrudModal
          :config="config"
          :data="data"
          :loading="loading"
          :pagination="pagination"
          :sort="sort"
          @add="$emit('add', $event)"
          @edit="(formData, editingItem) => $emit('edit', formData, editingItem)"
          @delete="$emit('delete', $event)"
          @refresh="$emit('refresh')"
          @search="$emit('search', $event)"
          @page-change="$emit('pageChange', $event)"
          @page-size-change="$emit('pageSizeChange', $event)"
          @sort-change="$emit('sortChange', $event)"
          @configure-permission="$emit('configurePermission', $event)"
          @test-connection="$emit('testConnection', $event)"
          @view-details="$emit('viewDetails', $event)"
          @batch-delete="$emit('batch-delete', $event)"
        >
          <!-- 透传所有插槽 -->
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps"></slot>
          </template>

          <!-- 动态渲染列（如果配置了 render 函数） -->
          <template
            v-for="column in columnsWithRender"
            :key="`column-${column.key}`"
            #[`column-${column.key}`]="{ row, value }"
          >
            <component :is="column.render(row, value)" />
          </template>
        </SimpleCrudModal>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import BreadcrumbHeader from '@/components/BreadcrumbHeader.vue'
import SimpleCrudModal from './SimpleCrudModal.vue'

const props = defineProps({
  // 页面标题（简单模式）
  title: {
    type: String,
    default: ''
  },
  // 面包屑导航（企业模式）
  breadcrumb: {
    type: Array,
    default: null
    // 示例：
    // [
    //   { label: '首页', path: '/' },
    //   { label: '设置', path: '/settings' },
    //   { label: 'IP白名单' }
    // ]
  },
  // SimpleCrudModal 配置
  config: {
    type: Object,
    required: true
  },
  // 数据源
  data: {
    type: Array,
    default: () => []
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 分页配置
  pagination: {
    type: Object,
    default: null
    // 格式: { page: 1, pageSize: 10, total: 0 }
  },
  // 排序配置
  sort: {
    type: Object,
    default: null
    // 格式: { key: 'name', order: 'asc' | 'desc' }
  }
})

defineEmits(['add', 'edit', 'delete', 'refresh', 'search', 'page-change', 'page-size-change', 'sort-change', 'batch-delete'])

// 获取配置了 render 函数的列
const columnsWithRender = computed(() => {
  const columns = props.config.table?.columns || []
  return columns.filter(col => typeof col.render === 'function')
})
</script>

<style scoped>
.simple-crud-page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.simple-crud-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
  overflow: hidden;
}

.content-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.simple-crud-page :deep(.simple-crud-modal) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.simple-crud-page :deep(.simple-crud-container) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.simple-crud-page :deep(.simple-table) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.simple-crud-page :deep(.ant-table-wrapper) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.simple-crud-page :deep(.ant-spin-nested-loading) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.simple-crud-page :deep(.ant-spin-container) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.simple-crud-page :deep(.ant-table) {
  flex: 1;
}
</style>
