<template>
  <div class="table-component">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="(col, i) in columns" :key="i">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ri) in tableData" :key="ri" :class="{ 'row-even': ri % 2 === 0 }">
          <td v-for="(cell, ci) in row" :key="ci" :class="{ 'cell-first': ci === 0 }">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Object, default: null }
})

const columns = computed(() => props.data?.columns || props.config.columns || ['名称', '部门', '数值'])

const tableData = computed(() => props.data?.rows || props.config.rows || [
  ['张三', '销售部', '¥52,000'],
  ['李四', '技术部', '¥48,000'],
  ['王五', '市场部', '¥45,000'],
  ['赵六', '运营部', '¥38,000']
])
</script>

<style scoped>
.table-component {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(0, 8, 20, 0.7);
  border: 1px solid rgba(0, 242, 242, 0.12);
}

.table-component::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.table-component::-webkit-scrollbar-track {
  background: transparent;
}

.table-component::-webkit-scrollbar-thumb {
  background: rgba(0, 242, 242, 0.2);
  border-radius: 2px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

thead tr {
  background: rgba(0, 242, 242, 0.08);
  border-bottom: 1px solid rgba(0, 242, 242, 0.25);
}

thead th {
  padding: 9px 12px;
  text-align: left;
  font-weight: 600;
  color: rgba(0, 242, 242, 0.8);
  letter-spacing: 0.5px;
  white-space: nowrap;
}

tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.15s;
}

tbody tr:hover {
  background: rgba(0, 242, 242, 0.05);
}

tbody tr.row-even {
  background: rgba(255, 255, 255, 0.02);
}

tbody tr.row-even:hover {
  background: rgba(0, 242, 242, 0.05);
}

tbody td {
  padding: 8px 12px;
  color: rgba(188, 208, 227, 0.75);
  white-space: nowrap;
}

tbody td.cell-first {
  color: rgba(232, 244, 255, 0.9);
  font-weight: 500;
}
</style>
