<!--
  Mock 数据源编辑器
  支持 JSON 编辑和数据预览
-->
<template>
  <div class="mock-data-editor-overlay" @click.self="handleClose">
    <div class="mock-data-editor">
      <!-- Header -->
      <div class="editor-header">
        <span class="header-title">{{ isEdit ? '编辑' : '上传' }} Excel / CSV 数据</span>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <!-- Body -->
      <div class="editor-body">
        <!-- 左侧：代码编辑 -->
        <div class="code-editor-section">
          <div class="section-header">
            <span>Excel / CSV 数据编辑器</span>
            <button class="format-btn" @click="formatJSON">格式化</button>
          </div>
          <textarea
            ref="editorRef"
            class="code-editor"
            v-model="jsonContent"
            spellcheck="false"
            @input="handleInput"
            placeholder="粘贴 Excel/CSV 转换后的 JSON 数据，或直接输入..."
          ></textarea>
        </div>

        <!-- 右侧：结构预览 -->
        <div class="preview-section">
          <div class="section-header">
            表格预览 ({{ previewData.length }}行)
          </div>
          <div class="preview-content">
            <div v-if="jsonError" class="error-state">
              <svg viewBox="0 0 1024 1024" width="40" height="40" fill="currentColor">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
                <path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"/>
              </svg>
              <div class="error-text">{{ jsonError }}</div>
            </div>

            <table v-else-if="previewData.length > 0" class="preview-table">
              <thead>
                <tr>
                  <th v-for="key in previewKeys" :key="key">{{ key }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in previewData.slice(0, 10)" :key="index">
                  <td v-for="key in previewKeys" :key="key">
                    <span :class="getValueClass(row[key])">{{ formatValue(row[key]) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="empty-state">
              <svg viewBox="0 0 1024 1024" width="40" height="40" fill="currentColor">
                <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z"/>
              </svg>
              <div class="empty-text">暂无数据</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="editor-footer">
        <div class="status-indicator">
          <span v-if="!jsonError && jsonContent.trim()" class="status-valid">
            <span class="status-dot"></span>
            JSON 格式有效
          </span>
          <span v-else-if="jsonError" class="status-error">
            <span class="status-dot"></span>
            JSON 格式错误
          </span>
        </div>
        <div class="footer-actions">
          <button class="cancel-btn" @click="handleClose">取消</button>
          <button class="save-btn" @click="handleSave" :disabled="!!jsonError || !jsonContent.trim()">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: String,
    default: ''
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const editorRef = ref(null)
const jsonContent = ref(props.data || '')
const jsonError = ref('')

// 解析预览数据
const previewData = computed(() => {
  if (jsonError.value || !jsonContent.value.trim()) return []

  try {
    const parsed = JSON.parse(jsonContent.value)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    return []
  }
})

// 获取预览表格的列
const previewKeys = computed(() => {
  if (previewData.value.length === 0) return []

  const firstRow = previewData.value[0]
  if (typeof firstRow === 'object' && firstRow !== null) {
    return Object.keys(firstRow)
  }
  return ['value']
})

// 监听数据变化
watch(() => props.data, (newData) => {
  jsonContent.value = newData || ''
  validateJSON()
})

// 验证 JSON
const validateJSON = () => {
  if (!jsonContent.value.trim()) {
    jsonError.value = ''
    return true
  }

  try {
    JSON.parse(jsonContent.value)
    jsonError.value = ''
    return true
  } catch (e) {
    jsonError.value = e.message
    return false
  }
}

// 处理输入
const handleInput = () => {
  validateJSON()
}

// 格式化 JSON
const formatJSON = () => {
  try {
    const parsed = JSON.parse(jsonContent.value)
    jsonContent.value = JSON.stringify(parsed, null, 2)
    jsonError.value = ''
  } catch (e) {
    jsonError.value = 'JSON 格式错误，无法格式化'
  }
}

// 格式化值显示
const formatValue = (value) => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

// 获取值的样式类
const getValueClass = (value) => {
  if (typeof value === 'number') return 'value-number'
  if (typeof value === 'boolean') return 'value-boolean'
  if (value === null) return 'value-null'
  return 'value-string'
}

// 关闭弹窗
const handleClose = () => {
  emit('close')
}

// 保存数据
const handleSave = () => {
  if (!validateJSON()) return

  emit('save', jsonContent.value)
  handleClose()
}
</script>

<style scoped>
.mock-data-editor-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.mock-data-editor {
  background: #1e1e1e;
  width: 800px;
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
}

/* Header */
.editor-header {
  height: 48px;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #252526;
}

.header-title {
  color: #fff;
  font-weight: 500;
  font-size: 14px;
}

.close-btn {
  color: #909099;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

/* Body */
.editor-body {
  flex: 1;
  display: flex;
  height: 500px;
  overflow: hidden;
}

.code-editor-section {
  flex: 1;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.preview-section {
  width: 280px;
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
}

.section-header {
  padding: 8px 12px;
  font-size: 12px;
  color: #909099;
  background: #1e1e1e;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.format-btn {
  color: #3b82f6;
  background: transparent;
  border: none;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 2px;
  transition: all 0.2s;
}

.format-btn:hover {
  color: #60a5fa;
  background: rgba(59, 130, 246, 0.1);
}

.code-editor {
  flex: 1;
  background: #101216;
  color: #a9b7c6;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 13px;
  resize: none;
  outline: none;
  border: none;
  line-height: 1.6;
  transition: background 0.2s;
}

.code-editor:focus {
  background: #000;
}

.code-editor::placeholder {
  color: #555;
}

/* Preview */
.preview-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.preview-table {
  width: 100%;
  text-align: left;
  font-size: 12px;
  color: #909099;
  border-collapse: collapse;
}

.preview-table thead tr {
  border-bottom: 1px solid #333;
  color: #e5e5e5;
}

.preview-table th {
  padding: 8px 0;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-table tbody tr {
  border-bottom: 1px solid rgba(51, 51, 51, 0.5);
}

.preview-table td {
  padding: 8px 0;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

.value-number {
  color: #10b981;
}

.value-boolean {
  color: #f59e0b;
}

.value-null {
  color: #6b7280;
  font-style: italic;
}

.value-string {
  color: #a9b7c6;
}

.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
}

.error-state svg {
  fill: #ef4444;
  margin-bottom: 12px;
}

.empty-state svg {
  fill: #444;
  margin-bottom: 12px;
}

.error-text,
.empty-text {
  font-size: 12px;
  margin-top: 8px;
}

.error-text {
  color: #ef4444;
  max-width: 200px;
  text-align: center;
  line-height: 1.5;
}

/* Footer */
.editor-footer {
  height: 56px;
  border-top: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #252526;
}

.status-indicator {
  font-size: 12px;
}

.status-valid,
.status-error {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-valid {
  color: #10b981;
}

.status-error {
  color: #ef4444;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn,
.save-btn {
  padding: 6px 16px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.cancel-btn {
  color: #e5e5e5;
  background: transparent;
  border: 1px solid #444;
}

.cancel-btn:hover {
  background: #333;
}

.save-btn {
  color: #fff;
  background: #3b82f6;
}

.save-btn:hover {
  background: #2563eb;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 滚动条 */
.preview-content::-webkit-scrollbar,
.code-editor::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.preview-content::-webkit-scrollbar-track,
.code-editor::-webkit-scrollbar-track {
  background: transparent;
}

.preview-content::-webkit-scrollbar-thumb,
.code-editor::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 3px;
}

.preview-content::-webkit-scrollbar-thumb:hover,
.code-editor::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
