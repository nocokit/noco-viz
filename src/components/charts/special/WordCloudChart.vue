<!--
  词云图组件（占位符）
  关键词频率可视化
  需要 echarts-wordcloud 插件
-->
<template>
  <div class="wordcloud-placeholder">
    <div class="placeholder-content">
      <svg class="placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
      </svg>
      <div class="placeholder-title">词云图</div>
      <div class="placeholder-desc">需要配置词云插件</div>
      <div class="word-samples">
        <span style="font-size: 24px; color: #3b82f6;">数据</span>
        <span style="font-size: 18px; color: #10b981;">可视化</span>
        <span style="font-size: 28px; color: #ec4899;">大屏</span>
        <span style="font-size: 16px; color: #f59e0b;">图表</span>
        <span style="font-size: 20px; color: #8b5cf6;">ECharts</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Array, default: null }
})
</script>

<style scoped>
.wordcloud-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
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
  margin-bottom: 16px;
}

.word-samples {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
  font-weight: 600;
}
</style>
