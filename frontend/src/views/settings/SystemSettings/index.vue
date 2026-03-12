<template>
  <div class="system-settings-wrapper">
    <!-- 面包屑导航 -->
    <BreadcrumbHeader :items="[
      { label: '首页', path: '/' },
      { label: '系统管理', path: '/settings' },
      { label: '系统配置' }
    ]" />

    <div class="system-settings">
      <div class="config-container">
      <!-- 左侧锚点菜单 -->
      <div class="settings-menu">
        <div class="menu-title">Basic</div>
        <div v-for="item in basicMenuItems" :key="item.id" :class="['menu-link', { active: activeSection === item.id }]"
          @click="scrollToSection(item.id)">
          {{ item.label }}
        </div>

        <div class="menu-divider"></div>
        <div class="menu-title">Security</div>
        <div v-for="item in securityMenuItems" :key="item.id"
          :class="['menu-link', { active: activeSection === item.id }]" @click="scrollToSection(item.id)">
          {{ item.label }}
        </div>

        <div class="menu-divider"></div>
        <div class="menu-title">Service</div>
        <div v-for="item in serviceMenuItems" :key="item.id"
          :class="['menu-link', { active: activeSection === item.id }]" @click="scrollToSection(item.id)">
          {{ item.label }}
        </div>
      </div>

      <!-- 右侧表单内容 -->
      <div class="settings-content-wrapper">
        <!-- 可滚动的内容区域 -->
        <div class="settings-content" ref="scrollContainer">
        <!-- 1. 基础设置 -->
        <div id="basic" class="section">
          <div class="section-header">
            <div class="section-title">基础设置</div>
            <div class="section-desc">配置系统的基本运行参数。</div>
          </div>

          <a-form :model="configForm" layout="horizontal" :label-col="{ style: { width: '140px' } }">
            <a-form-item label="系统名称">
              <a-input v-model:value="configForm.basic.systemName" placeholder="请输入系统名称" style="max-width: 400px" />
              <div class="input-hint">显示在浏览器标题栏及登录页。</div>
            </a-form-item>

            <a-form-item label="系统语言">
              <a-select v-model:value="configForm.basic.language" placeholder="选择语言" style="max-width: 400px">
                <a-select-option value="zh-CN">简体中文 (zh-CN)</a-select-option>
                <a-select-option value="en-US">English (en-US)</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="管理员联系邮箱">
              <a-input v-model:value="configForm.basic.adminEmail" type="email" placeholder="admin@company.com"
                style="max-width: 400px" />
            </a-form-item>
          </a-form>
        </div>

        <!-- 2. 外观主题 -->
        <div id="theme" class="section">
          <div class="section-header">
            <div class="section-title">外观主题</div>
            <div class="section-desc">选择您喜欢的界面配色方案。</div>
          </div>

          <a-form :model="configForm" label-position="top">
            <a-form-item label="主题模式">
              <a-select v-model:value="currentTheme" @change="handleThemeChange" placeholder="选择主题" style="max-width: 400px">
                <a-select-option value="light">明亮模式</a-select-option>
                <a-select-option value="dark">暗黑模式</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </div>

        <!-- 3. 安全策略 -->
        <div id="security" class="section">
          <div class="section-header">
            <div class="section-title">安全策略</div>
            <div class="section-desc">增强企业数据安全及访问控制。</div>
          </div>

          <div class="switch-row">
            <div class="switch-info">
              <h4>全局安全水印</h4>
              <p>在所有大屏和报表页面强制显示"用户名+时间"水印，防止截屏泄密。</p>
            </div>
            <a-switch v-model:checked="configForm.security.watermark" />
          </div>

          <div class="switch-row">
            <div class="switch-info">
              <h4>强密码策略</h4>
              <p>用户密码必须包含大小写字母、数字及特殊符号，且长度不少于 8 位。</p>
            </div>
            <a-switch v-model:checked="configForm.security.strongPassword" />
          </div>

          <div class="switch-row">
            <div class="switch-info">
              <h4>强制 HTTPS 跳转</h4>
              <p>禁止通过 HTTP 协议访问系统，确保传输加密。</p>
            </div>
            <a-switch v-model:checked="configForm.security.forceHttps" />
          </div>

          <div class="switch-row">
            <div class="switch-info">
              <h4>IP 白名单限制</h4>
              <p>仅允许白名单内的 IP 地址访问系统后台。</p>
            </div>
            <a-switch v-model:checked="configForm.security.ipWhitelist" />
          </div>
        </div>

        <!-- 4. 会话控制 -->
        <div id="session" class="section">
          <div class="section-header">
            <div class="section-title">会话控制</div>
            <div class="section-desc">管理用户登录会话的安全设置。</div>
          </div>

          <a-form :model="configForm" label-position="top">
            <a-form-item label="会话超时时间（分钟）">
              <a-input-number v-model:value="configForm.session.timeout" :min="5" :max="1440" :step="5"
                style="max-width: 200px" />
              <div class="input-hint">用户无操作后自动登出时间，范围 5-1440 分钟。</div>
            </a-form-item>

            <div class="switch-row">
              <div class="switch-info">
                <h4>单点登录 (SSO)</h4>
                <p>同一账号在其他设备登录后，强制下线当前会话。</p>
              </div>
              <a-switch v-model:checked="configForm.session.singleSignOn" />
            </div>

            <div class="switch-row">
              <div class="switch-info">
                <h4>记住登录状态</h4>
                <p>允许用户勾选"记住我"，延长登录有效期至 30 天。</p>
              </div>
              <a-switch v-model:checked="configForm.session.rememberMe" />
            </div>
          </a-form>
        </div>

        <!-- 5. 邮件服务 -->
        <div id="email" class="section">
          <div class="section-header">
            <div class="section-title">邮件服务 (SMTP)</div>
            <div class="section-desc">配置发件箱，用于发送系统告警、密码重置及邀请邮件。</div>
          </div>

          <a-form :model="configForm" label-position="top">
            <a-form-item label="SMTP 服务器地址">
              <a-input v-model:value="configForm.email.smtpServer" placeholder="smtp.exmail.qq.com" style="max-width: 400px" />
            </a-form-item>

            <div class="grid-row">
              <a-form-item label="端口 (Port)" class="col-half">
                <a-input-number v-model:value="configForm.email.port" :min="1" :max="65535" style="width: 100%" />
              </a-form-item>

              <a-form-item label="加密方式" class="col-half">
                <a-select v-model:value="configForm.email.encryption" style="width: 100%">
                  <a-select-option value="ssl">SSL</a-select-option>
                  <a-select-option value="tls">TLS</a-select-option>
                  <a-select-option value="none">None</a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <div class="grid-row">
              <a-form-item label="发件账号" class="col-half">
                <a-input v-model:value="configForm.email.account" placeholder="system@company.com" />
              </a-form-item>

              <a-form-item label="客户端授权码 / 密码" class="col-half">
                <a-input-password v-model:value="configForm.email.password" placeholder="请输入授权码" />
              </a-form-item>
            </div>

            <a-button @click="handleSendTestEmail" :loading="sendingEmail">
              发送测试邮件
            </a-button>
          </a-form>
        </div>

        <!-- 底部留白 -->
        <div style="height: 24px;"></div>
      </div>

      <!-- 保存按钮 - 固定在底部 -->
      <div class="content-footer">
        <a-button type="primary" @click="handleSaveConfig" :loading="saving">
          保存更改
        </a-button>
      </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'
import * as systemConfigApi from '@/api/systemConfig'
import BreadcrumbHeader from '@/components/BreadcrumbHeader.vue'
import { useThemeStore } from '@/store'

const themeStore = useThemeStore()

// 主题相关 - 使用 theme store
const currentTheme = ref(themeStore.currentTheme)
const allThemes = [
  { key: 'light', name: '明亮模式' },
  { key: 'dark', name: '暗黑模式' }
]

function setTheme(mode) {
  themeStore.setTheme(mode === 'dark')
  currentTheme.value = mode
}

// 菜单配置
const basicMenuItems = [
  { id: 'basic', label: '基础设置' },
  { id: 'theme', label: '外观主题' }
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
  message.success(`已切换到${themeKey === 'light' ? '明亮模式' : '暗黑模式'}`)
}

// 监听滚动，更新活动菜单项
const handleScroll = () => {
  if (!scrollContainer.value) return

  const sections = ['basic', 'theme', 'security', 'session', 'email']
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
  // 已移除，品牌化配置已迁移到独立页面
}

const beforeLogoUpload = (file) => {
  // 已移除，品牌化配置已迁移到独立页面
  return false
}

// Favicon 上传
const handleFaviconSuccess = (response, file) => {
  // 已移除，品牌化配置已迁移到独立页面
}

const beforeFaviconUpload = (file) => {
  // 已移除，品牌化配置已迁移到独立页面
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
    message.success('配置已保存')
  } catch (error) {
    console.error('保存配置失败:', error)
    message.error('保存配置失败')
  } finally {
    saving.value = false
  }
}

// 发送测试邮件
const handleSendTestEmail = async () => {
  if (!configForm.email.smtpServer || !configForm.email.account) {
    message.warning('请先填写 SMTP 服务器和发件账号')
    return
  }

  sendingEmail.value = true

  try {
    await systemConfigApi.sendTestEmail(configForm.email)
    message.success('测试邮件已发送，请检查收件箱')
  } catch (error) {
    console.error('发送测试邮件失败:', error)
    message.error('发送测试邮件失败')
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
.system-settings-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.system-settings {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

.config-container {
  flex: 1;
  display: flex;
  gap: 16px;
  overflow: hidden;
}

.settings-menu {
  width: 200px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;
}

.menu-title {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.menu-link {
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #666;
}

.menu-link:hover {
  background: #f5f5f5;
  color: #1890ff;
}

.menu-link.active {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 500;
}

.menu-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 16px 0;
}

.settings-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
}

.content-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  background: #fff;
}

.section {
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
}

.section-desc {
  font-size: 14px;
  color: #8c8c8c;
}

.input-hint {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.switch-row:last-child {
  border-bottom: none;
}

.switch-info h4 {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 4px 0;
}

.switch-info p {
  font-size: 13px;
  color: #8c8c8c;
  margin: 0;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.theme-card {
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-card:hover {
  border-color: #1890ff;
}

.theme-card.active {
  border-color: #1890ff;
  background: #f0f9ff;
}

.theme-preview {
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  margin-bottom: 12px;
}

.preview-sidebar {
  width: 30%;
  background: var(--preview-sidebar);
}

.preview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.preview-header {
  height: 30%;
  background: var(--preview-header);
}

.preview-body {
  flex: 1;
  background: var(--preview-body);
}

.theme-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.theme-check {
  font-size: 18px;
}

.grid-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.col-half {
  width: 100%;
}
</style>
