<template>
  <div class="simple-form">
    <div
      v-for="field in config.fields"
      :key="field.key"
      class="form-item"
      :style="{ marginBottom: field.marginBottom || '16px' }"
    >
      <!-- Label -->
      <label class="form-label">
        {{ field.label }}
        <span v-if="field.required" class="required-mark">*</span>
      </label>

      <!-- Input Field -->
      <input
        v-if="field.type === 'text' || !field.type"
        type="text"
        class="form-input"
        :class="{ 'input-error': errors[field.key] }"
        :placeholder="field.placeholder"
        :value="modelValue?.[field.key] || ''"
        :maxlength="field.maxlength"
        @input="handleInput(field.key, $event.target.value)"
      >

      <!-- Textarea Field -->
      <textarea
        v-else-if="field.type === 'textarea'"
        class="form-textarea"
        :class="{ 'input-error': errors[field.key] }"
        :placeholder="field.placeholder"
        :value="modelValue?.[field.key] || ''"
        :maxlength="field.maxlength"
        :rows="field.rows || 3"
        @input="handleInput(field.key, $event.target.value)"
      ></textarea>

      <!-- Error Message -->
      <div v-if="errors[field.key]" class="error-text">
        {{ errors[field.key] }}
      </div>

      <!-- Helper/Tip -->
      <div v-if="field.tip" class="form-tip">
        <a
          v-if="typeof field.tip === 'object' && field.tip.type === 'fillLink'"
          href="javascript:void(0)"
          @click="handleFillValue(field.key, field.tip.value)"
        >
          {{ field.tip.text }}
        </a>
        <component :is="field.tip" v-else-if="typeof field.tip === 'object'" />
        <span v-else v-html="field.tip"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // JSON 配置
  config: {
    type: Object,
    required: true,
    // 配置示例：
    // {
    //   fields: [
    //     {
    //       key: 'ip',
    //       label: 'IP 地址或网段',
    //       type: 'text',
    //       required: true,
    //       placeholder: '例如：192.168.1.1 或 192.168.1.0/24',
    //       maxlength: 100,
    //       validator: (value) => {
    //         if (!value) return '请输入IP地址或网段'
    //         // custom validation logic
    //         return ''
    //       },
    //       tip: '提示信息或 VNode'
    //     },
    //     {
    //       key: 'description',
    //       label: '备注说明',
    //       type: 'textarea',
    //       placeholder: '例如：研发部办公室 Wi-Fi',
    //       maxlength: 200,
    //       rows: 4
    //     }
    //   ]
    // }
  },
  // 表单数据 (v-model)
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 错误信息
const errors = ref({})

// 处理输入
const handleInput = (key, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })

  // 清除该字段的错误
  if (errors.value[key]) {
    errors.value[key] = ''
  }
}

// 处理填充值
const handleFillValue = (key, value) => {
  handleInput(key, value)
}

// 验证表单
const validate = () => {
  const newErrors = {}
  let isValid = true

  props.config.fields.forEach(field => {
    const value = props.modelValue[field.key]

    // 必填验证
    if (field.required && !value) {
      newErrors[field.key] = `请输入${field.label}`
      isValid = false
      return
    }

    // 自定义验证
    if (field.validator && value) {
      const error = field.validator(value)
      if (error) {
        newErrors[field.key] = error
        isValid = false
      }
    }
  })

  errors.value = newErrors
  return isValid
}

// 清除错误
const clearErrors = () => {
  errors.value = {}
}

// 暴露方法给父组件
defineExpose({
  validate,
  clearErrors
})
</script>

<style scoped>
.simple-form {
  display: flex;
  flex-direction: column;
}

.form-item {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 6px;
  font-weight: 500;
}

.required-mark {
  color: var(--el-color-danger);
  margin-left: 2px;
}

.form-input,
.form-textarea {
  width: 100%;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  color: var(--el-text-color-primary);
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input {
  height: 40px;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--el-color-primary);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--el-text-color-placeholder);
}

.input-error {
  border-color: var(--el-color-danger) !important;
}

.error-text {
  color: var(--el-color-danger);
  font-size: 12px;
  margin-top: 4px;
}

.form-tip {
  margin-top: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.form-tip :deep(a) {
  color: var(--el-color-primary);
  text-decoration: none;
}

.form-tip :deep(a:hover) {
  text-decoration: underline;
}
</style>
