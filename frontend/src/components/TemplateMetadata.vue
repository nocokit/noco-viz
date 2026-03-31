<template>
  <div class="template-metadata" :class="{ vertical: layout === 'vertical' }">
    <div v-if="resolution" class="meta-item">
      <Monitor />
      <span>{{ resolution }}</span>
    </div>
    <div v-if="usageCount !== undefined" class="meta-item">
      <View />
      <span>{{ usageCount }} 次使用</span>
    </div>
    <div v-if="department" class="meta-item">
      <OfficeBuilding />
      <span>{{ department }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { DesktopOutlined, EyeOutlined, BankOutlined } from '@ant-design/icons-vue'

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

