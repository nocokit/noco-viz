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
      @click="collapsible && !hasSwitch && toggleCollapse()"
    >
      <span class="section-title">
        {{ title }}
      </span>
      <div class="section-header-actions">
        <a-switch
          v-if="hasSwitch"
          :checked="switchEnabled"
          size="small"
          @click.stop
          @change="handleSwitchChange"
        />
        <svg
          v-if="collapsible"
          class="collapse-icon"
          :class="{ 'is-collapsed': collapsed }"
          viewBox="0 0 1024 1024"
          width="12"
          height="12"
          @click.stop="toggleCollapse"
        >
          <path fill="currentColor" d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"/>
        </svg>
      </div>
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
import { ref, computed, watch } from 'vue'

const props = defineProps({
  title: String,
  icon: String,
  collapsible: Boolean,
  defaultCollapsed: Boolean,
  divider: {
    type: Boolean,
    default: true
  },
  // 开关相关
  switchKey: String,
  switchValue: [Number, Boolean],
  switchCondition: Function
})

const emit = defineEmits(['switch-change'])

const collapsed = ref(props.defaultCollapsed || false)
const hasSwitch = computed(() => !!props.switchKey)

// 根据switchValue和switchCondition计算开关状态
const switchEnabled = computed({
  get() {
    if (!hasSwitch.value) return false
    if (props.switchCondition) {
      return props.switchCondition(props.switchValue)
    }
    return !!props.switchValue
  },
  set(value) {
    // 不在这里处理，由handleSwitchChange统一处理
  }
})

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

const handleSwitchChange = (checked) => {
  emit('switch-change', checked)
}
</script>

<style scoped>
.editor-form-section {
  margin-bottom: 4px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 6px 0;
  margin-left: -13px;
  border-left: 4px solid #409eff;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 0;
  user-select: none;
  transition: all 0.2s ease;
}

.section-header.is-collapsible {
  cursor: pointer;
}

.section-header.is-collapsible:hover {
  background: rgba(255, 255, 255, 0.05);
  border-bottom-color: rgba(255, 255, 255, 0.12);
}

.section-header.is-collapsible:hover .section-title {
  color: rgba(255, 255, 255, 1);
}

.section-header.is-collapsible:hover .collapse-icon {
  opacity: 1;
  color: #1890ff;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #bcd0e3;
  padding-left: 8px;
  transition: color 0.2s;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.section-header:hover .section-icon {
  opacity: 1;
}

.section-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-header-actions :deep(.ant-switch) {
  background-color: rgba(255, 255, 255, 0.15);
}

.section-header-actions :deep(.ant-switch-checked) {
  background-color: #1890ff;
}

.collapse-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.6;
  flex-shrink: 0;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
}

.collapse-icon:hover {
  opacity: 1;
  color: #1890ff;
}

.collapse-icon.is-collapsed {
  transform: rotate(-90deg);
  opacity: 0.4;
}

.section-content {
  padding: 8px 0 4px 0;
  animation: slideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    max-height: 2000px;
    transform: translateY(0);
  }
}

.section-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 8px -16px;
}
</style>
