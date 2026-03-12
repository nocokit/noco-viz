<template>
  <div :class="['content-area', { scrollable: scrollable }]" :style="contentStyle">
    <div v-if="loading" class="loading-overlay">
      <Loading />
    </div>
    <slot v-else></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  padding: {
    type: String,
    default: ''
  },
  scrollable: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const contentStyle = computed(() => {
  const style = {}
  if (props.padding) {
    style.padding = props.padding
  }
  return style
})
</script>

