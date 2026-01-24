<template>
  <div class="card-grid" :class="gridClass">
    <div
      v-for="item in items"
      :key="item[itemKey]"
      class="card-item"
      :class="getCardClass(item)"
      @click="handleCardClick(item)"
    >
      <slot name="card" :item="item">
        <!-- 默认卡片内容 -->
        <div class="card-cover">
          <img v-if="item.cover" :src="item.cover" :alt="item.title" />
          <div v-else class="card-cover-placeholder">
            <slot name="placeholder" :item="item">
              <el-icon :size="48"><Picture /></el-icon>
            </slot>
          </div>

          <!-- 悬浮操作 -->
          <div v-if="showActions" class="card-overlay">
            <slot name="actions" :item="item">
              <el-button size="small" @click.stop="$emit('edit', item)">编辑</el-button>
              <el-button size="small" @click.stop="$emit('preview', item)">预览</el-button>
            </slot>
          </div>
        </div>

        <div class="card-body">
          <div class="card-header">
            <div class="card-title">
              <slot name="title" :item="item">{{ item.title }}</slot>
            </div>
            <div v-if="showMenu" class="card-menu">
              <el-dropdown @command="(cmd) => handleCommand(cmd, item)">
                <el-icon><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <slot name="menu" :item="item">
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                    </slot>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <div v-if="item.description" class="card-desc">
            <slot name="description" :item="item">{{ item.description }}</slot>
          </div>

          <div class="card-footer">
            <slot name="footer" :item="item">
              <span>{{ item.updatedAt }}</span>
            </slot>
          </div>
        </div>
      </slot>
    </div>

    <!-- 空状态 -->
    <div v-if="items.length === 0" class="card-empty">
      <slot name="empty">
        <el-empty :description="emptyText" />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  itemKey: { type: String, default: 'id' },
  columns: { type: Number, default: 4 },
  gap: { type: Number, default: 24 },
  showActions: { type: Boolean, default: true },
  showMenu: { type: Boolean, default: true },
  emptyText: { type: String, default: '暂无数据' },
  cardClass: { type: [String, Function], default: '' }
})

const emit = defineEmits(['click', 'edit', 'preview', 'delete', 'command'])

const gridClass = computed(() => ({
  [`grid-cols-${props.columns}`]: true
}))

const getCardClass = (item) => {
  return typeof props.cardClass === 'function'
    ? props.cardClass(item)
    : props.cardClass
}

const handleCardClick = (item) => {
  emit('click', item)
}

const handleCommand = (command, item) => {
  emit('command', { command, item })
  emit(command, item)
}
</script>

<style scoped>
.card-grid {
  display: grid;
  gap: v-bind('props.gap + "px"');
}

.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-5 { grid-template-columns: repeat(5, 1fr); }

.card-item {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.card-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.card-cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: var(--el-fill-color-light);
  overflow: hidden;
}

.card-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-cover-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-placeholder);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.card-item:hover .card-overlay {
  opacity: 1;
}

.card-body {
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-menu {
  cursor: pointer;
  color: var(--el-text-color-secondary);
}

.card-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-footer {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  display: flex;
  justify-content: space-between;
}

.card-empty {
  grid-column: 1 / -1;
  padding: 60px 0;
}
</style>
