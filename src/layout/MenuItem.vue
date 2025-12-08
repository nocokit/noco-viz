<template>
  <template v-if="menu.type === 'submenu' && menu.children">
    <el-sub-menu :index="menu.id">
      <template #title>
        <el-icon v-if="menu.icon">
          <component :is="iconMap[menu.icon]" />
        </el-icon>
        <span>{{ menu.title }}</span>
      </template>
      <menu-item
        v-for="child in menu.children"
        :key="child.id"
        :menu="child"
        :collapse="collapse"
      />
    </el-sub-menu>
  </template>

  <template v-else>
    <el-menu-item :index="menu.path">
      <el-icon v-if="menu.icon">
        <component :is="iconMap[menu.icon]" />
      </el-icon>
      <template #title>
        <span>{{ menu.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup>
import {
  Odometer,
  Setting,
  Coin,
  DocumentCopy,
  Files,
  Document,
  UserFilled,
  Delete
} from '@element-plus/icons-vue'

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
  Delete
}
</script>
