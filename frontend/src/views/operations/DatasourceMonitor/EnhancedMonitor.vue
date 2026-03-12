<template>
  <div class="datasource-monitor">
    <PageHeader
      title="数据源监控"
      description="实时监控数据源连接状态和性能"
      :actions="[
        { text: '刷新', icon: 'Refresh', handler: loadData },
        { text: '批量测试', icon: 'Connection', handler: batchTest, type: 'primary' }
      ]"
    />

    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="stat-item">
        <div class="stat-icon total">
          <DatabaseOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.total || 0 }}</div>
          <div class="stat-label">数据源总数</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon active">
          <CheckCircleOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.byStatus?.active || 0 }}</div>
          <div class="stat-label">正常运行</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon error">
          <CloseCircleOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.byStatus?.error || 0 }}</div>
          <div class="stat-label">连接异常</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon inactive">
          <WarningOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.byStatus?.inactive || 0 }}</div>
          <div class="stat-label">未激活</div>
        </div>
      </div>
    </div>

    <!-- 数据源类型分布 -->
    <div class="type-distribution">
      <h3>数据源类型分布</h3>
      <div class="type-chart" ref="typeChart" style="height: 300px;"></div>
    </div>

    <!-- 数据源列表 -->
    <div class="datasource-table">
      <a-table
        :data="datasources"
        style="width: 100%"
        v-loading="loading"
      >
        <a-table-column type="selection" width="55" />

        <a-table-column prop="name" label="数据源名称" width="200">
          <template #default="{ row }">
            <div class="ds-name">
              <span class="ds-icon" :class="row.type"></span>
              {{ row.name }}
            </div>
          </template>
        </a-table-column>

        <a-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <a-tag size="small">{{ getTypeName(row.type) }}</a-tag>
          </template>
        </a-table-column>

        <a-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <a-tag
              :type="getStatusType(row.status)"
              size="small"
            >
              <i :class="getStatusIcon(row.status)"></i>
              {{ getStatusText(row.status) }}
            </a-tag>
          </template>
        </a-table-column>

        <a-table-column prop="lastTestAt" label="最后检测" width="180">
          <template #default="{ row }">
            {{ formatTime(row.lastTestAt) }}
          </template>
        </a-table-column>

        <a-table-column prop="lastTestResult" label="检测结果" min-width="200">
          <template #default="{ row }">
            <span :class="{ 'text-success': row.isHealthy, 'text-error': !row.isHealthy }">
              {{ row.lastTestResult || '-' }}
            </span>
          </template>
        </a-table-column>

        <a-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <a-button
              size="small"
              @click="testConnection(row)"
              :loading="row.testing"
            >
              测试连接
            </a-button>
            <a-button
              size="small"
              type="primary"
              link
              @click="viewDetails(row)"
            >
              详情
            </a-button>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <!-- 详情对话框 -->
    <a-modal
      v-model:value="detailsVisible"
      title="数据源详情"
      width="600px"
    >
      <div v-if="currentDatasource" class="details-content">
        <div class="detail-item">
          <label>名称：</label>
          <span>{{ currentDatasource.name }}</span>
        </div>
        <div class="detail-item">
          <label>类型：</label>
          <span>{{ getTypeName(currentDatasource.type) }}</span>
        </div>
        <div class="detail-item">
          <label>状态：</label>
          <a-tag :type="getStatusType(currentDatasource.status)">
            {{ getStatusText(currentDatasource.status) }}
          </a-tag>
        </div>
        <div class="detail-item">
          <label>最后检测时间：</label>
          <span>{{ formatTime(currentDatasource.lastTestAt) }}</span>
        </div>
        <div class="detail-item">
          <label>检测结果：</label>
          <span>{{ currentDatasource.lastTestResult }}</span>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import { DatabaseOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import PageHeader from '@/components/PageHeader.vue'
import {
  getDatasourceStats,
  getDatasourceHealth
} from '@/api/monitor'
import { testSavedConnection } from '@/api/datasource'

const loading = ref(false)
const stats = ref({})
const datasources = ref([])
const typeChart = ref(null)
let typeChartInstance = null
let refreshTimer = null
const detailsVisible = ref(false)
const currentDatasource = ref(null)

// 类型名称映射
const typeNames = {
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  mongodb: 'MongoDB',
  redis: 'Redis',
  restapi: 'REST API',
  graphql: 'GraphQL'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const [statsData, healthData] = await Promise.all([
      getDatasourceStats(),
      getDatasourceHealth()
    ])

    stats.value = statsData
    datasources.value = healthData.map(ds => ({
      ...ds,
      testing: false
    }))

    updateTypeChart()
  } catch (error) {
    console.error('加载数据失败:', error)
    message.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 更新类型分布图表
const updateTypeChart = () => {
  if (!typeChartInstance) {
    typeChartInstance = echarts.init(typeChart.value)
  }

  const typeData = Object.entries(stats.value.byType || {}).map(([type, count]) => ({
    name: getTypeName(type),
    value: count
  }))

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '数据源类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: typeData
      }
    ]
  }

  typeChartInstance.setOption(option)
}

// 测试连接
const testConnection = async (datasource) => {
  datasource.testing = true
  try {
    const result = await testSavedConnection(datasource.id)
    if (result.success) {
      message.success(`连接测试成功，延迟: ${result.latency}ms`)
      await loadData()
    } else {
      message.error(result.message || '连接测试失败')
    }
  } catch (error) {
    console.error('测试连接失败:', error)
    message.error('测试连接失败')
  } finally {
    datasource.testing = false
  }
}

// 批量测试
const batchTest = () => {
  message.info('批量测试功能开发中...')
}

// 查看详情
const viewDetails = (datasource) => {
  currentDatasource.value = datasource
  detailsVisible.value = true
}

// 获取类型名称
const getTypeName = (type) => {
  return typeNames[type] || type
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    active: 'success',
    inactive: 'info',
    error: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态图标
const getStatusIcon = (status) => {
  const iconMap = {
    active: 'CheckCircleOutlined',
    inactive: 'WarningOutlined',
    error: 'CloseCircleOutlined'
  }
  return iconMap[status] || 'InfoCircleOutlined'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    active: '正常',
    inactive: '未激活',
    error: '异常'
  }
  return textMap[status] || status
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

// 组件挂载
onMounted(() => {
  loadData()

  // 每30秒刷新一次
  refreshTimer = setInterval(() => {
    loadData()
  }, 30000)

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    typeChartInstance?.resize()
  })
})

// 组件卸载
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  typeChartInstance?.dispose()
})
</script>

