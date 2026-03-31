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

