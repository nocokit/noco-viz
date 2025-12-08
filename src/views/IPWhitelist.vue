<template>
  <div class="ip-whitelist-page">
    <!-- Header -->
    <header class="page-header">
      <h2>访问控制 (IP Whitelist)</h2>
    </header>

    <!-- 安全警示条 -->
    <div class="banner-alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
      </svg>
      <span>注意：启用白名单后，不在列表中的 IP 将无法访问 NocoViz 控制台。您当前的 IP 为：</span>
      <span class="current-ip-tag">{{ currentIP }}</span>
    </div>

    <div class="content-body">
      <!-- 全局开关 -->
      <div class="switch-card">
        <div class="switch-label">
          <h3>启用 IP 白名单控制</h3>
          <p>开启后，仅允许下列 IP 地址或网段访问本系统。</p>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" v-model="whitelistEnabled">
          <span class="slider"></span>
        </label>
      </div>

      <!-- 列表区域 -->
      <div class="list-toolbar">
        <div style="font-size:14px; color:var(--text-secondary)">
          已添加 {{ ipList.length }} 个规则
        </div>
        <button class="btn-primary" @click="openModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          添加 IP / 网段
        </button>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th width="30%">IP 地址 / CIDR</th>
            <th width="25%">备注说明</th>
            <th width="15%">添加人</th>
            <th width="15%">添加时间</th>
            <th width="15%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ipList" :key="item.id">
            <td>
              <span class="ip-badge">{{ item.ip }}</span>
              <span class="type-tag" :class="item.type === 'cidr' ? 'type-cidr' : 'type-single'">
                {{ item.typeLabel }}
              </span>
            </td>
            <td>{{ item.description }}</td>
            <td>{{ item.addedBy }}</td>
            <td>{{ item.addedAt }}</td>
            <td>
              <span class="btn-text" @click="handleEdit(item)">编辑</span>
              <span class="btn-text danger" @click="handleDelete(item)">删除</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" :class="{ open: modalOpen }" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingItem ? '编辑访问白名单' : '添加访问白名单' }}</h3>
          <div style="cursor:pointer; color:#888" @click="closeModal">✕</div>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">IP 地址或网段</label>
            <input
              type="text"
              class="form-input"
              placeholder="例如：192.168.1.1 或 192.168.1.0/24"
              v-model="formData.ip"
            >
            <div
              style="font-size:12px; color:var(--text-secondary); margin-top:6px; cursor:pointer; color:var(--primary)"
              @click="fillCurrentIP"
            >
              + 填入本机 IP ({{ currentIP }})
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">备注说明</label>
            <textarea
              class="form-textarea"
              placeholder="例如：研发部办公室 Wi-Fi"
              v-model="formData.description"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">取消</button>
          <button class="btn-primary" @click="handleSubmit">
            {{ editingItem ? '保存修改' : '确认添加' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentIP = ref('192.168.1.105')
const whitelistEnabled = ref(true)
const modalOpen = ref(false)
const editingItem = ref(null)

const formData = reactive({
  ip: '',
  description: ''
})

const ipList = ref([
  {
    id: 1,
    ip: '192.168.1.105',
    type: 'single',
    typeLabel: '本机',
    description: '管理员临时访问',
    addedBy: 'admin',
    addedAt: '2023-10-25'
  },
  {
    id: 2,
    ip: '10.0.0.0/16',
    type: 'cidr',
    typeLabel: 'CIDR',
    description: '公司内网 VPN 网段',
    addedBy: 'system',
    addedAt: '2023-01-01'
  },
  {
    id: 3,
    ip: '47.102.xx.xx',
    type: 'single',
    typeLabel: '单 IP',
    description: '运维监控服务器',
    addedBy: 'ops_user',
    addedAt: '2023-05-12'
  }
])

const openModal = (item = null) => {
  editingItem.value = item
  if (item) {
    formData.ip = item.ip
    formData.description = item.description
  } else {
    formData.ip = ''
    formData.description = ''
  }
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  editingItem.value = null
  formData.ip = ''
  formData.description = ''
}

const fillCurrentIP = () => {
  formData.ip = currentIP.value
}

const handleSubmit = () => {
  if (!formData.ip) {
    alert('请输入 IP 地址或网段')
    return
  }

  if (editingItem.value) {
    // 编辑
    const index = ipList.value.findIndex(item => item.id === editingItem.value.id)
    if (index !== -1) {
      ipList.value[index] = {
        ...ipList.value[index],
        ip: formData.ip,
        description: formData.description,
        type: formData.ip.includes('/') ? 'cidr' : 'single',
        typeLabel: formData.ip.includes('/') ? 'CIDR' : '单 IP'
      }
    }
  } else {
    // 新增
    const newItem = {
      id: Date.now(),
      ip: formData.ip,
      type: formData.ip.includes('/') ? 'cidr' : 'single',
      typeLabel: formData.ip.includes('/') ? 'CIDR' : '单 IP',
      description: formData.description,
      addedBy: 'admin',
      addedAt: new Date().toISOString().split('T')[0]
    }
    ipList.value.push(newItem)
  }

  closeModal()
}

const handleEdit = (item) => {
  openModal(item)
}

const handleDelete = (item) => {
  if (confirm(`确认删除 IP 规则：${item.ip}？`)) {
    const index = ipList.value.findIndex(i => i.id === item.id)
    if (index !== -1) {
      ipList.value.splice(index, 1)
    }
  }
}
</script>

<style scoped>
/* =========================================
   全局变量 (复用)
   ========================================= */
.ip-whitelist-page {
  --bg-body: #0a0b0d;
  --bg-sidebar: #141519;
  --bg-card: #1c1d21;
  --bg-input: #0f1012;
  --bg-hover: #26272c;

  --primary: #3b82f6;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;

  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --border: #2d2e33;

  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-body);
}

/* Header */
.page-header {
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(20, 21, 25, 0.9);
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-main);
}

/* Warning Banner */
.banner-alert {
  background: rgba(245, 158, 11, 0.1);
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  padding: 12px 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #fbbf24;
}

.current-ip-tag {
  background: rgba(245, 158, 11, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: 600;
}

/* Content Body */
.content-body {
  padding: 32px;
  flex: 1;
  overflow-y: auto;
}

/* Global Switch Card */
.switch-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.switch-label h3 {
  font-size: 16px;
  margin-bottom: 6px;
  font-weight: 600;
  color: #fff;
}

.switch-label p {
  font-size: 13px;
  color: var(--text-secondary);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  width: 48px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  transition: .4s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--success);
}

input:checked + .slider:before {
  transform: translateX(22px);
}

/* List Area */
.list-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-primary:hover {
  background: #2563eb;
}

/* Table */
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 12px 20px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  font-weight: 500;
  background: var(--bg-card);
}

.data-table th:first-child {
  border-top-left-radius: 8px;
}

.data-table th:last-child {
  border-top-right-radius: 8px;
}

.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
  background: var(--bg-card);
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover td {
  background: var(--bg-hover);
}

/* IP Badges */
.ip-badge {
  font-family: monospace;
  font-size: 13px;
  background: rgba(255,255,255,0.05);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.type-tag {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}

.type-single {
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.type-cidr {
  color: var(--primary);
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.2);
}

.btn-text {
  color: var(--primary);
  cursor: pointer;
  margin-right: 12px;
}

.btn-text:hover {
  text-decoration: underline;
}

.btn-text.danger {
  color: var(--danger);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: none;
  justify-content: center;
  align-items: center;
}

.modal-overlay.open {
  display: flex;
}

.modal {
  background: var(--bg-card);
  width: 480px;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: var(--bg-sidebar);
  border-radius: 0 0 12px 12px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
}

.form-textarea {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  height: 80px;
  resize: none;
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel:hover {
  border-color: var(--text-main);
  color: var(--text-main);
}
</style>
