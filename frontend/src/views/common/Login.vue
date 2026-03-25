<template>
  <div class="login-container">
    <canvas ref="canvasRef" class="bg-canvas"></canvas>

    <div class="logo-corner">
      <img src="/logo.png" alt="数镜" class="logo-img" />
      <span class="logo-name">数镜</span>
    </div>

    <div class="login-wrap">
      <div class="login-card">
        <div class="card-header">
          <h1 class="card-title">欢迎回来</h1>
          <p class="card-subtitle">数据可视化管理平台</p>
        </div>

        <a-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          @finish="handleSubmit"
        >
          <a-form-item name="username">
            <a-input
              v-model:value="formData.username"
              placeholder="用户名"
              class="blue-input"
              size="large"
            />
          </a-form-item>

          <a-form-item name="password">
            <a-input-password
              v-model:value="formData.password"
              placeholder="密码"
              class="blue-input"
              size="large"
            />
          </a-form-item>

          <a-form-item style="margin-bottom: 0">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
              class="login-btn"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const canvasRef = ref(null)

const formData = reactive({ username: '', password: '' })

const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    loading.value = true
    await userStore.login({ username: formData.username, password: formData.password })
    message.success('登录成功')
    router.push('/')
  } catch (error) {
    message.error(error.message || error.data?.message || '用户名或密码错误')
  } finally {
    loading.value = false
  }
}

// 粒子背景
let animationId = null
const particles = []
let W = 0, H = 0

class Particle {
  constructor() {
    this.init()
  }
  init() {
    this.x = Math.random() * W
    this.y = Math.random() * H
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.isNode = Math.random() < 0.15
    this.radius = this.isNode ? Math.random() * 1.5 + 1.5 : Math.random() * 0.8 + 0.3
    this.alpha = this.isNode ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3 + 0.1
    this.pulse = Math.random() * Math.PI * 2
    this.pulseSpeed = Math.random() * 0.02 + 0.01
    // 色相在青(180°)~蓝紫(240°)之间缓慢漂移
    this.hue = Math.random() * 60 + 180
    this.hueSpeed = (Math.random() - 0.5) * 0.4
  }
  update() {
    this.x += this.vx
    this.y += this.vy
    this.pulse += this.pulseSpeed
    this.hue += this.hueSpeed
    if (this.hue > 240) this.hueSpeed = -Math.abs(this.hueSpeed)
    if (this.hue < 175) this.hueSpeed = Math.abs(this.hueSpeed)
    if (this.x > W) this.x = 0
    else if (this.x < 0) this.x = W
    if (this.y > H) this.y = 0
    else if (this.y < 0) this.y = H
  }
  draw(ctx) {
    const a = this.isNode
      ? this.alpha * (0.7 + 0.3 * Math.sin(this.pulse))
      : this.alpha
    const r = this.radius
    const glowR = r * (this.isNode ? 3 : 2.2)

    // 径向渐变光晕：中心亮 → 边缘透明
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowR)
    grad.addColorStop(0,   `hsla(${this.hue}, 100%, 75%, ${a})`)
    grad.addColorStop(0.4, `hsla(${this.hue}, 100%, 65%, ${a * 0.5})`)
    grad.addColorStop(1,   `hsla(${this.hue}, 100%, 60%, 0)`)

    ctx.beginPath()
    ctx.arc(this.x, this.y, glowR, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()

    // 实心核心
    ctx.beginPath()
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${this.hue}, 100%, 88%, ${a})`
    ctx.fill()
  }
}

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const dpr = window.devicePixelRatio || 1
  W = window.innerWidth
  H = window.innerHeight
  canvas.width = W * dpr
  canvas.height = H * dpr
  canvas.style.width = W + 'px'
  canvas.style.height = H + 'px'

  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  particles.length = 0
  const count = Math.min(Math.floor(W / 10), 150)
  for (let i = 0; i < count; i++) particles.push(new Particle())

  const CONNECT_DIST = 220

  const animate = () => {
    ctx.clearRect(0, 0, W, H)

    // 连线（节点优先亮）
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x
        const dy = particles[a].y - particles[b].y
        const dist = dx * dx + dy * dy
        if (dist < CONNECT_DIST * CONNECT_DIST) {
          const d = Math.sqrt(dist)
          const boost = (particles[a].isNode || particles[b].isNode) ? 1.8 : 1
          const alpha = (1 - d / CONNECT_DIST) * 0.2 * boost
          ctx.strokeStyle = `rgba(0, 242, 255, ${alpha})`
          ctx.lineWidth = particles[a].isNode || particles[b].isNode ? 0.8 : 0.4
          ctx.beginPath()
          ctx.moveTo(particles[a].x, particles[a].y)
          ctx.lineTo(particles[b].x, particles[b].y)
          ctx.stroke()
        }
      }
    }

    particles.forEach(p => { p.update(); p.draw(ctx) })
    animationId = requestAnimationFrame(animate)
  }
  animate()
}

const handleResize = () => {
  if (!canvasRef.value) return
  const dpr = window.devicePixelRatio || 1
  W = window.innerWidth
  H = window.innerHeight
  canvasRef.value.width = W * dpr
  canvasRef.value.height = H * dpr
  canvasRef.value.style.width = W + 'px'
  canvasRef.value.style.height = H + 'px'
  const ctx = canvasRef.value.getContext('2d')
  ctx.scale(dpr, dpr)
  particles.length = 0
  const count = Math.min(Math.floor(W / 10), 150)
  for (let i = 0; i < count; i++) particles.push(new Particle())
}

onMounted(() => { initCanvas(); window.addEventListener('resize', handleResize) })
onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.login-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #020617;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.login-wrap {
  position: relative;
  z-index: 10;
}

/* 卡片 */
.login-card {
  width: 380px;
  padding: 40px 36px 32px;
  background: rgba(15, 28, 56, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 左上角 logo */
.logo-corner {
  position: fixed;
  top: 24px;
  left: 28px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  width: 36px;
  height: 36px;
}

.logo-name {
  font-size: 18px;
  font-weight: 600;
  color: #f0f6ff;
  letter-spacing: 1px;
}

/* 头部 */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.card-title {
  font-size: 26px;
  font-weight: 600;
  color: #f0f6ff;
  margin: 0 0 6px;
  letter-spacing: 1px;
}

.card-subtitle {
  font-size: 13px;
  color: rgba(148, 172, 220, 0.7);
  margin: 0;
}

/* 输入框覆盖 */
:deep(.blue-input.ant-input),
:deep(.blue-input.ant-input-affix-wrapper) {
  background-color: rgba(8, 18, 40, 0.8) !important;
  border: 1px solid rgba(59, 130, 246, 0.25) !important;
  border-radius: 8px !important;
  color: #d4e4ff !important;
  box-shadow: none !important;
  transition: border-color 0.2s, box-shadow 0.2s !important;
}

:deep(.blue-input.ant-input-affix-wrapper > input.ant-input) {
  background: transparent !important;
  color: #d4e4ff !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.blue-input.ant-input::placeholder),
:deep(.blue-input.ant-input-affix-wrapper input::placeholder) {
  color: rgba(148, 172, 220, 0.4) !important;
}

:deep(.blue-input.ant-input:focus),
:deep(.blue-input.ant-input-affix-wrapper:focus-within) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12) !important;
}

:deep(.blue-input .ant-input-suffix span),
:deep(.blue-input .ant-input-password-icon) {
  color: rgba(148, 172, 220, 0.5) !important;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-form-item-explain-error) {
  font-size: 12px;
  color: #f87171;
}

/* 登录按钮 */
:deep(.login-btn.ant-btn-primary) {
  background: #2563eb !important;
  border: none !important;
  border-radius: 8px !important;
  height: 44px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  color: #fff !important;
  letter-spacing: 2px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35) !important;
  transition: all 0.2s !important;
}

:deep(.login-btn.ant-btn-primary:hover) {
  background: #1d4ed8 !important;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5) !important;
  transform: translateY(-1px);
}

:deep(.login-btn.ant-btn-primary:active) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3) !important;
}

</style>
