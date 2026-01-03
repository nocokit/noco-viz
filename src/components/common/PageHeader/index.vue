<template>
  <div class="page-header">
    <div class="page-header__left">
      <!-- 面包屑 -->
      <el-breadcrumb v-if="breadcrumb && breadcrumb.length > 0" separator="/" class="page-header__breadcrumb">
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumb"
          :key="index"
          :to="item.path"
        >
          {{ item.label || item }}
        </el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 标题区域 -->
      <div class="page-header__title-wrapper">
        <slot name="icon">
          <el-icon v-if="icon" :size="24" class="page-header__icon">
            <component :is="icon" />
          </el-icon>
        </slot>

        <div class="page-header__text">
          <h1 class="page-header__title">
            <slot name="title">{{ title }}</slot>
          </h1>
          <p v-if="subtitle || $slots.subtitle" class="page-header__subtitle">
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
        </div>
      </div>
    </div>

    <div class="page-header__right">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: null
  },
  breadcrumb: {
    type: Array,
    default: null
  }
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: var(--bg-card, #1a1b1e);
  border-bottom: 1px solid var(--border, #35363a);
  margin-bottom: 24px;
}

.page-header__left {
  flex: 1;
  min-width: 0;
}

.page-header__breadcrumb {
  margin-bottom: 12px;
  font-size: 14px;
}

.page-header__title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header__icon {
  color: var(--el-color-primary);
}

.page-header__text {
  min-width: 0;
}

.page-header__title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary, #e8eaed);
  margin: 0;
  line-height: 1.3;
}

.page-header__subtitle {
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
  margin: 4px 0 0 0;
  line-height: 1.5;
}

.page-header__right {
  display: flex;
  gap: 12px;
  margin-left: 24px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-header__right {
    width: 100%;
    margin-left: 0;
  }

  .page-header__title {
    font-size: 20px;
  }
}
</style>
