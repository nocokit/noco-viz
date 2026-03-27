<template>
  <div class="data-tab-container">
    <!-- 模式切换 Tabs -->
    <div class="mode-tabs">
      <div :class="['mode-tab', { active: dataMode === 'ref' }]" @click="dataMode = 'ref'">引用数据集</div>
      <div :class="['mode-tab', { active: dataMode === 'static' }]" @click="dataMode = 'static'">静态 JSON</div>
      <div :class="['mode-tab', { active: dataMode === 'local' }]" @click="dataMode = 'local'">临时 API</div>
    </div>

    <!-- 场景 A: 引用数据集 (推荐) -->
    <div v-if="dataMode === 'ref'" class="mode-content">
      <div class="form-group">
        <div class="form-label">选择数据集</div>
        <div class="input-with-button">
          <a-select
            v-model:value="selectedDatasetId"
            placeholder="请选择数据集..."
            size="small"
            style="flex: 1"
          >
            <a-select-option value="">请选择数据集...</a-select-option>
            <a-select-option value="dataset_1">比亚迪_车辆实时监控</a-select-option>
            <a-select-option value="dataset_2">腾讯_服务器热力图</a-select-option>
            <a-select-option value="dataset_3">2025Q1_销售总表</a-select-option>
          </a-select>
          <button class="btn-icon-square" @click="editCurrentDataset" title="编辑数据集">✎</button>
        </div>
      </div>

      <div v-if="selectedDatasetId" class="data-status-info">
        <div class="form-label" style="margin-bottom: 8px;">数据状态:
          <span class="status-success">● 正常 ({{ dataRowCount }} 行)</span>
        </div>
      </div>

      <div v-if="selectedDatasetId" class="divider"></div>

      <div v-if="selectedDatasetId" class="form-group">
        <div class="form-label">字段映射 (Mapping)</div>
        <div class="field-mapping-simple">
          <div class="mapping-item">X轴: <span class="field-value">category</span></div>
          <div class="mapping-item">Y轴: <span class="field-value">value</span></div>
        </div>
      </div>
    </div>

    <!-- 场景 B: 静态 JSON -->
    <div v-if="dataMode === 'static'" class="mode-content">
      <div class="tip-box">
        适用于展示固定内容或开发调试。数据保存在组件内部，不会随数据源更新。
        <template v-if="props.modelValue?.type === 'radar' && jsonDataType === 'list'">
          <br/>雷达图多系列对比需切换至 <strong>ECharts 格式</strong>。
        </template>
      </div>

      <!-- 数据类型切换 -->
      <div class="json-type-toggle">
        <button :class="['type-btn', { active: jsonDataType === 'echarts' }]" @click="setJsonDataType('echarts')">ECharts 格式</button>
        <button
          :class="['type-btn', { active: jsonDataType === 'list' }]"
          :disabled="!supportsListMode(props.modelValue?.type)"
          :title="!supportsListMode(props.modelValue?.type) ? '该图表类型不支持 List 模式' : ''"
          @click="setJsonDataType('list')"
        >List 格式</button>
      </div>

      <div class="form-group">
        <div class="form-label-row">
          <span class="form-label">JSON 数据</span>
          <span v-if="jsonError" class="label-error">{{ jsonError }}</span>
          <span v-else-if="jsonDataType === 'list' && jsonParsed" class="label-success">✓ {{ jsonParsed.length }} 条</span>
          <span v-else-if="jsonDataType === 'echarts' && jsonValid && staticJsonData" class="label-success">✓ 合法</span>
        </div>
        <textarea
          v-model="staticJsonData"
          class="json-editor"
          :class="{ 'json-editor-error': jsonError }"
          :placeholder="jsonPlaceholder"
          spellcheck="false"
          @input="onJsonInput"
        />
      </div>

      <div class="form-group grid-2">
        <button class="btn-secondary" @click="formatJSON" :disabled="!staticJsonData">格式化</button>
        <button class="btn-primary" @click="applyStaticJSON" :disabled="!!jsonError || !staticJsonData">应用数据</button>
      </div>

      <!-- 自定义处理函数 -->
      <div class="transform-section">
        <div class="form-label-row">
          <span class="form-label">自定义处理函数</span>
          <div class="transform-actions">
            <span v-if="transformError" class="label-error">{{ transformError }}</span>
            <span v-else-if="transformEnabled && transformedData" class="label-success">✓ 已处理</span>
            <button class="btn-link" @click="resetTransform" v-if="transformCode">清空</button>
          </div>
        </div>
        <div class="transform-fn-wrap">
          <span class="fn-prefix">function transform(data) {</span>
          <textarea
            v-model="transformCode"
            class="json-editor transform-editor"
            :class="{ 'json-editor-error': transformError }"
            placeholder="  // 对 data 进行处理后 return&#10;  // 例: return data.filter(d => d.value > 100)"
            spellcheck="false"
            @input="onTransformInput"
          />
          <span class="fn-suffix">}</span>
        </div>
      </div>

      <div v-if="appliedAt" class="applied-hint">
        ✓ 已应用于当前组件 · {{ appliedAt }}
      </div>

      <!-- 雷达图 ECharts 模式预览 -->
      <div v-if="jsonDataType === 'echarts' && radarPreview" class="json-preview">
        <div class="preview-header">
          <span>雷达图结构预览</span>
          <span class="preview-count">{{ radarPreview.indicator.length }} 维度 · {{ radarPreview.series.length }} 系列</span>
        </div>
        <div class="preview-fields">
          <span v-for="ind in radarPreview.indicator" :key="ind.name" class="field-tag">
            {{ ind.name }}<span class="field-tag-max">/{{ ind.max }}</span>
          </span>
        </div>
        <div class="preview-table-wrap">
          <table class="preview-table">
            <thead>
              <tr>
                <th>系列</th>
                <th v-for="ind in radarPreview.indicator" :key="ind.name">{{ ind.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in radarPreview.series" :key="s.name">
                <td>{{ s.name }}</td>
                <td v-for="(v, i) in s.values" :key="i" :class="{ 'td-warn': v > radarPreview.indicator[i]?.max }">
                  {{ v }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 数据预览（仅 List 模式） -->
      <div v-if="jsonDataType === 'list' && previewRows.length > 0" class="json-preview">
        <div class="preview-header">
          <span>数据预览{{ transformEnabled && transformedData ? ' · 处理后' : '' }}</span>
          <span class="preview-count">共 {{ previewSource.length }} 条 · {{ previewFields.length }} 个字段</span>
        </div>
        <div class="preview-fields">
          <span v-for="field in previewFields" :key="field" class="field-tag">{{ field }}</span>
        </div>
        <div class="preview-table-wrap">
          <table class="preview-table">
            <thead>
              <tr>
                <th v-for="field in previewFields" :key="field">{{ field }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in previewRows" :key="i">
                <td v-for="field in previewFields" :key="field">{{ row[field] ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="previewSource.length > 3" class="preview-more">
            ... 还有 {{ previewSource.length - 3 }} 条
          </div>
        </div>
      </div>
    </div>

    <!-- 场景 C: 临时 API -->
    <div v-if="dataMode === 'local'" class="mode-content">
      <div class="tip-box">
        注意：此配置仅当前组件可见。如需复用或统一管理 Token，建议保存为公共数据集。
      </div>

      <div class="form-group">
        <div class="form-label">接口地址</div>
        <a-input
          v-model:value="apiUrl"
          placeholder="https://api.example.com/test"
          size="small"
        />
      </div>

      <div class="form-group">
        <div class="form-label">Method</div>
        <a-select v-model:value="apiMethod" size="small">
          <a-select-option value="GET">GET</a-select-option>
          <a-select-option value="POST">POST</a-select-option>
        </a-select>
      </div>

      <div class="form-group grid-2">
        <button class="btn-secondary" @click="testAPIConnection">测试请求</button>
        <button class="btn-primary" @click="applyAPIConfig" :disabled="!apiUrl">应用配置</button>
      </div>

      <div class="divider"></div>

      <div class="form-group" style="text-align: center;">
        <button class="btn-upgrade" @click="saveAsDataset">
          ⬆ 保存为公共数据集
        </button>
      </div>
    </div>

    <!-- 自动刷新配置（ref 和 local 模式可用） -->
    <div v-if="dataMode === 'ref' || dataMode === 'local'" class="refresh-section">
      <div class="divider"></div>
      <div class="refresh-header">
        <span class="form-label">自动刷新</span>
        <label class="toggle-switch">
          <input type="checkbox" v-model="refreshEnabled" @change="emitRefreshConfig" />
          <span class="toggle-track"></span>
        </label>
      </div>
      <div v-if="refreshEnabled" class="refresh-interval-row">
        <span class="form-label" style="flex-shrink:0">间隔</span>
        <input
          type="number"
          class="interval-input"
          v-model.number="refreshInterval"
          min="5"
          max="3600"
          @change="emitRefreshConfig"
        />
        <span class="form-label" style="flex-shrink:0">秒</span>
      </div>
      <div v-if="refreshEnabled" class="refresh-hint">
        每 {{ refreshInterval }} 秒自动重新拉取数据，预览页面生效
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  getPlaceholder,
  supportsListMode,
  validateJson,
  echartsToList,
  listToEcharts,
  mapListToChartData,
  validateEchartsApply
} from './chartDataConfig'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// ─── 模式 ────────────────────────────────────────────────────────────────────
const dataMode = ref('static')

// ─── 引用数据集 ───────────────────────────────────────────────────────────────
const selectedDatasetId = ref('')
const dataRowCount = ref(2845)

const editCurrentDataset = () => {
  if (!selectedDatasetId.value) {
    message.warning('请先选择数据集')
    return
  }
  message.info('跳转到数据集编辑页面...')
}

// ─── 静态 JSON ────────────────────────────────────────────────────────────────
const staticJsonData = ref('')
const jsonError = ref('')
const appliedAt = ref('')
const jsonDataType = ref('echarts') // 'echarts' | 'list'  // cspell:ignore echarts

const setJsonDataType = (type) => {
  if (type === jsonDataType.value) return
  const compType = props.modelValue?.type || ''
  const raw = staticJsonData.value.trim()

  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      const converted = type === 'list'
        ? echartsToList(parsed, compType)
        : listToEcharts(parsed, compType)
      staticJsonData.value = converted ? JSON.stringify(converted, null, 2) : ''
    } catch {
      staticJsonData.value = ''
    }
  }

  jsonDataType.value = type
  jsonError.value = ''
  onJsonInput()
}

// 根据组件类型和数据类型给出 placeholder 示例
const jsonPlaceholder = computed(() =>
  getPlaceholder(props.modelValue?.type || '', jsonDataType.value)
)

// 解析结果（仅 list 模式用于预览）
const jsonParsed = computed(() => {
  if (jsonDataType.value !== 'list') return null
  if (!staticJsonData.value.trim()) return null
  try {
    const parsed = JSON.parse(staticJsonData.value)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
})

// echarts 模式合法性（无结构错误才算合法）
const jsonValid = computed(() => {
  if (!staticJsonData.value.trim()) return false
  if (jsonError.value) return false
  try { JSON.parse(staticJsonData.value); return true } catch { return false }
})

// 雷达图 ECharts 模式预览数据
const radarPreview = computed(() => {
  if (props.modelValue?.type !== 'radar') return null
  if (jsonDataType.value !== 'echarts') return null // cspell:ignore echarts
  if (!staticJsonData.value.trim() || jsonError.value) return null
  try {
    const parsed = JSON.parse(staticJsonData.value)
    if (!parsed.indicator || !parsed.series) return null
    return { indicator: parsed.indicator, series: parsed.series }
  } catch { return null }
})

// ─── 自定义处理函数 ───────────────────────────────────────────────────────────
const transformCode = ref('')
const transformError = ref('')

const transformEnabled = computed(() => transformCode.value.trim().length > 0)

// 当前模式下可供 transform 消费的原始数据
const transformInputData = computed(() => {
  if (!staticJsonData.value.trim()) return null
  try {
    const parsed = JSON.parse(staticJsonData.value)
    if (jsonDataType.value === 'list') {
      return Array.isArray(parsed) ? parsed : null
    }
    // echarts 模式：直接传整个对象
    return parsed
  } catch {
    return null
  }
})

// 执行 transform，返回处理后数据或 null
const transformedData = computed(() => {
  if (!transformEnabled.value || !transformInputData.value) return null
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('data', transformCode.value)
    const result = fn(JSON.parse(JSON.stringify(transformInputData.value)))
    if (result === undefined || result === null) return null
    // list 模式要求数组；echarts 模式允许对象或数组
    if (jsonDataType.value === 'list' && !Array.isArray(result)) return null
    return result
  } catch {
    return null
  }
})

const onTransformInput = () => {
  if (!transformCode.value.trim()) { transformError.value = ''; return }
  if (!transformInputData.value) { transformError.value = ''; return }
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('data', transformCode.value)
    const result = fn(JSON.parse(JSON.stringify(transformInputData.value)))
    if (result === undefined) {
      transformError.value = '函数需要 return 返回值'
    } else if (jsonDataType.value === 'list' && !Array.isArray(result)) {
      transformError.value = 'List 模式返回值需为数组'
    } else if (jsonDataType.value === 'echarts' && typeof result !== 'object') {
      transformError.value = 'ECharts 模式返回值需为对象或数组'
    } else {
      transformError.value = ''
    }
  } catch (e) {
    transformError.value = e.message?.split('\n')[0] ?? '函数执行错误'
  }
}

const resetTransform = () => {
  transformCode.value = ''
  transformError.value = ''
}

// 预览数据源：优先用 transform 结果，否则用原始解析数据（仅 list 模式预览表格）
const previewSource = computed(() => {
  const base = jsonDataType.value === 'list'
    ? (Array.isArray(transformInputData.value) ? transformInputData.value : [])
    : []
  if (transformEnabled.value && transformedData.value && Array.isArray(transformedData.value)) {
    return transformedData.value
  }
  return base
})

const previewFields = computed(() => {
  if (!previewSource.value.length) return []
  return Object.keys(previewSource.value[0])
})

const previewRows = computed(() => previewSource.value.slice(0, 3))

// 输入时实时校验
const onJsonInput = () => {
  const val = staticJsonData.value.trim()
  if (!val) { jsonError.value = ''; return }
  try {
    const parsed = JSON.parse(val)
    jsonError.value = validateJson(parsed, props.modelValue?.type || '', jsonDataType.value)
  } catch {
    jsonError.value = 'JSON 格式错误'
  }
}

// 格式化
const formatJSON = () => {
  try {
    const parsed = JSON.parse(staticJsonData.value)
    staticJsonData.value = JSON.stringify(parsed, null, 2)
    jsonError.value = ''
    message.success('已格式化')
  } catch {
    message.error('JSON 格式错误，无法格式化')
  }
}

// 应用数据到组件
const applyStaticJSON = () => {
  if (!staticJsonData.value.trim()) { message.warning('请输入 JSON 数据'); return }
  try {
    const raw = JSON.parse(staticJsonData.value)
    const compType = props.modelValue?.type || ''
    let data

    if (jsonDataType.value === 'echarts') { // cspell:ignore echarts
      const err = validateEchartsApply(raw, compType)
      if (err) { message.error(err); return }
      // ECharts 模式：若 transform 有效，用处理后的结果
      if (transformEnabled.value) {
        if (transformError.value) { message.error('处理函数有错误，请先修复'); return }
        data = transformedData.value ?? raw
      } else {
        data = raw
      }
    } else {
      let list = raw
      if (!Array.isArray(list)) { message.error('List 格式需要数组 [ ... ]'); return }
      if (transformEnabled.value) {
        if (transformError.value) { message.error('处理函数有错误，请先修复'); return }
        if (transformedData.value) list = transformedData.value
      }
      data = mapListToChartData(list, compType)
    }

    emit('update:modelValue', {
      ...props.modelValue,
      data,
      dataSource: { mode: 'static', jsonDataType: jsonDataType.value, json: staticJsonData.value, transformCode: transformCode.value }
    })
    const now = new Date()
    appliedAt.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    message.success('数据已应用')
  } catch {
    message.error('JSON 格式错误')
  }
}

// ─── 自动刷新 ─────────────────────────────────────────────────────────────────
const refreshEnabled = ref(false)
const refreshInterval = ref(30)

const emitRefreshConfig = () => {
  const interval = Math.max(5, Math.min(3600, refreshInterval.value || 30))
  refreshInterval.value = interval
  emit('update:modelValue', {
    ...props.modelValue,
    refreshConfig: { enabled: refreshEnabled.value, interval }
  })
}

// ─── 临时 API ─────────────────────────────────────────────────────────────────
const apiUrl = ref('')
const apiMethod = ref('GET')

const applyAPIConfig = () => {
  if (!apiUrl.value) { message.warning('请输入接口地址'); return }
  emit('update:modelValue', {
    ...props.modelValue,
    dataSource: { mode: 'local', apiUrl: apiUrl.value, apiMethod: apiMethod.value }
  })
  message.success('API 配置已应用')
}

const testAPIConnection = async () => {
  if (!apiUrl.value) {
    message.warning('请输入接口地址')
    return
  }
  try {
    message.info('测试请求中...')
    const response = await fetch(apiUrl.value, { method: apiMethod.value })
    if (response.ok) {
      message.success('接口请求成功')
    } else {
      message.error(`请求失败: ${response.status} ${response.statusText}`)
    }
  } catch (e) {
    message.error(`接口请求失败: ${e.message}`)
  }
}

const saveAsDataset = () => {
  if (!apiUrl.value) {
    message.warning('请先配置接口地址')
    return
  }
  message.info('保存为数据集功能开发中...')
}

// ─── 切换组件时同步已保存配置 ──────────────────────────────────────────────────
watch(
  () => props.modelValue?.id,
  () => {
    const ds = props.modelValue?.dataSource
    // 同步刷新配置
    const rc = props.modelValue?.refreshConfig
    refreshEnabled.value = rc?.enabled ?? false
    refreshInterval.value = rc?.interval ?? 30

    if (ds?.mode === 'static') {
      dataMode.value = 'static'
      jsonDataType.value = ds.jsonDataType ?? 'echarts' // cspell:ignore echarts
      staticJsonData.value = ds.json ?? ''
      transformCode.value = ds.transformCode ?? ''
      transformError.value = ''
      appliedAt.value = ''
      onJsonInput()
    } else if (ds?.mode === 'local') {
      dataMode.value = 'local'
      apiUrl.value = ds.apiUrl ?? ''
      apiMethod.value = ds.apiMethod ?? 'GET'
    } else if (ds?.mode === 'ref') {
      dataMode.value = 'ref'
    } else if (props.modelValue?.data) {
      dataMode.value = 'static'
      jsonDataType.value = 'echarts' // cspell:ignore echarts
      staticJsonData.value = JSON.stringify(props.modelValue.data, null, 2)
      appliedAt.value = ''
      onJsonInput()
    } else {
      dataMode.value = 'static'
      jsonDataType.value = 'echarts' // cspell:ignore echarts
      staticJsonData.value = ''
      jsonError.value = ''
      appliedAt.value = ''
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.data-tab-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 0;
}

/* ── 模式 Tab ─────────────────────────────────────── */
.mode-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.mode-tab {
  flex: 1;
  text-align: center;
  padding: 7px 4px;
  font-size: 11px;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.15s;
  user-select: none;
}

.mode-tab:hover { color: var(--text-main); }

.mode-tab.active {
  color: #409eff;
  font-weight: 500;
}

/* ── 内容区 ────────────────────────────────────────── */
.mode-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.tip-box {
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 4px;
  padding: 7px 9px;
  font-size: 11px;
  color: #7ca4d4;
  line-height: 1.55;
}

.form-group { display: flex; flex-direction: column; gap: 5px; }

.form-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

.form-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
}

.label-error  { color: #f87171; font-size: 11px; font-weight: 400; }
.label-success { color: #4ade80; font-size: 11px; font-weight: 400; }

/* ── JSON 数据类型切换 ──────────────────────────────── */
.json-type-toggle {
  display: flex;
  gap: 0;
  background: var(--bg-item);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.type-btn {
  flex: 1;
  height: 26px;
  font-size: 11px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.type-btn:hover { color: var(--text-main); }
.type-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.type-btn.active {
  background: var(--accent-color);
  color: #fff;
}

/* ── JSON 编辑器 ───────────────────────────────────── */
.json-editor {
  width: 100%;
  height: 150px;
  padding: 8px;
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 11px;
  line-height: 1.65;
  color: #c9d1d9;
  background: #0d1117;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.json-editor:focus { border-color: var(--accent-color); }
.json-editor-error { border-color: #f87171 !important; }

.json-editor::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.json-editor::-webkit-scrollbar-track {
  background: transparent;
}
.json-editor::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
}
.json-editor::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ── 数据预览 ──────────────────────────────────────── */
.json-preview {
  background: var(--bg-item);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 9px;
  background: rgba(255,255,255,0.04);
  font-size: 11px;
  color: var(--text-main);
  font-weight: 500;
}

.preview-count { font-weight: 400; color: var(--text-muted); }

.preview-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px 9px;
  max-height: 52px;
  overflow-y: auto;
  border-bottom: 1px solid var(--border-color);
}

.field-tag {
  padding: 1px 6px;
  background: rgba(59, 130, 246, 0.15);
  color: #7eb8f7;
  border-radius: 3px;
  font-size: 11px;
}

.preview-table-wrap {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 160px;
}

.preview-table-wrap::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
.preview-table-wrap::-webkit-scrollbar-track {
  background: transparent;
}
.preview-table-wrap::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
}
.preview-table-wrap::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
.preview-table-wrap::-webkit-scrollbar-corner {
  background: transparent;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.preview-table th {
  padding: 4px 8px;
  text-align: left;
  color: var(--text-muted);
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.preview-table td {
  padding: 4px 8px;
  color: #a0aec0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-more {
  text-align: center;
  padding: 4px;
  font-size: 11px;
  color: var(--text-muted);
}

/* ── 按钮 ──────────────────────────────────────────── */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.btn-primary, .btn-secondary {
  height: 27px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}

.btn-primary {
  background: var(--accent-color);
  color: #fff;
}

.btn-primary:hover:not(:disabled) { background: #5b9cf6; }
.btn-primary:disabled { background: rgba(59,130,246,0.75); color: rgba(255,255,255,0.85); cursor: not-allowed; }

.btn-secondary {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) { border-color: var(--accent-color); color: #7eb8f7; }
.btn-secondary:disabled { color: rgba(255,255,255,0.75); cursor: not-allowed; }

.btn-full { width: 100%; }

.applied-hint {
  text-align: center;
  font-size: 11px;
  color: #4ade80;
  padding: 2px 0;
}

/* ── 引用数据集 ────────────────────────────────────── */
.input-with-button { display: flex; gap: 6px; align-items: center; }

.btn-icon-square {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-square:hover { border-color: var(--accent-color); color: #7eb8f7; }

.data-status-info .status-success { color: #4ade80; font-size: 11px; margin-left: 4px; }

.field-mapping-simple { display: flex; flex-direction: column; gap: 4px; }

.mapping-item {
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.field-value {
  background: rgba(255,255,255,0.07);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: monospace;
  color: var(--text-main);
}

.divider { height: 1px; background: var(--border-color); }

.preview-fields::-webkit-scrollbar {
  width: 3px;
}
.preview-fields::-webkit-scrollbar-track {
  background: transparent;
}
.preview-fields::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
}
.preview-fields::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

.field-tag-max {
  color: var(--text-muted);
  font-size: 10px;
  margin-left: 2px;
  opacity: 0.7;
}

.td-warn { color: #f87171; }

/* ── 自定义处理函数 ─────────────────────────────────── */
.transform-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.transform-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 11px;
  color: var(--text-muted);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.btn-link:hover { color: #f87171; }

.transform-fn-wrap {
  display: flex;
  flex-direction: column;
  background: #0d1117;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.fn-prefix, .fn-suffix {
  padding: 4px 8px;
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 11px;
  color: #6e7681;
  background: rgba(255, 255, 255, 0.02);
  user-select: none;
}

.fn-prefix { border-bottom: 1px solid var(--border-color); }
.fn-suffix { border-top: 1px solid var(--border-color); }

.transform-editor {
  border: none !important;
  border-radius: 0 !important;
  height: 72px;
  resize: none;
}

.transform-editor:focus { border-color: transparent !important; box-shadow: none !important; }

/* ── 自动刷新 ──────────────────────────────────────── */
.refresh-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.refresh-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
}

.refresh-interval-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.interval-input {
  width: 64px;
  height: 26px;
  padding: 0 6px;
  background: #0d1117;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: #c9d1d9;
  font-size: 12px;
  text-align: center;
  outline: none;
}

.interval-input:focus { border-color: var(--accent-color); }

.refresh-hint {
  font-size: 11px;
  line-height: 1.5;
  padding: 3px 7px;
  background: rgba(74, 222, 128, 0.07);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 4px;
  color: #6ee7a0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  cursor: pointer;
}

.toggle-switch input { display: none; }

.toggle-track {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 9px;
  transition: background 0.2s;
}

.toggle-track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle-switch input:checked + .toggle-track { background: var(--accent-color); }
.toggle-switch input:checked + .toggle-track::after { transform: translateX(14px); }

/* ── 升级按钮 ──────────────────────────────────────── */
.btn-upgrade {
  width: 100%;
  height: 30px;
  background: rgba(59, 130, 246, 0.15);
  color: #7eb8f7;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-upgrade:hover {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.5);
}
</style>
