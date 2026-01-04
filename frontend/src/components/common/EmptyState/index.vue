<template>
  <div :class="['empty-state', `empty-state--${size}`]">
    <!-- 图片或图标 -->
    <div class="empty-state__visual">
      <slot name="image">
        <img v-if="image" :src="image" :alt="description" class="empty-state__image" />
        <div v-else class="empty-state__icon">
          <slot name="icon">
            <el-icon :size="computedIconSize">
              <component :is="iconComponent" />
            </el-icon>
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
        <el-button
          v-if="actionText"
          :type="actionType"
          :size="actionSize"
          @click="handleAction"
        >
          <el-icon v-if="actionIcon">
            <component :is="actionIcon" />
          </el-icon>
          {{ actionText }}
        </el-button>
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
import {
  Document,
  FolderOpened,
  Picture,
  Loading,
  Box,
  Search,
  DataLine,
  Connection,
  Files
} from '@element-plus/icons-vue'

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

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-state--small {
  padding: 40px 20px;
}

.empty-state--large {
  padding: 80px 20px;
}

.empty-state__visual {
  margin-bottom: 20px;
}

.empty-state__image {
  max-width: 200px;
  height: auto;
  opacity: 0.8;
}

.empty-state--small .empty-state__image {
  max-width: 150px;
}

.empty-state--large .empty-state__image {
  max-width: 250px;
}

.empty-state__icon {
  color: var(--text-tertiary, #5f6368);
  opacity: 0.6;
}

.empty-state__title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary, #e8eaed);
}

.empty-state--small .empty-state__title {
  font-size: 16px;
  margin-bottom: 8px;
}

.empty-state--large .empty-state__title {
  font-size: 20px;
  margin-bottom: 16px;
}

.empty-state__description {
  margin-bottom: 24px;
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
  line-height: 1.6;
  max-width: 400px;
}

.empty-state--small .empty-state__description {
  font-size: 13px;
  margin-bottom: 16px;
  max-width: 300px;
}

.empty-state--large .empty-state__description {
  font-size: 15px;
  margin-bottom: 32px;
  max-width: 500px;
}

.empty-state__action {
  margin-top: 8px;
}

.empty-state__extra {
  margin-top: 20px;
  color: var(--text-tertiary, #5f6368);
  font-size: 12px;
}

@media (max-width: 768px) {
  .empty-state {
    padding: 40px 16px;
  }

  .empty-state__description {
    font-size: 13px;
    max-width: 300px;
  }
}
</style>
