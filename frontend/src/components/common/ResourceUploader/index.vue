<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 上传区域 -->
    <el-upload
      ref="uploadRef"
      v-bind="uploadProps"
      :auto-upload="false"
      :on-change="handleFileChange"
      :file-list="fileList"
      :accept="accept"
      :multiple="multiple"
      :limit="limit"
      :on-exceed="handleExceed"
      drag
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">
        拖拽文件到此处或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          <slot name="tip">
            {{ tipText }}
          </slot>
        </div>
      </template>
    </el-upload>

    <!-- 文件列表 -->
    <div v-if="fileList.length > 0" class="resource-uploader__list">
      <div
        v-for="(file, index) in fileList"
        :key="file.uid"
        class="resource-uploader__item"
      >
        <!-- 文件预览 -->
        <div class="resource-uploader__preview">
          <img
            v-if="isImage(file)"
            :src="getFilePreview(file)"
            class="preview-image"
          />
          <el-icon v-else class="preview-icon"><Document /></el-icon>
        </div>

        <!-- 文件信息 -->
        <div class="resource-uploader__info">
          <div class="file-name">{{ file.name }}</div>
          <div class="file-size">{{ formatFileSize(file.size) }}</div>
        </div>

        <!-- 自定义字段 -->
        <div v-if="allowRename || customFields.length > 0" class="resource-uploader__fields">
          <el-input
            v-if="allowRename"
            v-model="file.customName"
            placeholder="自定义文件名"
            size="small"
            class="field-input"
          />

          <template v-for="field in customFields" :key="field.name">
            <el-input
              v-if="field.type === 'input'"
              v-model="file[field.name]"
              :placeholder="field.label"
              size="small"
              class="field-input"
            />
            <el-select
              v-else-if="field.type === 'select'"
              v-model="file[field.name]"
              :placeholder="field.label"
              size="small"
              :multiple="field.multiple"
              :filterable="field.filterable"
              :allow-create="field.allowCreate"
              class="field-input"
            >
              <el-option
                v-for="option in field.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </template>
        </div>

        <!-- 操作按钮 -->
        <el-button
          link
          type="danger"
          @click="handleRemoveFile(index)"
          class="resource-uploader__remove"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="resource-uploader__footer">
        <div class="footer-info">
          <span v-if="fileList.length > 0" class="file-count">
            已选择 {{ fileList.length }} 个文件
          </span>
        </div>
        <div class="footer-actions">
          <el-button @click="handleCancel" :disabled="uploading">取消</el-button>
          <el-button
            type="primary"
            @click="handleUpload"
            :loading="uploading"
            :disabled="fileList.length === 0"
          >
            {{ confirmText || '上传' }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { UploadFilled, Document, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '上传文件'
  },
  width: {
    type: String,
    default: '700px'
  },
  accept: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: true
  },
  limit: {
    type: Number,
    default: undefined
  },
  maxSize: {
    type: Number,
    default: 50 * 1024 * 1024 // 50MB
  },
  allowRename: {
    type: Boolean,
    default: true
  },
  customFields: {
    type: Array,
    default: () => []
  },
  tipText: {
    type: String,
    default: '支持拖拽上传，单个文件不超过 50MB'
  },
  confirmText: {
    type: String,
    default: ''
  },
  uploadProps: {
    type: Object,
    default: () => ({})
  },
  // 上传前验证
  beforeUpload: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'upload', 'success', 'error', 'cancel'])

const visible = ref(props.modelValue)
const uploadRef = ref(null)
const fileList = ref([])
const uploading = ref(false)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (!val) {
    fileList.value = []
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const isImage = (file) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  return imageTypes.includes(file.raw?.type || file.type)
}

const getFilePreview = (file) => {
  if (file.url) return file.url
  if (file.raw) {
    return URL.createObjectURL(file.raw)
  }
  return ''
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handleFileChange = (file, files) => {
  // 文件大小验证
  if (props.maxSize && file.size > props.maxSize) {
    ElMessage.error(`文件 ${file.name} 大小超过限制 ${formatFileSize(props.maxSize)}`)
    uploadRef.value.handleRemove(file)
    return
  }

  // 自定义验证
  if (props.beforeUpload) {
    const result = props.beforeUpload(file)
    if (result === false) {
      uploadRef.value.handleRemove(file)
      return
    }
  }

  fileList.value = files.map(f => ({
    ...f,
    customName: f.customName || '',
    // 初始化自定义字段
    ...props.customFields.reduce((acc, field) => {
      if (f[field.name] === undefined) {
        acc[field.name] = field.multiple ? [] : ''
      }
      return acc
    }, {})
  }))
}

const handleExceed = (files, fileList) => {
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件`)
}

const handleRemoveFile = (index) => {
  fileList.value.splice(index, 1)
  // 同步更新 el-upload 的文件列表
  uploadRef.value.clearFiles()
  fileList.value.forEach(file => {
    uploadRef.value.handleStart(file.raw)
  })
}

const handleUpload = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择文件')
    return
  }

  uploading.value = true
  try {
    // 构建上传数据
    const uploadData = fileList.value.map(file => {
      const data = {
        file: file.raw,
        name: file.customName || file.name,
        size: file.size,
        type: file.raw.type
      }

      // 添加自定义字段
      props.customFields.forEach(field => {
        data[field.name] = file[field.name]
      })

      return data
    })

    emit('upload', uploadData)
    emit('success', uploadData)
    visible.value = false
  } catch (error) {
    emit('error', error)
    ElMessage.error('上传失败：' + (error.message || '未知错误'))
  } finally {
    uploading.value = false
  }
}

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}

const handleClose = () => {
  fileList.value = []
  uploadRef.value?.clearFiles()
}

defineExpose({
  fileList,
  clearFiles: () => {
    fileList.value = []
    uploadRef.value?.clearFiles()
  }
})
</script>

<style scoped>
.resource-uploader__list {
  margin-top: 24px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--border, #35363a);
  border-radius: 6px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.resource-uploader__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-card, #1a1b1e);
  border-radius: 6px;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.resource-uploader__item:last-child {
  margin-bottom: 0;
}

.resource-uploader__item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.resource-uploader__preview {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-icon {
  font-size: 24px;
  color: var(--text-secondary, #9aa0a6);
}

.resource-uploader__info {
  min-width: 120px;
}

.file-name {
  font-size: 14px;
  color: var(--text-primary, #e8eaed);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: var(--text-secondary, #9aa0a6);
}

.resource-uploader__fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.field-input {
  width: 100%;
}

.resource-uploader__remove {
  flex-shrink: 0;
}

.resource-uploader__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.footer-info {
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
}

.file-count {
  color: var(--el-color-primary);
  font-weight: 500;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .resource-uploader__item {
    flex-wrap: wrap;
  }

  .resource-uploader__fields {
    width: 100%;
    order: 3;
  }

  .resource-uploader__remove {
    order: 2;
  }
}
</style>
