<!--
  编辑器表单字段统一封装组件
  提供一致的样式和布局
-->
<template>
  <div class="editor-form-field" :class="{ 'field-inline': inline, 'field-grid': grid }">
    <!-- 标签 -->
    <div v-if="label" class="field-label">
      <span>{{ label }}</span>
      <slot name="label-suffix"></slot>
    </div>

    <!-- 控件内容 -->
    <div class="field-control">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  inline: Boolean, // 标签和控件在同一行
  grid: Boolean    // 网格布局（用于 W/H/X/Y 这种）
})
</script>

<style scoped>
.editor-form-field {
  margin-bottom: 8px;
}

.field-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 400;
  color: #e5e5e5;
  margin-bottom: 6px;
  user-select: none;
}

.field-control {
  width: 100%;
}

/* 内联布局 */
.field-inline {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field-inline .field-label {
  margin-bottom: 0;
  min-width: 70px;
  max-width: 70px;
  flex-shrink: 0;
  font-size: 12px;
}

.field-inline .field-control {
  flex: 1;
  min-width: 0; /* 防止 flex 子元素溢出 */
}

/* 网格布局 */
.field-grid {
  margin-bottom: 0; /* 网格内的字段不需要额外 margin */
}

.field-grid .field-label {
  font-size: 11px;
  font-weight: 500;
  color: #e5e5e5;
  margin-bottom: 0; /* 改为 0，配合 inline 布局 */
  min-width: 24px; /* 缩小 label 宽度，适合 W/H/X/Y */
  flex-shrink: 0;
}

.field-grid .field-control {
  flex: 1;
  min-width: 0;
}

/* 网格布局也使用 inline 样式 */
.field-grid {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
