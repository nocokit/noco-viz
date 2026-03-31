<template>
  <div>
    <a-modal
      :open="open"
      :title="modalTitle"
      :width="step === 1 ? 800 : 600"
      :footer="null"
      :destroy-on-close="true"
      @cancel="handleCancel"
    >
      <!-- Step 1: 选择类型 -->
      <div v-if="step === 1" class="type-selection">
        <div class="type-grid">
          <div
            v-for="type in projectTypes"
            :key="type.key"
            class="type-card"
            :class="type.key"
            @click="selectType(type.key)"
          >
            <div class="type-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                <path :d="type.icon" />
              </svg>
            </div>
            <div class="type-info">
              <h4>{{ type.title }}</h4>
              <p class="type-subtitle">{{ type.subtitle }}</p>
              <p class="type-desc">{{ type.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: 填写信息 -->
      <div v-else class="project-form">
        <a-form
          ref="formRef"
          :model="formData"
          :rules="projectRules"
          layout="vertical"
        >
          <a-form-item label="项目名称" name="title">
            <a-input
              v-model:value="formData.title"
              placeholder="请输入项目名称"
              :maxlength="100"
              size="large"
            />
          </a-form-item>

          <a-form-item label="项目描述" name="description">
            <a-textarea
              v-model:value="formData.description"
              placeholder="请简要描述项目用途"
              :rows="4"
              :maxlength="500"
              show-count
            />
          </a-form-item>

          <a-form-item label="封面图片">
            <div class="cover-upload-area">
              <div v-if="formData.coverImage" class="cover-preview">
                <img :src="getImageUrl(formData.coverImage)" alt="封面" />
                <div class="cover-overlay">
                  <a-space>
                    <a-button size="small" @click="mediaSelectorVisible = true">
                      <template #icon><PictureOutlined /></template>
                      更换
                    </a-button>
                    <a-button size="small" danger @click="formData.coverImage = ''">
                      <template #icon><DeleteOutlined /></template>
                      移除
                    </a-button>
                  </a-space>
                </div>
              </div>
              <div v-else class="cover-empty">
                <a-space direction="vertical" :size="16" style="width: 100%">
                  <a-button type="primary" block @click="mediaSelectorVisible = true">
                    <template #icon><PictureOutlined /></template>
                    从资源库选择
                  </a-button>
                  <a-divider style="margin: 0">或</a-divider>
                  <a-upload
                    :action="uploadAction"
                    :headers="uploadHeaders"
                    :show-file-list="false"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :before-upload="beforeUpload"
                    accept="image/*"
                    :disabled="uploading"
                  >
                    <a-button block :loading="uploading">
                      <template #icon><UploadOutlined /></template>
                      {{ uploading ? '上传中...' : '上传本地图片' }}
                    </a-button>
                  </a-upload>
                  <div class="upload-hint">建议尺寸 16:9，支持 JPG、PNG 格式</div>
                </a-space>
              </div>
            </div>
          </a-form-item>
        </a-form>

        <div class="modal-footer">
          <a-space>
            <a-button v-if="!isEditMode" @click="step = 1">上一步</a-button>
            <a-button v-if="isEditMode" @click="handleCancel">取消</a-button>
            <a-button type="primary" :loading="submitting" @click="handleSubmit">
              {{ isEditMode ? '保存' : '创建' }}
            </a-button>
          </a-space>
        </div>
      </div>
    </a-modal>

    <MediaSelector
      v-model:value="mediaSelectorVisible"
      @select="handleMediaSelect"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { PictureOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import MediaSelector from '@/components/MediaSelector.vue'
import { projectTypes } from './crudConfig'
import { createProject } from '@/api/project'

const props = defineProps({
  open: Boolean,
  project: { type: Object, default: null },
  updateProject: { type: Function, required: true }
})

const emit = defineEmits(['update:open', 'success'])

const router = useRouter()
const formRef = ref(null)
const step = ref(1)
const submitting = ref(false)
const uploading = ref(false)
const mediaSelectorVisible = ref(false)

const isEditMode = computed(() => !!props.project)

const modalTitle = computed(() => {
  if (isEditMode.value) return '编辑项目信息'
  return step.value === 1 ? '新建项目' : '填写项目信息'
})

const formData = reactive({ type: '', title: '', description: '', coverImage: '' })

const projectRules = {
  title: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 100, message: '项目名称长度在 2 到 100 个字符', trigger: 'blur' }
  ]
}

const uploadAction = '/api/media/upload'
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
}))

// 编辑模式时填充表单
watch(() => props.project, (project) => {
  if (project) {
    formData.type = project.type
    formData.title = project.title
    formData.description = project.description || ''
    formData.coverImage = project.coverImage || ''
    step.value = 2
  }
}, { immediate: true })

const selectType = (type) => {
  formData.type = type
  step.value = 2
}

const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return url
}

const beforeUpload = (file) => {
  if (!file.type.startsWith('image/')) {
    message.error('只能上传图片文件!')
    return false
  }
  if (file.size / 1024 / 1024 >= 5) {
    message.error('图片大小不能超过 5MB!')
    return false
  }
  uploading.value = true
  return true
}

const handleUploadSuccess = (response) => {
  uploading.value = false
  if (response?.url) {
    formData.coverImage = response.url
    message.success('封面上传成功')
  } else {
    message.error('上传失败，请重试')
  }
}

const handleUploadError = () => {
  uploading.value = false
  message.error('上传失败，请重试')
}

const handleMediaSelect = (media) => {
  if (media?.url) {
    formData.coverImage = media.url
    message.success('封面选择成功')
  }
}

const resetForm = () => {
  step.value = 1
  formData.type = ''
  formData.title = ''
  formData.description = ''
  formData.coverImage = ''
  formRef.value?.clearValidate()
}

const handleCancel = () => {
  emit('update:open', false)
  setTimeout(resetForm, 300)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    submitting.value = true

    if (isEditMode.value) {
      await props.updateProject(props.project.id, {
        title: formData.title,
        description: formData.description,
        coverImage: formData.coverImage
      })
      message.success('项目更新成功')
      emit('success')
      handleCancel()
    } else {
      const result = await createProject({
        title: formData.title,
        type: formData.type,
        description: formData.description,
        coverImage: formData.coverImage,
        status: 'draft'
      })
      message.success(`项目 "${formData.title}" 创建成功`)
      const projectType = formData.type
      emit('success')
      handleCancel()
      setTimeout(() => {
        router.push(projectType === 'report' ? `/editor/report/${result.id}` : `/editor/screen/${result.id}`)
      }, 500)
    }
  } catch (error) {
    if (!error.errorFields) {
      message.error(isEditMode.value ? '更新项目失败' : '创建项目失败')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.type-selection { padding: 8px 0; }

.type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.type-card {
  padding: 24px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.type-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.type-card.screen { background: linear-gradient(135deg, #f5f7ff 0%, #fff 100%); }
.type-card.report { background: linear-gradient(135deg, #f0fff4 0%, #fff 100%); }

.type-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 12px;
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.type-card.report .type-icon {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.type-info { text-align: center; }
.type-info h4 { font-size: 18px; font-weight: 600; color: #262626; margin: 0 0 8px; }
.type-subtitle { font-size: 14px; color: #8c8c8c; margin: 0 0 12px; }
.type-desc { font-size: 13px; color: #bfbfbf; line-height: 1.6; margin: 0; }

.project-form { padding: 8px 0; }

.modal-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.cover-upload-area {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.cover-preview {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.cover-preview img { width: 100%; height: 100%; object-fit: cover; }

.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-preview:hover .cover-overlay { opacity: 1; }

.cover-empty { padding: 32px; text-align: center; }

.upload-hint { font-size: 12px; color: #8c8c8c; text-align: center; }
</style>
