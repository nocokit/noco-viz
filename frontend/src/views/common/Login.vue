<template>
  <div class="login-container">
    <!-- 左侧展示区 -->
    <div class="login-banner">
      <div class="banner-inner">
        <div class="logo-section">
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
            <span class="logo-text">NocoViz</span>
          </div>
        </div>

        <!-- 展示图片 -->
        <div class="banner-image">
          <div class="image-placeholder">
            <el-icon :size="120"><DataAnalysis /></el-icon>
          </div>
          <h3 class="banner-title">开箱即用的高质量模板</h3>
          <p class="banner-desc">丰富的页面模板，覆盖大多数典型业务场景</p>
        </div>
      </div>
    </div>

    <!-- 右侧登录区 -->
    <div class="login-panel">
      <div class="login-panel-inner">
        <div class="login-header">
          <h2 class="login-title">{{ isLoginMode ? '登录 NocoViz' : '注册 NocoViz' }}</h2>
          <p class="login-subtitle">{{ isLoginMode ? '登录 NocoViz' : '注册 NocoViz' }}</p>
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
              :placeholder="isLoginMode ? 'admin' : '用户名'"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 注册时的邮箱 -->
          <el-form-item v-if="!isLoginMode" prop="email">
            <el-input
              v-model="formData.email"
              placeholder="邮箱"
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
              :placeholder="isLoginMode ? '······' : '密码'"
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
            <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码</el-link>
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
            <el-link type="primary" :underline="false" @click="toggleMode">
              {{ isLoginMode ? '注册账号' : '使用已有账号登录' }}
            </el-link>
          </div>
        </el-form>

        <!-- 页脚 -->
        <div class="login-footer">
          <span>Arco Pro</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, DataAnalysis } from '@element-plus/icons-vue'
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
  email: '',
  password: '',
  password_confirm: ''
})

// 验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
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
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
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
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm
      })

      ElMessage.success('注册成功')

      // 跳转到首页
      router.push('/')
    }
  } catch (error) {
    console.error('提交失败:', error)

    // 提取错误信息
    let errorMessage = '提交失败'

    if (error.message) {
      errorMessage = error.message
    } else if (error.data?.message) {
      errorMessage = error.data.message
    } else if (error.data?.detail) {
      errorMessage = error.data.detail
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    // 根据错误类型显示不同的提示
    if (isLoginMode.value) {
      if (errorMessage.includes('用户名') || errorMessage.includes('密码')) {
        ElMessage.error(errorMessage)
      } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        ElMessage.error('用户名或密码错误')
      } else {
        ElMessage.error(errorMessage)
      }
    } else {
      ElMessage.error(errorMessage)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  background: #f7f8fa;
}

/* 左侧展示区 */
.login-banner {
  flex: 1;
  background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.banner-inner {
  width: 100%;
  max-width: 440px;
  color: white;
}

.logo-section {
  margin-bottom: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  font-size: 24px;
  font-weight: 600;
  color: white;
}

.banner-image {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.image-placeholder {
  width: 280px;
  height: 280px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  margin-bottom: 32px;
}

.image-placeholder .el-icon {
  color: rgba(255, 255, 255, 0.8);
}

.banner-title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin: 0 0 16px 0;
}

.banner-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.6;
}

/* 右侧登录区 */
.login-panel {
  width: 48%;
  min-width: 600px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
}

.login-panel-inner {
  width: 100%;
  max-width: 440px;
}

.login-header {
  margin-bottom: 32px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #86909c;
  margin: 0;
}

/* 表单 */
.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-input) {
  --el-input-bg-color: #f7f8fa;
  --el-input-border-color: transparent;
  --el-input-hover-border-color: #165dff;
  --el-input-focus-border-color: #165dff;
}

.login-form :deep(.el-input__wrapper) {
  background: #f7f8fa;
  box-shadow: none;
  border-radius: 4px;
  padding: 0 12px;
}

.login-form :deep(.el-input__wrapper:hover),
.login-form :deep(.el-input__wrapper.is-focus) {
  background: #f7f8fa;
  box-shadow: 0 0 0 1px #165dff;
}

.login-form :deep(.el-input__inner) {
  background: transparent;
  color: #1d2129;
  height: 40px;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: #c9cdd4;
}

.login-form :deep(.el-input__prefix),
.login-form :deep(.el-input__suffix) {
  color: #86909c !important;
  background: transparent !important;
}

.login-form :deep(.el-input__prefix-inner),
.login-form :deep(.el-input__suffix-inner) {
  display: flex;
  align-items: center;
  background: transparent !important;
}

.login-form :deep(.el-icon) {
  background: transparent !important;
  color: #86909c !important;
}

/* 登录选项 */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-options :deep(.el-checkbox__label) {
  color: #4e5969;
  font-size: 14px;
}

.login-options :deep(.el-link) {
  font-size: 14px;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  background: #165dff;
  border: none;
  margin-bottom: 16px;
}

.submit-btn:hover {
  background: #4080ff;
}

.submit-btn:active {
  background: #0e42d2;
}

/* 模式切换 */
.toggle-mode {
  text-align: center;
  margin-bottom: 24px;
}

.toggle-mode :deep(.el-link) {
  font-size: 14px;
}

/* 页脚 */
.login-footer {
  text-align: center;
  font-size: 12px;
  color: #c9cdd4;
  margin-top: 40px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .login-banner {
    display: none;
  }

  .login-panel {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .login-panel {
    padding: 24px;
  }

  .login-panel-inner {
    max-width: 100%;
  }
}
</style>
