<template>
  <div class="template-metadata" :class="{ vertical: layout === 'vertical' }">
    <div v-if="resolution" class="meta-item">
      <el-icon><Monitor /></el-icon>
      <span>{{ resolution }}</span>
    </div>
    <div v-if="usageCount !== undefined" class="meta-item">
      <el-icon><View /></el-icon>
      <span>{{ usageCount }} 次使用</span>
    </div>
    <div v-if="department" class="meta-item">
      <el-icon><OfficeBuilding /></el-icon>
      <span>{{ department }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { Monitor, View, OfficeBuilding } from '@element-plus/icons-vue'

defineProps({
  resolution: {
    type: String,
    default: '1920 x 1080'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  department: {
    type: String,
    default: ''
  },
  layout: {
    type: String,
    default: 'horizontal', // horizontal | vertical
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  }
})
</script>

<style scoped>
.template-metadata {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.template-metadata.vertical {
  flex-direction: column;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.template-metadata.vertical .meta-item {
  font-size: 14px;
}
</style>
