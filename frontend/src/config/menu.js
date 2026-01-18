/**
 * NocoViz 私有化部署版菜单配置
 * 企业级内网部署专用
 */

export const menuConfig = [
  // ========== 工作台 (Workspace) ==========
  {
    id: 'workspace',
    label: '工作台',
    type: 'group',
    items: [
      {
        id: 'projects',
        title: '项目管理',
        icon: 'Grid',
        path: '/projects'
      },
      {
        id: 'playlist',
        title: '轮播管理',
        icon: 'VideoPlay',
        path: '/playlist'
      },
      {
        id: 'templates',
        title: '企业模板库',
        icon: 'DocumentCopy',
        path: '/templates'
      }
    ]
  },

  // ========== 数据中心 (Data Center) ==========
  {
    id: 'data',
    label: '数据中心',
    type: 'group',
    items: [
      {
        id: 'connections',
        title: '连接配置',
        icon: 'Connection',
        path: '/connections',
        description: '管理数据库和API连接'
      },
      {
        id: 'datasets',
        title: '数据集管理',
        icon: 'Coin',
        path: '/datasets',
        description: '管理SQL、Excel和API数据集'
      }
    ]
  },

  // ========== 资产管理 (Assets) ==========
  {
    id: 'assets',
    label: '资产管理',
    type: 'group',
    items: [
      {
        id: 'media',
        title: '媒体资源库',
        icon: 'Picture',
        path: '/media'
      },
      {
        id: 'components',
        title: '组件库',
        icon: 'Box',
        path: '/components'
      }
    ]
  },

  // ========== 安全与权限 (Security & Access) ==========
  {
    id: 'security',
    label: '安全与权限',
    type: 'group',
    items: [
      {
        id: 'org',
        title: '组织架构',
        icon: 'OfficeBuilding',
        path: '/organization'
      },
      {
        id: 'role-list',
        title: '角色列表',
        icon: 'Avatar',
        path: '/role-list',
        description: '管理系统角色'
      },
      {
        id: 'role-permission',
        title: '角色权限',
        icon: 'Key',
        path: '/role-permission',
        description: '配置角色权限'
      },
      {
        id: 'audit',
        title: '审计日志',
        icon: 'Document',
        path: '/audit'
      }
    ]
  },

  // ========== 运维中心 (Operations) ==========
  {
    id: 'operations',
    label: '运维中心',
    type: 'group',
    items: [
      {
        id: 'monitor',
        title: '系统监控',
        icon: 'Monitor',
        path: '/monitor'
      },
      {
        id: 'datasource-monitor',
        title: '数据源监控',
        icon: 'Connection',
        path: '/datasource-monitor'
      },
      {
        id: 'integration',
        title: '集成发布',
        icon: 'Upload',
        path: '/integration'
      }
    ]
  },

  // ========== 系统设置 (System) ==========
  {
    id: 'system',
    label: '系统设置',
    type: 'group',
    items: [
      {
        id: 'settings',
        title: '系统配置',
        icon: 'Setting',
        path: '/settings'
      },
      {
        id: 'whitelist',
        title: 'IP 白名单',
        icon: 'Lock',
        path: '/whitelist'
      },
      {
        id: 'backup',
        title: '备份恢复',
        icon: 'FolderOpened',
        path: '/backup'
      },
      {
        id: 'recycle',
        title: '回收站',
        icon: 'Delete',
        path: '/recycle'
      }
    ]
  }
]
