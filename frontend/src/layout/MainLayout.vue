<template>
  <a-layout style="min-height: 100vh">
    <!-- 侧边栏 -->
    <a-layout-sider
      :width="240"
      :style="{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#fff',
        borderRight: '1px solid #f0f0f0'
      }"
    >
      <!-- Logo -->
      <a-flex justify="center" align="center" :style="{ height: '64px', padding: '16px', borderBottom: '1px solid #f0f0f0' }">
        <a-typography-title :level="4" :style="{ margin: 0, color: '#1890ff' }">
          Noco<span>Viz</span>
        </a-typography-title>
      </a-flex>

      <!-- 菜单 -->
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        theme="light"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>

    <!-- 主内容区 -->
    <a-layout :style="{ marginLeft: '240px', height: '100vh', display: 'flex', flexDirection: 'column' }">
      <!-- 顶部栏 -->
      <a-layout-header v-if="!route.meta.hideLayoutHeader" :style="{ background: 'var(--ant-color-bg-container)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
        <!-- ProjectList 特有 Header -->
        <template v-if="route.name === 'ProjectList'">
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="all" tab="全部项目 (8)" />
            <a-tab-pane key="mine" tab="我创建的" />
            <a-tab-pane key="collab" tab="协作项目" />
          </a-tabs>

          <a-space>
            <a-input-search
              placeholder="搜索项目..."
              style="width: 200px"
            />
            <a-button type="primary">
              <template #icon><PlusOutlined /></template>
              新建大屏
            </a-button>
          </a-space>
        </template>

        <!-- 其他页面通用 Header -->
        <template v-else>
          <a-typography-title :level="4" :style="{ margin: 0 }">
            {{ route.meta.title }}
          </a-typography-title>
        </template>

        <!-- 用户菜单 -->
        <a-dropdown v-if="userStore.isLoggedIn">
          <a-avatar :size="32">
            {{ userStore.userInfo?.username?.charAt(0)?.toUpperCase() || 'U' }}
          </a-avatar>
          <template #overlay>
            <a-menu @click="handleUserCommand">
              <a-menu-item key="profile" disabled>
                <a-space direction="vertical" :size="0">
                  <a-typography-text strong>{{ userStore.userInfo?.username || '用户' }}</a-typography-text>
                  <a-typography-text type="secondary" :style="{ fontSize: '12px' }">{{ userStore.userInfo?.email || '' }}</a-typography-text>
                </a-space>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="profile">
                <UserOutlined />
                个人资料
              </a-menu-item>
              <a-menu-item key="settings">
                <SettingOutlined />
                账户设置
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout">
                <LogoutOutlined />
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content :style="{
        padding: route.meta.hideLayoutHeader ? '0' : '16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }">
        <router-view v-slot="{ Component }">
          <component :is="Component" :key="route.path" style="height: 100%; display: flex; flex-direction: column;" />
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  AppstoreOutlined,
  DollarOutlined,
  FileTextOutlined,
  PictureOutlined,
  InboxOutlined,
  BankOutlined,
  UserOutlined,
  FileOutlined,
  DesktopOutlined,
  ApiOutlined,
  UploadOutlined,
  SettingOutlined,
  LockOutlined,
  FolderOpenOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  KeyOutlined,
  LogoutOutlined,
  GlobalOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'
import { menuConfig } from '@/config/menu'
import { useUserStore } from '@/store'
import { h } from 'vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('all')

// 图标映射
const iconMap = {
  Grid: AppstoreOutlined,
  Coin: DollarOutlined,
  DocumentCopy: FileTextOutlined,
  Picture: PictureOutlined,
  Box: InboxOutlined,
  OfficeBuilding: BankOutlined,
  UserFilled: UserOutlined,
  Document: FileOutlined,
  Monitor: DesktopOutlined,
  Connection: ApiOutlined,
  Upload: UploadOutlined,
  Setting: SettingOutlined,
  Lock: LockOutlined,
  FolderOpened: FolderOpenOutlined,
  Delete: DeleteOutlined,
  VideoPlay: PlayCircleOutlined,
  Avatar: UserOutlined,
  Key: KeyOutlined,
  User: UserOutlined,
  SwitchButton: LogoutOutlined,
  GlobalOutlined: GlobalOutlined
}

// 转换菜单配置为 Ant Design Menu items 格式
const menuItems = computed(() => {
  return menuConfig.map(group => ({
    type: 'group',
    label: group.label,
    key: group.id,
    children: group.items.map(item => ({
      key: item.path,
      icon: h(iconMap[item.icon] || AppstoreOutlined),
      label: item.title,
    }))
  }))
})

// 当前选中的菜单
const selectedKeys = computed(() => [route.path])

// 处理菜单点击
const handleMenuClick = ({ key }) => {
  router.push(key)
}

// 处理用户菜单命令
const handleUserCommand = async ({ key }) => {
  switch (key) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      Modal.confirm({
        title: '提示',
        content: '确定要退出登录吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          userStore.logout()
          message.success('已退出登录')
          router.push('/login')
        }
      })
      break
  }
}
</script>
