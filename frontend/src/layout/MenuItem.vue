<template>
  <template v-if="menu.type === 'submenu' && menu.children">
    <a-sub-menu :index="menu.id">
      <template #title>
        
          <component :is="iconMap[menu.icon]" />
        
        <span>{{ menu.title }}</span>
      </template>
      <menu-item
        v-for="child in menu.children"
        :key="child.id"
        :menu="child"
        :collapse="collapse"
      />
    </a-sub-menu>
  </template>

  <template v-else>
    <a-menu-item :index="menu.path">
      
        <component :is="iconMap[menu.icon]" />
      
      <template #title>
        <span>{{ menu.title }}</span>
      </template>
    </a-menu-item>
  </template>
</template>

<script setup>
import { DashboardOutlined, SettingOutlined, DollarCircleOutlined, CopyOutlined, FileOutlined, UserOutlined, DeleteOutlined, ShareAltOutlined, DesktopOutlined, ApiOutlined } from '@ant-design/icons-vue'

defineProps({
  menu: {
    type: Object,
    required: true
  },
  collapse: {
    type: Boolean,
    default: false
  }
})

// Icon 映射
const iconMap = {
  Odometer,
  Setting,
  Coin,
  DocumentCopy,
  Files,
  Document,
  UserFilled,
  Delete,
  Share,
  Monitor,
  Connection
}
</script>
