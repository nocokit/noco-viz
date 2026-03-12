<template>
  <div class="branding-management-wrapper">
    <BreadcrumbHeader :items="[
      { label: '首页', path: '/' },
      { label: '系统设置', path: '/settings' },
      { label: '品牌化', icon: SkinOutlined }
    ]" />

    <div class="branding-management">
      <div class="config-container">
        <!-- 左侧菜单 -->
        <div class="settings-menu">
          <div class="menu-title">品牌配置</div>
          <div v-for="item in menuItems" :key="item.id"
            :class="['menu-link', { active: activeSection === item.id }]"
            @click="scrollToSection(item.id)">
            {{ item.label }}
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div class="settings-content-wrapper">
          <div class="settings-content" ref="scrollContainer">
        <!-- 1. 基础信息 -->
        <div id="basic" class="section-card">
          <div class="section-header">
            <div class="section-title">基础信息</div>
            <div class="section-desc">配置系统的基本品牌标识。</div>
          </div>

          <a-form :model="brandingForm" layout="vertical">
            <a-form-item label="系统名称">
              <a-input v-model:value="brandingForm.basic.systemName"
                placeholder="请输入系统名称"
                style="max-width: 500px" />
              <div class="input-hint">显示在浏览器标题栏、登录页及系统顶部。</div>
            </a-form-item>

            <a-form-item label="系统简称">
              <a-input v-model:value="brandingForm.basic.systemShortName"
                placeholder="简称或英文缩写"
                style="max-width: 500px" />
              <div class="input-hint">用于移动端或空间受限的场景。</div>
            </a-form-item>

            <a-form-item label="企业名称">
              <a-input v-model:value="brandingForm.basic.companyName"
                placeholder="请输入企业名称"
                style="max-width: 500px" />
              <div class="input-hint">显示在版权信息中。</div>
            </a-form-item>
          </a-form>
        </div>

        <!-- 2. Logo 配置 -->
        <div id="logo" class="section-card">
          <div class="section-header">
            <div class="section-title">Logo 配置</div>
            <div class="section-desc">上传适配不同主题的系统 Logo。</div>
          </div>

          <a-form :model="brandingForm" layout="vertical">
            <div class="logo-grid">
              <!-- 深色主题 Logo -->
              <a-form-item label="深色主题 Logo">
                <div class="logo-upload-box">
                  <a-upload
                    class="logo-uploader"
                    :show-file-list="false"
                    :before-upload="(file) => beforeLogoUpload(file, 'dark')"
                    accept="image/*">
                    <div v-if="brandingForm.logo.darkUrl" class="logo-preview-wrapper">
                      <img :src="brandingForm.logo.darkUrl" class="logo-preview" />
                      <div class="logo-overlay">
                        <UploadOutlined class="overlay-icon" />
                        <span>更换</span>
                      </div>
                    </div>
                    <div v-else class="upload-placeholder">
                      <PictureOutlined class="upload-icon" />
                      <div class="upload-text">点击上传</div>
                    </div>
                  </a-upload>
                  <div class="logo-actions" v-if="brandingForm.logo.darkUrl">
                    <a-button size="small" @click="previewLogo('dark')">预览</a-button>
                    <a-button size="small" danger @click="removeLogo('dark')">删除</a-button>
                  </div>
                </div>
                <div class="input-hint">建议尺寸：200×60px，格式：PNG/SVG，背景透明</div>
              </a-form-item>

              <!-- 浅色主题 Logo -->
              <a-form-item label="浅色主题 Logo">
                <div class="logo-upload-box">
                  <a-upload
                    class="logo-uploader"
                    :show-file-list="false"
                    :before-upload="(file) => beforeLogoUpload(file, 'light')"
                    accept="image/*">
                    <div v-if="brandingForm.logo.lightUrl" class="logo-preview-wrapper">
                      <img :src="brandingForm.logo.lightUrl" class="logo-preview light-bg" />
                      <div class="logo-overlay">
                        <UploadOutlined class="overlay-icon" />
                        <span>更换</span>
                      </div>
                    </div>
                    <div v-else class="upload-placeholder">
                      <PictureOutlined class="upload-icon" />
                      <div class="upload-text">点击上传</div>
                    </div>
                  </a-upload>
                  <div class="logo-actions" v-if="brandingForm.logo.lightUrl">
                    <a-button size="small" @click="previewLogo('light')">预览</a-button>
                    <a-button size="small" danger @click="removeLogo('light')">删除</a-button>
                  </div>
                </div>
                <div class="input-hint">建议尺寸：200×60px，格式：PNG/SVG</div>
              </a-form-item>
            </div>
          </a-form>
        </div>

        <!-- 3. 图标配置 -->
        <div id="icon" class="section-card">
          <div class="section-header">
            <div class="section-title">图标配置</div>
            <div class="section-desc">配置浏览器标签页图标。</div>
          </div>

          <a-form :model="brandingForm" layout="vertical">
            <a-form-item label="浏览器图标 (Favicon)">
              <div class="favicon-upload-box">
                <a-upload
                  class="favicon-uploader"
                  :show-file-list="false"
                  :before-upload="beforeFaviconUpload"
                  accept="image/*">
                  <div v-if="brandingForm.icon.faviconUrl" class="favicon-preview-wrapper">
                    <img :src="brandingForm.icon.faviconUrl" class="favicon-preview" />
                    <div class="favicon-overlay">
                      <UploadOutlined class="overlay-icon" />
                    </div>
                  </div>
                  <div v-else class="upload-placeholder small">
                    <PictureOutlined class="upload-icon small" />
                    <div class="upload-text">点击上传</div>
                  </div>
                </a-upload>
                <div class="favicon-actions" v-if="brandingForm.icon.faviconUrl">
                  <a-button size="small" danger @click="removeFavicon">删除</a-button>
                </div>
              </div>
              <div class="input-hint">建议尺寸：32×32px 或 64×64px，格式：ICO/PNG/SVG</div>
            </a-form-item>
          </a-form>
        </div>

        <!-- 4. 登录页配置 -->
        <div id="login" class="section-card">
          <div class="section-header">
            <div class="section-title">登录页配置</div>
            <div class="section-desc">自定义登录页面的展示内容。</div>
          </div>

          <a-form :model="brandingForm" layout="vertical">
            <a-form-item label="登录页标题">
              <a-input v-model:value="brandingForm.login.title"
                placeholder="欢迎使用数据可视化平台"
                style="max-width: 500px" />
              <div class="input-hint">显示在登录框上方的主标题。</div>
            </a-form-item>

            <a-form-item label="登录页副标题">
              <a-textarea v-model:value="brandingForm.login.subtitle"
                placeholder="企业级数据可视化解决方案"
                :rows="2"
                style="max-width: 500px" />
              <div class="input-hint">显示在主标题下方的描述文字。</div>
            </a-form-item>

            <a-form-item label="登录页背景图">
              <div class="background-upload-box">
                <a-upload
                  class="background-uploader"
                  :show-file-list="false"
                  :before-upload="beforeBackgroundUpload"
                  accept="image/*">
                  <div v-if="brandingForm.login.backgroundUrl" class="background-preview-wrapper">
                    <img :src="brandingForm.login.backgroundUrl" class="background-preview" />
                    <div class="background-overlay">
                      <UploadOutlined class="overlay-icon" />
                      <span>更换背景</span>
                    </div>
                  </div>
                  <div v-else class="upload-placeholder large">
                    <PictureOutlined class="upload-icon" />
                    <div class="upload-text">点击上传背景图</div>
                  </div>
                </a-upload>
                <div class="background-actions" v-if="brandingForm.login.backgroundUrl">
                  <a-button size="small" @click="previewBackground">预览</a-button>
                  <a-button size="small" danger @click="removeBackground">删除</a-button>
                </div>
              </div>
              <div class="input-hint">建议尺寸：1920×1080px，格式：JPG/PNG，文件大小不超过 2MB</div>
            </a-form-item>
          </a-form>
        </div>

        <!-- 5. 版权信息 -->
        <div id="copyright" class="section-card">
          <div class="section-header">
            <div class="section-title">版权信息</div>
            <div class="section-desc">配置系统底部的版权声明。</div>
          </div>

          <a-form :model="brandingForm" layout="vertical">
            <a-form-item label="版权文本">
              <a-input v-model:value="brandingForm.copyright.text"
                placeholder="© 2024 MyCompany Inc. All Rights Reserved."
                style="max-width: 600px" />
              <div class="input-hint">显示在系统底部的版权声明。</div>
            </a-form-item>

            <a-form-item label="ICP 备案号">
              <a-input v-model:value="brandingForm.copyright.icp"
                placeholder="京ICP备12345678号"
                style="max-width: 500px" />
              <div class="input-hint">中国大陆地区网站需要填写 ICP 备案号。</div>
            </a-form-item>

            <a-form-item label="备案链接">
              <a-input v-model:value="brandingForm.copyright.icpLink"
                placeholder="https://beian.miit.gov.cn/"
                style="max-width: 500px" />
              <div class="input-hint">点击备案号跳转的链接地址。</div>
            </a-form-item>
          </a-form>
        </div>

        <!-- 6. 其他配置 -->
        <div id="other" class="section-card">
          <div class="section-header">
            <div class="section-title">其他配置</div>
            <div class="section-desc">额外的品牌相关配置项。</div>
          </div>

          <a-form :model="brandingForm" layout="vertical">
            <a-form-item label="帮助文档链接">
              <a-input v-model:value="brandingForm.other.helpUrl"
                placeholder="https://docs.example.com"
                style="max-width: 500px" />
              <div class="input-hint">用户点击"帮助"按钮时跳转的文档地址。</div>
            </a-form-item>

            <a-form-item label="技术支持邮箱">
              <a-input v-model:value="brandingForm.other.supportEmail"
                placeholder="support@example.com"
                type="email"
                style="max-width: 500px" />
              <div class="input-hint">用于接收用户反馈和技术支持请求。</div>
            </a-form-item>

            <a-form-item label="技术支持电话">
              <a-input v-model:value="brandingForm.other.supportPhone"
                placeholder="400-xxx-xxxx"
                style="max-width: 500px" />
              <div class="input-hint">显示在系统中的技术支持热线。</div>
            </a-form-item>
          </a-form>
        </div>

        <!-- 底部留白 -->
        <div style="height: 24px;"></div>
          </div>

          <!-- 保存按钮 - 固定在底部 -->
          <div class="content-footer">
            <a-button type="primary" @click="handleSave" :loading="saving">
              保存更改
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Logo 预览对话框 -->
  <a-modal v-model:open="previewModal.visible" :title="previewModal.title" width="600px">
    <div class="preview-dialog">
      <div :class="['preview-container', previewModal.theme]">
        <img :src="previewModal.url" alt="Logo Preview" class="preview-image" />
      </div>
    </div>
    <template #footer>
      <a-button @click="previewModal.visible = false">关闭</a-button>
    </template>
  </a-modal>

  <!-- 背景图预览对话框 -->
  <a-modal v-model:open="backgroundPreviewVisible" title="登录页背景预览" width="900px">
    <div class="background-preview-dialog">
      <img :src="brandingForm.login.backgroundUrl" alt="Background Preview" class="background-preview-image" />
    </div>
    <template #footer>
      <a-button @click="backgroundPreviewVisible = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import { PictureOutlined, UploadOutlined, SkinOutlined } from '@ant-design/icons-vue'
import BreadcrumbHeader from '@/components/BreadcrumbHeader.vue'
import * as systemConfigApi from '@/api/systemConfig'

// 菜单配置
const menuItems = [
  { id: 'basic', label: '基础信息' },
  { id: 'logo', label: 'Logo 配置' },
  { id: 'icon', label: '图标配置' },
  { id: 'login', label: '登录页配置' },
  { id: 'copyright', label: '版权信息' },
  { id: 'other', label: '其他配置' }
]

// 表单数据
const brandingForm = reactive({
  basic: {
    systemName: 'NocoViz 数据可视化平台',
    systemShortName: 'NocoViz',
    companyName: ''
  },
  logo: {
    darkUrl: '',
    lightUrl: ''
  },
  icon: {
    faviconUrl: ''
  },
  login: {
    title: '',
    subtitle: '',
    backgroundUrl: ''
  },
  copyright: {
    text: '© 2024 MyCompany Inc. All Rights Reserved.',
    icp: '',
    icpLink: ''
  },
  other: {
    helpUrl: '',
    supportEmail: '',
    supportPhone: ''
  }
})

// 状态
const activeSection = ref('basic')
const saving = ref(false)
const scrollContainer = ref(null)
const backgroundPreviewVisible = ref(false)
const previewModal = reactive({
  visible: false,
  title: '',
  url: '',
  theme: 'dark'
})

// 滚动到指定区域
const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element && scrollContainer.value) {
    const container = scrollContainer.value
    const elementTop = element.offsetTop
    const containerTop = container.offsetTop

    container.scrollTo({
      top: elementTop - containerTop - 20,
      behavior: 'smooth'
    })
    activeSection.value = id
  }
}

// 监听滚动
const handleScroll = () => {
  if (!scrollContainer.value) return

  const sections = ['basic', 'logo', 'icon', 'login', 'copyright', 'other']
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
const beforeLogoUpload = (file, theme) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    message.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB！')
    return false
  }

  const url = URL.createObjectURL(file)
  if (theme === 'dark') {
    brandingForm.logo.darkUrl = url
  } else {
    brandingForm.logo.lightUrl = url
  }

  return false
}

// Favicon 上传
const beforeFaviconUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt1M = file.size / 1024 / 1024 < 1

  if (!isImage) {
    message.error('只能上传图片文件！')
    return false
  }
  if (!isLt1M) {
    message.error('图片大小不能超过 1MB！')
    return false
  }

  brandingForm.icon.faviconUrl = URL.createObjectURL(file)
  return false
}

// 背景图上传
const beforeBackgroundUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    message.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB！')
    return false
  }

  brandingForm.login.backgroundUrl = URL.createObjectURL(file)
  return false
}

// 预览 Logo
const previewLogo = (theme) => {
  previewModal.visible = true
  previewModal.title = theme === 'dark' ? '深色主题 Logo 预览' : '浅色主题 Logo 预览'
  previewModal.url = theme === 'dark' ? brandingForm.logo.darkUrl : brandingForm.logo.lightUrl
  previewModal.theme = theme
}

// 删除 Logo
const removeLogo = (theme) => {
  if (theme === 'dark') {
    brandingForm.logo.darkUrl = ''
  } else {
    brandingForm.logo.lightUrl = ''
  }
  message.success('已删除')
}

// 删除 Favicon
const removeFavicon = () => {
  brandingForm.icon.faviconUrl = ''
  message.success('已删除')
}

// 预览背景图
const previewBackground = () => {
  backgroundPreviewVisible.value = true
}

// 删除背景图
const removeBackground = () => {
  brandingForm.login.backgroundUrl = ''
  message.success('已删除')
}

// 保存配置
const handleSave = async () => {
  saving.value = true

  try {
    const configs = {
      'branding.systemName': brandingForm.basic.systemName,
      'branding.systemShortName': brandingForm.basic.systemShortName,
      'branding.companyName': brandingForm.basic.companyName,
      'branding.logo.dark': brandingForm.logo.darkUrl,
      'branding.logo.light': brandingForm.logo.lightUrl,
      'branding.favicon': brandingForm.icon.faviconUrl,
      'branding.login.title': brandingForm.login.title,
      'branding.login.subtitle': brandingForm.login.subtitle,
      'branding.login.background': brandingForm.login.backgroundUrl,
      'branding.copyright.text': brandingForm.copyright.text,
      'branding.copyright.icp': brandingForm.copyright.icp,
      'branding.copyright.icpLink': brandingForm.copyright.icpLink,
      'branding.helpUrl': brandingForm.other.helpUrl,
      'branding.supportEmail': brandingForm.other.supportEmail,
      'branding.supportPhone': brandingForm.other.supportPhone
    }

    await systemConfigApi.batchUpdateConfig(configs)
    message.success('品牌配置已保存')
  } catch (error) {
    console.error('保存配置失败:', error)
    message.error('保存配置失败')
  } finally {
    saving.value = false
  }
}

// 加载配置
const loadConfig = async () => {
  try {
    const configs = await systemConfigApi.getSystemConfig()

    if (configs['branding.systemName']) brandingForm.basic.systemName = configs['branding.systemName']
    if (configs['branding.systemShortName']) brandingForm.basic.systemShortName = configs['branding.systemShortName']
    if (configs['branding.companyName']) brandingForm.basic.companyName = configs['branding.companyName']
    if (configs['branding.logo.dark']) brandingForm.logo.darkUrl = configs['branding.logo.dark']
    if (configs['branding.logo.light']) brandingForm.logo.lightUrl = configs['branding.logo.light']
    if (configs['branding.favicon']) brandingForm.icon.faviconUrl = configs['branding.favicon']
    if (configs['branding.login.title']) brandingForm.login.title = configs['branding.login.title']
    if (configs['branding.login.subtitle']) brandingForm.login.subtitle = configs['branding.login.subtitle']
    if (configs['branding.login.background']) brandingForm.login.backgroundUrl = configs['branding.login.background']
    if (configs['branding.copyright.text']) brandingForm.copyright.text = configs['branding.copyright.text']
    if (configs['branding.copyright.icp']) brandingForm.copyright.icp = configs['branding.copyright.icp']
    if (configs['branding.copyright.icpLink']) brandingForm.copyright.icpLink = configs['branding.copyright.icpLink']
    if (configs['branding.helpUrl']) brandingForm.other.helpUrl = configs['branding.helpUrl']
    if (configs['branding.supportEmail']) brandingForm.other.supportEmail = configs['branding.supportEmail']
    if (configs['branding.supportPhone']) brandingForm.other.supportPhone = configs['branding.supportPhone']
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
.branding-management-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.branding-management {
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

.section-card {
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.section-card:last-child {
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

/* Logo 上传相关样式 */
.logo-grid {
  display: flex;
  gap: 48px;
}

.logo-upload-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logo-uploader {
  width: 100%;
}

.logo-preview-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  cursor: pointer;
}

.logo-preview {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.logo-preview.light-bg {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
}

.logo-overlay {
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
  gap: 8px;
}

.logo-preview-wrapper:hover .logo-overlay {
  opacity: 1;
}

.overlay-icon {
  font-size: 24px;
}

.upload-placeholder {
  width: 120px;
  height: 120px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.upload-placeholder:hover {
  border-color: #1890ff;
  background: #f0f9ff;
}

.upload-placeholder.small {
  width: 80px;
  height: 80px;
}

.upload-placeholder.large {
  width: 400px;
  height: 225px;
}

.upload-icon {
  font-size: 32px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.upload-icon.small {
  font-size: 24px;
}

.upload-text {
  font-size: 14px;
  color: #8c8c8c;
}

.logo-actions {
  display: flex;
  gap: 8px;
}

/* Favicon 上传相关样式 */
.favicon-upload-box {
  display: flex;
  align-items: center;
  gap: 16px;
}

.favicon-uploader {
  flex-shrink: 0;
}

.favicon-preview-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  cursor: pointer;
}

.favicon-preview {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.favicon-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: #fff;
}

.favicon-preview-wrapper:hover .favicon-overlay {
  opacity: 1;
}

.favicon-actions {
  display: flex;
  gap: 8px;
}

/* 背景图上传相关样式 */
.background-upload-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.background-uploader {
  width: 100%;
}

.background-preview-wrapper {
  position: relative;
  width: 400px;
  height: 225px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.background-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.background-overlay {
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
  gap: 8px;
}

.background-preview-wrapper:hover .background-overlay {
  opacity: 1;
}

.background-actions {
  display: flex;
  gap: 8px;
}

/* 预览对话框样式 */
.preview-dialog {
  padding: 24px;
}

.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border-radius: 8px;
  padding: 24px;
}

.preview-container.dark {
  background: #141414;
}

.preview-container.light {
  background: #f5f5f5;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.background-preview-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.background-preview-image {
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
  border-radius: 8px;
}
</style>
