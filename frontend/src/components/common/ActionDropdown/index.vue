<template>
  <a-dropdown
    :trigger="trigger"
    :placement="placement"
    :popper-class="`action-dropdown-popper ${popperClass}`"
    @command="handleCommand"
  >
    <slot name="trigger">
      <a-button :type="buttonType" :size="buttonSize" :circle="circle" :text="text">
        <MoreFilled />
      </a-button>
    </slot>

    <template #dropdown>
      <a-menu>
        <template v-for="(action, index) in actions" :key="action.value || index">
          <!-- 分隔线 -->
          <a-menu-item v-if="action.divided" divided />

          <!-- 操作项 -->
          <a-menu-item
            v-if="!action.divided"
            :command="action.value"
            :disabled="action.disabled"
            :class="[
              'action-dropdown-item',
              `action-dropdown-item--${action.type || 'default'}`,
              { 'action-dropdown-item--with-icon': action.icon }
            ]"
          >
            
              <component :is="action.icon" />
            
            <span class="action-dropdown-item__label">{{ action.label }}</span>
            <a-tag
              v-if="action.badge"
              :type="action.badgeType || 'info'"
              size="small"
              class="action-dropdown-item__badge"
            >
              {{ action.badge }}
            </a-tag>
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { MoreOutlined } from '@ant-design/icons-vue'

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

