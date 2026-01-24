<template>
  <div :class="['page-container', paddingClass]" :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: '24px',
    validator: (value) => ['24px', '16px', 'none'].includes(value)
  },
  background: {
    type: String,
    default: ''
  },
  fullHeight: {
    type: Boolean,
    default: true
  }
})

const paddingClass = computed(() => {
  return `padding-${props.padding.replace('px', '')}`
})

const containerStyle = computed(() => {
  const style = {}
  if (props.background) {
    style.background = props.background
  }
  if (!props.fullHeight) {
    style.height = 'auto'
  }
  return style
})
</script>

<style scoped>
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-bg-color);
}

.padding-24 {
  padding: 24px;
}

.padding-16 {
  padding: 16px;
}

.padding-none {
  padding: 0;
}

@media (max-width: 768px) {
  .padding-24 {
    padding: 16px;
  }

  .padding-16 {
    padding: 12px;
  }
}
</style>
