/**
 * 表单弹窗逻辑 Composable
 * 统一管理表单弹窗的打开、关闭、提交、重置
 * 支持文件上传、异步验证、步骤式表单
 */

import { ref, reactive, nextTick, computed } from 'vue'
import { message } from 'ant-design-vue'

/**
 * @param {Object} options - 配置选项
 * @param {Object} options.defaultFormData - 默认表单数据
 * @param {Function} options.onSuccess - 提交成功回调
 * @param {Function} options.onClose - 关闭回调
 * @param {Function} options.beforeOpen - 打开前钩子
 * @param {Function} options.beforeSubmit - 提交前钩子
 * @param {Function} options.asyncValidator - 异步验证函数
 * @param {Function} options.onFileUpload - 文件上传处理函数
 * @param {string} options.successMessage - 成功提示信息
 * @param {boolean} options.enableSteps - 是否启用步骤式表单
 * @param {Array} options.steps - 步骤配置
 */
export function useFormModal(options = {}) {
  const {
    defaultFormData = {},
    onSuccess,
    onClose,
    beforeOpen,
    beforeSubmit,
    asyncValidator,
    onFileUpload,
    successMessage,
    enableSteps = false,
    steps = []
  } = options

  // 状态
  const modalVisible = ref(false)
  const isEditMode = ref(false)
  const submitting = ref(false)
  const formRef = ref(null)
  const editingId = ref(null)
  const validating = ref(false)

  // 文件上传相关
  const uploadFileList = ref([])
  const uploading = ref(false)
  const uploadProgress = ref(0)

  // 步骤式表单
  const currentStep = ref(0)
  const stepValidation = ref({})

  const formData = reactive({ ...defaultFormData })

  /**
   * 打开新建弹窗
   */
  const openCreate = async () => {
    if (beforeOpen) {
      const canOpen = await beforeOpen('create')
      if (canOpen === false) return
    }

    isEditMode.value = false
    editingId.value = null
    resetForm()
    modalVisible.value = true
  }

  /**
   * 打开编辑弹窗
   */
  const openEdit = async (item) => {
    if (beforeOpen) {
      const canOpen = await beforeOpen('edit', item)
      if (canOpen === false) return
    }

    isEditMode.value = true
    editingId.value = item.id || item._id
    Object.assign(formData, item)
    modalVisible.value = true
  }

  /**
   * 打开查看弹窗（只读模式）
   */
  const openView = async (item) => {
    if (beforeOpen) {
      const canOpen = await beforeOpen('view', item)
      if (canOpen === false) return
    }

    isEditMode.value = false // 视图模式不允许编辑
    editingId.value = item.id || item._id
    Object.assign(formData, item)
    modalVisible.value = true
  }

  /**
   * 关闭弹窗
   */
  const closeModal = () => {
    modalVisible.value = false
    nextTick(() => {
      resetForm()
      onClose && onClose()
    })
  }

  /**
   * 重置表单
   */
  const resetForm = () => {
    // 重置为默认值
    Object.keys(formData).forEach(key => {
      delete formData[key]
    })
    Object.assign(formData, defaultFormData)

    // 清除验证
    nextTick(() => {
      formRef.value?.resetFields()
      formRef.value?.clearValidate()
    })
  }

  /**
   * 提交表单
   * @param {Function} apiFunc - API函数，接收 (id, data) 或 (data)
   */
  const handleSubmit = async (apiFunc) => {
    if (!formRef.value) {
      console.warn('表单引用不存在')
      return false
    }

    try {
      // 表单验证
      await formRef.value.validate()

      // 异步验证
      const asyncValid = await validateAsync()
      if (!asyncValid) {
        return false
      }

      // 文件上传
      if (uploadFileList.value.length > 0 && onFileUpload) {
        try {
          const uploadResults = await uploadFiles()
          // 将上传结果合并到表单数据
          if (uploadResults && uploadResults.length > 0) {
            formData.uploadedFiles = uploadResults
          }
        } catch (error) {
          return false
        }
      }

      // 提交前钩子
      if (beforeSubmit) {
        const canSubmit = await beforeSubmit(formData, isEditMode.value)
        if (canSubmit === false) return false
      }

      submitting.value = true

      let response
      if (isEditMode.value) {
        // 编辑模式
        response = await apiFunc.update(editingId.value, formData)
      } else {
        // 新建模式
        response = await apiFunc.create(formData)
      }

      if (response.code === 200 || response.success) {
        message.success(
          successMessage ||
          (isEditMode.value ? '更新成功' : '创建成功')
        )
        closeModal()
        onSuccess && onSuccess(response.data, isEditMode.value)
        return true
      } else {
        message.error(response.message || '操作失败')
        return false
      }
    } catch (error) {
      if (error.message && error.message !== 'cancel') {
        console.error('提交失败:', error)
        message.error(error.message || '操作失败')
      }
      return false
    } finally {
      submitting.value = false
    }
  }

  /**
   * 设置表单字段值
   */
  const setFieldValue = (field, value) => {
    formData[field] = value
  }

  /**
   * 获取表单字段值
   */
  const getFieldValue = (field) => {
    return formData[field]
  }

  /**
   * 批量设置表单值
   */
  const setFormData = (data) => {
    Object.assign(formData, data)
  }

  /**
   * 异步验证
   */
  const validateAsync = async () => {
    if (!asyncValidator) return true

    validating.value = true
    try {
      const result = await asyncValidator(formData, isEditMode.value)
      return result !== false
    } catch (error) {
      console.error('异步验证失败:', error)
      message.error(error.message || '验证失败')
      return false
    } finally {
      validating.value = false
    }
  }

  /**
   * 文件上传处理
   */
  const handleFileChange = (file, fileList) => {
    uploadFileList.value = fileList
  }

  const handleFileRemove = (file, fileList) => {
    uploadFileList.value = fileList
  }

  const uploadFiles = async () => {
    if (!onFileUpload || uploadFileList.value.length === 0) {
      return []
    }

    uploading.value = true
    uploadProgress.value = 0

    try {
      const results = await onFileUpload(uploadFileList.value, (progress) => {
        uploadProgress.value = progress
      })
      return results
    } catch (error) {
      console.error('文件上传失败:', error)
      message.error('文件上传失败')
      throw error
    } finally {
      uploading.value = false
      uploadProgress.value = 0
    }
  }

  const clearFiles = () => {
    uploadFileList.value = []
    uploadProgress.value = 0
  }

  /**
   * 步骤式表单 - 下一步
   */
  const nextStep = async () => {
    if (!enableSteps || currentStep.value >= steps.length - 1) {
      return false
    }

    // 验证当前步骤
    try {
      await formRef.value?.validate()
      stepValidation.value[currentStep.value] = true
      currentStep.value++
      return true
    } catch (error) {
      stepValidation.value[currentStep.value] = false
      return false
    }
  }

  /**
   * 步骤式表单 - 上一步
   */
  const prevStep = () => {
    if (!enableSteps || currentStep.value <= 0) {
      return false
    }
    currentStep.value--
    return true
  }

  /**
   * 步骤式表单 - 跳转到指定步骤
   */
  const goToStep = (step) => {
    if (!enableSteps || step < 0 || step >= steps.length) {
      return false
    }
    currentStep.value = step
    return true
  }

  /**
   * 步骤式表单 - 是否是最后一步
   */
  const isLastStep = computed(() => {
    return enableSteps && currentStep.value === steps.length - 1
  })

  /**
   * 步骤式表单 - 是否是第一步
   */
  const isFirstStep = computed(() => {
    return enableSteps && currentStep.value === 0
  })

  return {
    // 状态
    modalVisible,
    isEditMode,
    submitting,
    formRef,
    editingId,
    formData,
    validating,

    // 文件上传
    uploadFileList,
    uploading,
    uploadProgress,

    // 步骤式表单
    currentStep,
    stepValidation,
    isLastStep,
    isFirstStep,

    // 方法
    openCreate,
    openEdit,
    openView,
    closeModal,
    resetForm,
    handleSubmit,
    setFieldValue,
    getFieldValue,
    setFormData,

    // 异步验证
    validateAsync,

    // 文件上传方法
    handleFileChange,
    handleFileRemove,
    uploadFiles,
    clearFiles,

    // 步骤式表单方法
    nextStep,
    prevStep,
    goToStep
  }
}
