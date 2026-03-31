<template>
  <div class="dashboard">
    <a-row :gutter="20">
      <a-col :span="24">
        <div class="welcome-card">
          <h1>欢迎使用 Nocokit 低代码开发平台</h1>
          <p class="subtitle">企业级低代码/无代码开发平台（PaaS）</p>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="20" style="margin-top: 20px">
      <a-col :span="8">
        <a-card shadow="hover">
          <template #header>
            <div class="card-header">
              <DataBoard />
              <span>大屏编辑器</span>
            </div>
          </template>
          <p>拖拽式可视化大屏设计，支持炫酷图表与 3D 可视化</p>
          <a-tag type="info">待开发</a-tag>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card shadow="hover">
          <template #header>
            <div class="card-header">
              <Document />
              <span>报表编辑器</span>
            </div>
          </template>
          <p>类 Excel 体验，支持复杂表头与分页打印</p>
          <a-tag type="info">待开发</a-tag>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card shadow="hover">
          <template #header>
            <div class="card-header">
              <Notebook />
              <span>页面编辑器</span>
            </div>
          </template>
          <p>流式布局，快速构建业务后台与表单应用</p>
          <a-tag type="info">待开发</a-tag>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="20" style="margin-top: 20px">
      <a-col :span="24">
        <a-card>
          <template #header>
            <div class="card-header">
              <InfoFilled />
              <span>平台开发进度</span>
            </div>
          </template>
          <a-timeline>
            <a-timeline-item timestamp="Phase 1 - MVP" placement="top">
              <a-card>
                <h4>最小可行性产品</h4>
                <p>系统管理（用户/角色）、数据源管理、大屏编辑器核心功能</p>
                <a-tag type="warning">进行中</a-tag>
              </a-card>
            </a-timeline-item>
            <a-timeline-item timestamp="Phase 2" placement="top">
              <a-card>
                <h4>业务深化</h4>
                <p>网页编辑器、权限深化、数据交互增强</p>
                <a-tag type="info">规划中</a-tag>
              </a-card>
            </a-timeline-item>
            <a-timeline-item timestamp="Phase 3" placement="top">
              <a-card>
                <h4>全能型平台</h4>
                <p>报表编辑器、多租户 SaaS 化、3D 地球与高级可视化</p>
                <a-tag type="info">规划中</a-tag>
              </a-card>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { DashboardOutlined, FileOutlined, BookOutlined, InfoCircleFilled } from '@ant-design/icons-vue'
</script>

