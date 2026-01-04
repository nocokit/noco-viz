<template>
  <div :class="['meta-info-list', `layout-${layout}`]">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="meta-item"
    >
      <span v-if="item.label" class="meta-label">{{ item.label }}:</span>
      <span class="meta-value" :style="{ color: item.color }">
        <el-icon v-if="item.icon" class="meta-icon">
          <component :is="item.icon" />
        </el-icon>
        <slot :name="`value-${index}`" :item="item">
          {{ item.value }}
        </slot>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // 元信息列表
  items: {
    type: Array,
    required: true
    // [{ label: '类型', value: 'MySQL', icon: Database, color: '#409eff' }]
  },
  // 布局方式
  layout: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical', 'grid'].includes(value)
  }
})
</script>

<style scoped>
.meta-info-list {
  display: flex;
  gap: var(--spacing-md);
}

/* 水平布局 */
.meta-info-list.layout-horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}

.meta-info-list.layout-horizontal .meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* 垂直布局 */
.meta-info-list.layout-vertical {
  flex-direction: column;
}

.meta-info-list.layout-vertical .meta-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

/* 网格布局 */
.meta-info-list.layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.meta-info-list.layout-grid .meta-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

/* 元信息项 */
.meta-item {
  font-size: var(--font-size-sm);
}

.meta-label {
  color: var(--text-secondary);
  font-weight: var(--font-weight-normal);
}

.meta-value {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.meta-icon {
  font-size: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .meta-info-list.layout-horizontal {
    flex-direction: column;
  }

  .meta-info-list.layout-grid {
    grid-template-columns: 1fr;
  }
}
</style>
