<!--
  基础配置表单示例
  演示如何使用 EditorFormRenderer
-->
<template>
  <div class="config-demo">
    <h3>基础配置示例</h3>

    <!-- 使用表单渲染器 -->
    <EditorFormRenderer
      :schema="basicComponentSchema"
      v-model="componentData"
    />

    <!-- 显示当前数据 -->
    <div class="data-preview">
      <h4>当前数据：</h4>
      <pre>{{ JSON.stringify(componentData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EditorFormRenderer from './EditorFormRenderer.vue'
import { basicComponentSchema } from './formSchemas.js'

const componentData = ref({
  id: '1772698090346',
  name: '折线图',
  w: 400,
  h: 300,
  x: 197,
  y: 77,
  rotation: 0
})
</script>

<style scoped>
.config-demo {
  padding: 20px;
  background: #1a1a1a;
  color: #fff;
}

h3 {
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.85);
}

.data-preview {
  margin-top: 30px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.data-preview h4 {
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
}

.data-preview pre {
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  line-height: 1.6;
}
</style>
