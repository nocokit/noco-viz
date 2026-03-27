<template>
  <div class="form-component" :style="cssVars">
    <div class="form-row">
      <label class="form-label">工单编号</label>
      <input type="text" class="form-input" placeholder="请输入" />

      <label class="form-label">产品名称</label>
      <input type="text" class="form-input" placeholder="请输入" />

      <label class="form-label">状态</label>
      <select class="form-select">
        <option>请选择</option>
        <option>进行中</option>
        <option>已完成</option>
      </select>
    </div>

    <div class="form-row">
      <label class="form-label">开始日期</label>
      <input type="date" class="form-input" />

      <label class="form-label">结束时间</label>
      <input type="datetime-local" class="form-input" />

      <label class="form-label">数量</label>
      <input type="number" class="form-input form-input-number" placeholder="0" />
    </div>

    <div class="form-row">
      <label class="form-label">关键词</label>
      <div class="form-search">
        <input type="text" class="form-input" placeholder="搜索..." />
        <button class="search-btn">🔍</button>
      </div>
    </div>

    <div class="form-actions">
      <button class="form-btn form-btn-primary">新增</button>
      <button class="form-btn">发布</button>
      <button class="form-btn">导出</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { generateCSSVars } from '../utils/fontSizeAdapter'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Object, default: null }
})

const cssVars = computed(() => generateCSSVars(props.config?.fontSize || 14))
</script>

<style scoped>
.form-component {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.form-label {
  font-size: var(--form-font-size, 14px);
  color: #333;
  white-space: nowrap;
}

.form-input,
.form-select {
  height: var(--form-input-height, 35px);
  padding: 0 var(--form-padding-h, 12px);
  font-size: var(--form-font-size, 14px);
  line-height: var(--form-line-height, 21px);
  border: 1px solid #d9d9d9;
  border-radius: var(--form-border-radius, 4px);
  outline: none;
  transition: border-color 0.2s;
}

.form-input {
  width: 180px;
}

.form-input-number {
  width: 120px;
}

.form-select {
  width: 180px;
}

.form-input:focus,
.form-select:focus {
  border-color: #1890ff;
}

.form-search {
  position: relative;
  display: inline-flex;
}

.form-search .form-input {
  padding-right: calc(var(--form-input-height, 35px) + 4px);
}

.search-btn {
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: calc(var(--form-input-height, 35px) - 4px);
  height: calc(var(--form-input-height, 35px) - 4px);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: var(--form-font-size, 14px);
  border-radius: var(--form-border-radius, 4px);
  transition: background 0.2s;
}

.search-btn:hover {
  background: rgba(0, 0, 0, 0.04);
}

.form-actions {
  display: flex;
  gap: 12px;
}

.form-btn {
  height: var(--form-button-height, 35px);
  padding: 0 var(--form-padding-h, 16px);
  font-size: var(--form-font-size, 14px);
  line-height: var(--form-line-height, 21px);
  border: 1px solid #d9d9d9;
  border-radius: var(--form-border-radius, 4px);
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.form-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.form-btn-primary {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.form-btn-primary:hover {
  background: #40a9ff;
  border-color: #40a9ff;
  color: #fff;
}
</style>
