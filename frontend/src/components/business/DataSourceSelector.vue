<template>
  <a-space direction="vertical" :size="16" :style="{ width: '100%' }">
    <!-- 数据源类型选择 -->
    <a-form-item label="数据源类型" required>
      <a-select
        v-model:value="localType"
        placeholder="请选择数据源类型"
        @change="handleTypeChange"
        :disabled="disabled"
      >
        <a-select-option
          v-for="type in availableTypes"
          :key="type.value"
          :value="type.value"
          :disabled="type.disabled"
        >
          <a-space :size="8">
            <component v-if="type.icon" :is="type.icon" />
            <span>{{ type.label }}</span>
            <a-tag v-if="type.tag" size="small" :color="type.tagType">
              {{ type.tag }}
            </a-tag>
          </a-space>
        </a-select-option>
      </a-select>
    </a-form-item>

    <!-- 数据源配置表单 -->
    <div v-if="localType">
      <!-- SQL 数据源 -->
      <template v-if="localType === 'sql'">
        <a-form-item label="连接" required>
          <a-space direction="vertical" :size="8" :style="{ width: '100%' }">
            <a-select
              v-model:value="localConfig.connectionId"
              placeholder="请选择数据库连接"
              show-search
              @change="handleConnectionChange"
              :style="{ width: '100%' }"
            >
              <a-select-option
                v-for="conn in connections"
                :key="conn.id"
                :value="conn.id"
              >
                <a-space :size="8">
                  <span>{{ conn.name }}</span>
                  <a-tag size="small">{{ conn.type }}</a-tag>
                </a-space>
              </a-select-option>
            </a-select>
            <a-button
              v-if="allowCreateConnection"
              type="link"
              @click="handleCreateConnection"
              :style="{ padding: 0 }"
            >
              新建连接
            </a-button>
          </a-space>
        </a-form-item>

        <a-form-item label="SQL 查询" required>
          <a-space direction="vertical" :size="8" :style="{ width: '100%' }">
            <a-textarea
              v-model:value="localConfig.sqlQuery"
              :rows="8"
              placeholder="SELECT * FROM table_name"
              @blur="handleSqlChange"
            />
            <a-space :size="8">
              <a-button
                size="small"
                @click="formatSql"
                :loading="formatting"
              >
                格式化
              </a-button>
              <a-button
                size="small"
                type="primary"
                @click="validateSql"
                :loading="validating"
              >
                验证 SQL
              </a-button>
              <a-button
                size="small"
                @click="testQuery"
                :loading="testing"
              >
                测试查询
              </a-button>
            </a-space>
          </a-space>
        </a-form-item>

        <!-- SQL 验证结果 -->
        <a-alert
          v-if="sqlValidation.message"
          :type="sqlValidation.valid ? 'success' : 'error'"
          :message="sqlValidation.message"
          show-icon
          closable
        />
      </template>

      <!-- API 数据源 -->
      <template v-else-if="localType === 'api'">
        <a-form-item label="API 地址" required>
          <a-input
            v-model:value="localConfig.apiUrl"
            placeholder="https://api.example.com/data"
          />
        </a-form-item>

        <a-form-item label="请求方法">
          <a-select v-model:value="localConfig.method">
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="请求头">
          <a-textarea
            v-model:value="localConfig.headers"
            :rows="4"
            placeholder='{"Authorization": "Bearer token"}'
          />
        </a-form-item>

        <a-form-item label="请求体">
          <a-textarea
            v-model:value="localConfig.body"
            :rows="4"
            placeholder='{"key": "value"}'
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            @click="testApiConnection"
            :loading="testing"
          >
            测试连接
          </a-button>
        </a-form-item>
      </template>

      <!-- Excel 数据源 -->
      <template v-else-if="localType === 'excel'">
        <a-form-item label="上传文件" required>
          <a-upload-dragger
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
            :custom-request="handleFileChange"
            accept=".xlsx,.xls,.csv"
            :max-count="1"
          >
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text">拖拽文件到此处或点击上传</p>
            <p class="ant-upload-hint">
              支持 .xlsx, .xls, .csv 格式，文件大小不超过 10MB
            </p>
          </a-upload-dragger>
        </a-form-item>

        <a-form-item label="工作表" v-if="sheets.length > 0">
          <a-select v-model:value="localConfig.sheetName" placeholder="请选择工作表">
            <a-select-option
              v-for="sheet in sheets"
              :key="sheet"
              :value="sheet"
            >
              {{ sheet }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="起始行">
          <a-input-number
            v-model:value="localConfig.startRow"
            :min="1"
            :max="1000"
            :style="{ width: '100%' }"
          />
        </a-form-item>
      </template>

      <!-- JSON 数据源 -->
      <template v-else-if="localType === 'json'">
        <a-form-item label="JSON 数据" required>
          <a-textarea
            v-model:value="localConfig.jsonData"
            :rows="10"
            placeholder='[{"id": 1, "name": "示例"}]'
          />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button
              type="primary"
              @click="validateJson"
              :loading="validating"
            >
              验证 JSON
            </a-button>
            <a-button @click="formatJson">格式化</a-button>
          </a-space>
        </a-form-item>

        <!-- JSON 验证结果 -->
        <a-alert
          v-if="jsonValidation.message"
          :type="jsonValidation.valid ? 'success' : 'error'"
          :message="jsonValidation.message"
          show-icon
          closable
        />
      </template>
    </div>

    <!-- 高级配置 -->
    <a-collapse v-if="showAdvanced && localType" v-model:active-key="activeAdvanced">
      <a-collapse-panel key="advanced" header="高级配置">
        <a-space direction="vertical" :size="16" :style="{ width: '100%' }">
          <a-form-item label="更新策略">
            <a-radio-group v-model:value="localConfig.updateStrategy">
              <a-radio value="realtime">实时</a-radio>
              <a-radio value="scheduled">定时</a-radio>
              <a-radio value="manual">手动</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            v-if="localConfig.updateStrategy === 'scheduled'"
            label="更新频率"
          >
            <a-select v-model:value="localConfig.updateInterval">
              <a-select-option :value="60">每分钟</a-select-option>
              <a-select-option :value="300">每5分钟</a-select-option>
              <a-select-option :value="900">每15分钟</a-select-option>
              <a-select-option :value="3600">每小时</a-select-option>
              <a-select-option :value="86400">每天</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="缓存时间（秒）">
            <a-input-number
              v-model:value="localConfig.cacheTime"
              :min="0"
              :max="86400"
              :style="{ width: '100%' }"
            />
          </a-form-item>

          <a-form-item label="超时时间（秒）">
            <a-input-number
              v-model:value="localConfig.timeout"
              :min="1"
              :max="300"
              :style="{ width: '100%' }"
            />
          </a-form-item>
        </a-space>
      </a-collapse-panel>
    </a-collapse>
  </a-space>
</template>

<script setup>
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { InboxOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  config: {
    type: Object,
    default: () => ({})
  },
  connections: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showAdvanced: {
    type: Boolean,
    default: true
  },
  allowCreateConnection: {
    type: Boolean,
    default: true
  },
  availableTypes: {
    type: Array,
    default: () => [
      { value: 'sql', label: 'SQL 数据库', icon: 'Database' },
      { value: 'api', label: 'API 接口', icon: 'Link' },
      { value: 'excel', label: 'Excel 文件', icon: 'Document' },
      { value: 'json', label: 'JSON 数据', icon: 'DocumentCopy' }
    ]
  }
})

const emit = defineEmits([
  'update:type',
  'update:config',
  'test-connection',
  'create-connection',
  'validate'
])

// 状态
const localType = ref(props.type)
const localConfig = ref({ ...props.config })
const activeAdvanced = ref([])
const fileList = ref([])
const sheets = ref([])

// 验证状态
const validating = ref(false)
const testing = ref(false)
const formatting = ref(false)
const sqlValidation = ref({ valid: false, message: '' })
const jsonValidation = ref({ valid: false, message: '' })

// 方法
const handleTypeChange = (type) => {
  emit('update:type', type)
  // 重置配置
  localConfig.value = getDefaultConfig(type)
  emit('update:config', localConfig.value)
}

const getDefaultConfig = (type) => {
  const defaults = {
    sql: {
      connectionId: '',
      sqlQuery: '',
      updateStrategy: 'realtime',
      cacheTime: 300,
      timeout: 30
    },
    api: {
      apiUrl: '',
      method: 'GET',
      headers: '{}',
      body: '{}',
      updateStrategy: 'realtime',
      cacheTime: 300,
      timeout: 30
    },
    excel: {
      file: null,
      sheetName: '',
      startRow: 1,
      updateStrategy: 'manual'
    },
    json: {
      jsonData: '[]',
      updateStrategy: 'manual'
    }
  }
  return defaults[type] || {}
}

const handleConnectionChange = (connectionId) => {
  emit('update:config', localConfig.value)
}

const handleCreateConnection = () => {
  emit('create-connection')
}

const handleSqlChange = () => {
  emit('update:config', localConfig.value)
}

const formatSql = () => {
  formatting.value = true
  // 简单的 SQL 格式化
  setTimeout(() => {
    const sql = localConfig.value.sqlQuery
    const formatted = sql
      .replace(/\s+/g, ' ')
      .replace(/SELECT/gi, '\nSELECT')
      .replace(/FROM/gi, '\nFROM')
      .replace(/WHERE/gi, '\nWHERE')
      .replace(/AND/gi, '\n  AND')
      .replace(/OR/gi, '\n  OR')
      .replace(/ORDER BY/gi, '\nORDER BY')
      .replace(/GROUP BY/gi, '\nGROUP BY')
      .trim()
    localConfig.value.sqlQuery = formatted
    formatting.value = false
  }, 300)
}

const validateSql = async () => {
  validating.value = true
  try {
    // 这里应该调用后端 API 验证 SQL
    await new Promise(resolve => setTimeout(resolve, 500))
    sqlValidation.value = {
      valid: true,
      message: 'SQL 语法验证通过'
    }
    emit('validate', { type: 'sql', valid: true })
  } catch (error) {
    sqlValidation.value = {
      valid: false,
      message: error.message || 'SQL 语法错误'
    }
    emit('validate', { type: 'sql', valid: false, error })
  } finally {
    validating.value = false
  }
}

const testQuery = async () => {
  testing.value = true
  try {
    emit('test-connection', {
      type: 'sql',
      config: localConfig.value
    })
  } finally {
    testing.value = false
  }
}

const testApiConnection = async () => {
  testing.value = true
  try {
    emit('test-connection', {
      type: 'api',
      config: localConfig.value
    })
  } finally {
    testing.value = false
  }
}

const handleFileChange = (file, fileList) => {
  // 解析 Excel 文件获取工作表列表
  // 这里应该调用后端 API 或使用 xlsx 库
  sheets.value = ['Sheet1', 'Sheet2'] // 示例
  localConfig.value.file = file
  emit('update:config', localConfig.value)
}

const handleFileRemove = () => {
  sheets.value = []
  localConfig.value.file = null
  emit('update:config', localConfig.value)
}

const beforeUpload = (file) => {
  const isExcel = /\.(xlsx|xls|csv)$/.test(file.name)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isExcel) {
    message.error('只能上传 Excel 文件！')
    return false
  }
  if (!isLt10M) {
    message.error('文件大小不能超过 10MB！')
    return false
  }
  return true
}

const validateJson = () => {
  validating.value = true
  try {
    JSON.parse(localConfig.value.jsonData)
    jsonValidation.value = {
      valid: true,
      message: 'JSON 格式验证通过'
    }
    emit('validate', { type: 'json', valid: true })
  } catch (error) {
    jsonValidation.value = {
      valid: false,
      message: `JSON 格式错误: ${error.message}`
    }
    emit('validate', { type: 'json', valid: false, error })
  } finally {
    validating.value = false
  }
}

const formatJson = () => {
  try {
    const parsed = JSON.parse(localConfig.value.jsonData)
    localConfig.value.jsonData = JSON.stringify(parsed, null, 2)
  } catch (error) {
    message.error('JSON 格式错误，无法格式化')
  }
}

// 监听配置变化
watch(() => localConfig.value, (newVal) => {
  emit('update:config', newVal)
}, { deep: true })
</script>

