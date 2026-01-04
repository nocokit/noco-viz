<template>
  <div class="upload-file">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileListModel"
      :action="action"
      :accept="accept"
      :limit="limit"
      :multiple="multiple"
      :auto-upload="autoUpload"
      :show-file-list="showFileList"
      :drag="drag"
      :before-upload="handleBeforeUpload"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :disabled="disabled || uploading"
      class="upload-file__uploader"
    >
      <slot>
        <div v-if="drag" class="upload-file__drag-area">
          <el-icon class="upload-file__icon"><UploadFilled /></el-icon>
          <div class="upload-file__text">
            <p class="upload-file__title">{{ dragText || '将文件拖到此处，或点击上传' }}</p>
            <p class="upload-file__hint">{{ hint }}</p>
          </div>
        </div>
        <el-button v-else :icon="Upload" :disabled="disabled || uploading">
          {{ buttonText || '选择文件' }}
        </el-button>
      </slot>
    </el-upload>

    <!-- 上传进度 -->
    <div v-if="uploading && showProgress" class="upload-file__progress">
      <el-progress :percentage="uploadProgress" :status="progressStatus" />
      <span class="upload-file__progress-text">{{ progressText }}</span>
    </div>

    <!-- 提示信息 -->
    <div v-if="tip" class="upload-file__tip">{{ tip }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Upload, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  action: {
    type: String,
    default: '#'
  },
  accept: {
    type: String,
    default: ''
  },
  limit: {
    type: Number,
    default: 1
  },
  maxSize: {
    type: Number,
    default: 0 // 字节，0表示不限制
  },
  multiple: {
    type: Boolean,
    default: false
  },
  autoUpload: {
    type: Boolean,
    default: true
  },
  drag: {
    type: Boolean,
    default: false
  },
  showFileList: {
    type: Boolean,
    default: true
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: ''
  },
  dragText: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  tip: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:modelValue',
  'change',
  'remove',
  'exceed',
  'success',
  'error',
  'before-upload'
])

const uploadRef = ref(null)
const fileListModel = ref(props.modelValue)
const uploading = ref(false)
const uploadProgress = ref(0)

watch(() => props.modelValue, (val) => {
  fileListModel.value = val
})

watch(fileListModel, (val) => {
  emit('update:modelValue', val)
}, { deep: true })

const progressStatus = computed(() => {
  if (uploadProgress.value === 100) return 'success'
  if (uploadProgress.value > 0) return undefined
  return undefined
})

const progressText = computed(() => {
  if (uploadProgress.value === 100) return '上传完成'
  if (uploadProgress.value > 0) return `上传中 ${uploadProgress.value}%`
  return ''
})

const handleBeforeUpload = (file) => {
  // 文件大小验证
  if (props.maxSize && file.size > props.maxSize) {
    const sizeMB = (props.maxSize / 1024 / 1024).toFixed(1)
    ElMessage.error(`文件大小不能超过 ${sizeMB}MB`)
    return false
  }

  // 文件类型验证
  if (props.accept) {
    const fileName = file.name
    const fileExt = '.' + fileName.split('.').pop().toLowerCase()
    const acceptExts = props.accept.split(',').map(ext => ext.trim().toLowerCase())

    if (!acceptExts.includes(fileExt)) {
      ElMessage.error(`只支持 ${props.accept} 格式的文件`)
      return false
    }
  }

  emit('before-upload', file)
  uploading.value = true
  uploadProgress.value = 0

  return true
}

const handleChange = (file, fileList) => {
  fileListModel.value = fileList
  emit('change', file, fileList)
}

const handleRemove = (file, fileList) => {
  fileListModel.value = fileList
  emit('remove', file, fileList)
}

const handleExceed = (files, fileList) => {
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件`)
  emit('exceed', files, fileList)
}

const handleSuccess = (response, file, fileList) => {
  uploading.value = false
  uploadProgress.value = 100

  setTimeout(() => {
    uploadProgress.value = 0
  }, 2000)

  ElMessage.success('上传成功')
  emit('success', response, file, fileList)
}

const handleError = (error, file, fileList) => {
  uploading.value = false
  uploadProgress.value = 0
  ElMessage.error('上传失败')
  emit('error', error, file, fileList)
}

const handleProgress = (event, file, fileList) => {
  uploadProgress.value = Math.floor(event.percent)
}

const clearFiles = () => {
  uploadRef.value?.clearFiles()
  fileListModel.value = []
}

const submit = () => {
  uploadRef.value?.submit()
}

const abort = () => {
  uploadRef.value?.abort()
}

defineExpose({
  clearFiles,
  submit,
  abort,
  uploadRef
})
</script>

<style scoped>
.upload-file {
  width: 100%;
}

.upload-file__uploader {
  width: 100%;
}

.upload-file__drag-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.upload-file__icon {
  font-size: 48px;
  color: var(--el-color-primary);
  margin-bottom: 16px;
}

.upload-file__text {
  color: var(--text-secondary, #9aa0a6);
}

.upload-file__title {
  font-size: 14px;
  margin: 0 0 8px 0;
  color: var(--text-primary, #e8eaed);
}

.upload-file__hint {
  font-size: 12px;
  margin: 0;
  color: var(--text-tertiary, #5f6368);
}

.upload-file__progress {
  margin-top: 16px;
}

.upload-file__progress-text {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary, #9aa0a6);
  text-align: center;
}

.upload-file__tip {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-tertiary, #5f6368);
  line-height: 1.5;
}

:deep(.el-upload-dragger) {
  background: var(--bg-card, #1a1b1e);
  border-color: var(--border, #35363a);
}

:deep(.el-upload-dragger:hover) {
  border-color: var(--el-color-primary);
}
</style>
