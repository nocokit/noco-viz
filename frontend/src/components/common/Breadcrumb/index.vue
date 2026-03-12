<template>
  <nav class="breadcrumb" :class="`breadcrumb--${size}`">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="breadcrumb__item"
      :class="{ 'breadcrumb__item--active': index === items.length - 1 }"
    >
      <!-- 首页图标 -->
      <HomeFilled />

      <!-- 链接 -->
      <component
        :is="getLinkComponent(item)"
        v-if="item.to && index !== items.length - 1"
        :to="item.to"
        :href="item.href"
        class="breadcrumb__link"
        @click="handleClick(item, index)"
      >
         0" class="breadcrumb__icon">
          <component :is="item.icon" />
        
        <span>{{ item.label }}</span>
      </component>

      <!-- 当前页（不可点击） -->
      <span v-else class="breadcrumb__current">
         0" class="breadcrumb__icon">
          <component :is="item.icon" />
        
        <span>{{ item.label }}</span>
      </span>

      <!-- 分隔符 -->
      <span v-if="index < items.length - 1" class="breadcrumb__separator">
        <slot name="separator">
          
            <component :is="separatorIcon" />
          
          <span v-else>{{ separator }}</span>
        </slot>
      </span>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { HomeFilled, RightOutlined } from '@ant-design/icons-vue'
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

