<!--
  对齐工具栏组件
-->
<template>
  <div class="align-tools">
    <button
      v-for="tool in alignTools"
      :key="tool.type"
      class="align-btn"
      :disabled="disabled"
      :title="tool.title"
      @click="$emit('align', tool.type)"
    >
      <component :is="tool.icon" />
    </button>
  </div>
</template>

<script setup>
import { h } from 'vue'

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['align'])

const alignTools = [
  {
    type: 'left',
    title: '左对齐',
    icon: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'currentColor' }, [
      h('path', { d: 'M2 1v14h1V1H2zm3 2h9v2H5V3zm0 4h7v2H5V7zm0 4h9v2H5v-2z' })
    ])
  },
  {
    type: 'center-x',
    title: '水平居中',
    icon: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'currentColor' }, [
      h('path', { d: 'M8 1v14h1V1H8zM3.5 3h4v2h-4V3zm1 4h4v2h-4V7zm-1 4h4v2h-4v-2z' })
    ])
  },
  {
    type: 'right',
    title: '右对齐',
    icon: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'currentColor' }, [
      h('path', { d: 'M13 1v14h1V1h-1zM2 3h9v2H2V3zm2 4h7v2H4V7zm-2 4h9v2H2v-2z' })
    ])
  },
  {
    type: 'top',
    title: '顶部对齐',
    icon: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'currentColor' }, [
      h('path', { d: 'M1 2v1h14V2H1zm2 3v9h2V5H3zm4 0v7h2V5H7zm4 0v9h2V5h-2z' })
    ])
  },
  {
    type: 'center-y',
    title: '垂直居中',
    icon: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'currentColor' }, [
      h('path', { d: 'M1 8v1h14V8H1zM3 3.5v4h2v-4H3zm4 1v4h2v-4H7zm4-1v4h2v-4h-2z' })
    ])
  },
  {
    type: 'bottom',
    title: '底部对齐',
    icon: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'currentColor' }, [
      h('path', { d: 'M1 13v1h14v-1H1zM3 2v9h2V2H3zm4 2v7h2V4H7zm4-2v9h2V2h-2z' })
    ])
  }
]
</script>

<style scoped>
.align-tools {
  display: flex;
  gap: 4px;
}

.align-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.align-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.align-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
