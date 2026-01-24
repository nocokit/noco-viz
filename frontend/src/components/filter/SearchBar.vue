<template>
  <div class="search-bar">
    <el-input
      :model-value="modelValue"
      @update:model-value="handleInput"
      @keyup.enter="handleSearch"
      :placeholder="placeholder"
      :prefix-icon="prefixIcon"
      :clearable="clearable"
      :style="{ width: width }"
      class="search-input"
    >
      <template v-if="showSearchButton" #append>
        <el-button :icon="Search" @click="handleSearch" />
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索...'
  },
  width: {
    type: String,
    default: '240px'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  prefixIcon: {
    type: [String, Object],
    default: 'Search'
  },
  showSearchButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const handleInput = (value) => {
  emit('update:modelValue', value)
  if (!value) {
    emit('clear')
  }
}

const handleSearch = () => {
  emit('search', props.modelValue)
}
</script>

<style scoped>
.search-bar {
  display: inline-block;
}
</style>
