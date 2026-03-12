<template>
  <a-modal
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 上传区域 -->
    <a-upload
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
      <UploadFilled />
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
    </a-upload>

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
          <FileOutlined v-else />
        </div>

        <!-- 文件信息 -->
        <div class="resource-uploader__info">
          <div class="file-name">{{ file.name }}</div>
          <div class="file-size">{{ formatFileSize(file.size) }}</div>
        </div>

        <!-- 自定义字段 -->
        <div v-if="allowRename || customFields.length > 0" class="resource-uploader__fields">
          <a-input
            v-if="allowRename"
            v-model="file.customName"
            placeholder="自定义文件名"
            size="small"
            class="field-input"
          />

          <template v-for="field in customFields" :key="field.name">
            <a-input
              v-if="field.type === 'input'"
              v-model="file[field.name]"
              :placeholder="field.label"
              size="small"
              class="field-input"
            />
            <a-select
              v-else-if="field.type === 'select'"
              v-model="file[field.name]"
              :placeholder="field.label"
              size="small"
              :multiple="field.multiple"
              :filterable="field.filterable"
              :allow-create="field.allowCreate"
              class="field-input"
            >
              <a-select-option
                v-for="option in field.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </a-select>
          </template>
        </div>

        <!-- 操作按钮 -->
        <a-button
          link
          type="danger"
          @click="handleRemoveFile(index)"
          class="resource-uploader__remove"
        >
          <DeleteOutlined />
        </a-button>
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
          <a-button @click="handleCancel" :disabled="uploading">取消</a-button>
          <a-button
            type="primary"
            @click="handleUpload"
            :loading="uploading"
            :disabled="fileList.length === 0"
          >
            {{ confirmText || '上传' }}
          </a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { UploadFilled, FileOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

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
    message.error(`文件 ${file.name} 大小超过限制 ${formatFileSize(props.maxSize)}`)
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
  message.warning(`最多只能上传 ${props.limit} 个文件`)
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
    message.warning('请先选择文件')
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
    message.error('上传失败：' + (error.message || '未知错误'))
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

