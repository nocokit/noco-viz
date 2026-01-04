<template>
  <el-form
    ref="formRef"
    :model="modelValue"
    :rules="rules"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <el-form-item
      v-for="field in fields"
      :key="field.prop"
      :label="field.label"
      :prop="field.prop"
      :rules="field.rules"
      :required="field.required"
    >
      <!-- 输入框 -->
      <el-input
        v-if="field.type === 'input'"
        v-model="modelValue[field.prop]"
        :type="field.inputType || 'text'"
        :placeholder="field.placeholder"
        :maxlength="field.maxlength"
        :show-word-limit="field.showWordLimit"
        :disabled="field.disabled"
        :clearable="field.clearable !== false"
        v-bind="field.props"
      />

      <!-- 文本域 -->
      <el-input
        v-else-if="field.type === 'textarea'"
        v-model="modelValue[field.prop]"
        type="textarea"
        :placeholder="field.placeholder"
        :rows="field.rows || 4"
        :maxlength="field.maxlength"
        :show-word-limit="field.showWordLimit"
        :disabled="field.disabled"
        v-bind="field.props"
      />

      <!-- 数字输入 -->
      <el-input-number
        v-else-if="field.type === 'number'"
        v-model="modelValue[field.prop]"
        :min="field.min"
        :max="field.max"
        :step="field.step"
        :precision="field.precision"
        :disabled="field.disabled"
        v-bind="field.props"
      />

      <!-- 下拉选择 -->
      <el-select
        v-else-if="field.type === 'select'"
        v-model="modelValue[field.prop]"
        :placeholder="field.placeholder"
        :multiple="field.multiple"
        :filterable="field.filterable"
        :clearable="field.clearable !== false"
        :disabled="field.disabled"
        v-bind="field.props"
      >
        <el-option
          v-for="option in field.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
          :disabled="option.disabled"
        />
      </el-select>

      <!-- 单选框组 -->
      <el-radio-group
        v-else-if="field.type === 'radio'"
        v-model="modelValue[field.prop]"
        :disabled="field.disabled"
        v-bind="field.props"
      >
        <el-radio
          v-for="option in field.options"
          :key="option.value"
          :label="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </el-radio>
      </el-radio-group>

      <!-- 复选框组 -->
      <el-checkbox-group
        v-else-if="field.type === 'checkbox'"
        v-model="modelValue[field.prop]"
        :disabled="field.disabled"
        v-bind="field.props"
      >
        <el-checkbox
          v-for="option in field.options"
          :key="option.value"
          :label="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </el-checkbox>
      </el-checkbox-group>

      <!-- 开关 -->
      <el-switch
        v-else-if="field.type === 'switch'"
        v-model="modelValue[field.prop]"
        :disabled="field.disabled"
        :active-text="field.activeText"
        :inactive-text="field.inactiveText"
        v-bind="field.props"
      />

      <!-- 日期选择 -->
      <el-date-picker
        v-else-if="field.type === 'date'"
        v-model="modelValue[field.prop]"
        :type="field.dateType || 'date'"
        :placeholder="field.placeholder"
        :format="field.format"
        :value-format="field.valueFormat"
        :disabled="field.disabled"
        :clearable="field.clearable !== false"
        v-bind="field.props"
      />

      <!-- 时间选择 -->
      <el-time-picker
        v-else-if="field.type === 'time'"
        v-model="modelValue[field.prop]"
        :placeholder="field.placeholder"
        :format="field.format"
        :value-format="field.valueFormat"
        :disabled="field.disabled"
        :clearable="field.clearable !== false"
        v-bind="field.props"
      />

      <!-- 颜色选择 -->
      <el-color-picker
        v-else-if="field.type === 'color'"
        v-model="modelValue[field.prop]"
        :disabled="field.disabled"
        v-bind="field.props"
      />

      <!-- 滑块 -->
      <el-slider
        v-else-if="field.type === 'slider'"
        v-model="modelValue[field.prop]"
        :min="field.min"
        :max="field.max"
        :step="field.step"
        :disabled="field.disabled"
        :show-input="field.showInput"
        v-bind="field.props"
      />

      <!-- 评分 -->
      <el-rate
        v-else-if="field.type === 'rate'"
        v-model="modelValue[field.prop]"
        :max="field.max"
        :disabled="field.disabled"
        :allow-half="field.allowHalf"
        v-bind="field.props"
      />

      <!-- 自定义插槽 -->
      <slot
        v-else-if="field.type === 'slot'"
        :name="field.prop"
        :field="field"
        :value="modelValue[field.prop]"
      />

      <!-- 提示文本 -->
      <template v-if="field.tip" #extra>
        <div class="form-item-tip">{{ field.tip }}</div>
      </template>
    </el-form-item>

    <!-- 表单操作按钮 -->
    <el-form-item v-if="showActions">
      <slot name="actions">
        <el-button @click="handleReset">{{ resetText }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ submitText }}
        </el-button>
      </slot>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  // 表单数据
  modelValue: {
    type: Object,
    required: true
  },
  // 字段配置
  fields: {
    type: Array,
    required: true
    /* 字段配置格式：
    {
      prop: 'name',           // 字段名
      label: '名称',          // 标签
      type: 'input',          // 类型
      placeholder: '请输入',  // 占位符
      rules: [],              // 验证规则
      required: false,        // 是否必填
      disabled: false,        // 是否禁用
      options: [],            // 选项（select/radio/checkbox）
      props: {},              // 额外属性
      tip: ''                 // 提示文本
    }
    */
  },
  // 验证规则
  rules: {
    type: Object,
    default: () => ({})
  },
  // 标签宽度
  labelWidth: {
    type: String,
    default: '100px'
  },
  // 标签位置
  labelPosition: {
    type: String,
    default: 'right'
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否显示操作按钮
  showActions: {
    type: Boolean,
    default: true
  },
  // 提交按钮文本
  submitText: {
    type: String,
    default: '提交'
  },
  // 重置按钮文本
  resetText: {
    type: String,
    default: '重置'
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'reset'])

const formRef = ref(null)
const submitting = ref(false)

// 验证表单
const validate = async () => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    return false
  }
}

// 验证指定字段
const validateField = async (prop) => {
  if (!formRef.value) return false
  try {
    await formRef.value.validateField(prop)
    return true
  } catch (error) {
    return false
  }
}

// 重置表单
const resetFields = () => {
  formRef.value?.resetFields()
}

// 清空验证
const clearValidate = (props) => {
  formRef.value?.clearValidate(props)
}

// 提交表单
const handleSubmit = async () => {
  const isValid = await validate()
  if (!isValid) return

  submitting.value = true
  try {
    emit('submit', props.modelValue)
  } finally {
    submitting.value = false
  }
}

// 重置表单
const handleReset = () => {
  resetFields()
  emit('reset')
}

// 暴露方法
defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
  formRef
})
</script>

<style scoped>
.form-item-tip {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}
</style>
