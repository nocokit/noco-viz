<template>
  <div
    class="logo-wrapper"
    :class="{ clickable: previewable }"
    @click="handleClick"
  >
    <img
      v-if="useSvgFile"
      :src="logoSrc"
      :alt="alt"
      :style="{ width: size, height: size }"
      class="logo-image"
    />
    <svg
      v-else
      :width="size"
      :height="size"
      viewBox="0 0 100 100"
      class="logo-svg"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#logo-gradient)"/>
      <text
        x="50"
        y="70"
        font-family="Arial, sans-serif"
        font-size="60"
        font-weight="bold"
        text-anchor="middle"
        fill="white"
      >
        N
      </text>
    </svg>

    <!-- 预览对话框 -->
    <a-modal
      v-model="showPreview"
      title="Logo 预览"
      width="500px"
      :append-to-body="true"
      class="logo-preview-dialog"
    >
      <div class="preview-content">
        <img
          v-if="useSvgFile"
          :src="logoSrc"
          :alt="alt"
          class="preview-image"
        />
        <svg
          v-else
          width="200"
          height="200"
          viewBox="0 0 100 100"
          class="preview-svg"
        >
          <defs>
            <linearGradient id="preview-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="20" fill="url(#preview-gradient)"/>
          <text
            x="50"
            y="70"
            font-family="Arial, sans-serif"
            font-size="60"
            font-weight="bold"
            text-anchor="middle"
            fill="white"
          >
            N
          </text>
        </svg>

        <div class="preview-info">
          <p class="info-item"><strong>名称：</strong>{{ alt }}</p>
          <p class="info-item"><strong>尺寸：</strong>100 x 100</p>
          <p class="info-item"><strong>格式：</strong>SVG</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  // Logo 尺寸
  size: {
    type: [String, Number],
    default: '48px'
  },
  // 是否使用 SVG 文件
  useSvgFile: {
    type: Boolean,
    default: false
  },
  // SVG 文件路径
  src: {
    type: String,
    default: '/logo.svg'
  },
  // Alt 文本
  alt: {
    type: String,
    default: 'NocoViz Logo'
  },
  // 是否可预览
  previewable: {
    type: Boolean,
    default: true
  }
})

const showPreview = ref(false)

const logoSrc = computed(() => {
  return props.src
})

const handleClick = () => {
  if (props.previewable) {
    showPreview.value = true
  }
}
</script>

