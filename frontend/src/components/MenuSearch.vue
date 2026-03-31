<template>
  <div class="menu-search">
    <a-button :icon="Search" circle @click="openSearch" />

    <a-modal
      v-model="visible"
      title="菜单搜索"
      width="600px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <a-input
        v-model="searchKeyword"
        placeholder="搜索菜单..."
        :prefix-icon="Search"
        clearable
        autofocus
        @input="handleSearch"
      />

      <div class="search-results">
        <a-empty v-if="searchResults.length === 0 && searchKeyword" description="暂无搜索结果" />

        <div v-else class="result-list">
          <div
            v-for="item in searchResults"
            :key="item.path"
            class="result-item"
            @click="handleSelect(item)"
          >
            
              <component :is="iconMap[item.icon]" />
            
            <div class="result-content">
              <div class="result-title" v-html="highlightText(item.title)"></div>
              <div class="result-path">{{ item.breadcrumb }}</div>
            </div>
            <Right />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined, RightOutlined } from '@ant-design/icons-vue'
import { menuConfig } from '@/config/menu'
import { SearchOutlined, RightOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const visible = ref(false)
const searchKeyword = ref('')
const searchResults = ref([])

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

// 打开搜索框
const openSearch = () => {
  visible.value = true
  searchKeyword.value = ''
  searchResults.value = []
}

// 递归遍历菜单，收集所有可访问的菜单项
const flattenMenu = (menus, parentBreadcrumb = []) => {
  const result = []

  menus.forEach(menu => {
    const breadcrumb = [...parentBreadcrumb, menu.title]

    if (menu.path) {
      result.push({
        id: menu.id,
        title: menu.title,
        path: menu.path,
        icon: menu.icon,
        breadcrumb: breadcrumb.join(' / ')
      })
    }

    if (menu.children && menu.children.length > 0) {
      result.push(...flattenMenu(menu.children, breadcrumb))
    }
  })

  return result
}

// 所有菜单项的扁平列表
const allMenuItems = computed(() => flattenMenu(menuConfig))

// 搜索处理
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    return
  }

  const keyword = searchKeyword.value.toLowerCase()
  searchResults.value = allMenuItems.value.filter(item =>
    item.title.toLowerCase().includes(keyword) ||
    item.breadcrumb.toLowerCase().includes(keyword)
  )
}

// 高亮搜索关键词
const highlightText = (text) => {
  if (!searchKeyword.value) return text

  const keyword = searchKeyword.value
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 选择搜索结果
const handleSelect = (item) => {
  router.push(item.path)
  visible.value = false
}
</script>

