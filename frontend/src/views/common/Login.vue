<template>
  <div class="login-container">
    <!-- 科技感背景 -->
    <canvas ref="canvasRef" class="tech-background"></canvas>

    <!-- 网格背景 -->
    <div class="grid-background"></div>

    <!-- 光效 -->
    <div class="light-effect"></div>

    <!-- 登录表单 -->
    <a-flex vertical align="center" justify="center" :style="containerStyle">
      <a-card :style="cardStyle" class="login-card">
        <a-space direction="vertical" :size="16" style="width: 100%">
          <a-flex vertical align="center" :gap="16">
            <img src="/logo.png" alt="数镜" :style="logoStyle" />
            <a-typography-title :level="3" style="margin: 0">数镜</a-typography-title>
            <a-typography-text type="secondary">数据可视化平台</a-typography-text>
          </a-flex>

          <a-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            @finish="handleSubmit"
          >
            <a-form-item name="username">
              <a-input
                class="input"
                v-model:value="formData.username"
                placeholder="用户名"
              />
            </a-form-item>

            <a-form-item name="password">
              <a-input-password
                     class="input"
                v-model:value="formData.password"
                placeholder="密码"
              />
            </a-form-item>

            <a-form-item>
              <a-checkbox v-model:checked="formData.remember">
                记住密码
              </a-checkbox>
            </a-form-item>

            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
            >
              登录
            </a-button>
          </a-form>
        </a-space>
      </a-card>
    </a-flex>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const canvasRef = ref(null)

const formData = reactive({
  username: '',
  password: '',
  remember: false
})

const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    loading.value = true
    await userStore.login({
      username: formData.username,
      password: formData.password
    })
    message.success('登录成功')
    router.push('/')
  } catch (error) {
    const errorMsg = error.message || error.data?.message || '登录失败，请检查用户名和密码'
    message.error(errorMsg)
  } finally {
    loading.value = false
  }
}

// 粒子动画
let animationId = null
const particles = []

class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.radius = Math.random() * 2 + 1
    this.opacity = Math.random() * 0.5 + 0.2
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(64, 150, 255, ${this.opacity})`
    ctx.fill()
  }
}

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const ctx = canvas.getContext('2d')

  // 创建粒子
  particles.length = 0
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle(canvas))
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 更新和绘制粒子
    particles.forEach(particle => {
      particle.update()
      particle.draw(ctx)
    })

    // 绘制连线
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(64, 150, 255, ${0.15 * (1 - distance / 120)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

const handleResize = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
  }
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})

const containerStyle = computed(() => ({
  minHeight: '100vh',
  padding: '20px',
  position: 'relative',
  zIndex: 10
}))

const cardStyle = computed(() => ({
  width: '100%',
  maxWidth: '480px',
  padding: '24px'
}))

const logoStyle = computed(() => ({
  width: '56px',
  height: '56px'
}))
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%);
}

/* 粒子背景 Canvas */
.tech-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* 网格背景 */
.grid-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(64, 150, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 150, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

/* 光效 */
.light-effect {
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(64, 150, 255, 0.08) 0%,
    transparent 50%
  );
  animation: lightPulse 8s ease-in-out infinite;
}

@keyframes lightPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* 登录卡片 */
.login-card {
  background: rgba(248, 250, 255, 0.96) !important;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-top: 3px solid #1677ff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  border-radius: 8px;
}

:deep(.ant-input) {
  padding: 6px 11px !important;
}

:deep(.ant-input-password) {
  padding: 0 11px 0 0 !important;
}

:deep(.ant-input-password .ant-input) {
  padding: 6px 0 6px 11px !important;
}

:deep(.ant-input-affix-wrapper) {
  padding: 0 11px 0 0 !important;
  border-radius: 0 !important;
}

:deep(.ant-input-affix-wrapper .ant-input) {
  padding: 6px 0 6px 11px !important;
}

:deep(.ant-input-password .ant-input-suffix) {
  margin-left: 8px;
}

:deep(.ant-form-item) {
  margin-bottom: 12px;
}
:deep(.input) {
  border-radius: 0 !important;
}
</style>
