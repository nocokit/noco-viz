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

