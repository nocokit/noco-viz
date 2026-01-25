<template>
  <div class="data-table-wrapper">
    <table :class="['data-table', `data-table--${variant}`]">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.prop || column.label"
            :width="column.width"
            :class="[column.align === 'center' && 'text-center']"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody v-if="!loading && data.length > 0">
        <tr v-for="(row, index) in data" :key="row.id || index">
          <td
            v-for="column in columns"
            :key="column.prop || column.label"
            :class="[column.align === 'center' && 'text-center']"
          >
            <slot
              v-if="column.slot"
              :name="column.slot"
              :row="row"
              :column="column"
              :index="index"
            >
              {{ row[column.prop] }}
            </slot>
            <span v-else>{{ row[column.prop] }}</span>
          </td>
        </tr>
      </tbody>
      <tbody v-else-if="!loading && data.length === 0">
        <tr>
          <td :colspan="columns.length" class="empty-state">
            <slot name="empty">
              <el-empty :description="emptyText" />
            </slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="columns.length" class="loading-state">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>{{ loadingText }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'

defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => []
  },
  // 列配置
  columns: {
    type: Array,
    required: true,
    // columns: [
    //   { label: '名称', prop: 'name', width: '25%', slot: 'name' },
    //   { label: '状态', prop: 'status', align: 'center' }
    // ]
  },
  // 样式变体
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'dark', 'light'].includes(v)
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 空数据文本
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  // 加载文本
  loadingText: {
    type: String,
    default: '加载中...'
  }
})
</script>

<style scoped>
/* ========== 基础样式 ========== */
.data-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

/* ========== 表头样式 ========== */
.data-table thead {
  background: rgba(59, 130, 246, 0.1);
}

.data-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.data-table th.text-center {
  text-align: center;
}

/* ========== 表体样式 ========== */
.data-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}

.data-table tbody tr:hover {
  background: var(--bg-hover);
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table td {
  padding: 14px 16px;
  font-size: 14px;
  color: var(--text-main);
}

.data-table td.text-center {
  text-align: center;
}

/* ========== 空状态和加载状态 ========== */
.empty-state,
.loading-state {
  text-align: center;
  padding: 60px 20px !important;
  color: var(--text-secondary);
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-state .el-icon {
  font-size: 20px;
}

/* ========== 主题变体 ========== */

/* Default 主题 - 使用 CSS 变量 */
.data-table--default {
  --text-main: var(--el-text-color-primary);
  --text-secondary: var(--el-text-color-secondary);
  --text-tertiary: var(--el-text-color-placeholder);
  --border: var(--el-border-color);
  --bg-hover: var(--el-fill-color-light);
}

/* Dark 主题 - 深色主题 */
.data-table--dark {
  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-tertiary: #6b7280;
  --border: #2d2e33;
  --bg-hover: #26272c;
}

.data-table--dark thead {
  background: rgba(0, 0, 0, 0.2);
}

/* Light 主题 - 浅色主题 */
.data-table--light {
  --text-main: #303133;
  --text-secondary: #606266;
  --text-tertiary: #909399;
  --border: #ebeef5;
  --bg-hover: #f5f7fa;
}

.data-table--light thead {
  background: #f5f7fa;
}
</style>
