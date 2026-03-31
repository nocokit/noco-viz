<template>
  <a-modal
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    class="confirm-dialog"
  >
    <div class="confirm-dialog__content">
      <div class="confirm-dialog__icon">
        
          <component :is="iconComponent" />
        
      </div>

      <div class="confirm-dialog__message">
        <slot>{{ message }}</slot>
      </div>

      <!-- 二次确认输入 -->
      <div v-if="requireInput" class="confirm-dialog__input">
        <a-input
          v-model="inputValue"
          :placeholder="inputPlaceholder"
          clearable
        />
        <p v-if="inputHint" class="confirm-dialog__hint">{{ inputHint }}</p>
      </div>
    </div>

    <template #footer>
      <div class="confirm-dialog__footer">
        <a-button @click="handleCancel" :disabled="confirming">
          {{ cancelText }}
        </a-button>
        <a-button
          :type="confirmType"
          @click="handleConfirm"
          :loading="confirming"
          :disabled="!canConfirm"
        >
          {{ confirmText }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { WarningFilled, InfoCircleFilled, QuestionCircleFilled } from '@ant-design/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'warning', // warning, danger, info
    validator: (value) => ['warning', 'danger', 'info'].includes(value)
  },
  width: {
    type: String,
    default: '420px'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  requireInput: {
    type: Boolean,
    default: false
  },
  inputPlaceholder: {
    type: String,
    default: ''
  },
  inputHint: {
    type: String,
    default: ''
  },
  inputValidator: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(props.modelValue)
const confirming = ref(false)
const inputValue = ref('')

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    inputValue.value = ''
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const iconComponent = computed(() => {
  const icons = {
    warning: WarningFilled,
    danger: WarningFilled,
    info: InfoFilled,
    question: QuestionFilled
  }
  return icons[props.type] || WarningFilled
})

const iconColor = computed(() => {
  const colors = {
    warning: '#e6a23c',
    danger: '#f56c6c',
    info: '#409eff',
    question: '#909399'
  }
  return colors[props.type] || '#e6a23c'
})

const confirmType = computed(() => {
  return props.type === 'danger' ? 'danger' : 'primary'
})

const canConfirm = computed(() => {
  if (!props.requireInput) return true

  if (props.inputValidator) {
    return props.inputValidator(inputValue.value)
  }

  return inputValue.value.trim() !== ''
})

const handleConfirm = async () => {
  if (!canConfirm.value) return

  confirming.value = true
  try {
    await emit('confirm', inputValue.value)
    visible.value = false
  } finally {
    confirming.value = false
  }
}

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}
</script>

