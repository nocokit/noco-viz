<template>
  <span class="required-label">
    <span v-if="required" class="required-mark">*</span>
    <span class="label-text">{{ label }}</span>
  </span>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.required-label {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
}

.required-mark {
  color: #ff4d4f;
  margin-right: 4px;
  font-size: 14px;
  line-height: 1;
  order: -1;
}

.label-text {
  color: rgba(0, 0, 0, 0.85);
}
</style>
