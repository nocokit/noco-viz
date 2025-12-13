<!--
  数据表格组件
  结构化数据展示
-->
<template>
  <div class="table-component">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: null
  }
})

const columns = computed(() => {
  return props.data?.columns || props.config.columns || ['姓名', '部门', '销售额']
})

const tableData = computed(() => {
  return props.data?.rows || props.config.rows || [
    ['张三', '销售部', '¥52,000'],
    ['李四', '技术部', '¥48,000'],
    ['王五', '市场部', '¥45,000'],
    ['赵六', '运营部', '¥38,000']
  ]
})
</script>

<style scoped>
.table-component {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;
}

.data-table thead {
  background: rgba(59, 130, 246, 0.2);
  position: sticky;
  top: 0;
  z-index: 1;
}

.data-table th {
  padding: 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 2px solid rgba(59, 130, 246, 0.5);
}

.data-table td {
  padding: 10px 12px;
  font-size: 13px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.data-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* 滚动条样式 */
.table-component::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-component::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.table-component::-webkit-scrollbar-track {
  background: transparent;
}
</style>
