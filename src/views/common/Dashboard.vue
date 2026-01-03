<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="welcome-card">
          <h1>欢迎使用 Nocokit 低代码开发平台</h1>
          <p class="subtitle">企业级低代码/无代码开发平台（PaaS）</p>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon size="24" color="#409EFF"><DataBoard /></el-icon>
              <span>大屏编辑器</span>
            </div>
          </template>
          <p>拖拽式可视化大屏设计，支持炫酷图表与 3D 可视化</p>
          <el-tag type="info">待开发</el-tag>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon size="24" color="#67C23A"><Document /></el-icon>
              <span>报表编辑器</span>
            </div>
          </template>
          <p>类 Excel 体验，支持复杂表头与分页打印</p>
          <el-tag type="info">待开发</el-tag>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon size="24" color="#E6A23C"><Notebook /></el-icon>
              <span>页面编辑器</span>
            </div>
          </template>
          <p>流式布局，快速构建业务后台与表单应用</p>
          <el-tag type="info">待开发</el-tag>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon size="20"><InfoFilled /></el-icon>
              <span>平台开发进度</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item timestamp="Phase 1 - MVP" placement="top">
              <el-card>
                <h4>最小可行性产品</h4>
                <p>系统管理（用户/角色）、数据源管理、大屏编辑器核心功能</p>
                <el-tag type="warning">进行中</el-tag>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="Phase 2" placement="top">
              <el-card>
                <h4>业务深化</h4>
                <p>网页编辑器、权限深化、数据交互增强</p>
                <el-tag type="info">规划中</el-tag>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="Phase 3" placement="top">
              <el-card>
                <h4>全能型平台</h4>
                <p>报表编辑器、多租户 SaaS 化、3D 地球与高级可视化</p>
                <el-tag type="info">规划中</el-tag>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { DataBoard, Document, Notebook, InfoFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 40px;
  border-radius: 8px;
  color: white;
  text-align: center;
}

.welcome-card h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

:deep(.el-card__body) {
  min-height: 100px;
}
</style>
