/**
 * 表单弹窗逻辑 Composable
 * 统一管理表单弹窗的打开、关闭、提交、重置
 */

import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * @param {Object} options - 配置选项
 * @param {Object} options.defaultFormData - 默认表单数据
 * @param {Function} options.onSuccess - 提交成功回调
 * @param {Function} options.onClose - 关闭回调
 * @param {Function} options.beforeOpen - 打开前钩子
 * @param {Function} options.beforeSubmit - 提交前钩子
 * @param {string} options.successMessage - 成功提示信息
 */
export function useFormModal(options = {}) {
  const {
    defaultFormData = {},
    onSuccess,
    onClose,
    beforeOpen,
    beforeSubmit,
    successMessage
  } = options

  // 状态
  const modalVisible = ref(false)
  const isEditMode = ref(false)
  const submitting = ref(false)
  const formRef = ref(null)
  const editingId = ref(null)

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
        ElMessage.success(
          successMessage ||
          (isEditMode.value ? '更新成功' : '创建成功')
        )
        closeModal()
        onSuccess && onSuccess(response.data, isEditMode.value)
        return true
      } else {
        ElMessage.error(response.message || '操作失败')
        return false
      }
    } catch (error) {
      if (error.message && error.message !== 'cancel') {
        console.error('提交失败:', error)
        ElMessage.error(error.message || '操作失败')
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

  return {
    // 状态
    modalVisible,
    isEditMode,
    submitting,
    formRef,
    editingId,
    formData,

    // 方法
    openCreate,
    openEdit,
    openView,
    closeModal,
    resetForm,
    handleSubmit,
    setFieldValue,
    getFieldValue,
    setFormData
  }
}
