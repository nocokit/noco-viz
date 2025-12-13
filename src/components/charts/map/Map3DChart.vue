<!--
  3D地图组件（占位符）
  立体地图可视化
  注意：需要 echarts-gl 插件支持
-->
<template>
  <div class="map-3d-placeholder">
    <div class="placeholder-content">
      <svg class="placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </svg>
      <div class="placeholder-title">3D地图</div>
      <div class="placeholder-desc">需要安装 echarts-gl 插件</div>
      <code class="placeholder-code">npm install echarts-gl</code>
    </div>
  </div>
</template>

<script setup>
defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
.map-3d-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.placeholder-content {
  text-align: center;
  color: #fff;
  padding: 20px;
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  opacity: 0.8;
}

.placeholder-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.placeholder-desc {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 12px;
}

.placeholder-code {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 11px;
  font-family: 'Courier New', monospace;
}
</style>
