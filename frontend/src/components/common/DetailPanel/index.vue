<template>
  <a-drawer
    v-model="visible"
    :title="title"
    :size="size"
    :direction="direction"
    :before-close="handleClose"
    :close-on-click-modal="closeOnClickModal"
    class="detail-panel"
  >
    <template #header>
      <slot name="header">
        <div class="detail-panel__header">
          <h3 class="detail-panel__title">{{ title }}</h3>
        </div>
      </slot>
    </template>

    <div class="detail-panel__body">
      <slot :data="data"></slot>
    </div>

    <template #footer>
      <slot name="footer" :data="data">
        <div v-if="showFooter" class="detail-panel__footer">
          <a-button @click="handleClose">关闭</a-button>
          <a-button v-if="showEdit" type="primary" @click="handleEdit">
            编辑
          </a-button>
        </div>
      </slot>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '详情'
  },
  data: {
    type: Object,
    default: () => ({})
  },
  size: {
    type: [String, Number],
    default: '400px'
  },
  direction: {
    type: String,
    default: 'rtl' // rtl: 右侧, ltr: 左侧
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'edit'])

const visible = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const handleClose = () => {
  visible.value = false
  emit('close')
}

const handleEdit = () => {
  emit('edit', props.data)
}
</script>

