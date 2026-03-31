<template>
  <div class="toolbar">
    <!-- 搜索框 -->
    <div v-if="showSearch" class="search-box">
      <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <input
        type="text"
        class="search-input"
        :placeholder="searchPlaceholder"
        :value="searchValue"
        @input="$emit('update:searchValue', $event.target.value)"
      />
    </div>

    <!-- 右侧操作区 -->
    <div class="toolbar-actions">
      <!-- 筛选器插槽 -->
      <slot name="filters"></slot>

      <!-- 视图切换 -->
      <div v-if="showViewToggle" class="view-toggle">
        <button
          :class="['toggle-btn', { active: viewMode === 'card' }]"
          @click="$emit('update:viewMode', 'card')"
          title="卡片视图"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M4 11h6V5H4v6zm0 8h6v-6H4v6zm8 0h6v-6h-6v6zm0-8h6V5h-6v6z"/>
          </svg>
        </button>
        <button
          :class="['toggle-btn', { active: viewMode === 'list' }]"
          @click="$emit('update:viewMode', 'list')"
          title="列表视图"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
          </svg>
        </button>
      </div>

      <!-- 操作按钮插槽 -->
      <slot name="actions"></slot>

      <!-- 刷新按钮 -->
      <button v-if="showRefresh" class="btn btn-secondary" @click="$emit('refresh')" :disabled="refreshLoading">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        {{ refreshText }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // 搜索相关
  showSearch: {
    type: Boolean,
    default: true
  },
  searchValue: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  // 视图切换
  showViewToggle: {
    type: Boolean,
    default: false
  },
  viewMode: {
    type: String,
    default: 'card',
    validator: (value) => ['card', 'list'].includes(value)
  },
  // 刷新按钮
  showRefresh: {
    type: Boolean,
    default: true
  },
  refreshText: {
    type: String,
    default: '刷新'
  },
  refreshLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:searchValue', 'update:viewMode', 'refresh'])
</script>

