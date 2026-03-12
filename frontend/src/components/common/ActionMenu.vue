<template>
  <a-dropdown @command="handleCommand" trigger="click">
    <a-button :type="buttonType" :size="buttonSize" :text="text" :circle="circle">
      
        <component :is="icon" />
      
      <span v-else-if="!circle">{{ buttonText }}</span>
    </a-button>
    <template #dropdown>
      <a-menu>
        <template v-for="(action, index) in actions" :key="action.value">
          <a-menu-item
            :command="action.value"
            :disabled="action.disabled"
            :divided="action.divided"
          >
            
              <component :is="action.icon" />
            
            {{ action.label }}
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { MoreOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  actions: {
    type: Array,
    required: true
  },
  buttonType: {
    type: String,
    default: 'default'
  },
  buttonSize: {
    type: String,
    default: 'default'
  },
  buttonText: {
    type: String,
    default: '操作'
  },
  icon: {
    type: [String, Object],
    default: () => MoreFilled
  },
  text: {
    type: Boolean,
    default: false
  },
  circle: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['action'])

const handleCommand = (command) => {
  emit('action', command)
}
</script>

