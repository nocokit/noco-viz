<template>
  <div class="not-found">
    <div class="content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面未找到</h2>
      <p class="error-desc">抱歉，您访问的页面不存在或已被移除。</p>
      <a-button type="primary" @click="$router.push('/')">返回首页</a-button>
    </div>
  </div>
</template>

