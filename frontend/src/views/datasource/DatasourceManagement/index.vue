<template>
  <div class="datasource-management">
    <!-- 头部区域 -->
    <header class="library-header">
      <div class="header-top">
        <div class="header-title">
          <h1>数据连接</h1>
          <p>管理数据库、文件和 API 连接,为大屏提供数据支持。</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" class="btn-primary" @click="openModal()">
            <el-icon><Plus /></el-icon>
            新建连接
          </el-button>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="filter-bar">
        <div
          v-for="filter in filters"
          :key="filter.id"
          :class="['filter-item', { active: activeFilter === filter.id }]"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }} ({{ getCount(filter.id) }})
        </div>
      </div>
    </header>

    <!-- 滚动列表 -->
    <div class="datasource-scroll">
      <!-- 数据库 -->
      <div v-if="filteredDatabase.length > 0" class="category-section">
        <div class="section-title">
          数据库连接 <span class="section-badge">Database</span>
        </div>
        <div class="datasource-grid">
          <div
            v-for="ds in filteredDatabase"
            :key="ds.id"
            class="ds-card"
          >
            <!-- Card Header -->
            <div class="ds-header">
              <div class="ds-icon-box" :class="getIconClass(ds.type)">
                {{ getIconText(ds.type) }}
              </div>
              <div class="ds-status" :class="ds.status === 'connected' ? 'status-success' : 'status-error'">
                <span class="dot"></span>
                {{ ds.status === 'connected' ? '连接正常' : '连接失败' }}
              </div>
            </div>

            <!-- Card Body -->
            <div class="ds-body">
              <div class="ds-name">{{ ds.name }}</div>

              <!-- 文件类型特殊显示 -->
              <div v-if="ds.category === 'file'" class="ds-meta">
                <div class="meta-tags">
                  <span class="meta-tag">{{ ds.fileSize }}</span>
                  <span class="meta-tag">{{ ds.rowCount }} 行</span>
                  <span class="meta-tag">{{ ds.lastUpdate }}</span>
                </div>
              </div>

              <!-- 数据库/API 显示 -->
              <div v-else class="ds-meta">
                <div class="meta-row">
                  <span class="meta-label">类型:</span> {{ ds.typeLabel }}
                </div>
                <div class="meta-row">
                  <span class="meta-label">{{ ds.category === 'api' ? 'URL:' : 'Host:' }}</span> {{ ds.host }}
                </div>
                <div v-if="ds.method" class="meta-row">
                  <span class="meta-label">Method:</span> {{ ds.method }}
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="ds-footer">
              <template v-if="ds.category === 'file'">
                <el-button size="small" @click="previewFile(ds)">预览数据</el-button>
                <el-button size="small" @click="reuploadFile(ds)">重新上传</el-button>
              </template>
              <template v-else>
                <el-button size="small" @click="testConnection(ds)">
                  {{ ds.status === 'connected' ? '测试连接' : '重试' }}
                </el-button>
                <el-button size="small" @click="editDatasource(ds)">编辑</el-button>
              </template>
              <el-button size="small" type="danger" plain @click="deleteDatasource(ds)">删除</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 本地文件与静态数据 -->
      <div v-if="filteredFiles.length > 0" class="category-section">
        <div class="section-title">
          本地文件与静态数据 <span class="section-badge">Excel / CSV / JSON</span>
          <el-button size="small" type="primary" plain @click="openJsonModal" style="margin-left: auto;">
            <el-icon><Plus /></el-icon>
            添加 JSON
          </el-button>
        </div>
        <div class="datasource-grid">
          <div
            v-for="ds in filteredFiles"
            :key="ds.id"
            class="ds-card file-card"
          >
            <!-- Card Header -->
            <div class="ds-header">
              <div class="ds-icon-box" :class="getIconClass(ds.type)">
                {{ getIconText(ds.type) }}
              </div>
              <div class="ds-status status-success">
                <span class="dot"></span>
                有效
              </div>
            </div>

            <!-- Card Body -->
            <div class="ds-body">
              <div class="ds-name">{{ ds.name }}</div>
              <div class="ds-meta">
                <div v-if="ds.type === 'json' && ds.jsonPath" class="meta-row" style="font-family: 'SF Mono', Monaco, monospace; font-size: 11px; color: #94a3b8;">
                  ROOT: {{ ds.jsonPath }}
                </div>
                <div class="meta-tags">
                  <span class="meta-tag">{{ ds.fileSize }}</span>
                  <span class="meta-tag">{{ ds.rowCount }} 行</span>
                  <span class="meta-tag">{{ ds.lastUpdate }}</span>
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="ds-footer">
              <el-button size="small" @click="previewFile(ds)">预览数据</el-button>
              <el-button size="small" @click="reuploadFile(ds)">重新上传</el-button>
              <el-button size="small" type="danger" plain @click="deleteDatasource(ds)">删除</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- API 接口 -->
      <div v-if="filteredApi.length > 0" class="category-section">
        <div class="section-title">
          API 接口 <span class="section-badge">RESTful</span>
        </div>
        <div class="datasource-grid">
          <div
            v-for="ds in filteredApi"
            :key="ds.id"
            class="ds-card api-card"
          >
            <!-- Card Header -->
            <div class="ds-header">
              <div class="ds-icon-box" :class="getIconClass(ds.type)">
                {{ getIconText(ds.type) }}
              </div>
              <div class="ds-status" :class="ds.status === 'connected' ? 'status-success' : 'status-error'">
                <span class="dot"></span>
                {{ ds.status === 'connected' ? '有效' : '无效' }}
              </div>
            </div>

            <!-- Card Body -->
            <div class="ds-body">
              <div class="ds-name">{{ ds.name }}</div>
              <div class="ds-meta">
                <div class="meta-row">
                  <span class="meta-label">类型:</span> {{ ds.typeLabel }}
                </div>
                <div class="meta-row">
                  <span class="meta-label">URL:</span> {{ ds.host }}
                </div>
                <div v-if="ds.method" class="meta-row">
                  <span class="meta-label">Method:</span> {{ ds.method }}
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="ds-footer">
              <el-button size="small" @click="testConnection(ds)">测试请求</el-button>
              <el-button size="small" @click="editDatasource(ds)">编辑</el-button>
              <el-button size="small" type="danger" plain @click="deleteDatasource(ds)">删除</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="hasNoDatasources"
        description="暂无数据源"
      />
    </div>

    <!-- Modal (保持原样逻辑，样式微调适配 Element Plus) -->
    <el-dialog
      v-model="modalOpen"
      :title="editingDs ? '编辑连接' : '新建连接'"
      width="600px"
    >
      <div class="modal-body">
        <el-form :model="formData" label-position="top">
          <!-- Type Selector -->
          <el-form-item label="选择数据源类型">
            <div class="type-selector">
              <div
                v-for="type in dsTypes"
                :key="type.value"
                class="type-item"
                :class="{ selected: formData.type === type.value }"
                @click="formData.type = type.value"
              >
                {{ type.label }}
              </div>
            </div>
          </el-form-item>

          <!-- Name -->
          <el-form-item label="显示名称">
            <el-input v-model="formData.name" placeholder="例如：生产主库" />
          </el-form-item>

          <!-- Host & Port -->
          <div class="form-grid">
            <el-form-item label="主机地址 (Host)">
              <el-input v-model="formData.host" placeholder="127.0.0.1" />
            </el-form-item>
            <el-form-item label="端口 (Port)">
              <el-input v-model="formData.port" :placeholder="getDefaultPort(formData.type)" />
            </el-form-item>
          </div>

          <!-- Database -->
          <el-form-item v-if="formData.type !== 'api'" label="数据库名 (Database)">
            <el-input v-model="formData.database" placeholder="nocoviz_db" />
          </el-form-item>

          <!-- Username & Password -->
          <div v-if="formData.type !== 'api'" class="form-grid">
            <el-form-item label="用户名">
              <el-input v-model="formData.username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="formData.password" type="password" show-password />
            </el-form-item>
          </div>

          <!-- Advanced Config -->
          <div class="advanced-toggle" @click="showAdvanced = !showAdvanced">
            <el-icon><setting /></el-icon> 高级配置 (连接池)
            <el-icon :class="{ 'is-rotated': showAdvanced }"><arrow-down /></el-icon>
          </div>
          
          <div v-show="showAdvanced" class="advanced-panel">
            <div class="form-grid">
              <el-form-item label="最大连接数">
                <el-input-number v-model="formData.maxActive" :min="1" />
              </el-form-item>
              <el-form-item label="空闲超时 (ms)">
                <el-input-number v-model="formData.idleTimeout" :step="1000" />
              </el-form-item>
            </div>
            <div class="tip-text">注意：私有化部署环境下，请根据数据库负载能力谨慎调整。</div>
          </div>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="modalOpen = false">取消</el-button>
          <el-button type="primary" plain @click="testConnectionInModal">测试连接</el-button>
          <el-button type="primary" @click="saveDatasource">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- JSON 配置弹窗 -->
    <el-dialog
      v-model="jsonModalOpen"
      title="添加 JSON 数据源"
      width="800px"
    >
      <div class="json-modal-body">
        <!-- 输入区 -->
        <div class="json-input-section">
          <div class="section-label">粘贴 JSON 数据</div>
          <textarea
            v-model="jsonInput"
            class="json-textarea"
            placeholder='{"status": 200, "data": {"items": [{"id": 1, "name": "张三"}]}}'
            @input="validateJson"
          ></textarea>
          <div v-if="jsonError" class="error-message">{{ jsonError }}</div>
        </div>

        <!-- 配置区 -->
        <div class="json-config-section">
          <el-form :model="jsonFormData" label-position="top">
            <el-form-item label="数据源名称">
              <el-input
                v-model="jsonFormData.name"
                placeholder="例如: 2025_用户列表.json"
              />
            </el-form-item>
            <el-form-item label="数据路径 (JSONPath)">
              <el-input
                v-model="jsonFormData.jsonPath"
                placeholder="例如: data.items (留空表示根路径)"
              >
                <template #prepend>$.</template>
              </el-input>
              <div class="tip-text">支持嵌套路径提取,如: data.items 或 response.data.list</div>
            </el-form-item>
          </el-form>
        </div>

        <!-- 预览区 -->
        <div v-if="jsonPreviewData.length > 0" class="json-preview-section">
          <div class="section-label">数据预览 (已展平)</div>
          <div class="preview-table-wrapper">
            <table class="preview-table">
              <thead>
                <tr>
                  <th v-for="key in jsonPreviewKeys" :key="key">{{ key }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in jsonPreviewData.slice(0, 5)" :key="idx">
                  <td v-for="key in jsonPreviewKeys" :key="key">
                    {{ formatPreviewValue(row[key]) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="tip-text">仅显示前 5 条,共 {{ jsonPreviewData.length }} 条数据</div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="jsonModalOpen = false">取消</el-button>
          <el-button type="primary" @click="saveJsonDatasource">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Setting, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()

// 筛选器配置
const filters = [
  { id: 'all', label: '全部' },
  { id: 'database', label: '数据库' },
  { id: 'api', label: 'API 接口' },
  { id: 'file', label: '本地文件' }
]

const activeFilter = ref('all')
const modalOpen = ref(false)
const editingDs = ref(null)
const showAdvanced = ref(false)

// JSON Modal State
const jsonModalOpen = ref(false)
const jsonInput = ref('')
const jsonError = ref('')
const jsonFormData = ref({
  name: '',
  jsonPath: ''
})
const jsonPreviewData = ref([])
const jsonPreviewKeys = ref([])

// Mock Data
const datasources = ref([
  // Excel/CSV 文件
  {
    id: 1,
    name: '2025Q1_销售总表.xlsx',
    type: 'excel',
    typeLabel: 'Excel',
    host: '本地上传',
    status: 'connected',
    category: 'file',
    fileSize: '2.4 MB',
    rowCount: '12,405',
    lastUpdate: '2025-12-10 更新'
  },
  {
    id: 2,
    name: '设备_IoT_日志.csv',
    type: 'excel',
    typeLabel: 'CSV',
    host: '本地上传',
    status: 'connected',
    category: 'file',
    fileSize: '512 KB',
    rowCount: '5,000',
    lastUpdate: '10分钟前 更新'
  },

  // 数据库连接
  {
    id: 3,
    name: '交易订单主库',
    type: 'mysql',
    typeLabel: 'MySQL 8.0',
    host: '192.168.1.100:3306',
    status: 'connected',
    category: 'database'
  },
  {
    id: 4,
    name: '财务数仓_只读',
    type: 'oracle',
    typeLabel: 'Oracle 11g',
    host: '192.168.1.102:1521',
    status: 'error',
    category: 'database'
  },
  {
    id: 5,
    name: '用户行为日志',
    type: 'postgresql',
    typeLabel: 'PostgreSQL 14',
    host: '10.0.0.5:5432',
    status: 'connected',
    category: 'database'
  },

  // API 接口
  {
    id: 6,
    name: '实时天气服务',
    type: 'api',
    typeLabel: 'RESTful API',
    host: 'https://api.weather.com/v3/now',
    status: 'connected',
    category: 'api',
    method: 'GET'
  }
])

// Form Data
const dsTypes = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'Oracle', value: 'oracle' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'API', value: 'api' }
]

const formData = ref({
  type: 'mysql',
  name: '',
  host: '',
  port: '',
  database: '',
  username: '',
  password: '',
  maxActive: 10,
  idleTimeout: 30000
})

// Helpers
const getCount = (filterValue) => {
  if (filterValue === 'all') return datasources.value.length
  return datasources.value.filter(ds => ds.category === filterValue).length
}

const getIconClass = (type) => {
  const map = {
    mysql: 'icon-mysql',
    oracle: 'icon-oracle',
    postgresql: 'icon-pg',
    api: 'icon-api',
    excel: 'icon-excel',
    json: 'icon-json'
  }
  return map[type] || 'icon-mysql'
}

const getIconText = (type) => {
  const map = {
    mysql: 'SQL',
    oracle: 'ORA',
    postgresql: 'PG',
    api: 'API',
    excel: 'XLS',
    json: 'JSON'
  }
  return map[type] || 'DB'
}

const getDefaultPort = (type) => {
  const map = {
    mysql: '3306',
    oracle: '1521',
    postgresql: '5432',
    api: '80'
  }
  return map[type] || '3306'
}

// Computed Filtering
const filteredDatabase = computed(() => {
  return datasources.value.filter(ds => {
    if (activeFilter.value !== 'all' && ds.category !== activeFilter.value) return false
    return ds.category === 'database'
  })
})

const filteredFiles = computed(() => {
  return datasources.value.filter(ds => {
    if (activeFilter.value !== 'all' && ds.category !== activeFilter.value) return false
    return ds.category === 'file'
  })
})

const filteredApi = computed(() => {
  return datasources.value.filter(ds => {
    if (activeFilter.value !== 'all' && ds.category !== activeFilter.value) return false
    return ds.category === 'api'
  })
})

// 检查是否没有数据源
const hasNoDatasources = computed(() => {
  return filteredDatabase.value.length === 0 &&
         filteredFiles.value.length === 0 &&
         filteredApi.value.length === 0
})

// Actions
const openModal = () => {
  editingDs.value = null
  formData.value = {
    type: 'mysql',
    name: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    maxActive: 10,
    idleTimeout: 30000
  }
  showAdvanced.value = false
  modalOpen.value = true
}

const editDatasource = (ds) => {
  editingDs.value = ds
  formData.value = {
    type: ds.type,
    name: ds.name,
    host: ds.host.split(':')[0],
    port: ds.host.split(':')[1] || getDefaultPort(ds.type),
    database: '',
    username: '',
    password: '',
    maxActive: 10,
    idleTimeout: 30000
  }
  modalOpen.value = true
}

const testConnection = (ds) => {
  if (ds.status === 'connected') {
    ElMessage.success(`${ds.name} 连接测试成功`)
  } else {
    ElMessage.error(`${ds.name} 连接测试失败，请检查配置`)
  }
}

const testConnectionInModal = () => {
  ElMessage.info('正在测试连接...')
  setTimeout(() => {
    ElMessage.success('连接测试成功')
  }, 1000)
}

const saveDatasource = () => {
  if (!formData.value.name) {
    ElMessage.warning('请输入显示名称')
    return
  }
  if (!formData.value.host && formData.value.type !== 'file') {
    ElMessage.warning('请输入主机地址')
    return
  }
  ElMessage.success(editingDs.value ? '连接配置已更新' : '连接创建成功')
  modalOpen.value = false
}

const deleteDatasource = (ds) => {
  ElMessageBox.confirm(`确定删除连接 "${ds.name}"？`, '确认删除', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  }).then(() => {
    ElMessage.success('连接已删除')
  }).catch(() => {})
}

// 文件操作
const previewFile = (ds) => {
  // 跳转到Excel详情页
  router.push(`/datasource/excel/${ds.id}`)
}

const reuploadFile = (ds) => {
  ElMessage.info(`重新上传 ${ds.name}`)
  // TODO: 打开文件上传对话框
}

// ========== JSON 数据源相关 ==========

// 递归展平对象
function flattenObject(obj, prefix = '', res = {}) {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue
    const val = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key

    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      flattenObject(val, newKey, res)
    } else {
      res[newKey] = Array.isArray(val) ? `[Array(${val.length})]` : val
    }
  }
  return res
}

// 简化版 lodash get 函数
function getValueByPath(obj, path) {
  if (!path) return obj
  const keys = path.split('.')
  let result = obj
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key]
    } else {
      return undefined
    }
  }
  return result
}

// 打开 JSON 弹窗
const openJsonModal = () => {
  jsonModalOpen.value = true
  jsonInput.value = ''
  jsonError.value = ''
  jsonFormData.value = {
    name: '',
    jsonPath: ''
  }
  jsonPreviewData.value = []
  jsonPreviewKeys.value = []
}

// 验证并预览 JSON
const validateJson = () => {
  jsonError.value = ''
  jsonPreviewData.value = []
  jsonPreviewKeys.value = []

  if (!jsonInput.value.trim()) return

  try {
    const parsed = JSON.parse(jsonInput.value)

    // 使用 JSONPath 提取数据
    let targetData = jsonFormData.value.jsonPath
      ? getValueByPath(parsed, jsonFormData.value.jsonPath)
      : parsed

    if (!targetData) {
      jsonError.value = '指定的路径不存在'
      return
    }

    // 如果是数组,展平每个元素
    if (Array.isArray(targetData)) {
      const flattened = targetData.map(item => {
        if (typeof item === 'object' && item !== null) {
          return flattenObject(item)
        }
        return { value: item }
      })

      jsonPreviewData.value = flattened

      // 收集所有键
      const allKeys = new Set()
      flattened.forEach(row => {
        Object.keys(row).forEach(k => allKeys.add(k))
      })
      jsonPreviewKeys.value = Array.from(allKeys)
    } else if (typeof targetData === 'object' && targetData !== null) {
      // 如果是对象,展平后作为单行
      const flattened = flattenObject(targetData)
      jsonPreviewData.value = [flattened]
      jsonPreviewKeys.value = Object.keys(flattened)
    } else {
      jsonError.value = '提取的数据必须是对象或数组'
    }
  } catch (e) {
    jsonError.value = `JSON 格式错误: ${e.message}`
  }
}

// 格式化预览值
const formatPreviewValue = (val) => {
  if (val === null || val === undefined) return '-'
  if (typeof val === 'string' && val.startsWith('[Array(')) return val
  if (typeof val === 'string') return val.length > 30 ? val.slice(0, 30) + '...' : val
  return String(val)
}

// 保存 JSON 数据源
const saveJsonDatasource = () => {
  if (!jsonFormData.value.name) {
    ElMessage.warning('请输入数据源名称')
    return
  }

  if (!jsonInput.value.trim()) {
    ElMessage.warning('请输入 JSON 数据')
    return
  }

  if (jsonPreviewData.value.length === 0) {
    ElMessage.warning('无法解析 JSON 数据,请检查格式和路径')
    return
  }

  // 添加到数据源列表
  const newId = Math.max(...datasources.value.map(d => d.id)) + 1
  datasources.value.push({
    id: newId,
    name: jsonFormData.value.name,
    type: 'json',
    typeLabel: 'JSON',
    host: '本地上传',
    status: 'connected',
    category: 'file',
    fileSize: `${(jsonInput.value.length / 1024).toFixed(1)} KB`,
    rowCount: String(jsonPreviewData.value.length),
    lastUpdate: '刚刚更新',
    jsonPath: jsonFormData.value.jsonPath || '(根路径)'
  })

  ElMessage.success('JSON 数据源已添加')
  jsonModalOpen.value = false
}

// Watch for JSONPath changes to re-validate
watch(() => jsonFormData.value.jsonPath, () => {
  if (jsonInput.value.trim()) {
    validateJson()
  }
})
</script>

<style scoped>
/* =========================================
   全局样式 (Consistent with TemplateLibrary)
   ========================================= */
.datasource-management {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-bg-color);
}

/* Header Area */
.library-header {
  padding: 30px 40px;
  background: linear-gradient(180deg, rgba(64, 158, 255, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid var(--el-border-color);
  flex-shrink: 0;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-title h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.header-title p {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  max-width: 600px;
  line-height: 1.5;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 30px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  padding-bottom: 2px;
}

.filter-item {
  padding-bottom: 12px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.filter-item:hover {
  color: var(--el-text-color-primary);
}

.filter-item.active {
  color: var(--el-color-primary);
  font-weight: 600;
}

.filter-item.active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--el-color-primary);
}

/* Scroll Area */
.datasource-scroll {
  flex: 1;
  padding: 30px 40px;
  overflow-y: auto;
}

.category-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);
}

.section-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
  font-weight: 400;
}

.datasource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* Datasource Card */
.ds-card {
  background: #1e2229;
  border: 1px solid #303640;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
}

.ds-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* 文件卡片左边框 */
.file-card {
  border-left: 3px solid #10b981;
}

/* API 卡片左边框 */
.api-card {
  border-left: 3px solid #3b82f6;
}

/* 数据库卡片悬停 */
.ds-card:not(.file-card):not(.api-card):hover {
  border-color: #409eff;
}

.ds-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.ds-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.icon-mysql {
  color: #fff;
  background: linear-gradient(135deg, #00758f 0%, #00a8cc 100%);
}
.icon-oracle {
  color: #fff;
  background: linear-gradient(135deg, #f80000 0%, #ff4444 100%);
}
.icon-pg {
  color: #fff;
  background: linear-gradient(135deg, #336791 0%, #4a90c7 100%);
}
.icon-api {
  color: #fff;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}
.icon-excel {
  color: #fff;
  background: linear-gradient(135deg, #217346 0%, #2ea662 100%);
}
.icon-json {
  color: #fff;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.ds-status {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-success { color: #10b981; background: rgba(16, 185, 129, 0.1); }
.status-error { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
.dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.ds-body {
  flex: 1;
  margin-bottom: 20px;
}

.ds-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.ds-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-row {
  display: flex;
  gap: 8px;
}

.meta-label {
  color: var(--el-text-color-placeholder);
}

/* 文件元数据标签 */
.meta-tags {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.meta-tag {
  font-size: 11px;
  color: #94a3b8;
  background: rgba(100, 116, 139, 0.1);
  padding: 4px 10px;
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  border: 1px solid rgba(100, 116, 139, 0.2);
}

.ds-footer {
  display: flex;
  gap: 8px;
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 16px;
  justify-content: flex-end;
}

/* Modal Styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.type-selector {
  display: flex;
  gap: 12px;
  width: 100%;
}

.type-item {
  flex: 1;
  border: 1px solid var(--el-border-color);
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  font-size: 13px;
  transition: 0.2s;
  color: var(--el-text-color-regular);
}

.type-item:hover,
.type-item.selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.advanced-toggle {
  font-size: 13px;
  color: var(--el-color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
}

.advanced-panel {
  background: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.tip-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}

.is-rotated {
  transform: rotate(180deg);
  transition: transform 0.3s;
}

/* Scrollbar */
.datasource-scroll::-webkit-scrollbar {
  width: 6px;
}

.datasource-scroll::-webkit-scrollbar-thumb {
  background: var(--el-fill-color-darker);
  border-radius: 3px;
}

.datasource-scroll::-webkit-scrollbar-track {
  background: transparent;
}

/* JSON Modal Styles */
.json-modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 600px;
  overflow-y: auto;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.json-input-section {
  display: flex;
  flex-direction: column;
}

.json-textarea {
  width: 100%;
  min-height: 150px;
  padding: 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  font-size: 12px;
  resize: vertical;
  background: #1e2229;
  color: var(--el-text-color-primary);
}

.json-textarea:focus {
  outline: none;
  border-color: var(--el-color-primary);
}

.error-message {
  color: var(--el-color-error);
  font-size: 12px;
  margin-top: 6px;
}

.json-config-section {
  background: var(--el-fill-color-light);
  border-radius: 6px;
  padding: 16px;
}

.json-preview-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-table-wrapper {
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  overflow: auto;
  max-height: 300px;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  background: #1e2229;
}

.preview-table thead {
  position: sticky;
  top: 0;
  background: #2a3039;
  z-index: 1;
}

.preview-table th {
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--el-border-color);
  color: var(--el-text-color-primary);
  white-space: nowrap;
}

.preview-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.preview-table tbody tr:hover {
  background: rgba(64, 158, 255, 0.05);
}
</style>