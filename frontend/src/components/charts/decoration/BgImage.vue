<!--
  BgImage - 背景图片组件
  用于大屏背景装饰
-->
<template>
  <div class="bg-image" :style="containerStyle">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="altText"
      :style="imageStyle"
      @error="handleImageError"
    />
    <div v-if="showOverlay" class="bg-overlay" :style="overlayStyle"></div>

    <!-- 内容插槽 -->
    <div class="bg-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  width: {
    type: Number,
    default: 500
  },
  height: {
    type: Number,
    default: 400
  }
})

const imageError = ref(false)

// 图片URL，默认使用 bg4.svg
const imageUrl = computed(() => {
  if (imageError.value) return ''
  return props.config.imageUrl || 'http://localhost:8001/images/bg4.svg'
})

const altText = computed(() => props.config.altText || '背景图片')

// 图片填充模式：cover(覆盖), contain(包含), fill(拉伸填充), repeat(平铺)
const fillMode = computed(() => props.config.fillMode || 'fill')

// 图片位置
const position = computed(() => props.config.position || 'center')

// 是否显示遮罩层
const showOverlay = computed(() => props.config.showOverlay || false)

// 遮罩层颜色和透明度
const overlayColor = computed(() => props.config.overlayColor || 'rgba(0, 0, 0, 0.3)')

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden'
}))

const imageStyle = computed(() => {
  const baseStyle = {
    width: '100%',
    height: '100%',
    display: 'block',
    objectPosition: position.value
  }

  // 根据填充模式设置样式
  switch (fillMode.value) {
    case 'cover':
      baseStyle.objectFit = 'cover'
      break
    case 'contain':
      baseStyle.objectFit = 'contain'
      break
    case 'fill':
      baseStyle.objectFit = 'fill'
      break
    case 'repeat':
      baseStyle.objectFit = 'none'
      baseStyle.objectRepeat = 'repeat'
      break
    default:
      baseStyle.objectFit = 'fill'
  }

  return baseStyle
})

const overlayStyle = computed(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: overlayColor.value,
  pointerEvents: 'none'
}))

const handleImageError = () => {
  console.warn('背景图片加载失败:', imageUrl.value)
  imageError.value = true
}
</script>

<style scoped>
.bg-image {
  position: relative;
}

.bg-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.bg-content > * {
  pointer-events: auto;
}

.bg-overlay {
  z-index: 1;
}

.bg-content {
  z-index: 2;
}
</style>
