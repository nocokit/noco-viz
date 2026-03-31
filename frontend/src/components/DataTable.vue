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
              <a-empty :description="emptyText" />
            </slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="columns.length" class="loading-state">
            <Loading />
            <span>{{ loadingText }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { LoadingOutlined } from '@ant-design/icons-vue'

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

