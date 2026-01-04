<template>
  <div class="integration-publish">
    <!-- 场景说明 -->
    <div class="info-alert">
      <svg class="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
      <div class="info-content">
        <h4>Iframe 集成模式</h4>
        <p>在此模式下,大屏将作为子页面嵌入到您的业务系统(OA/ERP/Portal)中。请配置"允许嵌入的域名"以防止被恶意盗用。支持通过 URL 参数透传业务 ID。</p>
      </div>
    </div>

    <!-- 表格区 -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th width="20%">项目名称</th>
            <th width="15%">认证方式</th>
            <th width="20%">嵌入域名白名单 (Referer)</th>
            <th width="15%">接收参数</th>
            <th width="10%">状态</th>
            <th width="20%">集成操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <!-- 项目名称 -->
            <td>
              <div class="project-name">{{ project.name }}</div>
              <div class="project-id">ID: {{ project.id }}</div>
            </td>

            <!-- 认证方式 -->
            <td>
              <div class="auth-type" :class="{ public: project.authType === 'public' }">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2z"/>
                </svg>
                {{ project.authType === 'sign' ? '签名验证 (Sign)' : '无认证 (Public)' }}
              </div>
            </td>

            <!-- 嵌入域名白名单 -->
            <td>
              <div class="domain-limit">
                <span
                  v-for="(domain, idx) in project.domains"
                  :key="idx"
                  class="domain-tag"
                  :class="{ unrestricted: domain === '*' }"
                >
                  {{ domain === '*' ? '* (不限制)' : domain }}
                </span>
              </div>
            </td>

            <!-- 接收参数 -->
            <td class="params-col">
              {{ project.params || '-' }}
            </td>

            <!-- 状态 -->
            <td>
              <span class="status-online">● 已上线</span>
            </td>

            <!-- 集成操作 -->
            <td>
              <button class="btn-code" @click="openDrawer(project)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                </svg>
                获取集成代码
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 集成代码抽屉 -->
    <div class="code-drawer" :class="{ open: drawerOpen }">
      <div class="drawer-header">
        <div class="drawer-title">集成指南: <span>{{ currentProject?.name }}</span></div>
        <div class="close-btn" @click="closeDrawer">✕</div>
      </div>

      <div class="section-title">1. Iframe 嵌入代码</div>
      <div class="code-block">
        <div class="copy-btn-abs" @click="copyCode('iframe')">复制</div>
<pre>&lt;iframe
  id="nocoviz-frame"
  src="http://192.168.1.10:8080/view/{{ currentProject?.id }}{{ currentProject?.sampleUrl }}"
  width="100%"
  height="600px"
  frameborder="0"
  allowfullscreen&gt;
&lt;/iframe&gt;</pre>
      </div>

      <div class="section-title">2. 支持的 URL 参数</div>
      <table class="param-table">
        <thead>
          <tr>
            <th>参数名</th>
            <th>必填</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="param in currentProject?.urlParams" :key="param.name">
            <td>{{ param.name }}</td>
            <td>{{ param.required ? '是' : '否' }}</td>
            <td>{{ param.description }}</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">3. 跨域通讯 (PostMessage)</div>
      <div class="code-block">
        <div class="copy-btn-abs" @click="copyCode('postmessage')">复制</div>
<pre>// 宿主页面控制大屏刷新
const frame = document.getElementById('nocoviz-frame');
frame.contentWindow.postMessage(
  { type: 'REFRESH_DATA', payload: { orgId: 200 } },
  '*'
);</pre>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div v-if="drawerOpen" class="drawer-overlay" @click="closeDrawer"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const drawerOpen = ref(false)
const currentProject = ref(null)

// 项目列表
const projects = ref([
  {
    id: '839201',
    name: '财务总览大屏',
    authType: 'sign',
    domains: ['oa.example.com', 'finance.internal.net'],
    params: 'orgId, year',
    status: 'online',
    sampleUrl: '?orgId=100&sign=XXX',
    urlParams: [
      { name: 'orgId', required: true, description: '组织ID，用于过滤数据' },
      { name: 'year', required: false, description: '默认显示年份' },
      { name: 'token', required: true, description: '免登令牌' }
    ]
  },
  {
    id: '110293',
    name: '车间生产看板',
    authType: 'public',
    domains: ['*'],
    params: null,
    status: 'online',
    sampleUrl: '',
    urlParams: [
      { name: 'workshopId', required: false, description: '车间ID，用于过滤数据' }
    ]
  }
])

// 打开抽屉
const openDrawer = (project) => {
  currentProject.value = project
  drawerOpen.value = true
}

// 关闭抽屉
const closeDrawer = () => {
  drawerOpen.value = false
}

// 复制代码
const copyCode = (type) => {
  ElMessage.success(`${type === 'iframe' ? 'Iframe' : 'PostMessage'} 代码已复制到剪贴板`)
}
</script>

<style scoped>
.integration-publish {
  padding: 0;
  position: relative;
}

/* ========== 信息提示 ========== */
.info-alert {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  color: #3b82f6;
  margin-top: 2px;
  flex-shrink: 0;
}

.info-content h4 {
  font-size: 14px;
  margin-bottom: 4px;
  color: #fff;
}

.info-content p {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.5;
}

/* ========== 表格卡片 ========== */
.table-card {
  background: #1c1d21;
  border: 1px solid #2d2e33;
  border-radius: 12px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 14px 24px;
  color: #9ca3af;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #2d2e33;
  font-weight: 600;
}

.data-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #2d2e33;
  vertical-align: middle;
}

.data-table tr:hover {
  background: #26272c;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* 项目名称 */
.project-name {
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.project-id {
  font-size: 11px;
  color: #666;
}

/* 认证方式 */
.auth-type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  background: #000;
  border: 1px solid #2d2e33;
  color: #9ca3af;
  font-family: monospace;
}

.auth-type.public {
  border-color: #444;
  color: #888;
}

/* 域名白名单 */
.domain-limit {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.domain-tag {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 6px;
  border-radius: 3px;
  width: fit-content;
  font-family: monospace;
}

.domain-tag.unrestricted {
  color: #666;
  background: transparent;
}

/* 参数列 */
.params-col {
  color: #9ca3af;
  font-family: monospace;
  font-size: 12px;
}

/* 状态 */
.status-online {
  color: #10b981;
  font-size: 13px;
}

/* 获取代码按钮 */
.btn-code {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
  cursor: pointer;
  font-size: 12px;
  transition: 0.2s;
}

.btn-code:hover {
  background: #3b82f6;
  color: #fff;
}

/* ========== 代码抽屉 ========== */
.code-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 450px;
  background: #18181c;
  border-left: 1px solid #2d2e33;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  padding: 24px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow-y: auto;
}

.code-drawer.open {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #2d2e33;
}

.drawer-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.drawer-title span {
  color: #3b82f6;
}

.close-btn {
  cursor: pointer;
  color: #9ca3af;
  font-size: 20px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: 0.2s;
}

.close-btn:hover {
  background: #26272c;
  color: #fff;
}

/* 代码块 */
.section-title {
  font-size: 13px;
  margin-bottom: 12px;
  color: #fff;
  font-weight: 500;
}

.code-block {
  background: #000;
  border: 1px solid #2d2e33;
  border-radius: 6px;
  padding: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #a5b3ce;
  line-height: 1.6;
  margin-bottom: 24px;
  position: relative;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  white-space: pre;
}

.copy-btn-abs {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 11px;
  cursor: pointer;
  color: #3b82f6;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.5);
  transition: 0.2s;
}

.copy-btn-abs:hover {
  background: #3b82f6;
  color: #fff;
}

/* 参数表格 */
.param-table {
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
  margin-bottom: 24px;
}

.param-table th {
  text-align: left;
  color: #9ca3af;
  padding: 8px 12px;
  border-bottom: 1px solid #2d2e33;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.2);
}

.param-table td {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #d1d5db;
}

.param-table tbody tr:last-child td {
  border-bottom: none;
}

/* 遮罩层 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  backdrop-filter: blur(2px);
}
</style>
