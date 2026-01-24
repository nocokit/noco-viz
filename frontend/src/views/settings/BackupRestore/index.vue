<template>
  <div class="backup-restore">
    <PageHeader title="备份与恢复 (Backup & Restore)" />

    <div class="content-body">
      <!-- 自动备份策略配置 -->
      <div class="config-card">
        <div class="card-left">
          <div class="card-title">
            自动备份策略
            <span class="status-tag">运行中</span>
          </div>
          <div class="card-desc">
            系统将在指定时间自动备份所有项目数据、数据源配置及系统设置。
            <br>建议将备份文件定期转存至外部存储。
          </div>
          <div class="form-inline">
            <div class="input-group">
              <span>备份频率: 每天</span>
              <input type="text" class="tiny-input time-input" v-model="autoBackupTime">
            </div>
            <div class="input-group">
              <span>保留最近</span>
              <input type="number" class="tiny-input" v-model="retentionCount">
              <span>份</span>
            </div>
          </div>
        </div>
        <div class="card-right">
          <label class="toggle-switch">
            <input type="checkbox" v-model="autoBackupEnabled">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- 列表工具栏 -->
      <div class="toolbar">
        <div style="font-size:14px; color:var(--text-secondary)">备份记录 ({{ backupList.length }})</div>
        <div style="display:flex; gap:12px">
          <button class="btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
            </svg>
            上传备份文件
          </button>
          <button class="btn btn-primary" @click="openBackupModal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            手动立即备份
          </button>
        </div>
      </div>

      <!-- 备份列表 -->
      <table class="data-table">
        <thead>
          <tr>
            <th width="30%">文件名 / 版本号</th>
            <th width="15%">备份类型</th>
            <th width="15%">文件大小</th>
            <th width="20%">创建时间</th>
            <th width="20%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in backupList" :key="item.fileName">
            <td>
              <span class="file-name">{{ item.fileName }}</span>
              <span class="file-ver">{{ item.version }}</span>
            </td>
            <td>
              <span class="type-badge" :class="item.type === 'auto' ? 'type-auto' : 'type-manual'">
                {{ item.type === 'auto' ? '自动备份' : '手动备份' }}
              </span>
            </td>
            <td><span class="size-text">{{ item.size }}</span></td>
            <td>{{ item.createTime }}</td>
            <td>
              <span class="action-link" style="color:var(--success)" @click="openRestoreModal(item.fileName)">恢复</span>
              <span class="action-link" @click="handleDownload(item)">下载</span>
              <span class="action-link danger" @click="handleDelete(item)">删除</span>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <!-- Modal: Backup -->
    <CommonModal
      v-model:visible="showBackupModal"
      title="新建系统备份"
      width="480px"
      :show-footer="true"
      @close="closeBackupModal"
    >
      <div style="margin-bottom:16px; color:var(--text-secondary); font-size:13px">
        系统将打包当前所有配置、项目文件及数据库记录。备份过程可能持续几分钟。
      </div>
      <div style="margin-bottom:12px">
        <label
          style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:6px">备注信息</label>
        <input type="text"
          style="width:100%; background:var(--bg-input); border:1px solid var(--border); color:#fff; padding:10px; border-radius:6px"
          placeholder="例如：升级 v2.5 前备份" v-model="backupNote">
      </div>

      <div class="progress-container" v-show="isBackingUp">
        <div class="progress-text">
          <span>正在打包...</span>
          <span>{{ backupProgress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: backupProgress + '%' }"></div>
        </div>
      </div>

      <template #footer>
        <button class="btn" @click="closeBackupModal" :disabled="isBackingUp">取消</button>
        <button class="btn btn-primary" @click="startBackup" :disabled="isBackingUp">
          {{ isBackingUp ? '备份中...' : '开始备份' }}
        </button>
      </template>
    </CommonModal>

    <!-- Modal: Restore (High Risk) -->
    <CommonModal
      v-model:visible="showRestoreModal"
      title="⚠️ 确认恢复系统？"
      width="480px"
      :show-footer="true"
      @close="closeRestoreModal"
    >
      <div class="warning-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
        <div>
          <strong>警告：这是一个破坏性操作！</strong><br>
          恢复将覆盖当前所有数据（包括项目、用户、配置）。系统将重启，服务会中断数分钟。请确保您已对当前状态进行了备份。
        </div>
      </div>

      <div style="margin-bottom:12px">
        <label style="display:block; font-size:12px; color:var(--text-secondary); margin-bottom:6px">
          请输入文件名 <span style="color:#fff; font-family:monospace">{{ restoreTargetFile }}</span> 以确认：
        </label>
        <input type="text"
          style="width:100%; background:var(--bg-input); border:1px solid var(--border); color:#fff; padding:10px; border-radius:6px"
          placeholder="输入文件名确认" v-model="confirmRestoreFilename">
      </div>

      <template #footer>
        <button class="btn" @click="closeRestoreModal">取消</button>
        <button class="btn" style="background:var(--danger); border-color:var(--danger); color:white"
          @click="confirmRestore" :disabled="confirmRestoreFilename !== restoreTargetFile">
          确认恢复
        </button>
      </template>
    </CommonModal>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import CommonModal from '@/components/CommonModal.vue'
import {
  getBackupList,
  getBackupConfig,
  updateBackupConfig,
  createBackup,
  downloadBackup,
  restoreBackup,
  deleteBackup
} from '@/api/backup'

// 配置数据
const autoBackupEnabled = ref(true)
const autoBackupTime = ref('02:00:00')
const retentionCount = ref(30)

// 备份列表数据
const backupList = reactive([])

// 加载备份配置
const loadBackupConfig = async () => {
  try {
    const config = await getBackupConfig()
    autoBackupEnabled.value = config.autoBackupEnabled
    autoBackupTime.value = config.autoBackupTime
    retentionCount.value = config.retentionCount
  } catch (error) {
    console.error('加载备份配置失败:', error)
  }
}

// 加载备份列表
const loadBackupList = async () => {
  try {
    const list = await getBackupList()
    backupList.length = 0
    backupList.push(...list)
  } catch (error) {
    console.error('加载备份列表失败:', error)
    ElMessage.error('加载备份列表失败')
  }
}

// 保存配置
const saveConfig = async () => {
  try {
    await updateBackupConfig({
      autoBackupEnabled: autoBackupEnabled.value,
      autoBackupTime: autoBackupTime.value,
      retentionCount: retentionCount.value
    })
    ElMessage.success('配置已保存')
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error('保存配置失败')
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadBackupConfig()
  loadBackupList()
})

// 备份 Modal 状态
const showBackupModal = ref(false)
const isBackingUp = ref(false)
const backupProgress = ref(0)
const backupNote = ref('')

function openBackupModal() {
  showBackupModal.value = true
  backupNote.value = ''
  isBackingUp.value = false
  backupProgress.value = 0
}

function closeBackupModal() {
  if (isBackingUp.value) return
  showBackupModal.value = false
}

async function startBackup() {
  isBackingUp.value = true
  backupProgress.value = 0

  try {
    // 模拟进度
    const interval = setInterval(() => {
      if (backupProgress.value < 90) {
        backupProgress.value += 5
      }
    }, 100)

    // 调用 API 创建备份
    const result = await createBackup({ note: backupNote.value })

    clearInterval(interval)
    backupProgress.value = 100

    setTimeout(() => {
      isBackingUp.value = false
      showBackupModal.value = false
      ElMessage.success('备份创建成功')
      // 重新加载列表
      loadBackupList()
    }, 500)
  } catch (error) {
    console.error('创建备份失败:', error)
    ElMessage.error('创建备份失败')
    isBackingUp.value = false
  }
}

// 恢复 Modal 状态
const showRestoreModal = ref(false)
const restoreTargetFile = ref('')
const confirmRestoreFilename = ref('')

function openRestoreModal(filename) {
  restoreTargetFile.value = filename
  confirmRestoreFilename.value = ''
  showRestoreModal.value = true
}

function closeRestoreModal() {
  showRestoreModal.value = false
}

async function confirmRestore() {
  try {
    // 找到对应的备份 ID
    const backup = backupList.find(b => b.fileName === restoreTargetFile.value)
    if (!backup) {
      ElMessage.error('备份文件不存在')
      return
    }

    await restoreBackup(backup.id)
    ElMessage.success('恢复指令已发送，系统即将重启...')
    closeRestoreModal()
  } catch (error) {
    console.error('恢复备份失败:', error)
    ElMessage.error('恢复备份失败')
  }
}

// 下载备份
async function handleDownload(backup) {
  try {
    const blob = await downloadBackup(backup.id)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = backup.fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    ElMessage.success('下载成功')
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败')
  }
}

// 删除备份
async function handleDelete(backup) {
  try {
    await ElMessageBox.confirm(
      `确定要删除备份 "${backup.fileName}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteBackup(backup.id)
    ElMessage.success('备份已删除')
    loadBackupList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除备份失败:', error)
      ElMessage.error('删除备份失败')
    }
  }
}
</script>

<style scoped>
/* =========================================
   全局变量 (模拟 :root)
   ========================================= */
.backup-restore {
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
   3. 主内容区
   ========================================= */
.header {
    height: 64px; padding: 0 32px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(20, 21, 25, 0.9);
    flex-shrink: 0;
}
.header h2 { font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 10px; margin: 0; color: #fff; }

.content-body { padding: 32px; flex: 1; overflow-y: auto; }

/* Config Card (Auto Backup) */
.config-card {
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 24px;
    margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start;
}
.card-left { max-width: 600px; }
.card-title { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
.card-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5; }

.status-tag { font-size: 11px; background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 2px 8px; border-radius: 4px; }

.form-inline { display: flex; gap: 20px; align-items: center; }
.input-group { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-secondary); }
.tiny-input {
    background: var(--bg-input); border: 1px solid var(--border); color: #fff; padding: 6px 10px; border-radius: 4px; width: 80px; text-align: center;
}
.time-input { width: 120px; }

/* Toggle Switch */
.toggle-switch { position: relative; width: 44px; height: 24px; display: inline-block; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.slider {
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
    background-color: #333; transition: .4s; border-radius: 24px;
}
.slider:before {
    position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
    background-color: white; transition: .4s; border-radius: 50%;
}
input:checked + .slider { background-color: var(--success); }
input:checked + .slider:before { transform: translateX(20px); }

/* Toolbar */
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
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
.data-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; }
.data-table th {
    text-align: left; padding: 12px 20px; color: var(--text-muted);
    border-bottom: 1px solid var(--border); font-weight: 500; background: var(--bg-card);
}
.data-table th:first-child { border-top-left-radius: 8px; }
.data-table th:last-child { border-top-right-radius: 8px; }

.data-table td {
    padding: 16px 20px; border-bottom: 1px solid var(--border); color: var(--text-main); background: var(--bg-card); vertical-align: middle;
}
.data-table tr:hover td { background: var(--bg-hover); }

.file-name { font-family: monospace; font-size: 13px; color: var(--text-main); display: block; margin-bottom: 4px; }
.file-ver { font-size: 11px; color: var(--text-muted); }

.type-badge {
    font-size: 11px; padding: 2px 6px; border-radius: 3px; font-weight: 500;
}
.type-auto { color: #a78bfa; background: rgba(139, 92, 246, 0.1); } /* Purple */
.type-manual { color: #3b82f6; background: rgba(59, 130, 246, 0.1); } /* Blue */

.size-text { font-family: monospace; color: var(--text-secondary); }

.action-link { color: var(--primary); cursor: pointer; margin-right: 12px; }
.action-link.danger { color: var(--danger); }
.action-link:hover { text-decoration: underline; }

.warning-box {
    background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
    padding: 12px; border-radius: 6px; margin-bottom: 20px; display: flex; gap: 10px; color: #fca5a5; font-size: 13px; line-height: 1.5;
}

.progress-container { margin-top: 20px; }
.progress-bar { height: 6px; background: #333; border-radius: 3px; overflow: hidden; margin-bottom: 6px;}
.progress-fill { height: 100%; width: 0%; background: var(--primary); transition: width 0.3s; }
.progress-text { font-size: 12px; color: var(--text-secondary); display: flex; justify-content: space-between; margin-bottom: 4px; }
</style>
