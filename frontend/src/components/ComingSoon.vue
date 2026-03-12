<template>
  <div class="coming-soon-container">
    <a-empty description="该功能正在开发中，敬请期待">
      <template #image>
        <Tools />
      </template>
      <div class="feature-info">
        <h2>{{ displayTitle }}</h2>
        <p v-if="displayDescription" class="description">{{ displayDescription }}</p>
        <a-tag type="info" size="large">待开发</a-tag>
      </div>
    </a-empty>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ToolOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

const route = useRoute()

const displayTitle = computed(() => {
  return props.title || route.meta?.title || '功能开发中'
})

const displayDescription = computed(() => {
  return props.description || route.meta?.description || ''
})
</script>

