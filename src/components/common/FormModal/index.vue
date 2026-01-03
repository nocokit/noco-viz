<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    :close-on-press-escape="!loading"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-width="labelWidth"
      :label-position="labelPosition"
    >
      <slot :formData="formData" :formRef="formRef"></slot>
    </el-form>

    <template #footer>
      <slot name="footer" :loading="loading" :handleSubmit="handleSubmit" :handleCancel="handleCancel">
        <div class="dialog-footer">
          <el-button @click="handleCancel" :disabled="loading">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ confirmText || '确定' }}
          </el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: String, default: '600px' },
  formData: { type: Object, required: true },
  formRules: { type: Object, default: () => ({}) },
  labelWidth: { type: String, default: '100px' },
  labelPosition: { type: String, default: 'right' },
  loading: { type: Boolean, default: false },
  confirmText: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'close'])

const visible = ref(props.modelValue)
const formRef = ref(null)

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    emit('submit', props.formData)
  } catch (error) {
    console.log('表单验证失败')
  }
}

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}

const handleClose = () => {
  formRef.value?.resetFields()
  emit('close')
}

defineExpose({
  formRef,
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
  clearValidate: () => formRef.value?.clearValidate()
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
