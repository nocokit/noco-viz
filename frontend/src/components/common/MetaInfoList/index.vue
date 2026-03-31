<template>
  <div :class="['meta-info-list', `layout-${layout}`]">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="meta-item"
    >
      <span v-if="item.label" class="meta-label">{{ item.label }}:</span>
      <span class="meta-value" :style="{ color: item.color }">
        
          <component :is="item.icon" />
        
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

