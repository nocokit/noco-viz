/**
 * 表单通用逻辑 Composable
 * 提供表单验证、提交、重置等功能
 */
import { ref, reactive } from 'vue'

export function useForm(options = {}) {
  const {
    initialValues = {},
    rules = {},
    onSubmit,
    onSuccess,
    onError
  } = options

  // 表单引用
  const formRef = ref(null)

  // 表单数据
  const formData = reactive({ ...initialValues })

  // 表单规则
  const formRules = reactive(rules)

  // 提交状态
  const submitting = ref(false)

  /**
   * 验证表单
   */
  const validate = async () => {
    if (!formRef.value) return false

    try {
      await formRef.value.validate()
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * 验证指定字段
   */
  const validateField = async (field) => {
    if (!formRef.value) return false

    try {
      await formRef.value.validateField(field)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * 重置表单
   */
  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    Object.assign(formData, initialValues)
  }

  /**
   * 清空验证
   */
  const clearValidate = (fields) => {
    if (formRef.value) {
      formRef.value.clearValidate(fields)
    }
  }

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    const isValid = await validate()
    if (!isValid) return

    if (!onSubmit) {
      console.warn('未提供 onSubmit 回调函数')
      return
    }

    submitting.value = true
    try {
      const result = await onSubmit(formData)

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (error) {
      if (onError) {
        onError(error)
      } else {
        console.error('表单提交失败:', error)
      }
      throw error
    } finally {
      submitting.value = false
    }
  }

  /**
   * 设置表单值
   */
  const setFormData = (data) => {
    Object.assign(formData, data)
  }

  /**
   * 设置字段值
   */
  const setFieldValue = (field, value) => {
    formData[field] = value
  }

  /**
   * 获取表单值
   */
  const getFormData = () => {
    return { ...formData }
  }

  return {
    // 引用
    formRef,

    // 状态
    formData,
    formRules,
    submitting,

    // 方法
    validate,
    validateField,
    resetForm,
    clearValidate,
    handleSubmit,
    setFormData,
    setFieldValue,
    getFormData
  }
}
