<template>
  <div class="connection-management">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">连接配置</h1>
        <span class="page-subtitle">管理数据库和API连接</span>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          帮助文档
        </button>
        <button class="btn btn-primary" @click="handleCreateConnection">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          新建连接
        </button>
      </div>
    </div>

    <!-- 连接卡片网格 -->
    <div class="content-area">
      <div class="grid-layout">

        <!-- 遍历连接卡片 -->
        <div
          v-for="conn in connections"
          :key="conn.id"
          :class="['conn-card', { 'conn-error': conn.status === 'error' }]"
        >
          <div class="card-head">
            <div class="db-logo" :style="{ color: getDbColor(conn.type) }">
              {{ getDbIcon(conn.type) }}
            </div>
            <span :class="['status-badge', conn.status === 'error' ? 'error' : '']">
              ● {{ conn.status === 'active' ? '连接正常' : '连接失败' }}
            </span>
          </div>
          <div class="card-info">
            <h3>{{ conn.name }}</h3>
            <p>{{ conn.host }}</p>
          </div>
          <div class="card-meta">
            <span>{{ conn.dbType }}</span>
            <span>被 {{ conn.usedByDatasets || 0 }} 个数据集引用</span>
          </div>
          <div class="card-actions">
            <button class="btn btn-secondary" @click="testConnection(conn)">
              {{ conn.status === 'error' ? '重试' : '测试连接' }}
            </button>
            <button class="btn btn-secondary" @click="editConnection(conn)">
              编辑
            </button>
            <button class="btn btn-danger" @click="deleteConnection(conn)">
              删除
            </button>
          </div>
        </div>

        <!-- 新建连接卡片 -->
        <div class="conn-card conn-card-new" @click="handleCreateConnection">
          <div class="new-icon">+</div>
          <div class="new-text">新建数据连接</div>
        </div>

      </div>
    </div>

    <!-- 新建/编辑连接模态框 -->
    <CommonModal
      v-model:visible="modalVisible"
      :title="isEditMode ? '编辑连接' : '新建连接'"
      width="700px"
      :show-footer="false"
      @close="closeModal"
    >
      <el-form :model="formData" label-position="top" :rules="formRules" ref="formRef">
        <el-form-item label="连接名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入连接名称，例如：交易订单主库"
            maxlength="50"
            show-word-limit
            size="large"
          />
        </el-form-item>

        <el-form-item label="数据库类型" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="请选择数据库类型"
            size="large"
            style="width: 100%"
          >
            <el-option label="MySQL" value="mysql" />
            <el-option label="PostgreSQL" value="postgresql" />
            <el-option label="Oracle" value="oracle" />
            <el-option label="MongoDB" value="mongodb" />
            <el-option label="SQL Server" value="sqlserver" />
            <el-option label="Redis" value="redis" />
          </el-select>
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="16">
            <el-form-item label="主机地址" prop="host">
              <el-input
                v-model="formData.host"
                placeholder="例如：192.168.1.100"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="端口" prop="port">
              <el-input
                v-model="formData.port"
                placeholder="3306"
                size="large"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="数据库名" prop="database">
          <el-input
            v-model="formData.database"
            placeholder="请输入数据库名"
            size="large"
          />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="formData.username"
                placeholder="请输入用户名"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="handleTestConnection" :loading="testing">
          测试连接
        </el-button>
        <div style="flex: 1"></div>
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEditMode ? '保存' : '创建' }}
        </el-button>
      </template>
    </CommonModal>

  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonModal from '@/components/CommonModal.vue'
import {
  getConnections,
  createConnection,
  updateConnection,
  deleteConnection as deleteConnectionApi,
  testConnection as testConnectionApi,
  testConnectionConfig
} from '@/api/dataset'

const modalVisible = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const testing = ref(false)
const formRef = ref(null)
const editingConnectionId = ref(null)
const loading = ref(false)

// 表单数据
const formData = reactive({
  name: '',
  type: 'mysql',
  host: '',
  port: '3306',
  database: '',
  username: '',
  password: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入连接名称', trigger: 'blur' },
    { min: 2, max: 50, message: '连接名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择数据库类型', trigger: 'change' }
  ],
  host: [
    { required: true, message: '请输入主机地址', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口', trigger: 'blur' }
  ],
  database: [
    { required: true, message: '请输入数据库名', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 默认端口映射
const defaultPorts = {
  mysql: '3306',
  postgresql: '5432',
  oracle: '1521',
  mongodb: '27017',
  sqlserver: '1433',
  redis: '6379'
}

// 数据库类型显示名称
const dbTypeNames = {
  mysql: 'MySQL 8.0',
  postgresql: 'PostgreSQL 14',
  oracle: 'Oracle 11g',
  mongodb: 'MongoDB 5.0',
  sqlserver: 'SQL Server 2019',
  redis: 'Redis 7.0'
}

// 监听数据库类型变化，自动更新端口
watch(() => formData.type, (newType) => {
  if (!isEditMode.value) {
    formData.port = defaultPorts[newType] || '3306'
  }
})

// 连接数据
const connections = ref([])

// 加载连接列表
const loadConnections = async () => {
  try {
    loading.value = true
    const data = await getConnections()
    connections.value = data.map(conn => ({
      ...conn,
      dbType: dbTypeNames[conn.type] || conn.type,
      host: `${conn.host}:${conn.port}`,
      usedByDatasets: 0 // TODO: 从后端获取
    }))
  } catch (error) {
    console.error('加载连接列表失败:', error)
    ElMessage.error('加载连接列表失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadConnections()
})

const getDbIcon = (type) => {
  const icons = {
    mysql: 'My',
    oracle: 'Ora',
    postgresql: 'PG',
    mongodb: 'Mo'
  }
  return icons[type] || 'DB'
}

const getDbColor = (type) => {
  const colors = {
    mysql: '#409eff',
    oracle: '#f56c6c',
    postgresql: '#409eff',
    mongodb: '#67c23a'
  }
  return colors[type] || '#909399'
}

// 打开新建连接模态框
const handleCreateConnection = () => {
  isEditMode.value = false
  editingConnectionId.value = null
  resetForm()
  modalVisible.value = true
}

// 打开编辑连接模态框
const editConnection = (conn) => {
  isEditMode.value = true
  editingConnectionId.value = conn.id
  formData.name = conn.name
  formData.type = conn.type
  formData.host = conn.host.split(':')[0]
  formData.port = String(conn.port || conn.host.split(':')[1] || defaultPorts[conn.type])
  formData.database = conn.database || ''
  formData.username = conn.username || ''
  formData.password = '' // 不回显密码
  modalVisible.value = true
}

// 关闭模态框
const closeModal = () => {
  modalVisible.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.type = 'mysql'
  formData.host = ''
  formData.port = '3306'
  formData.database = ''
  formData.username = ''
  formData.password = ''
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 测试连接
const handleTestConnection = async () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('请填写完整的连接信息')
      return
    }

    testing.value = true

    try {
      const config = {
        name: formData.name,
        type: formData.type,
        host: formData.host,
        port: parseInt(formData.port),
        database: formData.database,
        username: formData.username,
        password: formData.password
      }

      const result = await testConnectionConfig(config)
      if (result.success) {
        ElMessage.success('连接测试成功！')
      } else {
        ElMessage.error(result.message || '连接测试失败，请检查配置')
      }
    } catch (error) {
      console.error('测试连接失败:', error)
      ElMessage.error('连接测试失败，请检查配置')
    } finally {
      testing.value = false
    }
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true

    try {
      const data = {
        name: formData.name,
        type: formData.type,
        host: formData.host,
        port: parseInt(formData.port),
        database: formData.database,
        username: formData.username,
        password: formData.password
      }

      if (isEditMode.value) {
        // 编辑模式
        await updateConnection(editingConnectionId.value, data)
        ElMessage.success(`连接 "${formData.name}" 已更新`)
      } else {
        // 新建模式
        await createConnection(data)
        ElMessage.success(`连接 "${formData.name}" 创建成功`)
      }

      // 重新加载连接列表
      await loadConnections()
      closeModal()
    } catch (error) {
      console.error('保存连接失败:', error)
      ElMessage.error('保存连接失败')
    } finally {
      submitting.value = false
    }
  })
}

// 测试连接（卡片按钮）
const testConnection = async (conn) => {
  const loadingMsg = ElMessage.loading('正在测试连接...')

  try {
    const result = await testConnectionApi(conn.id)
    loadingMsg.close()

    if (result.success) {
      conn.status = 'connected'
      ElMessage.success(`连接 "${conn.name}" 测试成功`)
      // 重新加载以更新状态
      await loadConnections()
    } else {
      conn.status = 'error'
      ElMessage.error(result.message || `连接 "${conn.name}" 测试失败`)
    }
  } catch (error) {
    loadingMsg.close()
    console.error('测试连接失败:', error)
    conn.status = 'error'
    ElMessage.error(`连接 "${conn.name}" 测试失败`)
  }
}

// 删除连接
const deleteConnection = async (conn) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除连接 "${conn.name}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteConnectionApi(conn.id)
    ElMessage.success('连接已删除')
    // 重新加载连接列表
    await loadConnections()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除连接失败:', error)
      ElMessage.error('删除连接失败')
    }
  }
}
</script>

<style scoped>
.connection-management {
  min-height: 100vh;
  background: #0f1014;
  color: #e5e5e5;
}

/* 页面头部 */
.page-header {
  height: 80px;
  border-bottom: 1px solid #303033;
  background: #18181c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #e5e5e5;
}

.page-subtitle {
  font-size: 13px;
  color: #909399;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: 0.2s;
}

.btn svg {
  flex-shrink: 0;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-primary:hover {
  background: #66b1ff;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #444;
  color: #ccc;
}

.btn-secondary:hover {
  border-color: #666;
  color: white;
}

.btn-danger {
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
}

.btn-danger:hover {
  background: #ef4444;
  color: white;
}

/* 内容区域 */
.content-area {
  padding: 32px;
}

/* 连接卡片网格 */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.conn-card {
  background: #1e1e20;
  border: 1px solid #303033;
  border-radius: 8px;
  padding: 24px;
  transition: all 0.2s;
  position: relative;
}

.conn-card:hover {
  border-color: #555;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.conn-card.conn-error {
  border-color: rgba(245, 108, 108, 0.3);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.db-logo {
  width: 48px;
  height: 48px;
  background: #2c2c30;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #ccc;
  font-size: 16px;
}

.status-badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
  border: 1px solid rgba(103, 194, 58, 0.2);
  height: fit-content;
}

.status-badge.error {
  background: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
  border-color: rgba(245, 108, 108, 0.2);
}

.card-info h3 {
  margin: 0 0 6px 0;
  font-size: 16px;
  color: white;
  font-weight: 600;
}

.card-info p {
  margin: 0;
  font-size: 13px;
  color: #666;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

.card-meta {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

.card-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.card-actions .btn {
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
  justify-content: center;
}

/* 新建连接卡片 */
.conn-card-new {
  border-style: dashed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 220px;
}

.conn-card-new:hover {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.new-icon {
  font-size: 32px;
  color: #666;
  margin-bottom: 12px;
}

.new-text {
  font-size: 14px;
  color: #888;
}
</style>
