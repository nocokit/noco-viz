<template>
  <div class="stat-card" :class="[`stat-card-${color}`]">
    <div class="stat-header">
      <div class="stat-title">{{ title }}</div>
      <div v-if="icon" class="stat-icon">
        <el-icon>
          <component :is="icon" />
        </el-icon>
      </div>
    </div>
    <div class="stat-value">{{ value }}</div>
    <div v-if="trend || trendValue" class="stat-trend" :class="[`trend-${trend}`]">
      <el-icon v-if="trend === 'up'">
        <TrendCharts />
      </el-icon>
      <el-icon v-else-if="trend === 'down'">
        <TrendCharts style="transform: rotate(180deg)" />
      </el-icon>
      <span v-if="trendValue">{{ trendValue }}</span>
    </div>
    <div v-if="$slots.footer" class="stat-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { TrendCharts } from '@element-plus/icons-vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: [String, Object],
    default: null
  },
  trend: {
    type: String,
    default: '',
    validator: (value) => ['', 'up', 'down'].includes(value)
  },
  trendValue: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info'].includes(value)
  }
})
</script>

<style scoped>
.stat-card {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--el-color-primary);
}

.stat-card-success::before {
  background: var(--el-color-success);
}

.stat-card-warning::before {
  background: var(--el-color-warning);
}

.stat-card-danger::before {
  background: var(--el-color-danger);
}

.stat-card-info::before {
  background: var(--el-color-info);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.stat-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-primary-light-9);
  border-radius: 6px;
  color: var(--el-color-primary);
  font-size: 18px;
}

.stat-card-success .stat-icon {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.stat-card-warning .stat-icon {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.stat-card-danger .stat-icon {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.stat-card-info .stat-icon {
  background: var(--el-color-info-light-9);
  color: var(--el-color-info);
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.trend-up {
  color: var(--el-color-success);
}

.trend-down {
  color: var(--el-color-danger);
}

.stat-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
