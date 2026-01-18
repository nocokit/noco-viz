/**
 * 权限预设模板
 * 提供常用的权限配置模板，方便快速创建角色
 */

export const permissionTemplates = [
  {
    id: 'super-admin',
    name: '超级管理员模板',
    description: '拥有系统所有权限，适用于系统管理员',
    icon: '👑',
    permissions: {
      users: ['view', 'create', 'edit', 'delete'],
      roles: ['view', 'create', 'edit', 'delete'],
      projects: ['view', 'create', 'edit', 'delete', 'publish'],
      templates: ['view', 'create', 'edit', 'delete', 'publish'],
      datasets: ['view', 'create', 'edit', 'delete'],
      connections: ['view', 'create', 'edit', 'delete'],
      media: ['view', 'upload', 'delete'],
      playlists: ['view', 'create', 'edit', 'delete'],
      system: ['view', 'config', 'backup', 'restore'],
      security: ['view', 'config']
    }
  },
  {
    id: 'project-manager',
    name: '项目经理模板',
    description: '管理项目和团队，适用于项目负责人',
    icon: '📊',
    permissions: {
      users: ['view', 'create', 'edit'],
      roles: ['view'],
      projects: ['view', 'create', 'edit', 'delete', 'publish'],
      templates: ['view', 'create', 'edit'],
      datasets: ['view', 'create', 'edit'],
      connections: ['view', 'create', 'edit'],
      media: ['view', 'upload'],
      playlists: ['view', 'create', 'edit'],
      system: ['view'],
      security: ['view']
    }
  },
  {
    id: 'content-editor',
    name: '内容编辑模板',
    description: '编辑和管理内容，适用于内容创作者',
    icon: '✏️',
    permissions: {
      users: [],
      roles: [],
      projects: ['view', 'create', 'edit'],
      templates: ['view', 'create', 'edit'],
      datasets: ['view'],
      connections: ['view'],
      media: ['view', 'upload'],
      playlists: ['view', 'create', 'edit'],
      system: [],
      security: []
    }
  },
  {
    id: 'data-analyst',
    name: '数据分析师模板',
    description: '管理数据和分析，适用于数据团队',
    icon: '📈',
    permissions: {
      users: [],
      roles: [],
      projects: ['view'],
      templates: ['view'],
      datasets: ['view', 'create', 'edit', 'delete'],
      connections: ['view', 'create', 'edit', 'delete'],
      media: ['view'],
      playlists: ['view'],
      system: [],
      security: []
    }
  },
  {
    id: 'viewer',
    name: '访客模板',
    description: '只读权限，适用于外部访客',
    icon: '👁️',
    permissions: {
      users: [],
      roles: [],
      projects: ['view'],
      templates: ['view'],
      datasets: ['view'],
      connections: ['view'],
      media: ['view'],
      playlists: ['view'],
      system: [],
      security: []
    }
  },
  {
    id: 'developer',
    name: '开发者模板',
    description: '开发和测试权限，适用于技术团队',
    icon: '💻',
    permissions: {
      users: ['view'],
      roles: ['view'],
      projects: ['view', 'create', 'edit'],
      templates: ['view', 'create', 'edit', 'delete'],
      datasets: ['view', 'create', 'edit', 'delete'],
      connections: ['view', 'create', 'edit', 'delete'],
      media: ['view', 'upload', 'delete'],
      playlists: ['view', 'create', 'edit'],
      system: ['view'],
      security: ['view']
    }
  },
  {
    id: 'designer',
    name: '设计师模板',
    description: '设计和媒体管理，适用于设计团队',
    icon: '🎨',
    permissions: {
      users: [],
      roles: [],
      projects: ['view', 'create', 'edit'],
      templates: ['view', 'create', 'edit'],
      datasets: ['view'],
      connections: [],
      media: ['view', 'upload', 'delete'],
      playlists: ['view', 'create', 'edit'],
      system: [],
      security: []
    }
  },
  {
    id: 'operations',
    name: '运维人员模板',
    description: '系统运维和监控，适用于运维团队',
    icon: '🔧',
    permissions: {
      users: ['view'],
      roles: ['view'],
      projects: ['view'],
      templates: ['view'],
      datasets: ['view'],
      connections: ['view', 'edit'],
      media: ['view'],
      playlists: ['view'],
      system: ['view', 'config', 'backup', 'restore'],
      security: ['view', 'config']
    }
  },
  {
    id: 'custom',
    name: '自定义模板',
    description: '从空白开始，自定义所有权限',
    icon: '⚙️',
    permissions: {
      users: [],
      roles: [],
      projects: [],
      templates: [],
      datasets: [],
      connections: [],
      media: [],
      playlists: [],
      system: [],
      security: []
    }
  }
]

/**
 * 根据模板ID获取模板
 */
export function getTemplateById(id) {
  return permissionTemplates.find(t => t.id === id)
}

/**
 * 获取所有模板
 */
export function getAllTemplates() {
  return permissionTemplates
}

/**
 * 应用模板到权限配置
 */
export function applyTemplate(templateId) {
  const template = getTemplateById(templateId)
  if (!template) {
    return null
  }

  // 深拷贝权限配置
  return JSON.parse(JSON.stringify(template.permissions))
}

/**
 * 比较两个权限配置的差异
 */
export function comparePermissions(perms1, perms2) {
  const diff = {
    added: [],
    removed: [],
    unchanged: []
  }

  const allModules = new Set([
    ...Object.keys(perms1 || {}),
    ...Object.keys(perms2 || {})
  ])

  allModules.forEach(module => {
    const actions1 = perms1[module] || []
    const actions2 = perms2[module] || []

    const allActions = new Set([...actions1, ...actions2])

    allActions.forEach(action => {
      const inPerms1 = actions1.includes(action)
      const inPerms2 = actions2.includes(action)

      if (inPerms1 && inPerms2) {
        diff.unchanged.push({ module, action })
      } else if (!inPerms1 && inPerms2) {
        diff.added.push({ module, action })
      } else if (inPerms1 && !inPerms2) {
        diff.removed.push({ module, action })
      }
    })
  })

  return diff
}

/**
 * 计算权限覆盖率
 */
export function calculateCoverage(permissions) {
  const allModules = ['users', 'roles', 'projects', 'templates', 'datasets', 'connections', 'media', 'playlists', 'system', 'security']
  const allActions = ['view', 'create', 'edit', 'delete', 'upload', 'publish', 'config', 'backup', 'restore']

  let totalPossible = 0
  let totalGranted = 0

  allModules.forEach(module => {
    const modulePerms = permissions[module] || []

    // 根据模块类型计算可能的权限数
    let possibleActions = []
    if (module === 'media') {
      possibleActions = ['view', 'upload', 'delete']
    } else if (module === 'system') {
      possibleActions = ['view', 'config', 'backup', 'restore']
    } else if (module === 'security') {
      possibleActions = ['view', 'config']
    } else if (['projects', 'templates'].includes(module)) {
      possibleActions = ['view', 'create', 'edit', 'delete', 'publish']
    } else {
      possibleActions = ['view', 'create', 'edit', 'delete']
    }

    totalPossible += possibleActions.length
    totalGranted += modulePerms.length
  })

  return {
    granted: totalGranted,
    possible: totalPossible,
    percentage: totalPossible > 0 ? Math.round((totalGranted / totalPossible) * 100) : 0
  }
}

/**
 * 获取推荐模板
 */
export function getRecommendedTemplate(userRole, department) {
  // 根据用户角色和部门推荐合适的模板
  const recommendations = {
    'admin': 'super-admin',
    'manager': 'project-manager',
    'editor': 'content-editor',
    'analyst': 'data-analyst',
    'developer': 'developer',
    'designer': 'designer',
    'ops': 'operations',
    'guest': 'viewer'
  }

  const templateId = recommendations[userRole] || 'custom'
  return getTemplateById(templateId)
}

export default {
  permissionTemplates,
  getTemplateById,
  getAllTemplates,
  applyTemplate,
  comparePermissions,
  calculateCoverage,
  getRecommendedTemplate
}
