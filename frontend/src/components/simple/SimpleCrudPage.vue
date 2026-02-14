<template>
  <div class="simple-crud-page">
    <!-- 面包屑导航 -->
    <BreadcrumbHeader v-if="breadcrumb" :items="breadcrumb" />

    <!-- 简单标题 -->
    <PageHeader v-else :title="title" />

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
        @page-change="$emit('page-change', $event)"
        @page-size-change="$emit('page-size-change', $event)"
        @sort-change="$emit('sort-change', $event)"
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

defineEmits(['add', 'edit', 'delete', 'refresh', 'page-change', 'page-size-change', 'sort-change'])

// 获取配置了 render 函数的列
const columnsWithRender = computed(() => {
  const columns = props.config.table?.columns || []
  return columns.filter(col => typeof col.render === 'function')
})
</script>

<style scoped>
.simple-crud-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  background-color: var(--el-bg-color-page);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: var(--el-fill-color-darker);
  border-radius: 3px;
}

.content-body {
  flex: 1;
  overflow-y: auto;
  margin-top: 12px;
}
</style>
