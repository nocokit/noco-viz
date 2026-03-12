<template>
  <div class="backup-restore">
    <PageHeader
      title="备份恢复"
      description="定期备份系统数据，支持一键恢复，确保数据安全。"
    />

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
              <input type="text" class="tiny-input time-input" v-model:value="autoBackupTime">
            </div>
            <div class="input-group">
              <span>保留最近</span>
              <input type="number" class="tiny-input" v-model:value="retentionCount">
              <span>份</span>
            </div>
          </div>
        </div>
        <div class="card-right">
          <label class="toggle-switch">
            <input type="checkbox" v-model:value="autoBackupEnabled">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- 列表工具栏 -->
      <div class="toolbar">
        <div style="font-size:14px; color:var(--el-text-color-secondary)">备份记录 ({{ backupList.length }})</div>
        <div style="display:flex; gap:12px">
          <a-button>
            <template #icon>
              <UploadOutlined />
            </template>
            上传备份文件
          </a-button>
          <a-button type="primary" @click="openBackupModal">
            <template #icon>
              <PlusOutlined />
            </template>
            手动立即备份
          </a-button>
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
      v-model:open="showBackupModal"
      title="新建系统备份"
      width="480px"
      :show-footer="true"
      @close="closeBackupModal"
    >
      <div style="margin-bottom:16px; color:var(--el-text-color-secondary); font-size:13px">
        系统将打包当前所有配置、项目文件及数据库记录。备份过程可能持续几分钟。
      </div>
      <div style="margin-bottom:12px">
        <label
          style="display:block; font-size:12px; color:var(--el-text-color-secondary); margin-bottom:6px">备注信息</label>
        <input type="text"
          style="width:100%; background:var(--el-fill-color-blank); border:1px solid var(--el-border-color); color:var(--el-text-color-primary); padding:10px; border-radius:6px"
          placeholder="例如：升级 v2.5 前备份" v-model:value="backupNote">
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
        <a-button @click="closeBackupModal" :disabled="isBackingUp">取消</a-button>
        <a-button type="primary" @click="startBackup" :disabled="isBackingUp" :loading="isBackingUp">
          开始备份
        </a-button>
      </template>
    </CommonModal>

    <!-- Modal: Restore (High Risk) -->
    <CommonModal
      v-model:open="showRestoreModal"
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
        <label style="display:block; font-size:12px; color:var(--el-text-color-secondary); margin-bottom:6px">
          请输入文件名 <span style="color:var(--el-text-color-primary); font-family:monospace">{{ restoreTargetFile }}</span> 以确认：
        </label>
        <input type="text"
          style="width:100%; background:var(--el-fill-color-blank); border:1px solid var(--el-border-color); color:var(--el-text-color-primary); padding:10px; border-radius:6px"
          placeholder="输入文件名确认" v-model:value="confirmRestoreFilename">
      </div>

      <template #footer>
        <a-button @click="closeRestoreModal">取消</a-button>
        <a-button danger
          @click="confirmRestore" :disabled="confirmRestoreFilename !== restoreTargetFile">
          确认恢复
        </a-button>
      </template>
    </CommonModal>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons-vue'
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
    message.error('加载备份列表失败')
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
    message.success('配置已保存')
  } catch (error) {
    console.error('保存配置失败:', error)
    message.error('保存配置失败')
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
      message.success('备份创建成功')
      // 重新加载列表
      loadBackupList()
    }, 500)
  } catch (error) {
    console.error('创建备份失败:', error)
    message.error('创建备份失败')
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
      message.error('备份文件不存在')
      return
    }

    await restoreBackup(backup.id)
    message.success('恢复指令已发送，系统即将重启...')
    closeRestoreModal()
  } catch (error) {
    console.error('恢复备份失败:', error)
    message.error('恢复备份失败')
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
    message.success('下载成功')
  } catch (error) {
    console.error('下载失败:', error)
    message.error('下载失败')
  }
}

// 删除备份
async function handleDelete(backup) {
  try {
    await Modal.confirm(
      `确定要删除备份 "${backup.fileName}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteBackup(backup.id)
    message.success('备份已删除')
    loadBackupList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除备份失败:', error)
      message.error('删除备份失败')
    }
  }
}
</script>

