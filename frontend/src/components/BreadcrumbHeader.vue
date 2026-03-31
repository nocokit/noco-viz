<template>
  <div class="breadcrumb-header">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(item, index) in items" :key="index">
        <router-link v-if="item.path && index < items.length - 1" :to="item.path">
          <component v-if="item.icon" :is="item.icon" :style="{ marginRight: '4px' }" />
          {{ item.label }}
        </router-link>
        <span v-else>
          <component v-if="item.icon" :is="item.icon" :style="{ marginRight: '4px' }" />
          {{ item.label }}
        </span>
      </a-breadcrumb-item>
    </a-breadcrumb>
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
    //   { label: 'IP白名单', icon: 'LockOutlined' }  // 最后一项不需要 path，可选 icon
    // ]
  }
})
</script>

<style scoped>
.breadcrumb-header {
  width: 100%;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
</style>
