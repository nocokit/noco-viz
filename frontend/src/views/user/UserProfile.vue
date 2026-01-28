<template>
  <div class="user-profile">
    <PageHeader
      title="个人资料"
      description="管理您的个人信息和账户设置"
    />

    <div class="profile-content">
      <!-- 左侧：头像和基本信息 -->
      <div class="profile-sidebar">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img
              :src="getAvatarUrl(userProfile.avatar)"
              :alt="userProfile.username"
              class="avatar-image"
            />
            <div class="avatar-overlay" @click="handleAvatarClick">
              <el-icon><Camera /></el-icon>
              <span>更换头像</span>
            </div>
          </div>
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleAvatarChange"
          />
        </div>

        <div class="user-info">
          <h3 class="username">{{ userProfile.username }}</h3>
          <p class="user-role">{{ userProfile.role?.name || '普通用户' }}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ userProfile.createdAt ? formatDate(userProfile.createdAt) : '-' }}</div>
            <div class="stat-label">注册时间</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userProfile.lastLoginAt ? formatDate(userProfile.lastLoginAt) : '-' }}</div>
            <div class="stat-label">最后登录</div>
          </div>
        </div>
      </div>

      <!-- 右侧：表单 -->
      <div class="profile-main">
        <el-tabs v-model="activeTab" class="profile-tabs">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-form
              ref="basicFormRef"
              :model="basicForm"
              :rules="basicRules"
              label-width="100px"
              class="profile-form"
            >
              <el-form-item label="用户名">
                <el-input v-model="userProfile.username" disabled />
              </el-form-item>

              <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="basicForm.realName" placeholder="请输入真实姓名" />
              </el-form-item>

              <el-form-item label="邮箱" prop="email">
                <el-input v-model="basicForm.email" placeholder="请输入邮箱" />
              </el-form-item>

              <el-form-item label="手机号" prop="phone">
                <el-input v-model="basicForm.phone" placeholder="请输入手机号" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleSaveBasic" :loading="saving">
                  保存修改
                </el-button>
                <el-button @click="handleResetBasic">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 安全设置 -->
          <el-tab-pane label="安全设置" name="security">
            <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              label-width="100px"
              class="profile-form"
            >
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input
                  v-model="passwordForm.oldPassword"
                  type="password"
                  placeholder="请输入旧密码"
                  show-password
                />
              </el-form-item>

              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  placeholder="请输入新密码（至少6位）"
                  show-password
                />
              </el-form-item>

              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  show-password
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleChangePassword" :loading="changingPassword">
                  修改密码
                </el-button>
                <el-button @click="handleResetPassword">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Camera } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import { getUserProfile, updateUserProfile, uploadAvatar, changePassword } from '@/api/user'

// 当前激活的标签页
const activeTab = ref('basic')

// 用户资料
const userProfile = ref({
  username: '',
  email: '',
  phone: '',
  realName: '',
  avatar: '',
  role: null,
  createdAt: '',
  lastLoginAt: ''
})

// 基本信息表单
const basicFormRef = ref(null)
const basicForm = reactive({
  realName: '',
  email: '',
  phone: ''
})

const basicRules = {
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 密码表单
const passwordFormRef = ref(null)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 状态
const saving = ref(false)
const changingPassword = ref(false)
const avatarInput = ref(null)

// 加载用户资料
const loadUserProfile = async () => {
  try {
    const data = await getUserProfile()
    userProfile.value = data

    // 填充表单
    basicForm.realName = data.realName || ''
    basicForm.email = data.email || ''
    basicForm.phone = data.phone || ''
  } catch (error) {
    console.error('加载用户资料失败:', error)
    ElMessage.error('加载用户资料失败')
  }
}

// 保存基本信息
const handleSaveBasic = async () => {
  try {
    await basicFormRef.value.validate()

    saving.value = true
    await updateUserProfile(basicForm)

    ElMessage.success('保存成功！')
    await loadUserProfile()
  } catch (error) {
    if (error !== false) { // 不是表单验证错误
      console.error('保存失败:', error)
      ElMessage.error(error.response?.data?.message || '保存失败')
    }
  } finally {
    saving.value = false
  }
}

// 重置基本信息
const handleResetBasic = () => {
  basicForm.realName = userProfile.value.realName || ''
  basicForm.email = userProfile.value.email || ''
  basicForm.phone = userProfile.value.phone || ''
  basicFormRef.value?.clearValidate()
}

// 修改密码
const handleChangePassword = async () => {
  try {
    await passwordFormRef.value.validate()

    changingPassword.value = true
    await changePassword(passwordForm.oldPassword, passwordForm.newPassword)

    ElMessage.success('密码修改成功！')
    handleResetPassword()
  } catch (error) {
    if (error !== false) {
      console.error('修改密码失败:', error)
      ElMessage.error(error.response?.data?.message || '修改密码失败')
    }
  } finally {
    changingPassword.value = false
  }
}

// 重置密码表单
const handleResetPassword = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.clearValidate()
}

// 点击头像
const handleAvatarClick = () => {
  avatarInput.value?.click()
}

// 头像改变
const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  // 验证文件大小（2MB）
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }

  const loading = ElMessage({
    message: '正在上传头像...',
    type: 'info',
    duration: 0
  })

  try {
    const result = await uploadAvatar(file, (progress) => {
      loading.message = `正在上传头像... ${progress}%`
    })

    loading.close()
    ElMessage.success('头像上传成功！')

    // 更新头像
    userProfile.value.avatar = result.url
  } catch (error) {
    loading.close()
    console.error('上传头像失败:', error)
    ElMessage.error(error.response?.data?.message || '上传头像失败')
  }

  // 清空 input
  event.target.value = ''
}

// 获取头像URL
const getAvatarUrl = (avatar) => {
  if (!avatar) {
    return 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  }
  if (avatar.startsWith('http')) {
    return avatar
  }
  return avatar
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
.user-profile {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: var(--el-bg-color);
}

.profile-content {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  margin-top: 24px;
  overflow: hidden;
}

/* 左侧边栏 */
.profile-sidebar {
  background: var(--el-bg-color-page);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-section {
  margin-bottom: 24px;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid var(--el-border-color);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: #fff;
  font-size: 12px;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay .el-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.user-info {
  text-align: center;
  margin-bottom: 24px;
}

.username {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.user-role {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  padding: 4px 12px;
  background: var(--el-fill-color);
  border-radius: 12px;
  display: inline-block;
}

.stats-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: var(--el-fill-color);
  border-radius: 8px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 右侧主内容 */
.profile-main {
  background: var(--el-bg-color-page);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 24px;
  overflow-y: auto;
}

.profile-tabs {
  height: 100%;
}

.profile-form {
  max-width: 600px;
  margin-top: 24px;
}

/* 滚动条 */
.profile-main::-webkit-scrollbar {
  width: 6px;
}

.profile-main::-webkit-scrollbar-thumb {
  background: var(--el-fill-color-darker);
  border-radius: 3px;
}

.profile-main::-webkit-scrollbar-track {
  background: transparent;
}
</style>
