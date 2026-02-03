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
          <i class="el-icon-database"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.total || 0 }}</div>
          <div class="stat-label">数据源总数</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon active">
          <i class="el-icon-success"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.byStatus?.active || 0 }}</div>
          <div class="stat-label">正常运行</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon error">
          <i class="el-icon-error"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.byStatus?.error || 0 }}</div>
          <div class="stat-label">连接异常</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon inactive">
          <i class="el-icon-warning"></i>
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
      <el-table
        :data="datasources"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column prop="name" label="数据源名称" width="200">
          <template #default="{ row }">
            <div class="ds-name">
              <span class="ds-icon" :class="row.type"></span>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.status)"
              size="small"
            >
              <i :class="getStatusIcon(row.status)"></i>
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="lastTestAt" label="最后检测" width="180">
          <template #default="{ row }">
            {{ formatTime(row.lastTestAt) }}
          </template>
        </el-table-column>

        <el-table-column prop="lastTestResult" label="检测结果" min-width="200">
          <template #default="{ row }">
            <span :class="{ 'text-success': row.isHealthy, 'text-error': !row.isHealthy }">
              {{ row.lastTestResult || '-' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              @click="testConnection(row)"
              :loading="row.testing"
            >
              测试连接
            </el-button>
            <el-button
              size="small"
              type="primary"
              link
              @click="viewDetails(row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailsVisible"
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
          <el-tag :type="getStatusType(currentDatasource.status)">
            {{ getStatusText(currentDatasource.status) }}
          </el-tag>
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
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
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
    ElMessage.error('加载数据失败')
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
      ElMessage.success(`连接测试成功，延迟: ${result.latency}ms`)
      await loadData()
    } else {
      ElMessage.error(result.message || '连接测试失败')
    }
  } catch (error) {
    console.error('测试连接失败:', error)
    ElMessage.error('测试连接失败')
  } finally {
    datasource.testing = false
  }
}

// 批量测试
const batchTest = () => {
  ElMessage.info('批量测试功能开发中...')
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
    active: 'el-icon-success',
    inactive: 'el-icon-warning',
    error: 'el-icon-error'
  }
  return iconMap[status] || 'el-icon-info'
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

<style scoped>
.datasource-monitor {
  padding: 24px;
  background: var(--el-bg-color);
  min-height: 100vh;
}

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-item {
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-icon.total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon.active { background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%); }
.stat-icon.error { background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%); }
.stat-icon.inactive { background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%); }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

/* 类型分布 */
.type-distribution {
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.type-distribution h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
}

/* 数据源表格 */
.datasource-table {
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.ds-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ds-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.ds-icon.mysql { background: #00758f; }
.ds-icon.postgresql { background: #336791; }
.ds-icon.mongodb { background: #47a248; }
.ds-icon.redis { background: #dc382d; }
.ds-icon.restapi { background: #61affe; }
.ds-icon.graphql { background: #e10098; }

.text-success {
  color: var(--el-color-success);
}

.text-error {
  color: var(--el-color-danger);
}

/* 详情对话框 */
.details-content {
  padding: 20px 0;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item label {
  width: 120px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
}

.detail-item span {
  flex: 1;
  color: var(--el-text-color-primary);
}
</style>
