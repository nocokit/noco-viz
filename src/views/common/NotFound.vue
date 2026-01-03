<template>
  <div class="not-found">
    <div class="content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面未找到</h2>
      <p class="error-desc">抱歉，您访问的页面不存在或已被移除。</p>
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
}

.content {
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(120deg, var(--el-color-primary), #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.error-title {
  font-size: 24px;
  margin: 20px 0;
  color: var(--el-text-color-primary);
}

.error-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 30px;
}
</style>
