<template>
  <div class="datasource-management">
    <!-- 头部区域 -->
    <PageHeader
      title="数据连接"
      description="管理数据库、文件和 API 连接,为大屏提供数据支持。"
      :actions="[
        { text: '新建连接', icon: 'Plus', type: 'primary', handler: () => openModal() }
      ]"
    />

    <!-- 分类筛选 -->
    <div class="datasource-filter">
      <div
        v-for="filter in filters"
        :key="filter.id"
        :class="['datasource-filter-item', { active: activeFilter === filter.id }]"
        @click="activeFilter = filter.id"
      >
        {{ filter.label }} ({{ getCount(filter.id) }})
      </div>
    </div>

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
                <a-button size="small" @click="previewFile(ds)">预览数据</a-button>
                <a-button size="small" @click="reuploadFile(ds)">重新上传</a-button>
              </template>
              <template v-else>
                <a-button size="small" @click="testConnection(ds)">
                  {{ ds.status === 'connected' ? '测试连接' : '重试' }}
                </a-button>
                <a-button size="small" @click="editDatasource(ds)">编辑</a-button>
              </template>
              <a-button size="small" danger @click="deleteDatasource(ds)">删除</a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 本地文件与静态数据 -->
      <div v-if="filteredFiles.length > 0" class="category-section">
        <div class="section-title">
          本地文件与静态数据 <span class="section-badge">Excel / CSV / JSON</span>
          <a-button size="small" type="primary" plain @click="openJsonModal" style="margin-left: auto;">
            <PlusOutlined />
            添加 JSON
          </a-button>
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
              <a-button size="small" @click="previewFile(ds)">预览数据</a-button>
              <a-button size="small" @click="reuploadFile(ds)">重新上传</a-button>
              <a-button size="small" danger @click="deleteDatasource(ds)">删除</a-button>
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
              <a-button size="small" @click="testConnection(ds)">测试请求</a-button>
              <a-button size="small" @click="editDatasource(ds)">编辑</a-button>
              <a-button size="small" danger @click="deleteDatasource(ds)">删除</a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <a-empty
        v-if="hasNoDatasources"
        description="暂无数据源"
      />
    </div>

    <!-- Modal (保持原样逻辑，样式微调适配 Element Plus) -->
    <a-modal
      v-model:value="modalOpen"
      :title="editingDs ? '编辑连接' : '新建连接'"
      width="600px"
    >
      <div class="modal-body">
        <a-form :model="formData" label-position="top">
          <!-- Type Selector -->
          <a-form-item label="选择数据源类型">
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
          </a-form-item>

          <!-- Name -->
          <a-form-item label="显示名称">
            <a-input v-model:value="formData.name" placeholder="例如：生产主库" />
          </a-form-item>

          <!-- Host & Port -->
          <div class="form-grid">
            <a-form-item label="主机地址 (Host)">
              <a-input v-model:value="formData.host" placeholder="127.0.0.1" />
            </a-form-item>
            <a-form-item label="端口 (Port)">
              <a-input v-model:value="formData.port" :placeholder="getDefaultPort(formData.type)" />
            </a-form-item>
          </div>

          <!-- Database -->
          <a-form-item v-if="formData.type !== 'api'" label="数据库名 (Database)">
            <a-input v-model:value="formData.database" placeholder="nocoviz_db" />
          </a-form-item>

          <!-- Username & Password -->
          <div v-if="formData.type !== 'api'" class="form-grid">
            <a-form-item label="用户名">
              <a-input v-model:value="formData.username" />
            </a-form-item>
            <a-form-item label="密码">
              <a-input v-model:value="formData.password" type="password" show-password />
            </a-form-item>
          </div>

          <!-- Advanced Config -->
          <div class="advanced-toggle" @click="showAdvanced = !showAdvanced">
            <SettingOutlined /> 高级配置 (连接池)
            <ArrowDownOutlined :class="{ 'is-rotated': showAdvanced }" />
          </div>
          
          <div v-show="showAdvanced" class="advanced-panel">
            <div class="form-grid">
              <a-form-item label="最大连接数">
                <a-input-number v-model:value="formData.maxActive" :min="1" />
              </a-form-item>
              <a-form-item label="空闲超时 (ms)">
                <a-input-number v-model:value="formData.idleTimeout" :step="1000" />
              </a-form-item>
            </div>
            <div class="tip-text">注意：私有化部署环境下，请根据数据库负载能力谨慎调整。</div>
          </div>
        </a-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="modalOpen = false">取消</a-button>
          <a-button type="primary" plain @click="testConnectionInModal">测试连接</a-button>
          <a-button type="primary" @click="saveDatasource">保存</a-button>
        </span>
      </template>
    </a-modal>

    <!-- JSON 配置弹窗 -->
    <a-modal
      v-model:value="jsonModalOpen"
      title="添加 JSON 数据源"
      width="800px"
    >
      <div class="json-modal-body">
        <!-- 输入区 -->
        <div class="json-input-section">
          <div class="section-label">粘贴 JSON 数据</div>
          <textarea
            v-model:value="jsonInput"
            class="json-textarea"
            placeholder='{"status": 200, "data": {"items": [{"id": 1, "name": "张三"}]}}'
            @input="validateJson"
          ></textarea>
          <div v-if="jsonError" class="error-message">{{ jsonError }}</div>
        </div>

        <!-- 配置区 -->
        <div class="json-config-section">
          <a-form :model="jsonFormData" label-position="top">
            <a-form-item label="数据源名称">
              <a-input
                v-model:value="jsonFormData.name"
                placeholder="例如: 2025_用户列表.json"
              />
            </a-form-item>
            <a-form-item label="数据路径 (JSONPath)">
              <a-input
                v-model:value="jsonFormData.jsonPath"
                placeholder="例如: data.items (留空表示根路径)"
              >
                <template #prepend>$.</template>
              </a-input>
              <div class="tip-text">支持嵌套路径提取,如: data.items 或 response.data.list</div>
            </a-form-item>
          </a-form>
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
          <a-button @click="jsonModalOpen = false">取消</a-button>
          <a-button type="primary" @click="saveJsonDatasource">保存</a-button>
        </span>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, SettingOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

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
    message.success(`${ds.name} 连接测试成功`)
  } else {
    message.error(`${ds.name} 连接测试失败，请检查配置`)
  }
}

const testConnectionInModal = () => {
  message.info('正在测试连接...')
  setTimeout(() => {
    message.success('连接测试成功')
  }, 1000)
}

const saveDatasource = () => {
  if (!formData.value.name) {
    message.warning('请输入显示名称')
    return
  }
  if (!formData.value.host && formData.value.type !== 'file') {
    message.warning('请输入主机地址')
    return
  }
  message.success(editingDs.value ? '连接配置已更新' : '连接创建成功')
  modalOpen.value = false
}

const deleteDatasource = (ds) => {
  Modal.confirm(`确定删除连接 "${ds.name}"？`, '确认删除', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  }).then(() => {
    message.success('连接已删除')
  }).catch(() => {})
}

// 文件操作
const previewFile = (ds) => {
  // 跳转到Excel详情页
  router.push(`/datasource/excel/${ds.id}`)
}

const reuploadFile = (ds) => {
  message.info(`重新上传 ${ds.name}`)
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
    message.warning('请输入数据源名称')
    return
  }

  if (!jsonInput.value.trim()) {
    message.warning('请输入 JSON 数据')
    return
  }

  if (jsonPreviewData.value.length === 0) {
    message.warning('无法解析 JSON 数据,请检查格式和路径')
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

  message.success('JSON 数据源已添加')
  jsonModalOpen.value = false
}

// Watch for JSONPath changes to re-validate
watch(() => jsonFormData.value.jsonPath, () => {
  if (jsonInput.value.trim()) {
    validateJson()
  }
})
</script>

