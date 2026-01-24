<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <el-button :type="buttonType" :size="buttonSize" :text="text" :circle="circle">
      <el-icon v-if="icon">
        <component :is="icon" />
      </el-icon>
      <span v-else-if="!circle">{{ buttonText }}</span>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="(action, index) in actions" :key="action.value">
          <el-dropdown-item
            :command="action.value"
            :disabled="action.disabled"
            :divided="action.divided"
          >
            <el-icon v-if="action.icon">
              <component :is="action.icon" />
            </el-icon>
            {{ action.label }}
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { MoreFilled } from '@element-plus/icons-vue'

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

<style scoped>
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 0;
}
</style>
