<template>
  <el-dropdown
    :trigger="trigger"
    :placement="placement"
    :popper-class="`action-dropdown-popper ${popperClass}`"
    @command="handleCommand"
  >
    <slot name="trigger">
      <el-button :type="buttonType" :size="buttonSize" :circle="circle" :text="text">
        <el-icon><MoreFilled /></el-icon>
      </el-button>
    </slot>

    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="(action, index) in actions" :key="action.value || index">
          <!-- 分隔线 -->
          <el-dropdown-item v-if="action.divided" divided />

          <!-- 操作项 -->
          <el-dropdown-item
            v-if="!action.divided"
            :command="action.value"
            :disabled="action.disabled"
            :class="[
              'action-dropdown-item',
              `action-dropdown-item--${action.type || 'default'}`,
              { 'action-dropdown-item--with-icon': action.icon }
            ]"
          >
            <el-icon v-if="action.icon" class="action-dropdown-item__icon">
              <component :is="action.icon" />
            </el-icon>
            <span class="action-dropdown-item__label">{{ action.label }}</span>
            <el-tag
              v-if="action.badge"
              :type="action.badgeType || 'info'"
              size="small"
              class="action-dropdown-item__badge"
            >
              {{ action.badge }}
            </el-tag>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { MoreFilled } from '@element-plus/icons-vue'

const props = defineProps({
  actions: {
    type: Array,
    required: true,
    validator: (actions) => {
      return actions.every(action => {
        // 分隔线不需要 label 和 value
        if (action.divided) return true
        return action.label && action.value !== undefined
      })
    }
  },
  trigger: {
    type: String,
    default: 'click',
    validator: (value) => ['click', 'hover', 'contextmenu'].includes(value)
  },
  placement: {
    type: String,
    default: 'bottom-end'
  },
  buttonType: {
    type: String,
    default: 'default'
  },
  buttonSize: {
    type: String,
    default: 'default'
  },
  circle: {
    type: Boolean,
    default: false
  },
  text: {
    type: Boolean,
    default: false
  },
  popperClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select', 'command'])

const handleCommand = (command) => {
  const action = props.actions.find(a => a.value === command)
  emit('select', command, action)
  emit('command', command)
}

defineExpose({
  actions: props.actions
})
</script>

<style>
.action-dropdown-popper {
  --el-dropdown-menuItem-hover-fill: rgba(255, 255, 255, 0.05);
  --el-dropdown-menuItem-hover-color: var(--el-color-primary);
}

.action-dropdown-popper .el-dropdown-menu {
  background: var(--bg-card, #1a1b1e);
  border: 1px solid var(--border, #35363a);
  padding: 6px 0;
}

.action-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--text-primary, #e8eaed);
  transition: all 0.3s;
}

.action-dropdown-item:hover:not(.is-disabled) {
  background: var(--el-dropdown-menuItem-hover-fill);
  color: var(--el-dropdown-menuItem-hover-color);
}

.action-dropdown-item.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 危险操作 */
.action-dropdown-item--danger {
  color: var(--el-color-danger);
}

.action-dropdown-item--danger:hover:not(.is-disabled) {
  background: rgba(245, 108, 108, 0.1);
  color: var(--el-color-danger);
}

/* 主要操作 */
.action-dropdown-item--primary {
  color: var(--el-color-primary);
}

.action-dropdown-item--primary:hover:not(.is-disabled) {
  background: var(--el-color-primary-light-9);
}

/* 警告操作 */
.action-dropdown-item--warning {
  color: var(--el-color-warning);
}

.action-dropdown-item--warning:hover:not(.is-disabled) {
  background: rgba(230, 162, 60, 0.1);
  color: var(--el-color-warning);
}

/* 成功操作 */
.action-dropdown-item--success {
  color: var(--el-color-success);
}

.action-dropdown-item--success:hover:not(.is-disabled) {
  background: rgba(103, 194, 58, 0.1);
  color: var(--el-color-success);
}

.action-dropdown-item__icon {
  font-size: 16px;
  flex-shrink: 0;
}

.action-dropdown-item__label {
  flex: 1;
  white-space: nowrap;
}

.action-dropdown-item__badge {
  margin-left: 8px;
}

/* 分隔线样式 */
.action-dropdown-popper .el-dropdown-menu__item--divided {
  margin: 6px 0;
  border-top-color: var(--border, #35363a);
}
</style>
