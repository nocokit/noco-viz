<template>
  <div class="layout-container">
    <!-- 侧边菜单 -->
    <aside class="sidebar">
      <!-- Logo区域 -->
      <div class="brand">
        Noco<span>Viz</span>
      </div>

      <!-- 菜单区域 -->
      <nav class="menu-scroll">
        <div v-for="group in menuConfig" :key="group.id" class="menu-group">
          <div class="menu-label">{{ group.label }}</div>
          <router-link
            v-for="item in group.items"
            :key="item.id"
            :to="item.path"
            class="nav-item"
            :class="{ active: activeMenu === item.path }"
          >
            <component :is="iconMap[item.icon]" class="nav-icon" />
            {{ item.title }}
          </router-link>
        </div>
      </nav>

    </aside>

    <!-- 主内容区 -->
    <main class="main">
      <!-- 顶部导航 -->
      <header class="header" v-if="!route.meta.hideLayoutHeader">
        <!-- ProjectList 特有 Header -->
        <template v-if="route.name === 'ProjectList'">
          <div class="view-tabs">
            <div class="tab-item active">全部项目 (8)</div>
            <div class="tab-item">我创建的</div>
            <div class="tab-item">协作项目</div>
          </div>

          <div class="actions">
            <div class="search-box">
              <el-input
                class="search-input"
                placeholder="搜索项目..."
                prefix-icon="Search"
              />
            </div>
            <button class="btn-primary">
              <svg style="width:16px;height:16px" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
              </svg>
              新建大屏
            </button>
          </div>
        </template>
        
        <!-- 其他页面通用 Header Title -->
        <template v-else>
          <div class="page-title">{{ route.meta.title }}</div>
        </template>
      </header>

      <!-- 内容区域 -->
      <div class="content-body" :style="{ padding: route.meta.hideLayoutHeader ? '0' : '16px 16px' }">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- 用户菜单 -->
    <div class="user-menu" v-if="userStore.isLoggedIn">
      <el-dropdown @command="handleUserCommand">
        <div class="user-trigger">
          <el-avatar :size="32">
            {{ userStore.userInfo?.username?.charAt(0)?.toUpperCase() || 'U' }}
          </el-avatar>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>
              <div class="user-info-item">
                <div class="username">{{ userStore.userInfo?.username || '用户' }}</div>
                <div class="user-email">{{ userStore.userInfo?.email || '' }}</div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided command="profile">
              <el-icon><User /></el-icon>
              个人资料
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              账户设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Grid,
  Coin,
  DocumentCopy,
  Picture,
  Box,
  OfficeBuilding,
  UserFilled,
  Document,
  Monitor,
  Connection,
  Upload,
  Setting,
  Lock,
  FolderOpened,
  Delete,
  VideoPlay,
  Search,
  Avatar,
  Key,
  User,
  SwitchButton
} from '@element-plus/icons-vue'
import { menuConfig } from '@/config/menu'
import { useUserStore } from '@/store'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 图标映射
const iconMap = {
  Grid,
  Coin,
  DocumentCopy,
  Picture,
  Box,
  OfficeBuilding,
  UserFilled,
  Document,
  Monitor,
  Connection,
  Upload,
  Setting,
  Lock,
  FolderOpened,
  Delete,
  VideoPlay,
  Avatar,
  Key,
  User,
  SwitchButton
}

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 处理用户菜单命令
const handleUserCommand = async (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        userStore.logout()
        ElMessage.success('已退出登录')
        router.push('/login')
      } catch {
        // 用户取消
      }
      break
  }
}
</script>

<style scoped>
/* ========== Design Tokens ========== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* ========== Layout ========== */
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #0a0b0d;
  color: #ffffff;
}

/* ========== Sidebar ========== */
.sidebar {
  width: 260px;
  background: #141519;
  border-right: 1px solid #2d2e33;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 20;
}

/* Logo */
.brand {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #fff;
}

.brand span {
  color: #3b82f6;
}

/* Menu Area */
.menu-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.menu-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-label {
  padding: 0 12px 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Nav Item */
.nav-item {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #9ca3af;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover {
  background: #26272c;
  color: #ffffff;
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-weight: 500;
}

.nav-icon {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  opacity: 0.8;
}

/* ========== Main Content ========== */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background-image: radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.05) 0px, transparent 50%);
}

/* Header */
.header {
  height: 64px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #2d2e33;
  backdrop-filter: blur(10px);
  background: rgba(20, 21, 25, 0.8);
  z-index: 10;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

/* View Tabs */
.view-tabs {
  display: flex;
  gap: 24px;
  position: relative;
}

.tab-item {
  font-size: 14px;
  color: #9ca3af;
  cursor: pointer;
  padding: 20px 0;
  position: relative;
}

.tab-item:hover {
  color: #ffffff;
}

.tab-item.active {
  color: #ffffff;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3b82f6;
}

/* Actions */
.actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-box {
  position: relative;
  width: 240px;
}

/* .search-input removed */

.btn-primary {
  background: #3b82f6;
  color: #fff;
  border: none;
  height: 36px;
  padding: 0 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Content Body */
.content-body {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 用户菜单 */
.user-menu {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 100;
}

.user-trigger {
  cursor: pointer;
  transition: all 0.2s;
}

.user-trigger:hover {
  transform: scale(1.05);
}

.user-info-item {
  padding: 4px 0;
}

.user-info-item .username {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.user-info-item .user-email {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 16px;
}
</style>
