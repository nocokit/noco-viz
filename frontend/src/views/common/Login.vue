<template>
  <div class="login-container">
    <div class="login-bg">
      <!-- 背景装饰 -->
      <div class="bg-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
    </div>

    <div class="login-content">
      <!-- Logo 和标题 -->
      <div class="login-header">
        <div class="logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="url(#gradient)" />
            <path d="M24 12L32 18V30L24 36L16 30V18L24 12Z" stroke="white" stroke-width="2" fill="none"/>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
                <stop offset="0%" stop-color="#667eea" />
                <stop offset="100%" stop-color="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="title">NocoViz</h1>
        <p class="subtitle">企业级数据可视化平台</p>
      </div>

      <!-- 登录表单 -->
      <div class="login-card">
        <div class="card-header">
          <h2>{{ isLoginMode ? '登录' : '注册' }}</h2>
          <p>{{ isLoginMode ? '欢迎回来，请登录您的账户' : '创建新账户，开始使用' }}</p>
        </div>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          class="login-form"
          @submit.prevent="handleSubmit"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              :placeholder="isLoginMode ? '用户名 / 手机号 / 邮箱' : '用户名'"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 注册时的手机号 -->
          <el-form-item v-if="!isLoginMode" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="手机号"
              size="large"
              maxlength="11"
              clearable
            >
              <template #prefix>
                <el-icon><Phone /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 注册时的邮箱 -->
          <el-form-item v-if="!isLoginMode" prop="email">
            <el-input
              v-model="formData.email"
              placeholder="邮箱 (可选)"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="密码"
              size="large"
              show-password
              clearable
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 注册时的确认密码 -->
          <el-form-item v-if="!isLoginMode" prop="password_confirm">
            <el-input
              v-model="formData.password_confirm"
              type="password"
              placeholder="确认密码"
              size="large"
              show-password
              clearable
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 登录选项 -->
          <div v-if="isLoginMode" class="login-options">
            <el-checkbox v-model="rememberMe" size="small">记住我</el-checkbox>
            <el-link type="primary" :underline="false" class="forgot-link">忘记密码？</el-link>
          </div>

          <!-- 提交按钮 -->
          <el-button
            type="primary"
            size="large"
            class="submit-btn"
            :loading="loading"
            native-type="submit"
          >
            {{ isLoginMode ? '登录' : '注册' }}
          </el-button>

          <!-- 切换登录/注册 -->
          <div class="toggle-mode">
            <span>{{ isLoginMode ? '还没有账户？' : '已有账户？' }}</span>
            <el-link type="primary" :underline="false" @click="toggleMode">
              {{ isLoginMode ? '立即注册' : '立即登录' }}
            </el-link>
          </div>
        </el-form>
      </div>

      <!-- 页脚 -->
      <div class="login-footer">
        <p>&copy; 2024 NocoViz. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Phone, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

// 模式切换：true=登录，false=注册
const isLoginMode = ref(true)
const loading = ref(false)
const rememberMe = ref(false)
const formRef = ref(null)

// 表单数据
const formData = reactive({
  username: '',
  phone: '',
  email: '',
  password: '',
  password_confirm: ''
})

// 验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名/手机号/邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 150, message: '用户名长度3-150位', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  password_confirm: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const formRules = computed(() => isLoginMode.value ? loginRules : registerRules)

// 切换登录/注册模式
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  formRef.value?.clearValidate()
  // 清空表单
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 表单验证
    await formRef.value.validate()

    loading.value = true

    if (isLoginMode.value) {
      // 登录
      await userStore.login({
        username: formData.username,
        password: formData.password
      })

      ElMessage.success('登录成功')

      // 跳转到首页
      router.push('/')
    } else {
      // 注册
      await userStore.register({
        username: formData.username,
        phone: formData.phone,
        email: formData.email || undefined,
        password: formData.password,
        password_confirm: formData.password_confirm
      })

      ElMessage.success('注册成功')

      // 跳转到首页
      router.push('/')
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(error.message || '提交失败')
    // 错误信息已在 http 拦截器中处理
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  overflow: hidden;
}

/* 背景装饰 */
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.bg-decoration {
  position: relative;
  width: 100%;
  height: 100%;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  right: -50px;
  animation-delay: -7s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

/* 主内容区 */
.login-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  padding: 24px;
}

/* 头部 Logo */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: inline-block;
  margin-bottom: 16px;
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* 登录卡片 */
.login-card {
  background: rgba(26, 27, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-2xl);
  padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

.card-header {
  margin-bottom: 32px;
  text-align: center;
}

.card-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.card-header p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* 表单 */
.login-form {
  margin-top: 24px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-input__inner) {
  background: #1a1b1e !important;
  border-color: var(--border);
  color: var(--text-primary);
  height: 44px;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.login-form :deep(.el-input__inner:focus) {
  border-color: var(--color-primary);
  background: #1a1b1e !important;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: var(--text-tertiary);
}

.login-form :deep(.el-input__prefix) {
  color: var(--text-secondary);
}

/* 登录选项 */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-options :deep(.el-checkbox__label) {
  color: var(--text-secondary);
  font-size: 14px;
}

.forgot-link {
  font-size: 14px;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all var(--transition-base);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

/* 模式切换 */
.toggle-mode {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.toggle-mode span {
  margin-right: 8px;
}

/* 页脚 */
.login-footer {
  margin-top: 32px;
  text-align: center;
  font-size: 12px;
  color: var(--text-tertiary);
}

/* 响应式 */
@media (max-width: 768px) {
  .login-content {
    padding: 16px;
  }

  .login-card {
    padding: 32px 24px;
  }

  .title {
    font-size: 28px;
  }

  .decoration-circle {
    opacity: 0.5;
  }
}
</style>
