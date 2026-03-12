<!--
  编辑器表单分组组件
  用于组织表单字段的分组和折叠
-->
<template>
  <div class="editor-form-section">
    <!-- 分组标题 -->
    <div
      v-if="title"
      class="section-header"
      :class="{ 'is-collapsible': collapsible }"
      @click="collapsible && toggleCollapse()"
    >
      <span class="section-title">{{ title }}</span>
      <svg
        v-if="collapsible"
        class="collapse-icon"
        :class="{ 'is-collapsed': collapsed }"
        viewBox="0 0 1024 1024"
        width="12"
        height="12"
      >
        <path fill="currentColor" d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"/>
      </svg>
    </div>

    <!-- 分组内容 -->
    <div v-show="!collapsed" class="section-content">
      <slot></slot>
    </div>

    <!-- 分隔线 -->
    <div v-if="divider && !collapsed" class="section-divider"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  collapsible: Boolean,
  defaultCollapsed: Boolean,
  divider: {
    type: Boolean,
    default: true
  }
})

const collapsed = ref(props.defaultCollapsed || false)

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
.editor-form-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin: 0 -12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  user-select: none;
  transition: all 0.2s ease;
}

.section-header.is-collapsible {
  cursor: pointer;
  border: 1px solid transparent;
}

.section-header.is-collapsible:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
}

.section-header.is-collapsible:hover .section-title {
  color: rgba(255, 255, 255, 0.95);
}

.section-header.is-collapsible:hover .collapse-icon {
  opacity: 0.8;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.collapse-icon {
  transition: all 0.2s ease;
  opacity: 0.6;
  flex-shrink: 0;
}

.collapse-icon.is-collapsed {
  transform: rotate(-90deg);
}

.section-content {
  padding: 12px 0 4px 0;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 16px 0;
}
</style>
