<template>
  <div class="ip-whitelist">
    <header class="header">
      <h2>IP 白名单 (IP Whitelist)</h2>
    </header>

    <div class="content-body">
      <!-- IP 白名单配置 -->
      <div class="config-card">
        <div class="card-left">
          <div class="card-title">
            启用 IP 白名单控制
            <span class="status-tag" v-if="whitelistEnabled">已启用</span>
            <span class="status-tag-disabled" v-else>已禁用</span>
          </div>
          <div class="card-desc">
            开启后，仅允许下列 IP 地址或网段访问本系统。
            <br>注意：启用白名单后，不在列表中的 IP 将无法访问 NocoViz 控制台。
          </div>
          <div class="form-inline">
            <div class="input-group">
              <span>当前 IP：</span>
              <span class="current-ip">{{ currentIP }}</span>
            </div>
          </div>
        </div>
        <div class="card-right">
          <label class="toggle-switch">
            <input type="checkbox" v-model="whitelistEnabled" @change="handleStatusChange">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- 列表工具栏 -->
      <div class="toolbar">
        <div style="font-size:14px; color:var(--text-secondary)">白名单规则 ({{ ipList.length }})</div>
        <div style="display:flex; gap:12px">
          <input
            type="text"
            class="search-input"
            placeholder="搜索 IP 地址或备注..."
            v-model="searchKeyword"
          >
          <button class="btn btn-primary" @click="openModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            添加 IP / 网段
          </button>
        </div>
      </div>

      <!-- IP 白名单列表 -->
      <table class="data-table">
        <thead>
          <tr>
            <th width="25%">IP 地址 / CIDR</th>
            <th width="35%">备注说明</th>
            <th width="15%">添加人</th>
            <th width="15%">添加时间</th>
            <th width="10%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredIpList" :key="item.id">
            <td>
              <div class="ip-cell">
                <span class="ip-badge">{{ item.ip }}</span>
                <span class="type-badge" :class="item.type === 'cidr' ? 'type-cidr' : 'type-single'">
                  {{ item.type === 'cidr' ? 'CIDR' : '单 IP' }}
                </span>
              </div>
            </td>
            <td>
              <span class="description-text">{{ item.description || '-' }}</span>
            </td>
            <td>{{ item.addedBy }}</td>
            <td>{{ formatDate(item.createdAt) }}</td>
            <td>
              <span class="action-link" @click="handleEdit(item)">编辑</span>
              <span class="action-link danger" @click="handleDelete(item)">删除</span>
            </td>
          </tr>
          <tr v-if="filteredIpList.length === 0">
            <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px;">
              暂无数据
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <!-- Modal: Add/Edit IP -->
    <CommonModal
      v-model:visible="modalOpen"
      :title="editingItem ? '编辑访问白名单' : '添加访问白名单'"
      width="520px"
      :show-footer="true"
      @close="closeModal"
    >
      <div style="margin-bottom:16px">
        <label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:6px">
          IP 地址或网段 <span style="color:var(--danger)">*</span>
        </label>
        <input
          type="text"
          style="width:100%; background:var(--bg-input); border:1px solid var(--border); color:#fff; padding:10px; border-radius:6px"
          placeholder="例如：192.168.1.1 或 192.168.1.0/24"
          v-model="formData.ip"
          :class="{ 'input-error': formErrors.ip }"
        >
        <div v-if="formErrors.ip" class="error-text">{{ formErrors.ip }}</div>
        <div class="form-tip">
          <a href="javascript:void(0)" @click="fillCurrentIP" style="color:var(--primary); font-size:12px">
            填入本机 IP ({{ currentIP }})
          </a>
        </div>
      </div>

      <div style="margin-bottom:12px">
        <label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:6px">
          备注说明
        </label>
        <textarea
          style="width:100%; background:var(--bg-input); border:1px solid var(--border); color:#fff; padding:10px; border-radius:6px; resize: vertical; min-height: 80px"
          placeholder="例如：研发部办公室 Wi-Fi"
          v-model="formData.description"
          maxlength="200"
        ></textarea>
      </div>

      <template #footer>
        <button class="btn" @click="closeModal">取消</button>
        <button class="btn btn-primary" @click="handleSubmit" :disabled="submitting">
          {{ submitting ? '保存中...' : (editingItem ? '保存修改' : '确认添加') }}
        </button>
      </template>
    </CommonModal>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonModal from '@/components/CommonModal.vue'
import * as ipWhitelistApi from '@/api/ipWhitelist'

// 状态
const loading = ref(false)
const submitting = ref(false)
const searchKeyword = ref('')
const currentIP = ref('192.168.1.105')
const whitelistEnabled = ref(true)
const modalOpen = ref(false)
const editingItem = ref(null)

// 是否使用Mock数据（当API调用失败时自动降级）
const useMock = ref(false)

// 表单数据
const formData = reactive({
  ip: '',
  description: ''
})

// 表单错误
const formErrors = reactive({
  ip: ''
})

const ipList = ref([])

// Mock数据（作为降级方案）
const mockData = [
  {
    id: 1,
    ip: '192.168.1.105',
    type: 'single',
    description: '管理员临时访问',
    addedBy: 'admin',
    createdAt: '2023-10-25T00:00:00.000Z'
  },
  {
    id: 2,
    ip: '10.0.0.0/16',
    type: 'cidr',
    description: '公司内网 VPN 网段',
    addedBy: 'system',
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    ip: '47.102.xx.xx',
    type: 'single',
    description: '运维监控服务器',
    addedBy: 'ops_user',
    createdAt: '2023-05-12T00:00:00.000Z'
  }
]

// 过滤后的列表
const filteredIpList = computed(() => {
  if (!searchKeyword.value) return ipList.value

  const keyword = searchKeyword.value.toLowerCase()
  return ipList.value.filter(item => {
    return item.ip.toLowerCase().includes(keyword) ||
           (item.description && item.description.toLowerCase().includes(keyword)) ||
           item.addedBy.toLowerCase().includes(keyword)
  })
})

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const [listRes, statusRes] = await Promise.all([
      ipWhitelistApi.getIpWhitelistList(),
      ipWhitelistApi.getWhitelistStatus()
    ])

    ipList.value = (listRes.data || []).map(item => ({
      ...item,
      type: item.ip.includes('/') ? 'cidr' : 'single'
    }))
    whitelistEnabled.value = statusRes.data?.enabled ?? true
    currentIP.value = statusRes.data?.currentIp || '192.168.1.105'
    useMock.value = false
  } catch (error) {
    console.warn('API调用失败，使用Mock数据:', error)
    ipList.value = mockData.map(item => ({
      ...item,
      type: item.ip.includes('/') ? 'cidr' : 'single'
    }))
    useMock.value = true
  } finally {
    loading.value = false
  }
}

// 切换白名单启用状态
const handleStatusChange = async () => {
  if (useMock.value) {
    ElMessage.success('白名单状态已更新（Mock模式）')
    return
  }

  try {
    await ipWhitelistApi.updateWhitelistStatus(whitelistEnabled.value)
    ElMessage.success('白名单状态已更新')
  } catch (error) {
    ElMessage.error('更新失败')
    whitelistEnabled.value = !whitelistEnabled.value
  }
}

// 打开弹窗
const openModal = (item = null) => {
  editingItem.value = item
  if (item) {
    formData.ip = item.ip
    formData.description = item.description || ''
  } else {
    formData.ip = ''
    formData.description = ''
  }
  formErrors.ip = ''
  modalOpen.value = true
}

// 关闭弹窗
const closeModal = () => {
  modalOpen.value = false
  editingItem.value = null
  formData.ip = ''
  formData.description = ''
  formErrors.ip = ''
}

// 填入当前IP
const fillCurrentIP = () => {
  formData.ip = currentIP.value
  formErrors.ip = ''
}

// 验证IP地址
const validateIP = (ip) => {
  if (!ip) {
    return '请输入IP地址或网段'
  }

  // 验证IP地址格式（支持单IP和CIDR）
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/
  if (!ipPattern.test(ip)) {
    return '请输入有效的IP地址或CIDR网段'
  }

  // 验证IP地址范围
  const parts = ip.split('/')[0].split('.')
  for (const part of parts) {
    const num = parseInt(part)
    if (num < 0 || num > 255) {
      return 'IP地址范围应在0-255之间'
    }
  }

  return ''
}

// 提交表单
const handleSubmit = async () => {
  // 验证
  formErrors.ip = validateIP(formData.ip)
  if (formErrors.ip) {
    return
  }

  submitting.value = true

  if (useMock.value) {
    if (editingItem.value) {
      const index = ipList.value.findIndex(item => item.id === editingItem.value.id)
      if (index !== -1) {
        ipList.value[index] = {
          ...ipList.value[index],
          ip: formData.ip,
          description: formData.description,
          type: formData.ip.includes('/') ? 'cidr' : 'single'
        }
      }
      ElMessage.success('修改成功（Mock模式）')
    } else {
      const newItem = {
        id: Date.now(),
        ip: formData.ip,
        type: formData.ip.includes('/') ? 'cidr' : 'single',
        description: formData.description,
        addedBy: 'admin',
        createdAt: new Date().toISOString()
      }
      ipList.value.unshift(newItem)
      ElMessage.success('添加成功（Mock模式）')
    }
    submitting.value = false
    closeModal()
    return
  }

  try {
    if (editingItem.value) {
      await ipWhitelistApi.updateIpWhitelist(editingItem.value.id, formData)
      ElMessage.success('修改成功')
    } else {
      await ipWhitelistApi.createIpWhitelist(formData)
      ElMessage.success('添加成功')
    }
    closeModal()
    await loadData()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error(editingItem.value ? '修改失败' : '添加失败')
  } finally {
    submitting.value = false
  }
}

// 编辑
const handleEdit = (item) => {
  openModal(item)
}

// 删除
const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 IP "${item.ip}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    if (useMock.value) {
      ipList.value = ipList.value.filter(i => i.id !== item.id)
      ElMessage.success('删除成功（Mock模式）')
      return
    }

    await ipWhitelistApi.deleteIpWhitelist(item.id)
    ElMessage.success('删除成功')
    await loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化加载
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* =========================================
   全局变量
   ========================================= */
.ip-whitelist {
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

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: var(--text-main);
  background-color: var(--bg-body);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

/* =========================================
   Header
   ========================================= */
.header {
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(20, 21, 25, 0.9);
  flex-shrink: 0;
}

.header h2 {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: #fff;
}

.content-body {
  padding: 32px;
  flex: 1;
  overflow-y: auto;
}

/* Config Card */
.config-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-left {
  max-width: 600px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.5;
}

.status-tag {
  font-size: 11px;
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
  padding: 2px 8px;
  border-radius: 4px;
}

.status-tag-disabled {
  font-size: 11px;
  background: rgba(107, 114, 128, 0.1);
  color: var(--text-muted);
  padding: 2px 8px;
  border-radius: 4px;
}

.form-inline {
  display: flex;
  gap: 20px;
  align-items: center;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
}

.current-ip {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: var(--primary);
  background: rgba(59, 130, 246, 0.1);
  padding: 4px 10px;
  border-radius: 4px;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  display: inline-block;
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
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
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
  transform: translateX(20px);
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-input {
  width: 240px;
  height: 36px;
  padding: 0 12px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: #fff;
  font-size: 13px;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
}

.btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #2d2e33;
  background: #1c1d21;
  color: #9ca3af;
  transition: 0.2s;
}

.btn:hover {
  border-color: #fff;
  color: #fff;
}

.btn-primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.btn-primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  vertical-align: middle;
}

.data-table tr:hover td {
  background: var(--bg-hover);
}

.ip-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ip-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #26272c;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: #e5e5e5;
}

.type-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

.type-cidr {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.type-single {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.description-text {
  font-size: 13px;
  color: var(--text-secondary);
}

.action-link {
  color: var(--primary);
  cursor: pointer;
  margin-right: 12px;
}

.action-link.danger {
  color: var(--danger);
}

.action-link:hover {
  text-decoration: underline;
}

/* Form */
.input-error {
  border-color: var(--danger) !important;
}

.error-text {
  color: var(--danger);
  font-size: 12px;
  margin-top: 4px;
}

.form-tip {
  margin-top: 6px;
  font-size: 12px;
}
</style>
