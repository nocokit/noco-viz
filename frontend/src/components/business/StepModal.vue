<template>
  <a-modal
    v-model:open="visible"
    :title="currentStepTitle"
    :width="width"
    :mask-closable="false"
    @cancel="handleClose"
  >
    <!-- 步骤指示器 -->
    <a-steps v-if="showSteps" :current="currentStep" :style="{ marginBottom: '24px' }">
      <a-step
        v-for="(step, index) in steps"
        :key="index"
        :title="step.title"
        :description="step.description"
      />
    </a-steps>

    <!-- 步骤内容 -->
    <div :style="{ minHeight: '200px' }">
      <slot :name="`step-${currentStep}`" :step="steps[currentStep]">
        <slot :step="steps[currentStep]" />
      </slot>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <a-space>
        <a-button v-if="currentStep > 0" @click="handlePrev">上一步</a-button>
        <a-button @click="handleClose">取消</a-button>
        <a-button
          v-if="currentStep < steps.length - 1"
          type="primary"
          :loading="loading"
          @click="handleNext"
        >
          下一步
        </a-button>
        <a-button
          v-else
          type="primary"
          :loading="loading"
          @click="handleFinish"
        >
          {{ finishText }}
        </a-button>
      </a-space>
    </template>
  </a-modal>
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

