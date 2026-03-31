<template>
  <div class="simple-form">
    <div
      v-for="field in (config?.fields || [])"
      :key="field.name || field.key"
      class="form-item"
      :style="{ marginBottom: field.marginBottom || '16px' }"
    >
      <!-- Label -->
      <label class="form-label">
        <span v-if="field.required" class="required-mark">*</span>
        <span class="label-text">{{ field.label }}</span>
      </label>

      <!-- Form Content -->
      <div class="form-content">
        <!-- Input Field (text, email, number) -->
        <a-input
          v-if="field.type === 'input' || field.type === 'text' || !field.type"
          :placeholder="field.placeholder"
          :value="modelValue?.[fieldKey(field)] || ''"
          :maxlength="field.maxlength"
          :status="errors[fieldKey(field)] ? 'error' : ''"
          allow-clear
          @update:value="handleInput(fieldKey(field), $event)"
        />

        <!-- Password Field -->
        <a-input-password
          v-else-if="field.type === 'password'"
          :placeholder="field.placeholder"
          :value="modelValue?.[fieldKey(field)] || ''"
          :status="errors[fieldKey(field)] ? 'error' : ''"
          @update:value="handleInput(fieldKey(field), $event)"
        />

        <!-- Select Field -->
        <a-select
          v-else-if="field.type === 'select'"
          :placeholder="field.placeholder || '请选择'"
          :value="modelValue?.[fieldKey(field)] || ''"
          :status="errors[fieldKey(field)] ? 'error' : ''"
          allow-clear
          style="width: 100%"
          @update:value="handleInput(fieldKey(field), $event)"
        >
          <a-select-option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>

        <!-- Switch Field -->
        <a-switch
          v-else-if="field.type === 'switch'"
          :checked="modelValue?.[fieldKey(field)] !== undefined ? modelValue[fieldKey(field)] : field.defaultValue"
          :checked-children="field.activeText || '启用'"
          :un-checked-children="field.inactiveText || '禁用'"
          @update:checked="handleInput(fieldKey(field), $event)"
        />

        <!-- Number Field -->
        <a-input-number
          v-else-if="field.type === 'number'"
          :placeholder="field.placeholder"
          :value="modelValue?.[fieldKey(field)] !== undefined ? modelValue[fieldKey(field)] : (field.defaultValue || '')"
          :min="field.min"
          :max="field.max"
          :status="errors[fieldKey(field)] ? 'error' : ''"
          style="width: 100%"
          @update:value="handleInput(fieldKey(field), $event)"
        />

        <!-- Textarea Field -->
        <a-textarea
          v-else-if="field.type === 'textarea'"
          :placeholder="field.placeholder"
          :value="modelValue?.[fieldKey(field)] || ''"
          :maxlength="field.maxlength"
          :rows="field.rows || 3"
          :status="errors[fieldKey(field)] ? 'error' : ''"
          :show-count="!!field.maxlength"
          @update:value="handleInput(fieldKey(field), $event)"
        />

        <!-- Error Message -->
        <div v-if="errors[fieldKey(field)]" class="error-text">
          {{ errors[fieldKey(field)] }}
        </div>

        <!-- Helper/Tip -->
        <div v-if="field.tip" class="form-tip">
          <a
            v-if="typeof field.tip === 'object' && field.tip.type === 'fillLink'"
            href="javascript:void(0)"
            @click="handleFillValue(fieldKey(field), field.tip.value)"
          >
            {{ field.tip.text }}
          </a>
          <component :is="field.tip" v-else-if="typeof field.tip === 'object'" />
          <span v-else v-html="field.tip"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  // JSON 配置
  config: {
    type: Object,
    required: true
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

// 获取字段的 key（兼容 name 和 key）
const fieldKey = (field) => field.name || field.key

// 处理输入
const handleInput = (key, value) => {
  // 处理数字类型
  let finalValue = value
  const field = props.config.fields.find(f => fieldKey(f) === key)
  if (field?.type === 'number' && value !== null && value !== undefined) {
    finalValue = Number(value)
  }

  emit('update:modelValue', {
    ...props.modelValue,
    [key]: finalValue
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
    const key = fieldKey(field)
    const value = props.modelValue[key]

    // 必填验证
    if (field.required && !value && value !== 0 && value !== false) {
      newErrors[key] = `请输入${field.label}`
      isValid = false
      return
    }

    // 自定义验证规则
    if (field.rules && value) {
      for (const rule of field.rules) {
        if (rule.required && !value) {
          newErrors[key] = rule.message || `请输入${field.label}`
          isValid = false
          break
        }
        if (rule.min && value.length < rule.min) {
          newErrors[key] = rule.message || `长度不能少于${rule.min}个字符`
          isValid = false
          break
        }
        if (rule.max && value.length > rule.max) {
          newErrors[key] = rule.message || `长度不能超过${rule.max}个字符`
          isValid = false
          break
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          newErrors[key] = rule.message || `格式不正确`
          isValid = false
          break
        }
        if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[key] = rule.message || `请输入正确的邮箱地址`
          isValid = false
          break
        }
      }
    }

    // 自定义验证器
    if (field.validator && value) {
      const error = field.validator(value)
      if (error) {
        newErrors[key] = error
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
.form-label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

.required-mark {
  color: #ff4d4f;
  margin-right: 4px;
  font-size: 14px;
  line-height: 1;
}

.label-text {
  color: rgba(0, 0, 0, 0.85);
}

.error-text {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.form-tip {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  margin-top: 4px;
}
</style>