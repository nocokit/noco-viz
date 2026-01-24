/**
 * 审计日志模块映射配置
 * 将 URL 路径映射到对应的模块、操作和描述信息
 */

export interface ModuleMapping {
  module: string;
  action?: string;
  actionType?: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'export' | 'import' | 'other';
  description?: string;
}

export interface ModuleMappingConfig {
  [key: string]: ModuleMapping;
}

/**
 * 模块映射配置
 * key: URL 路径关键词
 * value: 模块信息
 */
export const MODULE_MAPPING: ModuleMappingConfig = {
  // 认证相关
  '/auth/login': {
    module: '系统登录',
    action: '登录',
    actionType: 'login',
    description: '用户登录'
  },
  '/auth/logout': {
    module: '系统登录',
    action: '登出',
    actionType: 'logout',
    description: '用户登出'
  },
  '/auth/register': {
    module: '用户管理',
    action: '注册',
    actionType: 'create',
    description: '注册新用户'
  },

  // 用户管理
  '/users': {
    module: '用户管理',
    actionType: 'other'
  },

  // 角色管理
  '/roles': {
    module: '角色管理',
    actionType: 'other'
  },

  // 部门管理
  '/departments': {
    module: '部门管理',
    actionType: 'other'
  },

  // 项目管理
  '/projects': {
    module: '项目管理',
    actionType: 'other'
  },

  // 数据源管理
  '/datasets': {
    module: '数据源管理',
    actionType: 'other'
  },
  '/connections': {
    module: '数据源管理',
    actionType: 'other'
  },

  // 模板管理
  '/templates': {
    module: '模板管理',
    actionType: 'other'
  },

  // 组件管理
  '/components': {
    module: '组件管理',
    actionType: 'other'
  },

  // 播放列表
  '/playlists': {
    module: '播放列表',
    actionType: 'other'
  },

  // 媒体管理
  '/media': {
    module: '媒体管理',
    actionType: 'other'
  },

  // 系统设置
  '/system-config': {
    module: '系统设置',
    action: '更新',
    actionType: 'update',
    description: '修改系统配置'
  },

  // IP白名单
  '/ip-whitelist': {
    module: 'IP白名单',
    actionType: 'other'
  },

  // 备份管理
  '/backup': {
    module: '备份管理',
    actionType: 'other'
  },
  '/backup/restore': {
    module: '备份管理',
    action: '恢复备份',
    actionType: 'update',
    description: '恢复系统备份'
  },

  // 回收站
  '/recycle': {
    module: '回收站',
    actionType: 'other'
  }
};

/**
 * HTTP 方法到操作类型的映射
 */
export const METHOD_ACTION_MAPPING = {
  POST: { action: '新建', actionType: 'create' },
  PUT: { action: '更新', actionType: 'update' },
  PATCH: { action: '更新', actionType: 'update' },
  DELETE: { action: '删除', actionType: 'delete' },
  GET: { action: '查看', actionType: 'view' }
};

/**
 * 根据 URL 和 HTTP 方法解析模块信息
 * @param method HTTP 方法
 * @param url 请求 URL
 * @param body 请求体
 */
export function parseModuleInfo(method: string, url: string, body: any = {}) {
  let module = '未知模块';
  let action = '操作';
  let actionType: any = 'other';
  let description = `${method} ${url}`;

  // 查找匹配的模块配置
  let matchedConfig: ModuleMapping | null = null;
  let matchedPath = '';

  for (const [path, config] of Object.entries(MODULE_MAPPING)) {
    if (url.includes(path)) {
      // 优先匹配更长的路径
      if (path.length > matchedPath.length) {
        matchedConfig = config;
        matchedPath = path;
      }
    }
  }

  if (matchedConfig) {
    module = matchedConfig.module;

    // 如果配置中指定了固定的 action，使用配置的
    if (matchedConfig.action) {
      action = matchedConfig.action;
      actionType = matchedConfig.actionType || 'other';
      description = matchedConfig.description || description;
    } else {
      // 否则根据 HTTP 方法推断
      const methodMapping = METHOD_ACTION_MAPPING[method];
      if (methodMapping) {
        action = methodMapping.action;
        actionType = methodMapping.actionType;

        // 生成描述
        const resourceName = extractResourceName(body);
        if (resourceName) {
          description = `${action}${module}: ${resourceName}`;
        } else {
          description = `${action}${module}`;
        }
      }
    }
  }

  return { module, action, actionType, description };
}

/**
 * 从请求体中提取资源名称
 * @param body 请求体
 */
function extractResourceName(body: any): string {
  if (!body) return '';

  // 常见的名称字段
  const nameFields = ['name', 'title', 'username', 'email', 'ip'];

  for (const field of nameFields) {
    if (body[field]) {
      return body[field];
    }
  }

  return '';
}
