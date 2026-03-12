<template>
  <div :class="['empty-state', `empty-state--${size}`]">
    <!-- 图片或图标 -->
    <div class="empty-state__visual">
      <slot name="image">
        <img v-if="image" :src="image" :alt="description" class="empty-state__image" />
        <div v-else class="empty-state__icon">
          <slot name="icon">
            
              <component :is="iconComponent" />
            
          </slot>
        </div>
      </slot>
    </div>

    <!-- 标题 -->
    <h3 v-if="title || $slots.title" class="empty-state__title">
      <slot name="title">{{ title }}</slot>
    </h3>

    <!-- 描述 -->
    <div class="empty-state__description">
      <slot>{{ description || '暂无数据' }}</slot>
    </div>

    <!-- 操作按钮 -->
    <div v-if="actionText || $slots.action" class="empty-state__action">
      <slot name="action">
        <a-button
          v-if="actionText"
          :type="actionType"
          :size="actionSize"
          @click="handleAction"
        >
          
            <component :is="actionIcon" />
          
          {{ actionText }}
        </a-button>
      </slot>
    </div>

    <!-- 额外内容 -->
    <div v-if="$slots.extra" class="empty-state__extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FileOutlined, FolderOpenOutlined, PictureOutlined, LoadingOutlined, InboxOutlined, SearchOutlined, StockOutlined, ApiOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 描述
  description: {
    type: String,
    default: ''
  },
  // 图片URL
  image: {
    type: String,
    default: ''
  },
  // 图标类型
  icon: {
    type: [String, Object],
    default: 'document'
  },
  // 图标大小
  iconSize: {
    type: Number,
    default: 0
  },
  // 尺寸
  size: {
    type: String,
    default: 'default', // 'small' | 'default' | 'large'
    validator: (value) => ['small', 'default', 'large'].includes(value)
  },
  // 操作按钮文字
  actionText: {
    type: String,
    default: ''
  },
  // 操作按钮类型
  actionType: {
    type: String,
    default: 'primary'
  },
  // 操作按钮尺寸
  actionSize: {
    type: String,
    default: 'default'
  },
  // 操作按钮图标
  actionIcon: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['action'])

const iconMap = {
  document: Document,
  folder: FolderOpened,
  picture: Picture,
  loading: Loading,
  box: Box,
  search: Search,
  data: DataLine,
  connection: Connection,
  files: Files
}

const iconComponent = computed(() => {
  if (typeof props.icon === 'object') {
    return props.icon
  }
  return iconMap[props.icon] || Document
})

const computedIconSize = computed(() => {
  if (props.iconSize) return props.iconSize
  const sizeMap = {
    small: 48,
    default: 64,
    large: 80
  }
  return sizeMap[props.size] || 64
})

const handleAction = () => {
  emit('action')
}
</script>

