<template>
  <div class="page-container datasource-monitor">
    <!-- 页面头部 -->
    <PageHeader
      title="数据源监控"
      description="实时监控所有外部数据库连接池状态及响应延迟"
      :actions="[
        { text: '近 1 小时', handler: handleTimeRange },
        { text: '立即刷新', icon: 'Refresh', type: 'primary', handler: refreshAll }
      ]"
    />

    <!-- 顶部统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">总活跃连接数</div>
        <div class="stat-value">
          {{ totalActiveConnections }}
          <span class="stat-unit">/ {{ totalMaxConnections }}</span>
        </div>
        <div class="stat-trend down">
          <span>▼ 12%</span>
          <span class="trend-meta">vs 上一小时</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-label">平均查询延迟</div>
        <div class="stat-value">
          {{ avgLatency }}
          <span class="stat-unit">ms</span>
        </div>
        <div class="stat-trend" :class="avgLatency < 100 ? 'healthy' : 'warning'">
          <span>{{ avgLatency < 100 ? '健康' : '偏高' }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-label">数据源总数</div>
        <div class="stat-value">
          {{ totalCount }}
          <span class="stat-unit">个</span>
        </div>
        <div class="stat-trend">
          <span class="error-text">{{ errorCount }} 个异常</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-label">今日慢查询数</div>
        <div class="stat-value slow-query">
          {{ slowQueryCount }}
          <span class="stat-unit">次</span>
        </div>
        <div class="stat-trend up">
          <span>▲ 2</span>
          <span class="trend-meta">新增</span>
        </div>
      </div>
    </div>

    <!-- 监控面板 -->
    <div class="monitor-panel">
      <!-- 工具栏 -->
      <div class="panel-toolbar">
        <div class="filter-group">
          <button
            v-for="type in filterTypes"
            :key="type"
            class="btn"
            :class="{ active: currentFilter === type }"
            @click="currentFilter = type"
          >
            {{ type }}
          </button>
        </div>
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索数据源名称/IP..."
        >
      </div>

      <!-- 列表头 -->
      <div class="list-header">
        <div>数据源名称</div>
        <div>健康状态</div>
        <div>连接池使用率 (Active/Max)</div>
        <div>响应延迟趋势 (1h)</div>
        <div>QPS</div>
        <div style="text-align:right">操作</div>
      </div>

      <!-- 列表项 -->
      <div v-for="ds in filteredDatasources" :key="ds.id" class="list-item">
        <!-- 列1: 数据源名称 -->
        <div class="col-name">
          <div class="db-icon" :class="ds.type.toLowerCase()">
            {{ getDbIconText(ds.type) }}
          </div>
          <div class="db-info">
            <h4>{{ ds.name }}</h4>
            <p>{{ ds.type }} • {{ ds.host }}</p>
          </div>
        </div>

        <!-- 列2: 健康状态 -->
        <div>
          <span class="status-badge" :class="ds.status">
            <span class="dot"></span>
            {{ getStatusText(ds.status) }}
          </span>
        </div>

        <!-- 列3: 连接池使用率 -->
        <div class="col-pool">
          <div class="pool-bar-container">
            <div class="pool-meta">
              <span :class="getPoolUsageClass(ds)">{{ ds.activeConnections }} / {{ ds.maxConnections }}</span>
              <span>{{ Math.round((ds.activeConnections / ds.maxConnections) * 100) }}%</span>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{
                  width: (ds.activeConnections / ds.maxConnections * 100) + '%',
                  background: getProgressColor(ds)
                }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 列4: 响应延迟趋势 -->
        <div class="latency-chart">
          <div style="display:flex; align-items:center">
            <svg v-if="ds.status !== 'error'" viewBox="0 0 100 30" style="width:100px;height:30px">
              <path
                :d="ds.trendPath"
                :stroke="getLatencyColor(ds.avgResponseTime)"
                stroke-width="2"
                fill="none"
              />
            </svg>
            <span v-if="ds.status === 'error'" style="font-size:12px; color:#ef4444">
              Timeout ({{ ds.avgResponseTime }}ms)
            </span>
            <span v-else class="latency-val" :style="{ color: getLatencyColor(ds.avgResponseTime) }">
              {{ ds.avgResponseTime }}ms
            </span>
          </div>
        </div>

        <!-- 列5: QPS -->
        <div style="color:#fff; font-weight:500">
          {{ ds.qps.toLocaleString() }}
        </div>

        <!-- 列6: 操作 -->
        <div class="action-btns" style="justify-content:flex-end">
          <button class="mini-btn" @click="viewLog(ds.id)">日志</button>
          <button
            v-if="ds.status === 'warning'"
            class="mini-btn warning"
            @click="resetPool(ds.id)"
          >
            重置
          </button>
          <button
            v-else-if="ds.status === 'error'"
            class="mini-btn error"
            @click="reconnect(ds.id)"
          >
            重连
          </button>
          <button v-else class="mini-btn" @click="testConnection(ds.id)">检测</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

// 筛选类型
const filterTypes = ['全部', 'MySQL', 'Oracle', 'API']
const currentFilter = ref('全部')
const searchKeyword = ref('')

// 数据源列表
const datasources = ref([
  {
    id: 1,
    name: '生产环境_交易主库',
    type: 'MySQL',
    host: '192.168.1.100',
    status: 'healthy',
    activeConnections: 45,
    maxConnections: 200,
    avgResponseTime: 12,
    qps: 2400,
    trendPath: 'M0 25 Q10 20 20 25 T40 22 T60 25 T80 15 T100 25'
  },
  {
    id: 2,
    name: '财务数据仓库',
    type: 'Oracle',
    host: '192.168.1.102',
    status: 'warning',
    activeConnections: 92,
    maxConnections: 100,
    avgResponseTime: 450,
    qps: 850,
    trendPath: 'M0 20 Q10 25 20 15 T40 10 T60 5 T80 15 T100 10'
  },
  {
    id: 3,
    name: '第三方天气接口',
    type: 'API',
    host: 'api.weather.com',
    status: 'error',
    activeConnections: 0,
    maxConnections: 50,
    avgResponseTime: 5000,
    qps: 0,
    trendPath: ''
  },
  {
    id: 4,
    name: '用户行为分析库',
    type: 'MySQL',
    host: '192.168.1.105',
    status: 'healthy',
    activeConnections: 28,
    maxConnections: 150,
    avgResponseTime: 35,
    qps: 1850,
    trendPath: 'M0 22 Q10 18 20 20 T40 25 T60 18 T80 22 T100 20'
  },
  {
    id: 5,
    name: 'Redis 缓存集群',
    type: 'Redis',
    host: '192.168.1.110',
    status: 'healthy',
    activeConnections: 15,
    maxConnections: 100,
    avgResponseTime: 3,
    qps: 8500,
    trendPath: 'M0 28 Q10 26 20 28 T40 27 T60 29 T80 26 T100 28'
  }
])

// 计算统计数据
const totalCount = computed(() => datasources.value.length)
const errorCount = computed(() => datasources.value.filter(ds => ds.status === 'error').length)
const totalActiveConnections = computed(() =>
  datasources.value.reduce((sum, ds) => sum + ds.activeConnections, 0)
)
const totalMaxConnections = computed(() =>
  datasources.value.reduce((sum, ds) => sum + ds.maxConnections, 0)
)
const avgLatency = computed(() => {
  const validDs = datasources.value.filter(ds => ds.status !== 'error')
  if (validDs.length === 0) return 0
  return Math.round(validDs.reduce((sum, ds) => sum + ds.avgResponseTime, 0) / validDs.length)
})
const slowQueryCount = ref(15)

// 筛选后的数据源
const filteredDatasources = computed(() => {
  let result = datasources.value

  // 按类型筛选
  if (currentFilter.value !== '全部') {
    result = result.filter(ds => ds.type === currentFilter.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(ds =>
      ds.name.toLowerCase().includes(keyword) ||
      ds.host.toLowerCase().includes(keyword)
    )
  }

  return result
})

// 辅助方法
const getDbIconText = (type) => {
  const map = {
    MySQL: 'SQL',
    Oracle: 'ORA',
    API: 'API',
    Redis: 'RDS'
  }
  return map[type] || 'DB'
}

const getStatusText = (status) => {
  const map = {
    healthy: '正常',
    warning: '高负载',
    error: '连接失败'
  }
  return map[status] || '未知'
}

const getPoolUsageClass = (ds) => {
  const ratio = ds.activeConnections / ds.maxConnections
  if (ratio > 0.8) return 'pool-danger'
  if (ratio > 0.6) return 'pool-warning'
  return ''
}

const getProgressColor = (ds) => {
  const ratio = ds.activeConnections / ds.maxConnections
  if (ratio > 0.8) return '#ef4444'
  if (ratio > 0.6) return '#f59e0b'
  return '#10b981'
}

const getLatencyColor = (latency) => {
  if (latency > 200) return '#ef4444'
  if (latency > 100) return '#f59e0b'
  return '#10b981'
}

// 操作方法
const refreshAll = () => {
  ElMessage.success('正在刷新数据源状态...')
}

const handleTimeRange = () => {
  ElMessage.info('时间范围选择功能开发中...')
}

const viewLog = (id) => {
  ElMessage.info(`查看数据源 #${id} 日志`)
}

const testConnection = (id) => {
  ElMessage.info(`正在测试数据源 #${id} 连接...`)
}

const resetPool = (id) => {
  ElMessage.warning(`正在重置数据源 #${id} 连接池...`)
}

const reconnect = (id) => {
  ElMessage.error(`正在尝试重连数据源 #${id}...`)
}
</script>

<style scoped>
.datasource-monitor {
  padding: 24px;
  /* 移除 padding: 0，使用 page-container 的默认 padding */
}

/* ========== 统计卡片 ========== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  margin-top: 20px;
}

.stat-card {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
}

.stat-card:hover {
  border-color: var(--el-border-color-hover);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: var(--el-text-color-primary);
}

.stat-value.slow-query {
  color: var(--el-color-warning);
}

.stat-unit {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  font-weight: 400;
}

.stat-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.up {
  color: var(--el-color-danger);
}

.stat-trend.down {
  color: var(--el-color-success);
}

.stat-trend.healthy {
  color: var(--el-color-success);
}

.stat-trend.warning {
  color: var(--el-color-warning);
}

.trend-meta {
  color: var(--el-text-color-placeholder);
  margin-left: 4px;
}

.error-text {
  color: var(--el-color-danger);
}

/* ========== 监控面板 ========== */
.monitor-panel {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
}

/* 工具栏 */
.panel-toolbar {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-group .btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--el-border-color);
  background: transparent;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.filter-group .btn:hover {
  background: var(--el-fill-color);
  color: var(--el-text-color-primary);
}

.filter-group .btn.active {
  background: var(--el-color-primary);
  color: #fff;
  border-color: var(--el-color-primary);
}

.search-input {
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  color: var(--el-text-color-primary);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  width: 240px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--el-color-primary);
}

.search-input::placeholder {
  color: var(--el-text-color-placeholder);
}

/* 列表头 */
.list-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 2fr 1.5fr 1fr 1fr;
  padding: 12px 24px;
  background: rgba(59, 130, 246, 0.05);
  font-size: 12px;
  color: var(--el-text-color-secondary);
  font-weight: 600;
}

/* 列表项 */
.list-item {
  display: grid;
  grid-template-columns: 2fr 1.5fr 2fr 1.5fr 1fr 1fr;
  padding: 20px 24px;
  border-bottom: 1px solid var(--el-border-color);
  align-items: center;
  transition: all 0.2s;
}

.list-item:hover {
  background: var(--el-fill-color-light);
}

.list-item:last-child {
  border-bottom: none;
}

/* 列1: 数据源名称 */
.col-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.db-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--el-fill-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: var(--el-text-color-secondary);
  border: 1px solid var(--el-border-color);
}

.db-icon.mysql {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.db-icon.oracle {
  color: var(--el-color-warning);
  border-color: var(--el-color-warning);
  background: var(--el-color-warning-light-9);
}

.db-icon.api {
  color: var(--el-color-success);
  border-color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.db-icon.redis {
  color: var(--el-color-danger);
  border-color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
}

.db-info h4 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--el-text-color-primary);
}

.db-info p {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 列2: 状态徽章 */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.healthy {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.status-badge.warning {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.status-badge.error {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* 列3: 连接池使用率 */
.col-pool {
  width: 90%;
}

.pool-bar-container {
  width: 100%;
}

.pool-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--el-text-color-secondary);
  margin-bottom: 6px;
}

.pool-meta .pool-danger {
  color: var(--el-color-danger);
}

.pool-meta .pool-warning {
  color: var(--el-color-warning);
}

.progress-track {
  height: 6px;
  background: var(--el-fill-color);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s;
}

/* 列4: 延迟趋势 */
.latency-chart {
  display: flex;
  align-items: center;
}

.latency-val {
  font-size: 13px;
  font-weight: 600;
  margin-left: 8px;
}

/* 列6: 操作按钮 */
.action-btns {
  display: flex;
  gap: 8px;
}

.mini-btn {
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
  background: transparent;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.mini-btn:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.mini-btn.warning {
  border-color: var(--el-color-warning);
  color: var(--el-color-warning);
}

.mini-btn.warning:hover {
  background: var(--el-color-warning-light-9);
}

.mini-btn.error {
  border-color: var(--el-color-danger);
  color: var(--el-color-danger);
}

.mini-btn.error:hover {
  background: var(--el-color-danger-light-9);
}
</style>
