<template>
  <div class="system-settings">
    <!-- Header -->
    <div class="settings-header">
      <h2>系统配置 (System Configuration)</h2>
      <el-button type="primary" @click="handleSaveConfig" :loading="saving">
        保存更改
      </el-button>
    </div>

    <div class="config-container">
      <!-- 左侧锚点菜单 -->
      <div class="settings-menu">
        <div class="menu-title">Basic</div>
        <div
          v-for="item in basicMenuItems"
          :key="item.id"
          :class="['menu-link', { active: activeSection === item.id }]"
          @click="scrollToSection(item.id)"
        >
          {{ item.label }}
        </div>

        <div class="menu-divider"></div>
        <div class="menu-title">Security</div>
        <div
          v-for="item in securityMenuItems"
          :key="item.id"
          :class="['menu-link', { active: activeSection === item.id }]"
          @click="scrollToSection(item.id)"
        >
          {{ item.label }}
        </div>

        <div class="menu-divider"></div>
        <div class="menu-title">Service</div>
        <div
          v-for="item in serviceMenuItems"
          :key="item.id"
          :class="['menu-link', { active: activeSection === item.id }]"
          @click="scrollToSection(item.id)"
        >
          {{ item.label }}
        </div>
      </div>

      <!-- 右侧表单内容 -->
      <div class="settings-content" ref="scrollContainer">
        <!-- 1. 基础设置 -->
        <div id="basic" class="section-card">
          <div class="section-header">
            <div class="section-title">基础设置</div>
            <div class="section-desc">配置系统的基本运行参数。</div>
          </div>

          <el-form :model="configForm" label-position="top" label-width="auto">
            <el-form-item label="系统名称">
              <el-input
                v-model="configForm.basic.systemName"
                placeholder="请输入系统名称"
                style="max-width: 400px"
              />
              <div class="input-hint">显示在浏览器标题栏及登录页。</div>
            </el-form-item>

            <el-form-item label="系统语言">
              <el-select
                v-model="configForm.basic.language"
                placeholder="选择语言"
                style="max-width: 400px"
              >
                <el-option label="简体中文 (zh-CN)" value="zh-CN" />
                <el-option label="English (en-US)" value="en-US" />
              </el-select>
            </el-form-item>

            <el-form-item label="管理员联系邮箱">
              <el-input
                v-model="configForm.basic.adminEmail"
                type="email"
                placeholder="admin@company.com"
                style="max-width: 400px"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 2. 外观主题 -->
        <div id="theme" class="section-card">
          <div class="section-header">
            <div class="section-title">外观主题</div>
            <div class="section-desc">选择您喜欢的界面配色方案。</div>
          </div>

          <div class="theme-grid">
            <div
              v-for="theme in allThemes"
              :key="theme.key"
              :class="['theme-card', { active: currentTheme === theme.key }]"
              @click="handleThemeChange(theme.key)"
            >
              <div class="theme-preview" :style="getThemePreviewStyle(theme.key)">
                <div class="preview-sidebar"></div>
                <div class="preview-content">
                  <div class="preview-header"></div>
                  <div class="preview-body"></div>
                </div>
              </div>
              <div class="theme-info">
                <div class="theme-name">{{ theme.name }}</div>
                <div v-if="currentTheme === theme.key" class="theme-check">
                  <el-icon color="#10b981"><CircleCheck /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. 品牌化 -->
        <div id="branding" class="section-card">
          <div class="section-header">
            <div class="section-title">品牌化 (OEM)</div>
            <div class="section-desc">自定义系统的 Logo 和版权信息，使其符合企业形象。</div>
          </div>

          <el-form :model="configForm" label-position="top">
            <div class="grid-row">
              <el-form-item label="系统 Logo (Dark)">
                <div class="logo-upload-wrapper">
                  <el-upload
                    class="logo-uploader"
                    :show-file-list="false"
                    :on-success="handleLogoSuccess"
                    :before-upload="beforeLogoUpload"
                    action="#"
                    :auto-upload="false"
                  >
                    <img v-if="configForm.branding.logoUrl" :src="configForm.branding.logoUrl" class="logo-preview" />
                    <div v-else class="upload-placeholder">
                      <el-icon class="upload-icon"><Picture /></el-icon>
                      <div class="upload-text">点击上传</div>
                    </div>
                  </el-upload>
                  <el-button
                    v-if="configForm.branding.logoUrl"
                    link
                    type="primary"
                    size="small"
                    @click="showLogoPreview = true"
                    class="preview-btn"
                  >
                    预览
                  </el-button>
                </div>
                <div class="input-hint">建议尺寸 200x60 PNG</div>
              </el-form-item>

              <el-form-item label="浏览器图标 (Favicon)">
                <el-upload
                  class="favicon-uploader"
                  :show-file-list="false"
                  :on-success="handleFaviconSuccess"
                  :before-upload="beforeFaviconUpload"
                  action="#"
                  :auto-upload="false"
                >
                  <img v-if="configForm.branding.faviconUrl" :src="configForm.branding.faviconUrl" class="favicon-preview" />
                  <div v-else class="upload-placeholder">
                    <el-icon class="upload-icon"><Upload /></el-icon>
                    <div class="upload-text">点击上传</div>
                  </div>
                </el-upload>
                <div class="input-hint">建议尺寸 32x32 ICO/PNG</div>
              </el-form-item>
            </div>

            <el-form-item label="底部版权信息 (Footer Copyright)">
              <el-input
                v-model="configForm.branding.copyright"
                placeholder="© 2024 MyCompany Inc. All Rights Reserved."
                style="max-width: 600px"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 3. 安全策略 -->
        <div id="security" class="section-card">
          <div class="section-header">
            <div class="section-title">安全策略</div>
            <div class="section-desc">增强企业数据安全及访问控制。</div>
          </div>

          <div class="switch-row">
            <div class="switch-info">
              <h4>全局安全水印</h4>
              <p>在所有大屏和报表页面强制显示"用户名+时间"水印，防止截屏泄密。</p>
            </div>
            <el-switch v-model="configForm.security.watermark" />
          </div>

          <div class="switch-row">
            <div class="switch-info">
              <h4>强密码策略</h4>
              <p>用户密码必须包含大小写字母、数字及特殊符号，且长度不少于 8 位。</p>
            </div>
            <el-switch v-model="configForm.security.strongPassword" />
          </div>

          <div class="switch-row">
            <div class="switch-info">
              <h4>强制 HTTPS 跳转</h4>
              <p>禁止通过 HTTP 协议访问系统，确保传输加密。</p>
            </div>
            <el-switch v-model="configForm.security.forceHttps" />
          </div>

          <div class="switch-row">
            <div class="switch-info">
              <h4>IP 白名单限制</h4>
              <p>仅允许白名单内的 IP 地址访问系统后台。</p>
            </div>
            <el-switch v-model="configForm.security.ipWhitelist" />
          </div>
        </div>

        <!-- 4. 会话控制 -->
        <div id="session" class="section-card">
          <div class="section-header">
            <div class="section-title">会话控制</div>
            <div class="section-desc">管理用户登录会话的安全设置。</div>
          </div>

          <el-form :model="configForm" label-position="top">
            <el-form-item label="会话超时时间（分钟）">
              <el-input-number
                v-model="configForm.session.timeout"
                :min="5"
                :max="1440"
                :step="5"
                style="max-width: 200px"
              />
              <div class="input-hint">用户无操作后自动登出时间，范围 5-1440 分钟。</div>
            </el-form-item>

            <div class="switch-row">
              <div class="switch-info">
                <h4>单点登录 (SSO)</h4>
                <p>同一账号在其他设备登录后，强制下线当前会话。</p>
              </div>
              <el-switch v-model="configForm.session.singleSignOn" />
            </div>

            <div class="switch-row">
              <div class="switch-info">
                <h4>记住登录状态</h4>
                <p>允许用户勾选"记住我"，延长登录有效期至 30 天。</p>
              </div>
              <el-switch v-model="configForm.session.rememberMe" />
            </div>
          </el-form>
        </div>

        <!-- 5. 邮件服务 -->
        <div id="email" class="section-card">
          <div class="section-header">
            <div class="section-title">邮件服务 (SMTP)</div>
            <div class="section-desc">配置发件箱，用于发送系统告警、密码重置及邀请邮件。</div>
          </div>

          <el-form :model="configForm" label-position="top">
            <el-form-item label="SMTP 服务器地址">
              <el-input
                v-model="configForm.email.smtpServer"
                placeholder="smtp.exmail.qq.com"
                style="max-width: 400px"
              />
            </el-form-item>

            <div class="grid-row">
              <el-form-item label="端口 (Port)" class="col-half">
                <el-input-number
                  v-model="configForm.email.port"
                  :min="1"
                  :max="65535"
                  style="width: 100%"
                />
              </el-form-item>

              <el-form-item label="加密方式" class="col-half">
                <el-select v-model="configForm.email.encryption" style="width: 100%">
                  <el-option label="SSL" value="ssl" />
                  <el-option label="TLS" value="tls" />
                  <el-option label="None" value="none" />
                </el-select>
              </el-form-item>
            </div>

            <div class="grid-row">
              <el-form-item label="发件账号" class="col-half">
                <el-input
                  v-model="configForm.email.account"
                  placeholder="system@company.com"
                />
              </el-form-item>

              <el-form-item label="客户端授权码 / 密码" class="col-half">
                <el-input
                  v-model="configForm.email.password"
                  type="password"
                  show-password
                  placeholder="请输入授权码"
                />
              </el-form-item>
            </div>

            <el-button @click="handleSendTestEmail" :loading="sendingEmail">
              发送测试邮件
            </el-button>
          </el-form>
        </div>

        <!-- 底部留白 -->
        <div style="height: 100px;"></div>
      </div>
    </div>

    <!-- Logo 预览对话框 -->
    <el-dialog
      v-model="showLogoPreview"
      title="Logo 预览"
      width="600px"
      :append-to-body="true"
    >
      <div class="logo-preview-dialog">
        <div class="preview-image-container">
          <img :src="configForm.branding.logoUrl" alt="Logo Preview" class="preview-large-image" />
        </div>
        <div class="preview-info-section">
          <div class="info-row">
            <span class="info-label">文件名称：</span>
            <span class="info-value">{{ logoFileName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">建议尺寸：</span>
            <span class="info-value">200 x 60 像素</span>
          </div>
          <div class="info-row">
            <span class="info-label">支持格式：</span>
            <span class="info-value">PNG, JPG, SVG</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture, Upload, CircleCheck } from '@element-plus/icons-vue'
import { useTheme } from '@/composables/useTheme'
import * as systemConfigApi from '@/api/systemConfig'

// 主题相关
const { currentTheme, setTheme, getAllThemes } = useTheme()
const allThemes = getAllThemes()

// 菜单配置
const basicMenuItems = [
  { id: 'basic', label: '基础设置' },
  { id: 'theme', label: '外观主题' },
  { id: 'branding', label: '品牌化 (OEM)' }
]

const securityMenuItems = [
  { id: 'security', label: '安全策略' },
  { id: 'session', label: '会话控制' }
]

const serviceMenuItems = [
  { id: 'email', label: '邮件服务' }
]

// 表单数据
const configForm = reactive({
  basic: {
    systemName: 'NocoViz 数据可视化平台',
    language: 'zh-CN',
    adminEmail: 'admin@company.com'
  },
  branding: {
    logoUrl: '',
    faviconUrl: '',
    copyright: '© 2024 MyCompany Inc. All Rights Reserved.'
  },
  security: {
    watermark: true,
    strongPassword: false,
    forceHttps: true,
    ipWhitelist: false
  },
  session: {
    timeout: 30,
    singleSignOn: false,
    rememberMe: true
  },
  email: {
    smtpServer: '',
    port: 465,
    encryption: 'ssl',
    account: '',
    password: ''
  }
})

// 状态
const activeSection = ref('basic')
const saving = ref(false)
const sendingEmail = ref(false)
const scrollContainer = ref(null)
const showLogoPreview = ref(false)
const logoFileName = ref('logo.png')

// 滚动到指定区域
const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element && scrollContainer.value) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeSection.value = id
  }
}

// 主题切换处理
const handleThemeChange = (themeKey) => {
  setTheme(themeKey)
  ElMessage.success(`已切换到${allThemes.find(t => t.key === themeKey).name}`)
}

// 获取主题预览样式
const getThemePreviewStyle = (themeKey) => {
  const themeColors = {
    dark: {
      bg: '#0a0b0d',
      sidebar: '#141519',
      card: '#1c1d21',
      primary: '#3b82f6'
    },
    light: {
      bg: '#f5f7fa',
      sidebar: '#ffffff',
      card: '#ffffff',
      primary: '#409eff'
    },
    blue: {
      bg: '#0a1628',
      sidebar: '#0f1d35',
      card: '#162544',
      primary: '#1890ff'
    },
    red: {
      bg: '#1a0a0f',
      sidebar: '#260f18',
      card: '#2d1420',
      primary: '#ff4466'
    },
    yellow: {
      bg: '#1a1508',
      sidebar: '#261f0f',
      card: '#2d2614',
      primary: '#fbbf24'
    },
    green: {
      bg: '#0a1410',
      sidebar: '#0f1a16',
      card: '#16241e',
      primary: '#10b981'
    }
  }

  return {
    backgroundColor: themeColors[themeKey].bg
  }
}

// 监听滚动，更新活动菜单项
const handleScroll = () => {
  if (!scrollContainer.value) return

  const sections = ['basic', 'branding', 'security', 'session', 'email']
  const scrollTop = scrollContainer.value.scrollTop

  for (const sectionId of sections) {
    const element = document.getElementById(sectionId)
    if (element) {
      const { offsetTop, offsetHeight } = element
      if (scrollTop >= offsetTop - 100 && scrollTop < offsetTop + offsetHeight - 100) {
        activeSection.value = sectionId
        break
      }
    }
  }
}

// Logo 上传
const handleLogoSuccess = (response, file) => {
  configForm.branding.logoUrl = URL.createObjectURL(file.raw)
}

const beforeLogoUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }

  // 保存文件名
  logoFileName.value = file.name
  // 直接预览
  configForm.branding.logoUrl = URL.createObjectURL(file)
  return false // 阻止自动上传
}

// Favicon 上传
const handleFaviconSuccess = (response, file) => {
  configForm.branding.faviconUrl = URL.createObjectURL(file.raw)
}

const beforeFaviconUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt1M = file.size / 1024 / 1024 < 1

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt1M) {
    ElMessage.error('图片大小不能超过 1MB！')
    return false
  }

  configForm.branding.faviconUrl = URL.createObjectURL(file)
  return false
}

// 保存配置
const handleSaveConfig = async () => {
  saving.value = true

  try {
    // 构建配置对象
    const configs = {
      'basic.systemName': configForm.basic.systemName,
      'basic.language': configForm.basic.language,
      'basic.adminEmail': configForm.basic.adminEmail,
      'branding.logoUrl': configForm.branding.logoUrl,
      'branding.faviconUrl': configForm.branding.faviconUrl,
      'branding.copyright': configForm.branding.copyright,
      'security.watermark': configForm.security.watermark,
      'security.strongPassword': configForm.security.strongPassword,
      'security.forceHttps': configForm.security.forceHttps,
      'security.ipWhitelist': configForm.security.ipWhitelist,
      'session.timeout': configForm.session.timeout,
      'session.singleSignOn': configForm.session.singleSignOn,
      'session.rememberMe': configForm.session.rememberMe,
      'email.smtpServer': configForm.email.smtpServer,
      'email.port': configForm.email.port,
      'email.encryption': configForm.email.encryption,
      'email.account': configForm.email.account,
      'email.password': configForm.email.password,
    }

    await systemConfigApi.batchUpdateConfig(configs)
    ElMessage.success('配置已保存')
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error('保存配置失败')
  } finally {
    saving.value = false
  }
}

// 发送测试邮件
const handleSendTestEmail = async () => {
  if (!configForm.email.smtpServer || !configForm.email.account) {
    ElMessage.warning('请先填写 SMTP 服务器和发件账号')
    return
  }

  sendingEmail.value = true

  try {
    await systemConfigApi.sendTestEmail(configForm.email)
    ElMessage.success('测试邮件已发送，请检查收件箱')
  } catch (error) {
    console.error('发送测试邮件失败:', error)
    ElMessage.error('发送测试邮件失败')
  } finally {
    sendingEmail.value = false
  }
}

// 加载配置
const loadConfig = async () => {
  try {
    const configs = await systemConfigApi.getSystemConfig()

    // 基础设置
    if (configs['basic.systemName']) configForm.basic.systemName = configs['basic.systemName']
    if (configs['basic.language']) configForm.basic.language = configs['basic.language']
    if (configs['basic.adminEmail']) configForm.basic.adminEmail = configs['basic.adminEmail']

    // 品牌化
    if (configs['branding.logoUrl']) configForm.branding.logoUrl = configs['branding.logoUrl']
    if (configs['branding.faviconUrl']) configForm.branding.faviconUrl = configs['branding.faviconUrl']
    if (configs['branding.copyright']) configForm.branding.copyright = configs['branding.copyright']

    // 安全策略
    if (configs['security.watermark'] !== undefined) configForm.security.watermark = configs['security.watermark']
    if (configs['security.strongPassword'] !== undefined) configForm.security.strongPassword = configs['security.strongPassword']
    if (configs['security.forceHttps'] !== undefined) configForm.security.forceHttps = configs['security.forceHttps']
    if (configs['security.ipWhitelist'] !== undefined) configForm.security.ipWhitelist = configs['security.ipWhitelist']

    // 会话控制
    if (configs['session.timeout']) configForm.session.timeout = configs['session.timeout']
    if (configs['session.singleSignOn'] !== undefined) configForm.session.singleSignOn = configs['session.singleSignOn']
    if (configs['session.rememberMe'] !== undefined) configForm.session.rememberMe = configs['session.rememberMe']

    // 邮件服务
    if (configs['email.smtpServer']) configForm.email.smtpServer = configs['email.smtpServer']
    if (configs['email.port']) configForm.email.port = configs['email.port']
    if (configs['email.encryption']) configForm.email.encryption = configs['email.encryption']
    if (configs['email.account']) configForm.email.account = configs['email.account']
    if (configs['email.password']) configForm.email.password = configs['email.password']
  } catch (error) {
    console.warn('加载配置失败，使用默认值:', error)
  }
}

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
  }
  loadConfig()
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.system-settings {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-bg-color);
}

/* Header */
.settings-header {
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--el-bg-color-overlay);
  backdrop-filter: blur(10px);
  z-index: 10;
  flex-shrink: 0;
}

.settings-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

/* Config Container */
.config-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧设置菜单 */
.settings-menu {
  width: 220px;
  padding: 24px 0;
  border-right: 1px solid var(--el-border-color);
  overflow-y: auto;
  background: var(--el-bg-color);
  flex-shrink: 0;
}

.menu-title {
  padding: 0 24px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-divider {
  height: 20px;
}

.menu-link {
  padding: 10px 24px;
  font-size: 13px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.menu-link:hover {
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-light);
}

.menu-link.active {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border-left-color: var(--el-color-primary);
  font-weight: 500;
}

/* 右侧表单区域 */
.settings-content {
  flex: 1;
  padding: 32px 48px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Form Section */
.section-card {
  margin-bottom: 40px;
  max-width: 800px;
}

.section-header {
  margin-bottom: 24px;
  border-bottom: 1px solid var(--el-border-color);
  padding-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.section-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

/* Input Hint */
.input-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 6px;
}

/* Upload */
.logo-uploader,
.favicon-uploader {
  width: 120px;
  height: 120px;
}

.upload-placeholder {
  width: 120px;
  height: 120px;
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--el-fill-color-lighter);
}

.upload-placeholder:hover {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.upload-icon {
  font-size: 32px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.upload-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.logo-preview,
.favicon-preview {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
}

/* Switch Row */
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  padding: 16px;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  margin-bottom: 16px;
}

.switch-info h4 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--el-text-color-primary);
}

.switch-info p {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

/* Grid Row */
.grid-row {
  display: flex;
  gap: 20px;
  max-width: 600px;
}

.col-half {
  flex: 1;
}

/* Scrollbar */
.settings-menu::-webkit-scrollbar,
.settings-content::-webkit-scrollbar {
  width: 6px;
}

.settings-menu::-webkit-scrollbar-thumb,
.settings-content::-webkit-scrollbar-thumb {
  background: var(--el-fill-color-darker);
  border-radius: 3px;
}

.settings-menu::-webkit-scrollbar-track,
.settings-content::-webkit-scrollbar-track {
  background: transparent;
}

/* 主题选择器样式 */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.theme-card {
  border: 2px solid var(--el-border-color);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--el-bg-color);
}

.theme-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border-color: var(--el-text-color-secondary);
}

.theme-card.active {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.theme-preview {
  height: 120px;
  display: flex;
  padding: 8px;
  border-radius: 8px 8px 0 0;
}

.preview-sidebar {
  width: 30%;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  margin-right: 6px;
}

.preview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-header {
  height: 20px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
}

.preview-body {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
}

.theme-info {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--el-fill-color-blank);
  border-top: 1px solid var(--el-border-color);
}

.theme-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.theme-check {
  display: flex;
  align-items: center;
}

/* 确保所有输入框背景色一致 */
:deep(.el-input__wrapper) {
  background-color: #0f1012 !important;
  box-shadow: 0 0 0 1px var(--el-border-color) inset !important;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-text-color-secondary) inset !important;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
}

:deep(.el-input__inner) {
  color: var(--el-text-color-primary);
}

:deep(.el-input-number .el-input__wrapper) {
  background-color: #0f1012 !important;
}

:deep(.el-select .el-input__wrapper) {
  background-color: #0f1012 !important;
}

/* Logo 上传包装器 */
.logo-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-btn {
  align-self: flex-start;
  margin-top: 4px;
}

/* Logo 预览对话框 */
.logo-preview-dialog {
  padding: 20px;
}

.preview-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: var(--el-fill-color-lighter);
  border-radius: 12px;
  margin-bottom: 24px;
  min-height: 200px;
}

.preview-large-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
}

.preview-info-section {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 16px;
}

.info-row {
  display: flex;
  padding: 8px 0;
  font-size: 14px;
}

.info-row:not(:last-child) {
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.info-label {
  color: var(--el-text-color-secondary);
  min-width: 100px;
  font-weight: 500;
}

.info-value {
  color: var(--el-text-color-primary);
  flex: 1;
}
</style>
