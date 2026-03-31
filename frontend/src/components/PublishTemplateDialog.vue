<template>
  <a-modal
    v-model:open="visible"
    title="发布我的模板"
    width="700px"
    @cancel="handleClose"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
    >
      <a-form-item label="模板名称" name="name" required>
        <a-input
          v-model:value="form.name"
          placeholder="请输入模板名称"
          maxlength="50"
          show-word-limit
        />
      </a-form-item>

      <a-form-item label="模板描述" name="description" required>
        <a-input
          v-model:value="form.description"
          type="textarea"
          :rows="3"
          placeholder="请描述模板的用途和特点"
          maxlength="200"
          show-word-limit
        />
      </a-form-item>

      <a-form-item label="分类" name="category" required>
        <a-select
          v-model:value="form.category"
          placeholder="请选择分类"
          style="width: 100%"
        >
          <a-select-option label="业务分析" value="business" />
          <a-select-option label="物联网监控" value="iot" />
          <a-select-option label="安全监控" value="security" />
          <a-select-option label="物流供应链" value="logistics" />
          <a-select-option label="人力资源" value="hr" />
          <a-select-option label="客户服务" value="service" />
          <a-select-option label="销售管理" value="sales" />
          <a-select-option label="UI设计" value="design" />
          <a-select-option label="研发效能" value="development" />
          <a-select-option label="市场营销" value="marketing" />
          <a-select-option label="财务分析" value="finance" />
          <a-select-option label="其他" value="other" />
        </a-select>
      </a-form-item>

      <a-form-item label="部门" name="department">
        <a-input
          v-model:value="form.department"
          placeholder="请输入所属部门"
        />
      </a-form-item>

      <a-form-item label="分辨率" name="resolution">
        <a-select
          v-model:value="form.resolution"
          placeholder="请选择分辨率"
          style="width: 100%"
        >
          <a-select-option label="1920 x 1080 (标准)" value="1920 x 1080" />
          <a-select-option label="3840 x 2160 (4K)" value="3840 x 2160" />
          <a-select-option label="1366 x 768 (小屏)" value="1366 x 768" />
          <a-select-option label="自适应" value="自适应" />
        </a-select>
      </a-form-item>

      <a-form-item label="标签" name="tags">
        <a-tag
          v-for="tag in form.tags"
          :key="tag"
          closable
          @close="handleRemoveTag(tag)"
          style="margin-right: 8px; margin-bottom: 8px;"
        >
          {{ tag }}
        </a-tag>
        <a-input
          v-if="tagInputVisible"
          ref="tagInputRef"
          v-model="tagInputValue"
          size="small"
          style="width: 100px;"
          @keyup.enter="handleAddTag"
          @blur="handleAddTag"
        />
        <a-button
          v-else
          size="small"
          @click="showTagInput"
        >
          + 添加标签
        </a-button>
        <div class="form-tip">按回车添加标签，最多5个</div>
      </a-form-item>

      <a-form-item label="缩略图" name="thumbnail">
        <a-upload
          class="thumbnail-uploader"
          :action="uploadAction"
          :headers="uploadHeaders"
          :show-file-list="false"
          :before-upload="beforeThumbnailUpload"
          :on-success="handleThumbnailSuccess"
          :on-progress="handleUploadProgress"
          accept="image/*"
        >
          <img v-if="form.thumbnail" :src="getImageUrl(form.thumbnail)" class="thumbnail-preview" />
          <div v-else class="thumbnail-placeholder">
            <Plus />
            <div class="upload-text">点击上传缩略图</div>
            <div class="upload-tip">建议尺寸 800x450，支持 JPG/PNG</div>
          </div>
        </a-upload>
        <a-progress
          v-if="uploadProgress > 0 && uploadProgress < 100"
          :percentage="uploadProgress"
          style="margin-top: 10px;"
        />
      </a-form-item>

    </a-form>

    <template #footer>
      <span class="dialog-footer">
        <a-button @click="handleClose">取消</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ submitting ? '发布中...' : '发布模板' }}
        </a-button>
      </span>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { message } from '@/utils/ui'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { publishTemplate, uploadThumbnail } from '@/api/template'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  screenData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref(null)
const tagInputRef = ref(null)

const form = ref({
  name: '',
  description: '',
  category: '',
  department: '',
  resolution: '1920 x 1080',
  tags: [],
  thumbnail: '',
  config: null
})

const rules = {
  name: [
    { required: true, message: '请输入模板名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入模板描述', trigger: 'blur' },
    { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ]
}

const tagInputVisible = ref(false)
const tagInputValue = ref('')
const uploadProgress = ref(0)
const submitting = ref(false)

// 获取上传配置
const uploadAction = computed(() => {
  return '/api/media/upload'
})

const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return {
    Authorization: `Bearer ${token}`
  }
})

// 获取图片完整URL
const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return url
}

// 显示标签输入框
const showTagInput = () => {
  if (form.value.tags.length >= 5) {
    message.warning('最多添加5个标签')
    return
  }
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

// 添加标签
const handleAddTag = () => {
  const value = tagInputValue.value.trim()
  if (value && !form.value.tags.includes(value)) {
    if (form.value.tags.length >= 5) {
      message.warning('最多添加5个标签')
    } else {
      form.value.tags.push(value)
    }
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

// 移除标签
const handleRemoveTag = (tag) => {
  const index = form.value.tags.indexOf(tag)
  if (index !== -1) {
    form.value.tags.splice(index, 1)
  }
}

// 上传前验证
const beforeThumbnailUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    message.error('图片大小不能超过 5MB!')
    return false
  }

  // 使用自定义上传
  handleCustomUpload(file)
  return false
}

// 自定义上传
const handleCustomUpload = async (file) => {
  try {
    uploadProgress.value = 0
    const response = await uploadThumbnail(file, (progress) => {
      uploadProgress.value = progress
    })

    form.value.thumbnail = response.url
    message.success('缩略图上传成功')
  } catch (error) {
    console.error('上传失败:', error)
    message.error('上传缩略图失败')
  }
}

// 上传进度
const handleUploadProgress = (event) => {
  uploadProgress.value = Math.round((event.loaded / event.total) * 100)
}

// 上传成功
const handleThumbnailSuccess = (response) => {
  if (response.code === 200) {
    form.value.thumbnail = response.data.url
    message.success('缩略图上传成功')
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    if (!form.value.thumbnail) {
      message.warning('请上传缩略图')
      return
    }

    submitting.value = true

    // 准备提交数据
    const submitData = {
      title: form.value.name,
      description: form.value.description,
      category: form.value.category,
      thumbnail: form.value.thumbnail,
      config: {
        ...props.screenData,
        tags: form.value.tags,
        metadata: {
          department: form.value.department,
          resolution: form.value.resolution
        }
      }
    }

    try {
      const response = await publishTemplate(submitData)
      message.success('模板发布成功！')
      emit('success', response)
      handleClose()
    } catch (error) {
      console.error('发布失败:', error)
      message.error('发布模板失败')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    submitting.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
  form.value = {
    name: '',
    description: '',
    category: '',
    department: '',
    resolution: '1920 x 1080',
    tags: [],
    thumbnail: '',
    config: null
  }
  uploadProgress.value = 0
}
</script>

