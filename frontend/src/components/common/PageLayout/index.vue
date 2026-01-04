<template>
  <div :class="['page-layout', { 'page-layout--with-sidebar': showSidebar }]">
    <!-- 侧边栏 -->
    <aside
      v-if="showSidebar"
      :class="[
        'page-layout__sidebar',
        `page-layout__sidebar--${sidebarPosition}`
      ]"
      :style="{ width: sidebarWidth }"
    >
      <slot name="sidebar"></slot>
    </aside>

    <!-- 主内容区 -->
    <div class="page-layout__main">
      <!-- 头部 -->
      <header
        v-if="showHeader || $slots.header"
        class="page-layout__header"
        :style="{ height: headerHeight }"
      >
        <slot name="header"></slot>
      </header>

      <!-- 内容 -->
      <main
        class="page-layout__content"
        :style="{ padding: padding }"
      >
        <slot></slot>
      </main>

      <!-- 底部 -->
      <footer v-if="$slots.footer" class="page-layout__footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showHeader: {
    type: Boolean,
    default: true
  },
  showSidebar: {
    type: Boolean,
    default: false
  },
  sidebarPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  sidebarWidth: {
    type: String,
    default: '260px'
  },
  headerHeight: {
    type: String,
    default: 'auto'
  },
  padding: {
    type: String,
    default: '24px'
  }
})
</script>

<style scoped>
.page-layout {
  display: flex;
  height: 100vh;
  background: var(--bg-page, #141517);
  overflow: hidden;
}

.page-layout--with-sidebar {
  /* 有侧边栏时的布局 */
}

.page-layout__sidebar {
  flex-shrink: 0;
  height: 100%;
  background: var(--bg-card, #1a1b1e);
  border-right: 1px solid var(--border, #35363a);
  overflow-y: auto;
  overflow-x: hidden;
}

.page-layout__sidebar--right {
  order: 2;
  border-right: none;
  border-left: 1px solid var(--border, #35363a);
}

.page-layout__sidebar::-webkit-scrollbar {
  width: 6px;
}

.page-layout__sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.page-layout__sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.page-layout__sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.page-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-width: 0;
}

.page-layout__header {
  flex-shrink: 0;
  background: var(--bg-card, #1a1b1e);
  border-bottom: 1px solid var(--border, #35363a);
}

.page-layout__content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg-page, #141517);
}

.page-layout__content::-webkit-scrollbar {
  width: 8px;
}

.page-layout__content::-webkit-scrollbar-track {
  background: transparent;
}

.page-layout__content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.page-layout__content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.page-layout__footer {
  flex-shrink: 0;
  background: var(--bg-card, #1a1b1e);
  border-top: 1px solid var(--border, #35363a);
  padding: 16px 24px;
}

@media (max-width: 768px) {
  .page-layout {
    flex-direction: column;
  }

  .page-layout__sidebar {
    width: 100% !important;
    height: auto;
    max-height: 30vh;
    border-right: none;
    border-bottom: 1px solid var(--border, #35363a);
  }

  .page-layout__sidebar--right {
    order: 0;
    border-left: none;
    border-bottom: 1px solid var(--border, #35363a);
  }

  .page-layout__content {
    padding: 16px !important;
  }

  .page-layout__footer {
    padding: 12px 16px;
  }
}
</style>
