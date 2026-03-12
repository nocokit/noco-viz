<template>
  <a-modal
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    :close-on-press-escape="!loading"
    @close="handleClose"
    class="step-modal"
  >
    <!-- 步骤指示器 -->
    <div v-if="showStepIndicator && steps.length > 1" class="step-modal__indicator">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="[
          'step-modal__indicator-item',
          {
            'step-modal__indicator-item--active': index === currentStepIndex,
            'step-modal__indicator-item--completed': index < currentStepIndex
          }
        ]"
      >
        <div class="step-modal__indicator-number">
          <Check />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span class="step-modal__indicator-label">{{ step.title }}</span>
      </div>
      <div class="step-modal__indicator-line"></div>
    </div>

    <!-- 步骤内容 -->
    <div class="step-modal__content">
      <slot :name="`step-${currentStepIndex}`" :currentStep="currentStep" :formData="formData">
        <component
          v-if="currentStep.component"
          :is="currentStep.component"
          v-model="formData"
          :step-index="currentStepIndex"
        />
      </slot>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="step-modal__footer">
        <a-button @click="handleCancel" :disabled="loading">取消</a-button>

        <div class="step-modal__footer-actions">
          <a-button
            v-if="currentStepIndex > 0"
            @click="handlePrevStep"
            :disabled="loading"
          >
            上一步
          </a-button>

          <a-button
            v-if="currentStepIndex < steps.length - 1"
            type="primary"
            @click="handleNextStep"
            :disabled="!canNext"
            :loading="loading"
          >
            下一步
          </a-button>

          <a-button
            v-else
            type="primary"
            @click="handleFinish"
            :disabled="!canFinish"
            :loading="loading"
          >
            {{ confirmText }}
          </a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '700px'
  },
  steps: {
    type: Array,
    required: true,
    validator: (steps) => {
      return steps.every(step => step.title)
    }
  },
  currentStep: {
    type: Number,
    default: 0
  },
  showStepIndicator: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '完成'
  },
  loading: {
    type: Boolean,
    default: false
  },
  // 步骤验证器
  stepValidator: {
    type: Function,
    default: null
  },
  // 完成验证器
  finishValidator: {
    type: Function,
    default: null
  }
})

const emit = defineEmits([
  'update:modelValue',
  'update:currentStep',
  'next',
  'prev',
  'finish',
  'cancel',
  'close',
  'step-change'
])

const visible = ref(props.modelValue)
const currentStepIndex = ref(props.currentStep)
const formData = ref({})

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    currentStepIndex.value = props.currentStep
    formData.value = {}
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

watch(() => props.currentStep, (val) => {
  currentStepIndex.value = val
})

watch(currentStepIndex, (val) => {
  emit('update:currentStep', val)
  emit('step-change', val, currentStep.value)
})

const currentStep = computed(() => {
  return props.steps[currentStepIndex.value] || {}
})

const canNext = computed(() => {
  if (props.stepValidator) {
    return props.stepValidator(currentStepIndex.value, formData.value)
  }
  return true
})

const canFinish = computed(() => {
  if (props.finishValidator) {
    return props.finishValidator(formData.value)
  }
  return true
})

const handleNextStep = () => {
  if (currentStepIndex.value < props.steps.length - 1) {
    emit('next', currentStepIndex.value, formData.value)
    currentStepIndex.value++
  }
}

const handlePrevStep = () => {
  if (currentStepIndex.value > 0) {
    emit('prev', currentStepIndex.value, formData.value)
    currentStepIndex.value--
  }
}

const handleFinish = () => {
  emit('finish', formData.value)
}

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}

const handleClose = () => {
  currentStepIndex.value = 0
  formData.value = {}
  emit('close')
}

defineExpose({
  formData,
  nextStep: handleNextStep,
  prevStep: handlePrevStep,
  goToStep: (index) => {
    if (index >= 0 && index < props.steps.length) {
      currentStepIndex.value = index
    }
  },
  reset: () => {
    currentStepIndex.value = 0
    formData.value = {}
  }
})
</script>

