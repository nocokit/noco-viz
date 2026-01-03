import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/MainLayout.vue'
import ComingSoon from '@/components/ComingSoon.vue'
import ProjectList from '@/views/workspace/ProjectList.vue'
import SystemMonitor from '@/views/operations/SystemMonitor.vue'
import DatasourceMonitor from '@/views/operations/DatasourceMonitor.vue'
import TemplateLibrary from '@/views/workspace/TemplateLibrary.vue'
import SystemSettings from '@/views/settings/SystemSettings.vue'

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
        path: 'connections',
        name: 'Connections',
        component: () => import('@/views/workspace/ConnectionManagement.vue'),
        meta: { title: '连接配置', hideLayoutHeader: true }
      },
      {
        path: 'datasets',
        name: 'Datasets',
        component: () => import('@/views/workspace/DatasetManagementNew.vue'),
        meta: { title: '数据集管理', hideLayoutHeader: true }
      },
      {
        path: 'playlist',
        name: 'PlaylistManagement',
        component: () => import('@/views/workspace/PlaylistManagement.vue'),
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
        component: () => import('@/views/assets/MediaLibrary.vue'),
        meta: { title: '媒体资源库', hideLayoutHeader: true }
      },
      {
        path: 'components',
        name: 'CustomComponents',
        component: () => import('@/views/assets/CustomComponents.vue'),
        meta: { title: '自定义组件', hideLayoutHeader: true }
      },

      // ========== 安全与权限 ==========
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/security/OrganizationManagement.vue'),
        meta: { title: '组织架构', hideLayoutHeader: true }
      },
      {
        path: 'role-list',
        name: 'RoleList',
        component: () => import('@/views/security/RoleList.vue'),
        meta: { title: '角色列表', hideLayoutHeader: true }
      },
      {
        path: 'role-permission',
        name: 'RolePermission',
        component: () => import('@/views/security/RolePermission.vue'),
        meta: { title: '角色权限', hideLayoutHeader: true }
      },
      {
        path: 'audit',
        name: 'AuditLog',
        component: () => import('@/views/security/AuditLog.vue'),
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
        component: () => import('@/views/operations/IntegrationPublish.vue'),
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
        component: () => import('@/views/settings/IPWhitelist.vue'),
        meta: { title: 'IP 白名单', hideLayoutHeader: true }
      },
      {
        path: 'backup',
        name: 'BackupRestore',
        component: () => import('@/views/settings/BackupRestore.vue'),
        meta: { title: '备份恢复', hideLayoutHeader: true }
      },
      {
        path: 'recycle',
        name: 'Recycle',
        component: () => import('@/views/settings/RecycleBin.vue'),
        meta: { title: '回收站' }
      }
    ]
  },
  {
    path: '/editor/report/:id',
    name: 'ReportEditor',
    component: () => import('@/views/editor/ReportEditor.vue'),
    meta: { title: '报表编辑器' }
  },
  {
    path: '/editor/screen/:id',
    name: 'ScreenEditor',
    component: () => import('@/views/editor/ScreenEditor/index.vue'),
    meta: { title: '大屏编辑器' }
  },
  {
    path: '/datasource/excel/:id',
    name: 'ExcelDataDetail',
    component: () => import('@/views/datasource/ExcelDataDetail.vue'),
    meta: { title: 'Excel数据源详情' }
  },
  {
    path: '/preview/:id',
    name: 'Preview',
    component: () => import('@/views/preview/PreviewScreen.vue'),
    meta: { title: '大屏预览' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/common/NotFound.vue'),
    meta: { title: '404', hideLayoutHeader: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
