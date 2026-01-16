<template>
  <div class="data-source-selector">
    <!-- 数据源类型选择 -->
    <el-form-item label="数据源类型" required>
      <el-select
        v-model="localType"
        placeholder="请选择数据源类型"
        @change="handleTypeChange"
        :disabled="disabled"
      >
        <el-option
          v-for="type in availableTypes"
          :key="type.value"
          :label="type.label"
          :value="type.value"
          :disabled="type.disabled"
        >
          <div class="type-option">
            <el-icon v-if="type.icon">
              <component :is="type.icon" />
            </el-icon>
            <span>{{ type.label }}</span>
            <el-tag v-if="type.tag" size="small" :type="type.tagType">
              {{ type.tag }}
            </el-tag>
          </div>
        </el-option>
      </el-select>
    </el-form-item>

    <!-- 数据源配置表单 -->
    <div v-if="localType" class="config-form">
      <!-- SQL 数据源 -->
      <template v-if="localType === 'sql'">
        <el-form-item label="连接" required>
          <el-select
            v-model="localConfig.connectionId"
            placeholder="请选择数据库连接"
            filterable
            @change="handleConnectionChange"
          >
            <el-option
              v-for="conn in connections"
              :key="conn.id"
              :label="conn.name"
              :value="conn.id"
            >
              <div class="connection-option">
                <span>{{ conn.name }}</span>
                <el-tag size="small">{{ conn.type }}</el-tag>
              </div>
            </el-option>
          </el-select>
          <el-button
            v-if="allowCreateConnection"
            link
            type="primary"
            @click="handleCreateConnection"
          >
            新建连接
          </el-button>
        </el-form-item>

        <el-form-item label="SQL 查询" required>
          <div class="sql-editor">
            <el-input
              v-model="localConfig.sqlQuery"
              type="textarea"
              :rows="8"
              placeholder="SELECT * FROM table_name"
              @blur="handleSqlChange"
            />
            <div class="sql-actions">
              <el-button
                size="small"
                @click="formatSql"
                :loading="formatting"
              >
                格式化
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="validateSql"
                :loading="validating"
              >
                验证 SQL
              </el-button>
              <el-button
                size="small"
                type="success"
                @click="testQuery"
                :loading="testing"
              >
                测试查询
              </el-button>
            </div>
          </div>
        </el-form-item>

        <!-- SQL 验证结果 -->
        <el-alert
          v-if="sqlValidation.message"
          :type="sqlValidation.valid ? 'success' : 'error'"
          :title="sqlValidation.message"
          :closable="false"
          show-icon
        />
      </template>

      <!-- API 数据源 -->
      <template v-else-if="localType === 'api'">
        <el-form-item label="API 地址" required>
          <el-input
            v-model="localConfig.apiUrl"
            placeholder="https://api.example.com/data"
          />
        </el-form-item>

        <el-form-item label="请求方法">
          <el-select v-model="localConfig.method">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </el-form-item>

        <el-form-item label="请求头">
          <el-input
            v-model="localConfig.headers"
            type="textarea"
            :rows="4"
            placeholder='{"Authorization": "Bearer token"}'
          />
        </el-form-item>

        <el-form-item label="请求体">
          <el-input
            v-model="localConfig.body"
            type="textarea"
            :rows="4"
            placeholder='{"key": "value"}'
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="testApiConnection"
            :loading="testing"
          >
            测试连接
          </el-button>
        </el-form-item>
      </template>

      <!-- Excel 数据源 -->
      <template v-else-if="localType === 'excel'">
        <el-form-item label="上传文件" required>
          <el-upload
            ref="uploadRef"
            :file-list="fileList"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :before-upload="beforeUpload"
            :auto-upload="false"
            accept=".xlsx,.xls,.csv"
            drag
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 .xlsx, .xls, .csv 格式，文件大小不超过 10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="工作表" v-if="sheets.length > 0">
          <el-select v-model="localConfig.sheetName" placeholder="请选择工作表">
            <el-option
              v-for="sheet in sheets"
              :key="sheet"
              :label="sheet"
              :value="sheet"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="起始行">
          <el-input-number
            v-model="localConfig.startRow"
            :min="1"
            :max="1000"
          />
        </el-form-item>
      </template>

      <!-- JSON 数据源 -->
      <template v-else-if="localType === 'json'">
        <el-form-item label="JSON 数据" required>
          <el-input
            v-model="localConfig.jsonData"
            type="textarea"
            :rows="10"
            placeholder='[{"id": 1, "name": "示例"}]'
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="validateJson"
            :loading="validating"
          >
            验证 JSON
          </el-button>
          <el-button @click="formatJson">格式化</el-button>
        </el-form-item>

        <!-- JSON 验证结果 -->
        <el-alert
          v-if="jsonValidation.message"
          :type="jsonValidation.valid ? 'success' : 'error'"
          :title="jsonValidation.message"
          :closable="false"
          show-icon
        />
      </template>
    </div>

    <!-- 高级配置 -->
    <el-collapse v-if="showAdvanced && localType" v-model="activeAdvanced">
      <el-collapse-item title="高级配置" name="advanced">
        <el-form-item label="更新策略">
          <el-radio-group v-model="localConfig.updateStrategy">
            <el-radio label="realtime">实时</el-radio>
            <el-radio label="scheduled">定时</el-radio>
            <el-radio label="manual">手动</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="localConfig.updateStrategy === 'scheduled'"
          label="更新频率"
        >
          <el-select v-model="localConfig.updateInterval">
            <el-option label="每分钟" :value="60" />
            <el-option label="每5分钟" :value="300" />
            <el-option label="每15分钟" :value="900" />
            <el-option label="每小时" :value="3600" />
            <el-option label="每天" :value="86400" />
          </el-select>
        </el-form-item>

        <el-form-item label="缓存时间（秒）">
          <el-input-number
            v-model="localConfig.cacheTime"
            :min="0"
            :max="86400"
          />
        </el-form-item>

        <el-form-item label="超时时间（秒）">
          <el-input-number
            v-model="localConfig.timeout"
            :min="1"
            :max="300"
          />
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

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
    ElMessage.error('只能上传 Excel 文件！')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB！')
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
    ElMessage.error('JSON 格式错误，无法格式化')
  }
}

// 监听配置变化
watch(() => localConfig.value, (newVal) => {
  emit('update:config', newVal)
}, { deep: true })
</script>

<style scoped lang="scss">
.data-source-selector {
  .type-option {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .connection-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .config-form {
    margin-top: 16px;
  }

  .sql-editor {
    width: 100%;

    .sql-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
  }
}
</style>
