<template>
  <div class="simple-toolbar">
    <div class="toolbar-left" v-if="showSearch">
      <!-- 搜索框 -->
      <input
        type="text"
        class="search-input"
        :placeholder="searchPlaceholder"
        :value="search"
        @input="$emit('update:search', $event.target.value)"
      >
    </div>

    <div class="toolbar-right">
      <!-- 操作按钮 -->
      <button
        v-for="action in actions"
        :key="action.key"
        :class="['btn', action.type === 'primary' ? 'btn-primary' : '']"
        @click="$emit('action', action.key)"
      >
        <svg v-if="action.icon === 'plus'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        {{ action.label }}
      </button>

      <!-- 刷新按钮 -->
      <button
        v-if="showRefresh"
        class="btn btn-icon"
        @click="$emit('refresh')"
        title="刷新"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  search: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  showRefresh: {
    type: Boolean,
    default: true
  },
  actions: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:search', 'action', 'refresh'])
</script>

<style scoped>
.simple-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-direction: row-reverse;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
}

.search-input {
  width: 240px;
  height: 32px;
  padding: 0 12px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  color: var(--el-text-color-primary);
  font-size: 13px;
}

.search-input::placeholder {
  color: var(--el-text-color-placeholder);
}

.search-input:focus {
  outline: none;
  border-color: var(--el-color-primary);
}

.btn {
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
  transition: 0.2s;
}

.btn:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.btn-primary {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--el-color-primary-light-3);
  border-color: var(--el-color-primary-light-3);
}

.btn-icon {
  padding: 0;
  width: 32px;
  justify-content: center;
}

.btn-icon:hover {
  background: var(--el-fill-color-light);
}
</style>
