import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/MainLayout.vue'
import ComingSoon from '@/components/ComingSoon.vue'
import ProjectList from '@/views/ProjectList.vue'
import SystemMonitor from '@/views/SystemMonitor.vue'
import DatasourceMonitor from '@/views/DatasourceMonitor.vue'
import TemplateLibrary from '@/views/TemplateLibrary.vue'
import SystemSettings from '@/views/SystemSettings.vue'

/**
 * NocoViz 私有化部署版路由配置
 * 企业级内网部署专用
 */

const routes = [
  {
    path: '/',
    redirect: '/projects'
  },
  {
    path: '/',
    component: Layout,
    children: [
      // ========== 工作台 ==========
      {
        path: 'projects',
        name: 'ProjectList',
        component: ProjectList,
        meta: { title: '项目管理', hideLayoutHeader: true }
      },
      {
        path: 'datasource',
        name: 'Datasource',
        component: () => import('@/views/DatasourceManagement.vue'),
        meta: { title: '数据源管理', hideLayoutHeader: true }
      },
      {
        path: 'playlist',
        name: 'PlaylistManagement',
        component: () => import('@/views/PlaylistManagement.vue'),
        meta: { title: '轮播管理' }
      },
      {
        path: 'templates',
        name: 'Templates',
        component: TemplateLibrary,
        meta: { title: '企业模板库', hideLayoutHeader: true }
      },

      // ========== 资产管理 ==========
      {
        path: 'media',
        name: 'MediaLibrary',
        component: () => import('@/views/MediaLibrary.vue'),
        meta: { title: '媒体资源库', hideLayoutHeader: true }
      },
      {
        path: 'components',
        name: 'CustomComponents',
        component: () => import('@/views/CustomComponents.vue'),
        meta: { title: '自定义组件', hideLayoutHeader: true }
      },

      // ========== 安全与权限 ==========
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/OrganizationManagement.vue'),
        meta: { title: '组织架构', hideLayoutHeader: true }
      },
      {
        path: 'roles',
        name: 'RolePermission',
        component: () => import('@/views/RolePermission.vue'),
        meta: { title: '角色权限', hideLayoutHeader: true }
      },
      {
        path: 'audit',
        name: 'AuditLog',
        component: () => import('@/views/AuditLog.vue'),
        meta: { title: '审计日志', hideLayoutHeader: true }
      },

      // ========== 运维中心 ==========
      {
        path: 'monitor',
        name: 'SystemMonitor',
        component: SystemMonitor,
        meta: { title: '系统监控' }
      },
      {
        path: 'datasource-monitor',
        name: 'DatasourceMonitor',
        component: DatasourceMonitor,
        meta: { title: '数据源监控' }
      },
      {
        path: 'integration',
        name: 'IntegrationPublish',
        component: () => import('@/views/IntegrationPublish.vue'),
        meta: { title: '集成发布' }
      },

      // ========== 系统设置 ==========
      {
        path: 'settings',
        name: 'SystemSettings',
        component: SystemSettings,
        meta: { title: '系统配置', hideLayoutHeader: true }
      },
      {
        path: 'whitelist',
        name: 'IPWhitelist',
        component: () => import('@/views/IPWhitelist.vue'),
        meta: { title: 'IP 白名单', hideLayoutHeader: true }
      },
      {
        path: 'backup',
        name: 'BackupRestore',
        component: () => import('@/views/BackupRestore.vue'),
        meta: { title: '备份恢复', hideLayoutHeader: true }
      },
      {
        path: 'recycle',
        name: 'Recycle',
        component: () => import('@/views/RecycleBin.vue'),
        meta: { title: '回收站' }
      }
    ]
  },
  {
    path: '/editor/report/:id',
    name: 'ReportEditor',
    component: () => import('@/views/ReportEditor.vue'),
    meta: { title: '报表编辑器' }
  },
  {
    path: '/editor/screen/:id',
    name: 'ScreenEditor',
    component: () => import('@/views/ScreenEditor.vue'),
    meta: { title: '大屏编辑器' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404', hideLayoutHeader: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
