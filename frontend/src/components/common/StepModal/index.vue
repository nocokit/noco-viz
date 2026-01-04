<template>
  <el-dialog
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
          <el-icon v-if="index < currentStepIndex"><Check /></el-icon>
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
        <el-button @click="handleCancel" :disabled="loading">取消</el-button>

        <div class="step-modal__footer-actions">
          <el-button
            v-if="currentStepIndex > 0"
            @click="handlePrevStep"
            :disabled="loading"
          >
            上一步
          </el-button>

          <el-button
            v-if="currentStepIndex < steps.length - 1"
            type="primary"
            @click="handleNextStep"
            :disabled="!canNext"
            :loading="loading"
          >
            下一步
          </el-button>

          <el-button
            v-else
            type="primary"
            @click="handleFinish"
            :disabled="!canFinish"
            :loading="loading"
          >
            {{ confirmText }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Check } from '@element-plus/icons-vue'

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

<style scoped>
.step-modal__indicator {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 0 24px;
}

.step-modal__indicator-line {
  position: absolute;
  top: 16px;
  left: 24px;
  right: 24px;
  height: 2px;
  background: var(--border, #35363a);
  z-index: 0;
}

.step-modal__indicator-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  z-index: 1;
}

.step-modal__indicator-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-card, #1a1b1e);
  border: 2px solid var(--border, #35363a);
  color: var(--text-secondary, #9aa0a6);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.step-modal__indicator-item--active .step-modal__indicator-number {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.step-modal__indicator-item--completed .step-modal__indicator-number {
  border-color: var(--el-color-success);
  background: var(--el-color-success);
  color: #fff;
}

.step-modal__indicator-label {
  font-size: 13px;
  color: var(--text-secondary, #9aa0a6);
  white-space: nowrap;
  transition: color 0.3s;
}

.step-modal__indicator-item--active .step-modal__indicator-label {
  color: var(--el-color-primary);
  font-weight: 500;
}

.step-modal__indicator-item--completed .step-modal__indicator-label {
  color: var(--text-primary, #e8eaed);
}

.step-modal__content {
  min-height: 300px;
  padding: 0 24px;
}

.step-modal__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.step-modal__footer-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .step-modal__indicator {
    padding: 0 12px;
  }

  .step-modal__indicator-label {
    font-size: 11px;
  }

  .step-modal__indicator-number {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .step-modal__content {
    padding: 0 12px;
    min-height: 200px;
  }
}
</style>
