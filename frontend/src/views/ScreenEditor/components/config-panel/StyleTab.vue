<!--
  样式配置Tab组件
  配置组件的样式属性（位置、大小、颜色等）
-->
<template>
  <div class="style-tab">
    <!-- 位置和尺寸 -->
    <div class="config-section">
      <div class="section-title">位置和尺寸</div>
      <div class="config-row">
        <div class="config-item">
          <label>X</label>
          <el-input-number
            v-model="localStyle.x"
            :min="0"
            :max="1920"
            size="small"
            controls-position="right"
            @change="handleChange"
          />
        </div>
        <div class="config-item">
          <label>Y</label>
          <el-input-number
            v-model="localStyle.y"
            :min="0"
            :max="1080"
            size="small"
            controls-position="right"
            @change="handleChange"
          />
        </div>
      </div>
      <div class="config-row">
        <div class="config-item">
          <label>宽度</label>
          <el-input-number
            v-model="localStyle.w"
            :min="50"
            :max="1920"
            size="small"
            controls-position="right"
            @change="handleChange"
          />
        </div>
        <div class="config-item">
          <label>高度</label>
          <el-input-number
            v-model="localStyle.h"
            :min="50"
            :max="1080"
            size="small"
            controls-position="right"
            @change="handleChange"
          />
        </div>
      </div>
    </div>

    <!-- 层级 -->
    <div class="config-section">
      <div class="section-title">层级</div>
      <div class="config-row">
        <div class="config-item full-width">
          <label>Z-Index</label>
          <el-input-number
            v-model="localStyle.zIndex"
            :min="0"
            :max="9999"
            size="small"
            controls-position="right"
            @change="handleChange"
          />
        </div>
      </div>
    </div>

    <!-- 透明度 -->
    <div class="config-section">
      <div class="section-title">透明度</div>
      <div class="config-row">
        <div class="config-item full-width">
          <el-slider
            v-model="localStyle.opacity"
            :min="0"
            :max="1"
            :step="0.01"
            show-input
            @change="handleChange"
          />
        </div>
      </div>
    </div>

    <!-- 边框 -->
    <div class="config-section">
      <div class="section-title">边框</div>
      <div class="config-row">
        <div class="config-item">
          <label>宽度</label>
          <el-input-number
            v-model="localStyle.borderWidth"
            :min="0"
            :max="20"
            size="small"
            controls-position="right"
            @change="handleChange"
          />
        </div>
        <div class="config-item">
          <label>颜色</label>
          <el-color-picker
            v-model="localStyle.borderColor"
            size="small"
            @change="handleChange"
          />
        </div>
      </div>
      <div class="config-row">
        <div class="config-item full-width">
          <label>圆角</label>
          <el-input-number
            v-model="localStyle.borderRadius"
            :min="0"
            :max="100"
            size="small"
            controls-position="right"
            @change="handleChange"
          />
        </div>
      </div>
    </div>

    <!-- 背景 -->
    <div class="config-section">
      <div class="section-title">背景</div>
      <div class="config-row">
        <div class="config-item full-width">
          <label>背景颜色</label>
          <el-color-picker
            v-model="localStyle.backgroundColor"
            size="small"
            show-alpha
            @change="handleChange"
          />
        </div>
      </div>
    </div>

    <!-- 阴影 -->
    <div class="config-section">
      <div class="section-title">阴影</div>
      <div class="config-row">
        <div class="config-item">
          <label>X偏移</label>
          <el-input-number
            v-model="localStyle.shadowX"
            :min="-50"
            :max="50"
            size="small"
            controls-position="right"
            @change="handleChange"
          />
        </div>
        <div class="config-item">
          <label>Y偏移</label>
          <el-input-number
            v-model="localStyle.shadowY"
            :min="-50"
            :max="50"
            size="small"
            controls-position="right"
            @change="handleChange"
          />
        </div>
      </div>
      <div class="config-row">
        <div class="config-item">
          <label>模糊</label>
          <el-input-number
            v-model="localStyle.shadowBlur"
            :min="0"
            :max="50"
            size="small"
            controls-position="right"
            @change="handleChange"
          />
        </div>
        <div class="config-item">
          <label>颜色</label>
          <el-color-picker
            v-model="localStyle.shadowColor"
            size="small"
            show-alpha
            @change="handleChange"
          />
        </div>
      </div>
    </div>

    <!-- 其他选项 -->
    <div class="config-section">
      <div class="section-title">其他</div>
      <div class="config-row">
        <el-checkbox v-model="localStyle.locked" @change="handleChange">
          锁定组件
        </el-checkbox>
      </div>
      <div class="config-row">
        <el-checkbox v-model="localStyle.hidden" @change="handleChange">
          隐藏组件
        </el-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  component: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

// 本地样式状态
const localStyle = ref({
  x: 0,
  y: 0,
  w: 200,
  h: 150,
  zIndex: 1,
  opacity: 1,
  borderWidth: 0,
  borderColor: '#409eff',
  borderRadius: 0,
  backgroundColor: 'transparent',
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  locked: false,
  hidden: false
})

// 监听组件变化，同步到本地状态
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent) {
      Object.assign(localStyle.value, newComponent)
    }
  },
  { immediate: true, deep: true }
)

// 处理样式变化
const handleChange = () => {
  emit('update', { ...localStyle.value })
}
</script>

<style scoped>
.style-tab {
  padding: 16px;
}

.config-section {
  margin-bottom: 24px;
}

.config-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.config-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.config-row:last-child {
  margin-bottom: 0;
}

.config-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-item.full-width {
  flex: 1 1 100%;
}

.config-item label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__inner) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

:deep(.el-checkbox) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}
</style>
