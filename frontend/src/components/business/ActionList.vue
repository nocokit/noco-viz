<template>
  <el-dropdown
    :trigger="trigger"
    :placement="placement"
    @command="handleCommand"
  >
    <slot>
      <el-button :type="buttonType" :size="size" :icon="icon">
        {{ text }}
        <el-icon v-if="!icon" class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
    </slot>

    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="(action, index) in visibleActions" :key="action.command || index">
          <el-dropdown-item
            v-if="!action.hidden"
            :command="action.command"
            :disabled="action.disabled"
            :divided="action.divided"
            :icon="action.icon"
          >
            <span :style="{ color: action.danger ? 'var(--el-color-danger)' : '' }">
              {{ action.label }}
            </span>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { usePermission } from '@/composables/usePermission'
import * as message from '@/utils/message'

const props = defineProps({
  actions: { type: Array, required: true },
  text: { type: String, default: '操作' },
  icon: { type: String, default: '' },
  buttonType: { type: String, default: 'default' },
  size: { type: String, default: 'default' },
  trigger: { type: String, default: 'click' },
  placement: { type: String, default: 'bottom' },
  data: { type: Object, default: null }
})

const emit = defineEmits(['command'])

const { hasPermission } = usePermission()

const visibleActions = computed(() => {
  return props.actions.filter(action => {
    // 权限检查
    if (action.permission && !hasPermission(action.permission)) {
      return false
    }

    // 自定义显示条件
    if (action.show !== undefined) {
      return typeof action.show === 'function'
        ? action.show(props.data)
        : action.show
    }

    return true
  })
})

const handleCommand = async (command) => {
  const action = props.actions.find(a => a.command === command)

  if (!action) return

  // 确认提示
  if (action.confirm) {
    try {
      const confirmText = typeof action.confirm === 'string'
        ? action.confirm
        : '确定要执行此操作吗？'

      if (action.danger) {
        await message.confirmDelete(confirmText)
      } else {
        await message.confirm(confirmText)
      }
    } catch {
      return
    }
  }

  // 执行操作
  if (action.handler) {
    await action.handler(props.data)
  }

  emit('command', { command, data: props.data, action })
}
</script>
