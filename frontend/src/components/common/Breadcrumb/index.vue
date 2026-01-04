<template>
  <nav class="breadcrumb" :class="`breadcrumb--${size}`">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="breadcrumb__item"
      :class="{ 'breadcrumb__item--active': index === items.length - 1 }"
    >
      <!-- 首页图标 -->
      <el-icon v-if="showHome && index === 0" class="breadcrumb__home-icon">
        <HomeFilled />
      </el-icon>

      <!-- 链接 -->
      <component
        :is="getLinkComponent(item)"
        v-if="item.to && index !== items.length - 1"
        :to="item.to"
        :href="item.href"
        class="breadcrumb__link"
        @click="handleClick(item, index)"
      >
        <el-icon v-if="item.icon && index > 0" class="breadcrumb__icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.label }}</span>
      </component>

      <!-- 当前页（不可点击） -->
      <span v-else class="breadcrumb__current">
        <el-icon v-if="item.icon && index > 0" class="breadcrumb__icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.label }}</span>
      </span>

      <!-- 分隔符 -->
      <span v-if="index < items.length - 1" class="breadcrumb__separator">
        <slot name="separator">
          <el-icon v-if="separatorIcon">
            <component :is="separatorIcon" />
          </el-icon>
          <span v-else>{{ separator }}</span>
        </slot>
      </span>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { HomeFilled, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  // 面包屑项
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every(item => item.label)
    }
  },
  // 分隔符
  separator: {
    type: String,
    default: '/'
  },
  // 分隔符图标
  separatorIcon: {
    type: Object,
    default: null
  },
  // 显示首页图标
  showHome: {
    type: Boolean,
    default: true
  },
  // 尺寸
  size: {
    type: String,
    default: 'default', // 'small' | 'default' | 'large'
    validator: (value) => ['small', 'default', 'large'].includes(value)
  }
})

const emit = defineEmits(['click'])

const router = useRouter()

const getLinkComponent = (item) => {
  if (item.to) return 'router-link'
  if (item.href) return 'a'
  return 'span'
}

const handleClick = (item, index) => {
  emit('click', item, index)
}
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 0;
  font-size: 14px;
}

.breadcrumb--small {
  font-size: 12px;
  gap: 6px;
}

.breadcrumb--large {
  font-size: 16px;
  gap: 10px;
}

.breadcrumb__item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary, #9aa0a6);
}

.breadcrumb__item--active {
  color: var(--text-primary, #e8eaed);
  font-weight: 500;
}

.breadcrumb__home-icon {
  font-size: 16px;
  color: var(--el-color-primary);
}

.breadcrumb--small .breadcrumb__home-icon {
  font-size: 14px;
}

.breadcrumb--large .breadcrumb__home-icon {
  font-size: 18px;
}

.breadcrumb__icon {
  font-size: 14px;
}

.breadcrumb--small .breadcrumb__icon {
  font-size: 12px;
}

.breadcrumb--large .breadcrumb__icon {
  font-size: 16px;
}

.breadcrumb__link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary, #9aa0a6);
  text-decoration: none;
  transition: color 0.3s;
  cursor: pointer;
}

.breadcrumb__link:hover {
  color: var(--el-color-primary);
}

.breadcrumb__current {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb__separator {
  color: var(--text-tertiary, #5f6368);
  user-select: none;
  font-size: 12px;
}

.breadcrumb--small .breadcrumb__separator {
  font-size: 10px;
}

.breadcrumb--large .breadcrumb__separator {
  font-size: 14px;
}

@media (max-width: 768px) {
  .breadcrumb {
    font-size: 12px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .breadcrumb::-webkit-scrollbar {
    display: none;
  }

  .breadcrumb__item {
    flex-shrink: 0;
  }
}
</style>
