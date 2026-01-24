<template>
  <el-form
    :model="modelValue"
    :rules="rules"
    :label-position="labelPosition"
    :label-width="labelWidth"
    ref="formRef"
    class="form-builder"
  >
    <el-row :gutter="20">
      <el-col
        v-for="field in fields"
        :key="field.prop"
        :span="field.span || 24"
      >
        <el-form-item
          :label="field.label"
          :prop="field.prop"
          :required="field.required"
        >
          <!-- Input -->
          <el-input
            v-if="field.type === 'input' || !field.type"
            v-model="modelValue[field.prop]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :maxlength="field.maxlength"
            :show-word-limit="field.showWordLimit"
            :clearable="field.clearable !== false"
          />

          <!-- Textarea -->
          <el-input
            v-else-if="field.type === 'textarea'"
            v-model="modelValue[field.prop]"
            type="textarea"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :rows="field.rows || 3"
            :maxlength="field.maxlength"
            :show-word-limit="field.showWordLimit"
          />

          <!-- Select -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="modelValue[field.prop]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :clearable="field.clearable !== false"
            :multiple="field.multiple"
            style="width: 100%"
          >
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :disabled="option.disabled"
            />
          </el-select>

          <!-- Date -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="modelValue[field.prop]"
            :type="field.dateType || 'date'"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :clearable="field.clearable !== false"
            style="width: 100%"
          />

          <!-- Switch -->
          <el-switch
            v-else-if="field.type === 'switch'"
            v-model="modelValue[field.prop]"
            :disabled="field.disabled"
          />

          <!-- Radio -->
          <el-radio-group
            v-else-if="field.type === 'radio'"
            v-model="modelValue[field.prop]"
            :disabled="field.disabled"
          >
            <el-radio
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>

          <!-- Checkbox -->
          <el-checkbox-group
            v-else-if="field.type === 'checkbox'"
            v-model="modelValue[field.prop]"
            :disabled="field.disabled"
          >
            <el-checkbox
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>

          <!-- Number -->
          <el-input-number
            v-else-if="field.type === 'number'"
            v-model="modelValue[field.prop]"
            :min="field.min"
            :max="field.max"
            :step="field.step"
            :disabled="field.disabled"
            style="width: 100%"
          />

          <!-- Custom Slot -->
          <slot v-else :name="`field-${field.prop}`" :field="field"></slot>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  fields: {
    type: Array,
    required: true
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  labelPosition: {
    type: String,
    default: 'top'
  },
  labelWidth: {
    type: String,
    default: '100px'
  }
})

const formRef = ref(null)

const validate = () => {
  return formRef.value?.validate()
}

const resetFields = () => {
  formRef.value?.resetFields()
}

const clearValidate = () => {
  formRef.value?.clearValidate()
}

defineExpose({
  validate,
  resetFields,
  clearValidate
})
</script>

<style scoped>
.form-builder {
  width: 100%;
}
</style>
