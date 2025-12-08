<template>
  <div class="coming-soon-container">
    <el-empty description="该功能正在开发中，敬请期待">
      <template #image>
        <el-icon :size="120" color="#909399">
          <Tools />
        </el-icon>
      </template>
      <div class="feature-info">
        <h2>{{ displayTitle }}</h2>
        <p v-if="displayDescription" class="description">{{ displayDescription }}</p>
        <el-tag type="info" size="large">待开发</el-tag>
      </div>
    </el-empty>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Tools } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

const route = useRoute()

const displayTitle = computed(() => {
  return props.title || route.meta?.title || '功能开发中'
})

const displayDescription = computed(() => {
  return props.description || route.meta?.description || ''
})
</script>

<style scoped>
.coming-soon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 500px;
}

.feature-info {
  margin-top: 20px;
}

.feature-info h2 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 24px;
}

.description {
  margin: 10px 0 20px 0;
  color: #606266;
  font-size: 14px;
}
</style>
