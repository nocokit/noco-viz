<template>
  <div class="enhanced-monitor">
    <PageHeader
      title="系统监控"
      description="实时监控系统资源和应用状态"
      :actions="[
        { text: '刷新', icon: 'Refresh', handler: loadMonitorData },
        { text: '导出报告', icon: 'Download', handler: exportReport }
      ]"
    />

    <!-- 关键指标卡片 -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon cpu">
          <i class="icon-cpu"></i>
        </div>
        <div class="metric-content">
          <div class="metric-label">CPU使用率</div>
          <div class="metric-value">{{ systemData.cpu?.usage || 0 }}%</div>
          <div class="metric-trend">{{ systemData.cpu?.cores || 0 }} 核心</div>
        </div>
        <div class="metric-chart">
          <div class="progress-ring" :style="{ '--progress': systemData.cpu?.usage || 0 }"></div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon memory">
          <i class="icon-memory"></i>
        </div>
        <div class="metric-content">
          <div class="metric-label">内存使用</div>
          <div class="metric-value">{{ systemData.memory?.usagePercent || 0 }}%</div>
          <div class="metric-trend">{{ systemData.memory?.used || '0 GB' }} / {{ systemData.memory?.total || '0 GB' }}</div>
        </div>
        <div class="metric-chart">
          <div class="progress-ring" :style="{ '--progress': systemData.memory?.usagePercent || 0 }"></div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon users">
          <i class="icon-users"></i>
        </div>
        <div class="metric-content">
          <div class="metric-label">在线用户</div>
          <div class="metric-value">{{ appData.users?.active || 0 }}</div>
          <div class="metric-trend">总用户: {{ appData.users?.total || 0 }}</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon projects">
          <i class="icon-projects"></i>
        </div>
        <div class="metric-content">
          <div class="metric-label">项目总数</div>
          <div class="metric-value">{{ appData.projects?.total || 0 }}</div>
          <div class="metric-trend">已发布: {{ appData.projects?.published || 0 }}</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>系统资源趋势</h3>
          <el-radio-group v-model="timeRange" size="small">
            <el-radio-button label="1h">1小时</el-radio-button>
            <el-radio-button label="6h">6小时</el-radio-button>
            <el-radio-button label="24h">24小时</el-radio-button>
          </el-radio-group>
        </div>
        <div class="chart-body" ref="resourceChart" style="height: 300px;"></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h3>数据源状态分布</h3>
        </div>
        <div class="chart-body" ref="datasourceChart" style="height: 300px;"></div>
      </div>
    </div>

    <!-- 数据源健康状态 -->
    <div class="health-section">
      <h3 class="section-title">数据源健康状态</h3>
      <el-table :data="datasourceHealth" style="width: 100%">
        <el-table-column prop="name" label="数据源名称" width="200" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '正常' : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastTestAt" label="最后检测时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.lastTestAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="lastTestResult" label="检测结果" />
      </el-table>
    </div>

    <!-- 最近活动 -->
    <div class="activity-section">
      <h3 class="section-title">最近活动</h3>
      <div class="activity-list">
        <div v-for="activity in activities" :key="activity.id" class="activity-item">
          <div class="activity-icon">
            <i :class="getActivityIcon(activity.action)"></i>
          </div>
          <div class="activity-content">
            <div class="activity-title">{{ activity.description }}</div>
            <div class="activity-meta">
              <span>{{ activity.user?.username || '系统' }}</span>
              <span>{{ formatTime(activity.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import PageHeader from '@/components/PageHeader.vue'
import {
  getMonitorData,
  getDatasourceHealth
} from '@/api/monitor'

const timeRange = ref('1h')
const systemData = ref({})
const appData = ref({})
const activities = ref([])
const datasourceHealth = ref([])
const resourceChart = ref(null)
const datasourceChart = ref(null)
let resourceChartInstance = null
let datasourceChartInstance = null
let refreshTimer = null

// 加载监控数据
const loadMonitorData = async () => {
  try {
    const data = await getMonitorData()
    systemData.value = data.system || {}
    appData.value = data.application || {}
    activities.value = data.activities || []

    // 更新图表
    updateResourceChart()
    updateDatasourceChart(data.application)
  } catch (error) {
    console.error('加载监控数据失败:', error)
    ElMessage.error('加载监控数据失败')
  }
}

// 加载数据源健康状态
const loadDatasourceHealth = async () => {
  try {
    const data = await getDatasourceHealth()
    datasourceHealth.value = data
  } catch (error) {
    console.error('加载数据源健康状态失败:', error)
  }
}

// 更新资源图表
const updateResourceChart = () => {
  if (!resourceChartInstance) {
    resourceChartInstance = echarts.init(resourceChart.value)
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['CPU', '内存']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: generateTimeLabels()
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: 'CPU',
        type: 'line',
        smooth: true,
        data: generateRandomData(),
        itemStyle: { color: '#409eff' },
        areaStyle: { opacity: 0.3 }
      },
      {
        name: '内存',
        type: 'line',
        smooth: true,
        data: generateRandomData(),
        itemStyle: { color: '#67c23a' },
        areaStyle: { opacity: 0.3 }
      }
    ]
  }

  resourceChartInstance.setOption(option)
}

// 更新数据源图表
const updateDatasourceChart = (appData) => {
  if (!datasourceChartInstance) {
    datasourceChartInstance = echarts.init(datasourceChart.value)
  }

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '数据源状态',
        type: 'pie',
        radius: '50%',
        data: [
          { value: appData.datasets?.active || 0, name: '活跃', itemStyle: { color: '#67c23a' } },
          { value: appData.datasets?.inactive || 0, name: '未激活', itemStyle: { color: '#909399' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  datasourceChartInstance.setOption(option)
}

// 生成时间标签
const generateTimeLabels = () => {
  const labels = []
  for (let i = 11; i >= 0; i--) {
    labels.push(`${i * 5}分钟前`)
  }
  return labels
}

// 生成随机数据（模拟）
const generateRandomData = () => {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 40 + 30))
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

// 获取活动图标
const getActivityIcon = (action) => {
  const iconMap = {
    create: 'el-icon-plus',
    update: 'el-icon-edit',
    delete: 'el-icon-delete',
    login: 'el-icon-user'
  }
  return iconMap[action] || 'el-icon-info'
}

// 导出报告
const exportReport = () => {
  ElMessage.info('导出报告功能开发中...')
}

// 组件挂载
onMounted(() => {
  loadMonitorData()
  loadDatasourceHealth()

  // 每30秒刷新一次
  refreshTimer = setInterval(() => {
    loadMonitorData()
    loadDatasourceHealth()
  }, 30000)

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    resourceChartInstance?.resize()
    datasourceChartInstance?.resize()
  })
})

// 组件卸载
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  resourceChartInstance?.dispose()
  datasourceChartInstance?.dispose()
})
</script>

<style scoped>
.enhanced-monitor {
  padding: 24px;
  background: var(--el-bg-color);
  min-height: 100vh;
}

/* 指标卡片 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.metric-icon.cpu { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.metric-icon.memory { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
.metric-icon.users { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
.metric-icon.projects { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; }

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1;
  margin-bottom: 4px;
}

.metric-trend {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.metric-chart {
  width: 60px;
  height: 60px;
}

.progress-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    var(--el-color-primary) calc(var(--progress) * 1%),
    var(--el-fill-color-light) 0
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 图表区域 */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

/* 健康状态 */
.health-section,
.activity-section {
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
}

/* 活动列表 */
.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--el-fill-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-color-primary);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.activity-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  display: flex;
  gap: 16px;
}
</style>
