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
            <Close />
          </span>
        </div>

        <!-- 新增按钮 -->
        <div v-if="addable" class="tab-item tab-item--add" @click="handleAdd">
          <Plus />
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
import { CloseOutlined, PlusOutlined } from '@ant-design/icons-vue'

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

