<template>
  <div class="tab-navigation" :class="`tab-navigation--${type}`">
    <div class="tab-navigation__container">
      <!-- 标签列表 -->
      <div class="tab-navigation__tabs">
        <div
          v-for="tab in tabs"
          :key="tab.name"
          class="tab-item"
          :class="{
            'tab-item--active': modelValue === tab.name,
            'tab-item--disabled': tab.disabled
          }"
          @click="handleTabClick(tab)"
        >
          <!-- 图标 -->
          <component
            v-if="tab.icon"
            :is="tab.icon"
            class="tab-item__icon"
          />

          <!-- 标签文本 -->
          <span class="tab-item__label">{{ tab.label }}</span>

          <!-- 角标 -->
          <span
            v-if="tab.badge !== undefined && tab.badge !== null"
            class="tab-item__badge"
          >
            {{ tab.badge }}
          </span>

          <!-- 关闭按钮 -->
          <span
            v-if="closable && !tab.disabled"
            class="tab-item__close"
            @click.stop="handleClose(tab)"
          >
            <el-icon><Close /></el-icon>
          </span>
        </div>

        <!-- 新增按钮 -->
        <div v-if="addable" class="tab-item tab-item--add" @click="handleAdd">
          <el-icon><Plus /></el-icon>
        </div>
      </div>

      <!-- 额外操作区域 -->
      <div v-if="$slots.extra" class="tab-navigation__extra">
        <slot name="extra" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Close, Plus } from '@element-plus/icons-vue'

const props = defineProps({
  // v-model绑定值
  modelValue: {
    type: [String, Number],
    required: true
  },

  // 标签配置
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => {
      return tabs.every(tab =>
        tab.name !== undefined &&
        tab.label !== undefined
      )
    }
  },

  // 风格类型
  type: {
    type: String,
    default: 'card',
    validator: (value) => ['card', 'border', 'plain'].includes(value)
  },

  // 是否可关闭
  closable: {
    type: Boolean,
    default: false
  },

  // 是否可新增
  addable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'tab-click', 'tab-close', 'tab-add'])

// 点击标签
const handleTabClick = (tab) => {
  if (tab.disabled) return

  emit('update:modelValue', tab.name)
  emit('tab-click', tab)
}

// 关闭标签
const handleClose = (tab) => {
  emit('tab-close', tab)
}

// 新增标签
const handleAdd = () => {
  emit('tab-add')
}
</script>

<style scoped>
.tab-navigation {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
}

.tab-navigation__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

/* 标签列表 */
.tab-navigation__tabs {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tab-navigation__tabs::-webkit-scrollbar {
  display: none;
}

/* 标签项 */
.tab-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.tab-item:hover:not(.tab-item--disabled):not(.tab-item--active) {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.tab-item--active {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.tab-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 图标 */
.tab-item__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* 标签文本 */
.tab-item__label {
  flex: 1;
}

/* 角标 */
.tab-item__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  line-height: 1;
}

.tab-item--active .tab-item__badge {
  background: var(--color-primary);
  color: #fff;
}

/* 关闭按钮 */
.tab-item__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
  opacity: 0;
  transition: all var(--transition-fast);
}

.tab-item:hover .tab-item__close {
  opacity: 0.6;
}

.tab-item__close:hover {
  opacity: 1 !important;
  background: var(--bg-hover);
}

.tab-item__close .el-icon {
  font-size: 12px;
}

/* 新增按钮 */
.tab-item--add {
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-tertiary);
  border: 1px dashed var(--border);
}

.tab-item--add:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--bg-active);
}

/* 额外操作区域 */
.tab-navigation__extra {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* ========== Card 风格 ========== */
.tab-navigation--card {
  padding: var(--spacing-sm);
}

.tab-navigation--card .tab-item--active {
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
}

/* ========== Border 风格 ========== */
.tab-navigation--border {
  border-bottom: 2px solid var(--border-light);
  border-radius: 0;
}

.tab-navigation--border .tab-navigation__container {
  padding: 0 var(--spacing-lg);
}

.tab-navigation--border .tab-item {
  border-radius: 0;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

.tab-navigation--border .tab-item--active {
  border-bottom-color: var(--color-primary);
  background: transparent;
}

.tab-navigation--border .tab-item:hover:not(.tab-item--disabled):not(.tab-item--active) {
  background: transparent;
  border-bottom-color: var(--border);
}

/* ========== Plain 风格 ========== */
.tab-navigation--plain {
  background: transparent;
  border-radius: 0;
}

.tab-navigation--plain .tab-item {
  border-radius: var(--radius-sm);
}

.tab-navigation--plain .tab-item--active {
  background: var(--bg-active);
}
</style>
