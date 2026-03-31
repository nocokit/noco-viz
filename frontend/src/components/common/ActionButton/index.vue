<template>
  <div class="action-button" :class="`action-button--${displayType}`">
    <!-- 文本按钮组 -->
    <template v-if="displayType === 'text'">
      <template v-for="(action, index) in visibleActions" :key="action.label">
        <a-button
          :type="action.type || 'primary'"
          :disabled="isDisabled(action)"
          :icon="action.icon"
          link
          @click="handleAction(action)"
        >
          {{ action.label }}
        </a-button>
        <a-divider
          v-if="index < visibleActions.length - 1"
          direction="vertical"
        />
      </template>

      <!-- 更多操作下拉 -->
      <template v-if="hasMore">
        <a-divider direction="vertical" />
        <a-dropdown @command="handleDropdownAction" trigger="click">
          <a-button link type="primary">
            更多
            <ArrowDown />
          </a-button>
          <template #dropdown>
            <a-menu>
              <a-menu-item
                v-for="action in moreActions"
                :key="action.label"
                :command="action"
                :disabled="isDisabled(action)"
                :divided="action.divided"
              >
                
                  <component :is="action.icon" />
                
                {{ action.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>

    <!-- 普通按钮组 -->
    <template v-else-if="displayType === 'button'">
      <a-button
        v-for="action in visibleActions"
        :key="action.label"
        :type="action.type || 'default'"
        :size="size"
        :disabled="isDisabled(action)"
        :icon="action.icon"
        @click="handleAction(action)"
      >
        {{ action.label }}
      </a-button>

      <!-- 更多操作下拉 -->
      <a-dropdown v-if="hasMore" @command="handleDropdownAction" trigger="click">
        <a-button :size="size">
          更多
          <ArrowDown />
        </a-button>
        <template #dropdown>
          <a-menu>
            <a-menu-item
              v-for="action in moreActions"
              :key="action.label"
              :command="action"
              :disabled="isDisabled(action)"
              :divided="action.divided"
            >
              
                <component :is="action.icon" />
              
              {{ action.label }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>

    <!-- 仅下拉菜单 -->
    <template v-else-if="displayType === 'dropdown'">
      <a-dropdown @command="handleDropdownAction" trigger="click">
        <span class="action-button__trigger">
          <slot name="trigger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </slot>
        </span>
        <template #dropdown>
          <a-menu>
            <a-menu-item
              v-for="action in actions"
              :key="action.label"
              :command="action"
              :disabled="isDisabled(action)"
              :divided="action.divided"
            >
              
                <component :is="action.icon" />
              
              {{ action.label }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  // 操作列表
  actions: {
    type: Array,
    required: true,
    default: () => []
  },

  // 显示类型
  type: {
    type: String,
    default: 'auto',
    validator: (value) => ['text', 'button', 'dropdown', 'auto'].includes(value)
  },

  // 按钮尺寸
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value)
  },

  // 最大显示数量(超过显示为下拉)
  max: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['action'])

// 计算实际显示类型
const displayType = computed(() => {
  if (props.type !== 'auto') return props.type

  // 自动判断
  const visibleCount = props.actions.filter(a => isVisible(a)).length
  if (visibleCount === 0) return 'text'
  if (visibleCount === 1) return 'text'
  if (visibleCount <= 3) return 'text'
  return 'text' // 默认使用text + 更多下拉
})

// 可见的操作
const visibleActions = computed(() => {
  const visible = props.actions.filter(a => isVisible(a))
  if (displayType.value === 'dropdown') return []
  return visible.slice(0, props.max)
})

// 更多操作
const moreActions = computed(() => {
  const visible = props.actions.filter(a => isVisible(a))
  return visible.slice(props.max)
})

// 是否有更多操作
const hasMore = computed(() => {
  return moreActions.value.length > 0
})

// 判断操作是否可见
const isVisible = (action) => {
  if (typeof action.visible === 'function') {
    return action.visible()
  }
  return action.visible !== false
}

// 判断操作是否禁用
const isDisabled = (action) => {
  if (typeof action.disabled === 'function') {
    return action.disabled()
  }
  return action.disabled === true
}

// 处理操作点击
const handleAction = (action) => {
  if (isDisabled(action)) return

  if (action.handler) {
    action.handler()
  }
  emit('action', action)
}

// 处理下拉菜单选择
const handleDropdownAction = (action) => {
  handleAction(action)
}
</script>

