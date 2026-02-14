<template>
  <div class="breadcrumb-header">
    <div class="breadcrumb-nav">
      <template v-for="(item, index) in items" :key="index">
        <span v-if="index > 0" class="breadcrumb-separator">/</span>
        <router-link
          v-if="item.path && index < items.length - 1"
          :to="item.path"
          class="breadcrumb-item breadcrumb-link"
        >
          {{ item.label }}
        </router-link>
        <span v-else class="breadcrumb-item breadcrumb-current">
          {{ item.label }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // 面包屑项目列表
  items: {
    type: Array,
    required: true,
    // 示例：
    // [
    //   { label: '首页', path: '/' },
    //   { label: '设置', path: '/settings' },
    //   { label: 'IP白名单' }  // 最后一项不需要 path
    // ]
  }
})
</script>

<style scoped>
.breadcrumb-header {
  margin-bottom: 16px;
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
}

.breadcrumb-link {
  color: var(--el-text-color-secondary);
  text-decoration: none;
  cursor: pointer;
}

.breadcrumb-link:hover {
  color: var(--el-color-primary);
}

.breadcrumb-current {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.breadcrumb-separator {
  color: var(--el-text-color-placeholder);
  user-select: none;
}
</style>
