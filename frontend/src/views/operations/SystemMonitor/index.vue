<template>
  <SimpleCrudPage
    :breadcrumb="[
      { label: '首页', path: '/' },
      { label: '运维中心', path: '/monitor' },
      { label: '系统监控' }
    ]"
    :config="datasourceConfig"
    :data="filteredDatasources"
    :loading="loading"
    @search="handleSearch"
    @refresh="handleRefresh"
    @row-action="handleRowAction"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import SimpleCrudPage from '@/components/simple/SimpleCrudPage.vue'
import { datasourceConfig } from './datasourceConfig'
import { message } from 'ant-design-vue'

// 搜索关键词
const searchQuery = ref('')

// 加载状态
const loading = ref(false)

// 数据源状态
const datasources = ref([
  { id: 1, name: '生产数据库', type: 'MySQL', host: '192.168.1.100:3306', status: 'online', responseTime: 12, connections: 45 },
  { id: 2, name: 'Redis 缓存', type: 'Redis', host: '192.168.1.101:6379', status: 'online', responseTime: 3, connections: 128 },
  { id: 3, name: '业务数据仓库', type: 'PostgreSQL', host: '192.168.1.102:5432', status: 'online', responseTime: 28, connections: 23 },
  { id: 4, name: 'MongoDB 集群', type: 'MongoDB', host: '192.168.1.103:27017', status: 'offline', responseTime: 0, connections: 0 }
])

// 过滤后的数据源
const filteredDatasources = computed(() => {
  if (!searchQuery.value) return datasources.value

  const query = searchQuery.value.toLowerCase()
  return datasources.value.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.type.toLowerCase().includes(query) ||
    item.host.toLowerCase().includes(query)
  )
})

// 处理搜索
const handleSearch = (searchParams) => {
  searchQuery.value = searchParams.keyword || ''
}

// 刷新数据
const handleRefresh = async () => {
  loading.value = true
  message.info('正在刷新数据源状态...')

  // 模拟刷新延迟
  setTimeout(() => {
    loading.value = false
    message.success('刷新成功')
  }, 1000)
}

// 处理行操作
const handleRowAction = (actionKey, row) => {
  if (actionKey === 'test') {
    message.info(`正在测试 ${row.name} 的连接...`)
  } else if (actionKey === 'view') {
    message.info(`查看 ${row.name} 的详细信息`)
  }
}
</script>
