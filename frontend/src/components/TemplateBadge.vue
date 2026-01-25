<template>
  <span :class="['template-badge', badgeClass]">
    {{ badgeText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  category: {
    type: String,
    default: 'shared'
  }
})

const badgeClass = computed(() => {
  return props.category === 'official' ? 'badge-official' : 'badge-shared'
})

const badgeText = computed(() => {
  return props.category === 'official' ? '官方' : '共享'
})
</script>

<style scoped>
.template-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

.badge-official {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.badge-shared {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}
</style>
