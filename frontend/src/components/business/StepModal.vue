<template>
  <el-dialog
    v-model="visible"
    :title="currentStepTitle"
    :width="width"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 步骤指示器 -->
    <div v-if="showSteps" class="step-indicator">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-item"
        :class="{ active: index === currentStep, completed: index < currentStep }"
      >
        <div class="step-number">{{ index < currentStep ? '✓' : index + 1 }}</div>
        <div class="step-label">{{ step.title }}</div>
      </div>
    </div>

    <!-- 步骤内容 -->
    <div class="step-content">
      <slot :name="`step-${currentStep}`" :step="steps[currentStep]">
        <slot :step="steps[currentStep]" />
      </slot>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="step-footer">
        <el-button v-if="currentStep > 0" @click="handlePrev">上一步</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button
          v-if="currentStep < steps.length - 1"
          type="primary"
          :loading="loading"
          @click="handleNext"
        >
          下一步
        </el-button>
        <el-button
          v-else
          type="primary"
          :loading="loading"
          @click="handleFinish"
        >
          {{ finishText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  steps: { type: Array, required: true },
  width: { type: String, default: '600px' },
  showSteps: { type: Boolean, default: true },
  finishText: { type: String, default: '完成' },
  loading: { type: Boolean, default: false },
  beforeNext: { type: Function, default: null },
  beforeFinish: { type: Function, default: null }
})

const emit = defineEmits(['update:modelValue', 'next', 'prev', 'finish', 'close'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentStep = ref(0)

const currentStepTitle = computed(() => {
  return props.steps[currentStep.value]?.title || ''
})

const handleNext = async () => {
  if (props.beforeNext) {
    const result = await props.beforeNext(currentStep.value)
    if (result === false) return
  }

  emit('next', currentStep.value)
  currentStep.value++
}

const handlePrev = () => {
  emit('prev', currentStep.value)
  currentStep.value--
}

const handleFinish = async () => {
  if (props.beforeFinish) {
    const result = await props.beforeFinish()
    if (result === false) return
  }

  emit('finish')
}

const handleClose = () => {
  visible.value = false
  emit('close')
}

const reset = () => {
  currentStep.value = 0
}

watch(() => props.modelValue, (val) => {
  if (!val) {
    setTimeout(reset, 300)
  }
})

defineExpose({ reset, currentStep })
</script>

<style scoped>
.step-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  padding: 0 40px;
}

.step-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 16px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: var(--el-border-color);
  z-index: -1;
}

.step-item.completed::after {
  background: var(--el-color-primary);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.step-item.active .step-number {
  background: var(--el-color-primary);
  color: white;
}

.step-item.completed .step-number {
  background: var(--el-color-primary);
  color: white;
}

.step-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.step-item.active .step-label {
  color: var(--el-color-primary);
  font-weight: 500;
}

.step-content {
  min-height: 200px;
}

.step-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
