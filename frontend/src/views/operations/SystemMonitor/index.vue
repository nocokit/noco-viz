<template>
  <div class="system-monitor">
    <!-- 系统状态卡片 -->
    <div class="monitor-grid">
      <!-- CPU 使用率 -->
      <div class="stat-card">
        <div class="card-header">
          <div class="card-icon cpu">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path d="M9 7h6v2H9V7m6 4H9v2h6v-2m6-6h-2V3c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1v2H3c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h2v2c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-2h2c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1M7 4h10v16H7V4m12 14h-1V6h1v12z" fill="currentColor"/>
            </svg>
          </div>
          <div class="card-info">
            <div class="card-label">CPU 使用率</div>
            <div class="card-value">{{ systemStats.cpu }}%</div>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill cpu" :style="{ width: systemStats.cpu + '%' }"></div>
        </div>
        <div class="card-meta">当前负载：低</div>
      </div>

      <!-- 内存使用 -->
      <div class="stat-card">
        <div class="card-header">
          <div class="card-icon memory">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path d="M17 17H7V7h10m0-2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m-1 6h-1.5V9.5h-2V11h-1v-1h-1v1H9v2h1.5v1h1v-1h2v1H15z" fill="currentColor"/>
            </svg>
          </div>
          <div class="card-info">
            <div class="card-label">内存使用</div>
            <div class="card-value">{{ systemStats.memory }}GB / 16GB</div>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill memory" :style="{ width: (systemStats.memory / 16 * 100) + '%' }"></div>
        </div>
        <div class="card-meta">可用：{{ 16 - systemStats.memory }}GB</div>
      </div>

      <!-- 磁盘空间 -->
      <div class="stat-card">
        <div class="card-header">
          <div class="card-icon disk">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path d="M6 2h12c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2m0 2v16h12V4H6m2 14h8v2H8v-2m0-4h8v2H8v-2m0-4h8v2H8v-2m0-4h8v2H8V6z" fill="currentColor"/>
            </svg>
          </div>
          <div class="card-info">
            <div class="card-label">磁盘空间</div>
            <div class="card-value">{{ systemStats.disk }}GB / 500GB</div>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill disk" :style="{ width: (systemStats.disk / 500 * 100) + '%' }"></div>
        </div>
        <div class="card-meta">使用率：{{ Math.round(systemStats.disk / 500 * 100) }}%</div>
      </div>

      <!-- 在线用户 -->
      <div class="stat-card">
        <div class="card-header">
          <div class="card-icon users">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
            </svg>
          </div>
          <div class="card-info">
            <div class="card-label">在线用户</div>
            <div class="card-value">{{ systemStats.onlineUsers }}</div>
          </div>
        </div>
        <div class="card-meta">总用户：{{ systemStats.totalUsers }}</div>
      </div>
    </div>

    <!-- 服务状态 -->
    <div class="services-section">
      <h3 class="section-title">服务状态</h3>
      <div class="services-grid">
        <div v-for="service in services" :key="service.name" class="service-item">
          <div class="service-header">
            <span class="service-status" :class="service.status"></span>
            <span class="service-name">{{ service.name }}</span>
          </div>
          <div class="service-meta">
            <span>版本：{{ service.version }}</span>
            <span>运行时长：{{ service.uptime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据源状态 -->
    <div class="datasource-section">
      <h3 class="section-title">数据源连接状态</h3>
      <div class="datasource-list">
        <div v-for="ds in datasources" :key="ds.id" class="datasource-item">
          <div class="ds-info">
            <div class="ds-icon">
              <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                <path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4M4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4m0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <div class="ds-name">{{ ds.name }}</div>
              <div class="ds-meta">{{ ds.type }} | {{ ds.host }}</div>
            </div>
          </div>
          <div class="ds-status" :class="ds.status">
            <span class="status-dot"></span>
            {{ ds.status === 'online' ? '在线' : '离线' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 系统状态数据
const systemStats = ref({
  cpu: 45,
  memory: 8.5,
  disk: 235,
  onlineUsers: 23,
  totalUsers: 156
})

// 服务状态
const services = ref([
  { name: 'Web 服务', status: 'online', version: 'v2.3.1', uptime: '15天 8小时' },
  { name: 'API 网关', status: 'online', version: 'v1.2.0', uptime: '15天 8小时' },
  { name: '任务调度器', status: 'online', version: 'v3.1.4', uptime: '10天 2小时' },
  { name: '文件服务', status: 'warning', version: 'v1.0.8', uptime: '2天 12小时' }
])

// 数据源状态
const datasources = ref([
  { id: 1, name: '生产数据库', type: 'MySQL', host: '192.168.1.100:3306', status: 'online' },
  { id: 2, name: 'Redis 缓存', type: 'Redis', host: '192.168.1.101:6379', status: 'online' },
  { id: 3, name: '业务数据仓库', type: 'PostgreSQL', host: '192.168.1.102:5432', status: 'online' },
  { id: 4, name: 'MongoDB 集群', type: 'MongoDB', host: '192.168.1.103:27017', status: 'offline' }
])
</script>

<style scoped>
.system-monitor {
  padding: 0;
}

/* 监控卡片网格 */
.monitor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: #1c1d21;
  border: 1px solid #2d2e33;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
}

.stat-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon.cpu { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.card-icon.memory { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.card-icon.disk { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.card-icon.users { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }

.card-info {
  flex: 1;
}

.card-label {
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.progress-bar {
  height: 8px;
  background: #2d2e33;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-fill.cpu { background: #3b82f6; }
.progress-fill.memory { background: #10b981; }
.progress-fill.disk { background: #f59e0b; }

.card-meta {
  font-size: 12px;
  color: #6b7280;
}

/* 服务状态 */
.services-section,
.datasource-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.service-item {
  background: #1c1d21;
  border: 1px solid #2d2e33;
  border-radius: 8px;
  padding: 16px;
}

.service-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.service-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.service-status.online { background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
.service-status.warning { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5); }
.service-status.offline { background: #ef4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); }

.service-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.service-meta {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 数据源列表 */
.datasource-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.datasource-item {
  background: #1c1d21;
  border: 1px solid #2d2e33;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.datasource-item:hover {
  border-color: #3b82f6;
}

.ds-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ds-icon {
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.ds-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 4px;
}

.ds-meta {
  font-size: 12px;
  color: #6b7280;
}

.ds-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 12px;
}

.ds-status.online {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.ds-status.offline {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
</style>
