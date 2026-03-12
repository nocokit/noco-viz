<!--
  BgBox - 容器背景组件
  网格科技背景,数据展示容器
-->
<template>
  <div class="bg-box" :style="containerStyle">
    <canvas ref="canvasRef" class="bg-canvas"></canvas>

    <!-- SVG装饰层 -->
    <svg class="bg-svg" :width="width" :height="height">
      <!-- 网格线 -->
      <defs>
        <pattern id="grid-pattern" :width="gridSize" :height="gridSize" patternUnits="userSpaceOnUse">
          <path
            :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`"
            fill="none"
            :stroke="gridColor"
            stroke-width="0.5"
            opacity="0.3"
          />
        </pattern>
      </defs>

      <!-- 应用网格 -->
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />

      <!-- 边框 -->
      <rect
        x="1"
        y="1"
        :width="width - 2"
        :height="height - 2"
        :stroke="borderColor"
        stroke-width="2"
        fill="none"
        opacity="0.6"
      />

      <!-- 四角装饰 -->
      <g class="corner-decorations">
        <!-- 左上 -->
        <line x1="0" y1="0" x2="20" y2="0" :stroke="borderColor" stroke-width="3" />
        <line x1="0" y1="0" x2="0" y2="20" :stroke="borderColor" stroke-width="3" />
        <circle cx="0" cy="0" r="3" :fill="borderColor" />

        <!-- 右上 -->
        <line :x1="width - 20" y1="0" :x2="width" y2="0" :stroke="borderColor" stroke-width="3" />
        <line :x1="width" y1="0" :x2="width" y2="20" :stroke="borderColor" stroke-width="3" />
        <circle :cx="width" cy="0" r="3" :fill="borderColor" />

        <!-- 右下 -->
        <line :x1="width - 20" :y1="height" :x2="width" :y2="height" :stroke="borderColor" stroke-width="3" />
        <line :x1="width" :y1="height - 20" :x2="width" :y2="height" :stroke="borderColor" stroke-width="3" />
        <circle :cx="width" :cy="height" r="3" :fill="borderColor" />

        <!-- 左下 -->
        <line x1="0" :y1="height" x2="20" :y2="height" :stroke="borderColor" stroke-width="3" />
        <line x1="0" :y1="height - 20" x2="0" :y2="height" :stroke="borderColor" stroke-width="3" />
        <circle cx="0" :cy="height" r="3" :fill="borderColor" />
      </g>

      <!-- 扫描线效果 -->
      <line
        x1="0"
        :y1="scanLineY"
        :x2="width"
        :y2="scanLineY"
        :stroke="scanLineColor"
        stroke-width="1"
        opacity="0.5"
      >
        <animate attributeName="y1" :from="0" :to="height" :dur="scanDuration" repeatCount="indefinite" />
        <animate attributeName="y2" :from="0" :to="height" :dur="scanDuration" repeatCount="indefinite" />
      </line>
    </svg>

    <!-- 内容插槽 -->
    <div class="bg-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const canvasRef = ref(null)
const scanLineY = ref(0)
let animationId = null

const width = computed(() => props.config.width || 500)
const height = computed(() => props.config.height || 400)
const bgColor = computed(() => props.config.bgColor || '#001529')
const borderColor = computed(() => props.config.borderColor || '#00f2f2')
const gridColor = computed(() => props.config.gridColor || '#0099cc')
const gridSize = computed(() => props.config.gridSize || 20)
const scanLineColor = computed(() => props.config.scanLineColor || '#00f2f2')
const scanDuration = computed(() => props.config.scanDuration || '6s')

const containerStyle = computed(() => ({
  width: `${width.value}px`,
  height: `${height.value}px`,
  background: bgColor.value
}))

// 粒子效果
const initParticles = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = width.value
  canvas.height = height.value

  const ctx = canvas.getContext('2d')
  const particles = []
  const particleCount = 30

  // 创建粒子
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width.value,
      y: Math.random() * height.value,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2
    })
  }

  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, width.value, height.value)

    // 更新和绘制粒子
    particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy

      // 边界检测
      if (particle.x < 0 || particle.x > width.value) particle.vx *= -1
      if (particle.y < 0 || particle.y > height.value) particle.vy *= -1

      // 绘制粒子
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0, 242, 242, ${particle.opacity})`
      ctx.fill()
    })

    // 绘制连接线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(0, 242, 242, ${0.2 * (1 - distance / 100)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  initParticles()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

