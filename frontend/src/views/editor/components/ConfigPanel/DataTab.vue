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
      </div>

      <!-- 数据类型切换 -->
      <div class="json-type-toggle">
        <button :class="['type-btn', { active: jsonDataType === 'echarts' }]" @click="setJsonDataType('echarts')">ECharts 格式</button>
        <button :class="['type-btn', { active: jsonDataType === 'list' }]" @click="setJsonDataType('list')">List 格式</button>
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

      <!-- 数据预览（仅 List 模式） -->
      <div v-if="jsonDataType === 'list' && jsonParsed && jsonParsed.length > 0" class="json-preview">
        <div class="preview-header">
          <span>数据预览</span>
          <span class="preview-count">共 {{ jsonParsed.length }} 条 · {{ jsonFields.length }} 个字段</span>
        </div>
        <div class="preview-fields">
          <span v-for="field in jsonFields" :key="field" class="field-tag">{{ field }}</span>
        </div>
        <div class="preview-table-wrap">
          <table class="preview-table">
            <thead>
              <tr>
                <th v-for="field in jsonFields" :key="field">{{ field }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in jsonPreviewRows" :key="i">
                <td v-for="field in jsonFields" :key="field">{{ row[field] ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="jsonParsed.length > 3" class="preview-more">
            ... 还有 {{ jsonParsed.length - 3 }} 条
          </div>
        </div>
      </div>

      <div class="form-group grid-2">
        <button class="btn-secondary" @click="formatJSON" :disabled="!staticJsonData">格式化</button>
        <button class="btn-primary" @click="applyStaticJSON" :disabled="!!jsonError || !staticJsonData">应用数据</button>
      </div>

      <div v-if="appliedAt" class="applied-hint">
        ✓ 已应用于当前组件 · {{ appliedAt }}
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

      <div class="form-group">
        <button class="btn-secondary btn-full" @click="testAPIConnection">测试请求</button>
      </div>

      <div class="divider"></div>

      <div class="form-group" style="text-align: center;">
        <button class="btn-upgrade" @click="saveAsDataset">
          ⬆ 保存为公共数据集
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'

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
const jsonDataType = ref('echarts') // 'echarts' | 'list'

const setJsonDataType = (type) => {
  jsonDataType.value = type
  staticJsonData.value = ''
  jsonError.value = ''
}

// 根据组件类型和数据类型给出 placeholder 示例
const jsonPlaceholder = computed(() => {
  const t = props.modelValue?.type || ''
  if (jsonDataType.value === 'list') {
    if (t === 'radar') {
      return '[{"name":"销售","max":6500,"value":4200},{"name":"管理","max":16000,"value":3000}]'
    }
    return '[{"name":"周一","value":120},{"name":"周二","value":200}]'
  }
  // ECharts 原生格式
  if (['bar', 'line', 'area'].includes(t)) {
    return '{"categories":["周一","周二"],"values":[120,200]}'
  }
  if (['gauge', 'liquidFill'].includes(t)) {
    return '{"value":0.65,"name":"完成率"}'
  }
  if (t === 'radar') {
    return '{"indicator":[{"name":"销售","max":6500},{"name":"管理","max":16000}],"series":[{"name":"预算","values":[4200,3000]}]}'
  }
  return '[{"name":"A","value":30},{"name":"B","value":50}]'
})

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

// echarts 模式合法性
const jsonValid = computed(() => {
  if (!staticJsonData.value.trim()) return false
  try { JSON.parse(staticJsonData.value); return true } catch { return false }
})

// 字段列表（取第一条记录的 key）
const jsonFields = computed(() => {
  if (!jsonParsed.value || jsonParsed.value.length === 0) return []
  return Object.keys(jsonParsed.value[0])
})

// 最多预览 3 行
const jsonPreviewRows = computed(() => {
  return jsonParsed.value?.slice(0, 3) ?? []
})

// 输入时实时校验
const onJsonInput = () => {
  const val = staticJsonData.value.trim()
  if (!val) { jsonError.value = ''; return }
  try {
    const parsed = JSON.parse(val)
    const t = props.modelValue?.type || ''
    if (jsonDataType.value === 'list') {
      if (!Array.isArray(parsed)) {
        jsonError.value = 'List 格式需要数组 [ ... ]'
      } else if (t === 'radar' && parsed.length > 0 && !('name' in parsed[0] && 'max' in parsed[0] && 'value' in parsed[0])) {
        jsonError.value = '雷达图需要 [{name, max, value}] 格式'
      } else {
        jsonError.value = ''
      }
    } else {
      // ECharts 格式：只校验 JSON 合法即可
      jsonError.value = ''
    }
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

    if (jsonDataType.value === 'echarts') {
      // ECharts 模式：直接透传给内部 mapper
      data = raw
    } else {
      // List 模式：[{name, value, ...}] → 各图表内部格式
      if (!Array.isArray(raw)) { message.error('List 格式需要数组 [ ... ]'); return }

      if (['bar', 'line', 'area'].includes(compType)) {
        data = {
          categories: raw.map(d => d.name ?? ''),
          values: raw.map(d => Number(d.value) || 0)
        }
      } else if (['gauge', 'liquidFill'].includes(compType)) {
        data = { value: Number(raw[0]?.value) || 0, name: raw[0]?.name || '完成率' }
      } else if (compType === 'radar') {
        // [{name, max, value}] → {indicator, series}
        data = {
          indicator: raw.map(d => ({ name: d.name, max: d.max })),
          series: [{ name: '数据', values: raw.map(d => Number(d.value) || 0) }]
        }
      } else {
        // pie / doughnut / funnel / wordCloud 等：直接传标准 [{name, value}]
        data = raw.map(d => ({ name: d.name, value: Number(d.value) || 0 }))
      }
    }

    emit('update:modelValue', {
      ...props.modelValue,
      data,
      dataSource: { mode: 'static', jsonDataType: jsonDataType.value, json: staticJsonData.value }
    })
    const now = new Date()
    appliedAt.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    message.success('数据已应用')
  } catch {
    message.error('JSON 格式错误')
  }
}

// ─── 临时 API ─────────────────────────────────────────────────────────────────
const apiUrl = ref('')
const apiMethod = ref('GET')

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
    if (ds?.mode === 'static') {
      dataMode.value = 'static'
      jsonDataType.value = ds.jsonDataType ?? 'echarts'
      staticJsonData.value = ds.json ?? ''
      appliedAt.value = ''
      onJsonInput()
    } else if (props.modelValue?.data) {
      dataMode.value = 'static'
      jsonDataType.value = 'echarts'
      staticJsonData.value = JSON.stringify(props.modelValue.data, null, 2)
      appliedAt.value = ''
      onJsonInput()
    } else {
      dataMode.value = 'static'
      jsonDataType.value = 'echarts'
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
  border-bottom: 1px solid var(--border-color);
}

.field-tag {
  padding: 1px 6px;
  background: rgba(59, 130, 246, 0.15);
  color: #7eb8f7;
  border-radius: 3px;
  font-size: 11px;
}

.preview-table-wrap { overflow-x: auto; }

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
