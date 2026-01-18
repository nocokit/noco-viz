import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store'
import Layout from '@/layout/MainLayout.vue'
import ComingSoon from '@/components/ComingSoon.vue'
import ProjectList from '@/views/workspace/ProjectList'
import SystemMonitor from '@/views/operations/SystemMonitor'
import DatasourceMonitor from '@/views/operations/DatasourceMonitor'
import TemplateLibrary from '@/views/workspace/TemplateLibrary'
import SystemSettings from '@/views/settings/SystemSettings'

/**
 * NocoViz 私有化部署版路由配置
 * 企业级内网部署专用
 */

const routes = [
  // 登录页面（无需Layout）
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/common/Login'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/projects'
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
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
        component: () => import('@/views/workspace/ConnectionManagement'),
        meta: { title: '连接配置', hideLayoutHeader: true }
      },
      {
        path: 'datasets',
        name: 'Datasets',
        component: () => import('@/views/workspace/DatasetManagement'),
        meta: { title: '数据集管理', hideLayoutHeader: true }
      },
      {
        path: 'playlist',
        name: 'PlaylistManagement',
        component: () => import('@/views/workspace/PlaylistManagement'),
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
        component: () => import('@/views/assets/MediaLibrary'),
        meta: { title: '媒体资源库', hideLayoutHeader: true }
      },
      {
        path: 'components',
        name: 'ComponentLibrary',
        component: () => import('@/views/assets/ComponentLibrary'),
        meta: { title: '组件库', hideLayoutHeader: true }
      },

      // ========== 安全与权限 ==========
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/security/UserManagement'),
        meta: { title: '用户管理', hideLayoutHeader: true }
      },
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/security/OrganizationManagement'),
        meta: { title: '组织架构', hideLayoutHeader: true }
      },
      {
        path: 'role-list',
        name: 'RoleList',
        component: () => import('@/views/security/RoleList'),
        meta: { title: '角色列表', hideLayoutHeader: true }
      },
      {
        path: 'role-permission',
        name: 'RolePermission',
        component: () => import('@/views/security/RolePermission'),
        meta: { title: '角色权限', hideLayoutHeader: true }
      },
      {
        path: 'audit',
        name: 'AuditLog',
        component: () => import('@/views/security/AuditLog'),
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
        component: () => import('@/views/operations/IntegrationPublish'),
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
        component: () => import('@/views/settings/IPWhitelist'),
        meta: { title: 'IP 白名单', hideLayoutHeader: true }
      },
      {
        path: 'backup',
        name: 'BackupRestore',
        component: () => import('@/views/settings/BackupRestore'),
        meta: { title: '备份恢复', hideLayoutHeader: true }
      },
      {
        path: 'recycle',
        name: 'Recycle',
        component: () => import('@/views/settings/RecycleBin'),
        meta: { title: '回收站', hideLayoutHeader: true }
      }
    ]
  },
  {
    path: '/editor/report/:id',
    name: 'ReportEditor',
    component: () => import('@/views/editor/ReportEditor'),
    meta: { title: '报表编辑器' }
  },
  {
    path: '/editor/screen/:id',
    name: 'ScreenEditor',
    component: () => import('@/views/ScreenEditor'),
    meta: { title: '大屏编辑器' }
  },
  {
    path: '/datasource/excel/:id',
    name: 'ExcelDataDetail',
    component: () => import('@/views/datasource/ExcelDataDetail'),
    meta: { title: 'Excel数据源详情' }
  },
  {
    path: '/preview/:id',
    name: 'Preview',
    component: () => import('@/views/preview/PreviewScreen'),
    meta: { title: '大屏预览' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/common/NotFound'),
    meta: { title: '404', hideLayoutHeader: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：认证检查
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - NocoViz` : 'NocoViz'

  // 检查是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  if (requiresAuth && !userStore.isLoggedIn) {
    // 需要认证但未登录，跳转到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    // 已登录用户访问登录页，跳转到首页
    next('/')
  } else {
    next()
  }
})

export default router
