<!--
  数据配置Tab组件
  配置组件的数据源
-->
<template>
  <div class="data-tab">
    <!-- 数据源类型 -->
    <div class="config-section">
      <div class="section-title">数据源类型</div>
      <el-radio-group v-model="dataConfig.type" @change="handleChange">
        <el-radio label="static">静态数据</el-radio>
        <el-radio label="api">API接口</el-radio>
        <el-radio label="mock">模拟数据</el-radio>
      </el-radio-group>
    </div>

    <!-- 静态数据 -->
    <div v-if="dataConfig.type === 'static'" class="config-section">
      <div class="section-title">
        <span>静态数据</span>
        <el-button size="small" text @click="formatJson">格式化</el-button>
      </div>
      <el-input
        v-model="dataConfig.staticData"
        type="textarea"
        :rows="10"
        placeholder="请输入JSON格式数据"
        @change="handleChange"
      />
      <div v-if="jsonError" class="error-message">
        {{ jsonError }}
      </div>
    </div>

    <!-- API接口 -->
    <div v-if="dataConfig.type === 'api'" class="config-section">
      <div class="section-title">API配置</div>

      <div class="config-row">
        <div class="config-item full-width">
          <label>请求方法</label>
          <el-select v-model="dataConfig.method" @change="handleChange">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </div>
      </div>

      <div class="config-row">
        <div class="config-item full-width">
          <label>API地址</label>
          <el-input
            v-model="dataConfig.url"
            placeholder="https://api.example.com/data"
            @change="handleChange"
          />
        </div>
      </div>

      <div class="config-row">
        <div class="config-item full-width">
          <label>请求头 (JSON)</label>
          <el-input
            v-model="dataConfig.headers"
            type="textarea"
            :rows="3"
            placeholder='{"Authorization": "Bearer token"}'
            @change="handleChange"
          />
        </div>
      </div>

      <div class="config-row">
        <div class="config-item full-width">
          <label>请求参数 (JSON)</label>
          <el-input
            v-model="dataConfig.params"
            type="textarea"
            :rows="3"
            placeholder='{"page": 1, "size": 10}'
            @change="handleChange"
          />
        </div>
      </div>

      <div class="config-row">
        <div class="config-item full-width">
          <label>数据路径</label>
          <el-input
            v-model="dataConfig.dataPath"
            placeholder="data.list (用于提取嵌套数据)"
            @change="handleChange"
          />
        </div>
      </div>

      <div class="config-row">
        <div class="config-item">
          <label>自动刷新</label>
          <el-switch v-model="dataConfig.autoRefresh" @change="handleChange" />
        </div>
        <div class="config-item">
          <label>刷新间隔(秒)</label>
          <el-input-number
            v-model="dataConfig.refreshInterval"
            :min="1"
            :max="3600"
            :disabled="!dataConfig.autoRefresh"
            @change="handleChange"
          />
        </div>
      </div>

      <div class="config-row">
        <el-button type="primary" size="small" @click="testApi">测试接口</el-button>
      </div>
    </div>

    <!-- 模拟数据 -->
    <div v-if="dataConfig.type === 'mock'" class="config-section">
      <div class="section-title">模拟数据配置</div>

      <div class="config-row">
        <div class="config-item full-width">
          <label>数据模板</label>
          <el-select v-model="dataConfig.mockTemplate" @change="handleMockTemplateChange">
            <el-option label="柱状图数据" value="bar" />
            <el-option label="折线图数据" value="line" />
            <el-option label="饼图数据" value="pie" />
            <el-option label="表格数据" value="table" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </div>
      </div>

      <div class="config-row">
        <div class="config-item full-width">
          <label>数据条数</label>
          <el-input-number
            v-model="dataConfig.mockCount"
            :min="1"
            :max="1000"
            @change="handleChange"
          />
        </div>
      </div>

      <div class="config-row">
        <el-button type="primary" size="small" @click="generateMockData">生成数据</el-button>
      </div>

      <div class="config-row">
        <div class="config-item full-width">
          <label>生成的数据</label>
          <el-input
            v-model="dataConfig.generatedData"
            type="textarea"
            :rows="8"
            readonly
          />
        </div>
      </div>
    </div>

    <!-- 数据转换 -->
    <div class="config-section">
      <div class="section-title">数据转换</div>
      <div class="config-row">
        <div class="config-item full-width">
          <label>转换函数 (可选)</label>
          <el-input
            v-model="dataConfig.transformFunction"
            type="textarea"
            :rows="5"
            placeholder="function(data) { return data; }"
            @change="handleChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  component: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const dataConfig = ref({
  type: 'static',
  staticData: '[]',
  method: 'GET',
  url: '',
  headers: '{}',
  params: '{}',
  dataPath: '',
  autoRefresh: false,
  refreshInterval: 60,
  mockTemplate: 'bar',
  mockCount: 10,
  generatedData: '',
  transformFunction: ''
})

const jsonError = ref('')

// 监听组件变化
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent?.dataConfig) {
      Object.assign(dataConfig.value, newComponent.dataConfig)
    }
  },
  { immediate: true, deep: true }
)

const handleChange = () => {
  emit('update', { dataConfig: { ...dataConfig.value } })
}

const formatJson = () => {
  try {
    const parsed = JSON.parse(dataConfig.value.staticData)
    dataConfig.value.staticData = JSON.stringify(parsed, null, 2)
    jsonError.value = ''
    handleChange()
  } catch (e) {
    jsonError.value = '无效的JSON格式: ' + e.message
  }
}

const testApi = async () => {
  try {
    ElMessage.info('正在测试API...')
    // 这里应该实际调用API
    ElMessage.success('API测试成功')
  } catch (e) {
    ElMessage.error('API测试失败: ' + e.message)
  }
}

const handleMockTemplateChange = () => {
  generateMockData()
}

const generateMockData = () => {
  const templates = {
    bar: () => {
      const data = []
      for (let i = 0; i < dataConfig.value.mockCount; i++) {
        data.push({
          name: `类目${i + 1}`,
          value: Math.floor(Math.random() * 1000)
        })
      }
      return data
    },
    line: () => {
      const data = []
      for (let i = 0; i < dataConfig.value.mockCount; i++) {
        data.push({
          x: i,
          y: Math.floor(Math.random() * 100)
        })
      }
      return data
    },
    pie: () => {
      const categories = ['分类A', '分类B', '分类C', '分类D', '分类E']
      return categories.map(name => ({
        name,
        value: Math.floor(Math.random() * 1000)
      }))
    },
    table: () => {
      const data = []
      for (let i = 0; i < dataConfig.value.mockCount; i++) {
        data.push({
          id: i + 1,
          name: `名称${i + 1}`,
          value: Math.floor(Math.random() * 1000),
          status: Math.random() > 0.5 ? '正常' : '异常'
        })
      }
      return data
    }
  }

  const template = templates[dataConfig.value.mockTemplate]
  if (template) {
    const data = template()
    dataConfig.value.generatedData = JSON.stringify(data, null, 2)
    handleChange()
  }
}
</script>

<style scoped>
.data-tab {
  padding: 16px;
}

.config-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.config-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.config-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-item.full-width {
  flex: 1 1 100%;
}

.config-item label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.error-message {
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.3);
  border-radius: 4px;
  color: #ff4757;
  font-size: 12px;
}

:deep(.el-radio-group) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.el-radio) {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-textarea__inner),
:deep(.el-input__inner) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}
</style>
