# 前端业务模块 API 接口与 Mock 数据梳理

## 📋 目录结构

```
frontend/src/
├── api/                      # API 接口定义
│   ├── role.js              # 角色管理
│   ├── dataset.js           # 数据集管理
│   ├── template.js          # 模板管理
│   └── modules/
│       └── user.js          # 用户管理
├── views/                    # 业务页面
│   ├── workspace/           # 工作空间模块
│   ├── datasource/          # 数据源模块
│   ├── security/            # 安全管理模块
│   ├── settings/            # 系统设置模块
│   └── operations/          # 运维监控模块
```

---

## 🎯 业务模块分类

### 1. 工作空间模块 (workspace)
- **ProjectList** - 项目列表
- **TemplateLibrary** - 模板库
- **PlaylistManagement** - 播放列表管理
- **ConnectionManagement** - 连接管理
- **DatasetManagement** - 数据集管理

### 2. 数据源模块 (datasource)
- **DataCenter** - 数据中心
- **DatasourceManagement** - 数据源管理
- **DatasetManagement** - 数据集管理
- **ExcelDataDetail** - Excel 数据详情

### 3. 安全管理模块 (security)
- **RoleList** - 角色列表
- **RolePermission** - 角色权限配置
- **OrganizationManagement** - 组织管理
- **AuditLog** - 审计日志

### 4. 系统设置模块 (settings)
- **SystemSettings** - 系统设置
- **IPWhitelist** - IP 白名单
- **RecycleBin** - 回收站
- **BackupRestore** - 备份恢复

### 5. 运维监控模块 (operations)
- **SystemMonitor** - 系统监控
- **DatasourceMonitor** - 数据源监控
- **IntegrationPublish** - 集成发布

---

## 📦 模型与接口规范

## 1. 项目管理 (Project)

### 数据模型
```typescript
interface Project {
  id: number | string
  title: string                    // 项目名称
  type: 'screen' | 'report'        // 项目类型：大屏/报表
  description: string              // 项目描述
  coverImage?: string              // 封面图片
  status: 'draft' | 'published'    // 状态：草稿/已发布
  createdBy: number                // 创建人ID
  updatedAt: string                // 更新时间
  createdAt: string                // 创建时间
}
```

### API 接口
```javascript
// 获取项目列表
GET /api/projects
Query: {
  page?: number
  pageSize?: number
  type?: 'screen' | 'report'
  status?: 'draft' | 'published'
  keyword?: string
}
Response: {
  code: 200,
  data: {
    list: Project[],
    total: number,
    page: number,
    pageSize: number
  }
}

// 获取项目详情
GET /api/projects/:id
Response: {
  code: 200,
  data: Project
}

// 创建项目
POST /api/projects
Body: {
  title: string
  type: 'screen' | 'report'
  description?: string
}
Response: {
  code: 200,
  data: Project
}

// 更新项目
PUT /api/projects/:id
Body: Partial<Project>
Response: {
  code: 200,
  data: Project
}

// 删除项目
DELETE /api/projects/:id
Response: {
  code: 200,
  message: '删除成功'
}

// 复制项目
POST /api/projects/:id/duplicate
Response: {
  code: 200,
  data: Project
}
```

### Mock 数据
```javascript
const mockProjects = [
  {
    id: 1,
    title: '智慧城市交通大脑',
    type: 'screen',
    description: '展示全市交通流量、拥堵指数及实时摄像头画面，集成 3D 城市模型。',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    status: 'published',
    createdBy: 1,
    updatedAt: '2024-01-15 14:30:00',
    createdAt: '2024-01-10 10:00:00'
  },
  {
    id: 2,
    title: 'Q4 财务与销售季报',
    type: 'report',
    description: '包含复杂表头、多级汇总及填报功能的财务报表，支持 A4 打印导出。',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    status: 'draft',
    createdBy: 2,
    updatedAt: '2024-01-14 16:20:00',
    createdAt: '2024-01-12 09:15:00'
  },
  {
    id: 3,
    title: '数字化工厂监控',
    type: 'screen',
    description: '连接 IoT 设备，实时展示产线良率、设备运行状态及故障告警。',
    coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    status: 'draft',
    createdBy: 1,
    updatedAt: '2024-01-12 11:45:00',
    createdAt: '2024-01-08 14:30:00'
  }
]
```

---

## 2. 角色管理 (Role)

### 数据模型
```typescript
interface Role {
  id: number | string
  name: string                     // 角色名称
  description: string              // 角色描述
  istem: boolean                // 是否系统内置
  scope: 'all' | 'dept' | 'self' | 'custom'  // 数据权限范围
  permissions: string[]            // 权限列表
  userCount: number                // 关联用户数
  createdAt: string
  updatedAt: string
}
```

### API 接口
```javascript
// 获取角色列表
GET /api/roles
Query: {
  page?: number
  pageSize?: number
  keyword?: string
}

// 获取角色详情
GET /api/roles/:id

// 创建角色
POST /api/roles
Body: {
  name: string
  description?: string
  scope: string
  permissions: string[]
}

// 更新角色
PUT /api/roles/:id
Body: Partial<Role>

// 删除角色
DELETE /api/roles/:id

// 复制角色
POST /api/roles/:id/clone
Body: {
  name: string
}

// 获取权限树
GET /api/roles/permissions/tree

// 批量导入角色
POST /api/roles/import
Body: {
  roles: Role[]
}

// 导出角色
POST /api/roles/export
Body: {
  roleIds?: number[]
}
```

### Mock 数据
```javascript
const mockRoles = [
  {
    id: 1,
    name: '超级管理员',
    description: '拥有系统所有权限，可管理所有功能和数据',
    isSystem: true,
    scope: 'all',
    permissions: ['*'],
    userCount: 3,
    createdAt: '2023-01-15 10:30:00',
    updatedAt: '2023-01-15 10:30:00'
  },
  {
    id: 2,
    name: '项目管理员',
    description: '管理所有项目及资源，负责项目的创建、编辑和删除',
    isSystem: false,
    scope: 'dept',
    permissions: ['project:create', 'project:edit', 'project:delete', 'project:view'],
    userCount: 8,
    createdAt: '2023-02-20 14:20:00',
    updatedAt: '2023-10-15 09:45:00'
  },
  {
    id: 3,
    name: '开发工程师',
    description: '仅限编辑和开发大屏，具有项目创建和编辑权限',
    isSystem: false,
    scope: 'dept',
    permissions: ['project:create', 'project:edit', 'project:view', 'dataset:view'],
    userCount: 25,
    createdAt: '2023-03-10 11:00:00',
    updatedAt: '2023-09-20 16:30:00'
  },
  {
    id: 4,
    name: '普通访客',
    description: '仅具备查看权限，不能进行任何修改操作',
    isSystem: false,
    scope: 'self',
    permissions: ['project:view'],
    userCount: 120,
    createdAt: '2023-01-15 10:35:00',
    updatedAt: '2023-01-15 10:35:00'
  }
]
```

---

## 3. 数据集管理 (Dataset)

### 数据模型
```typescript
interface Dataset {
  id: number | string
  name: string                     // 数据集名称
  type: 'excel' | 'sql' | 'api'    // 数据源类型
  connectionId?: number            // 连接ID（SQL类型）
  config: object                   // 配置信息
  fields: DatasetField[]           // 字段列表
  rowCount: number                 // 数据行数
  status: 'active' | 'inactive'    // 状态
  createdAt: string
  updatedAt: string
}

interface DatasetField {
  name: string
  type: 'string' | 'number' | 'date' | 'boolean'
  description?: string
}
```

### API 接口
```javascript
// 获取数据集列表
GET /api/datasets
Query: {
  page?: number
  pageSize?: number
  type?: string
  keyword?: string
}

// 获取数据集详情
GET /api/datasets/:id

// 创建数据集
POST /api/datasets
Body: {
  name: string
  type: 'excel' | 'sql' | 'api'
  config: object
}

// 更新数据集
PUT /api/datasets/:id
Body: Partial<Dataset>

// 删除数据集
DELETE /api/datasets/:id

// 预览数据集数据
GET /api/datasets/:id/preview
Query: {
  page?: number
  pageSize?: number
}

// 上传 Excel 文件
POST /api/datasets/upload/excel
Body: FormData { file: File }

// 验证 SQL 查询
POST /api/datasets/validate-sql
Body: {
  sql: string
  connectionId: number
}

// 测试 API 数据源
POST /api/datasets/test-api
Body: {
  url: string
  method: string
  headers: object
}
```

### Mock 数据
```javascript
const mockDatasets = [
  {
    id: 1,
    name: '销售数据2024',
 'excel',
    config: {
      fileName: 'sales_2024.xlsx',
      sheetName: 'Sheet1'
    },
    fields: [
      { name: 'date', type: 'date', description: '日期' },
      { name: 'product', type: 'string', description: '产品名称' },
      { name: 'amount', type: 'number', description: '销售额' },
      { name: 'quantity', type: 'number', description: '销量' }
    ],
    rowCount: 1250,
    status: 'active',
    createdAt: '2024-01-10 09:00:00',
    updatedAt: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    name: '用户行为分析',
    type: 'sql',
    connectionId: 1,
    config: {
      sql: 'SELECT * FROM user_behavior WHERE date >= CURDATE() - INTERVAL 30 DAY'
    },
    fields: [
      { name: 'user_id', type: 'number', description: '用户ID' },
      { name: 'action', type: 'string', description: '行为类型' },
      { name: 'timestamp', type: 'date', description: '时间戳' }
    ],
    rowCount: 58420,
    status: 'active',
    createdAt: '2024-01-08 11:20:00',
    updatedAt: '2024-01-15 10:15:00'
  }
]
```

---

## 4. 模板管理 (Template)

### 数据模型
```typescript
interface Template {
  id: number | string
  name: string                     // 模板名称
  type: 'screen' | 'report'        // 模板类型
  category: string                 // 分类
  thumbnail?: string               // 缩略图
  description: string              // 描述
  config: object                   // 配置JSON
  isPublic: boolean                // 是否公开
  usageCount: number               // 使用次数
  status: 'draft' | 'published' | 'reviewing'  // 状态
  createdBy: number
  createdAt: string
  updatedAt: string
}
```

### API 接口
```javascript
// 获取模板列表
GET /api/templates
Query: {
  page?: number
  pageSize?: number
  type?: string
  category?: string
  keyword?: string
}

// 获取模板详情
GET /api/templates/:id

// 创建模板
POST /api/templates
Body: {
  name: string
  type: 'screen' | 'report'
  category: string
  description?: string
  config: object
}

// 更新模板
PUT /api/templates/:id
Body: Partial<Template>

// 删除模板
DELETE /api/templates/:id

// 发布模板
POST /api/templates/publish
Body: {
  id: number
}

// 复制模板
POST /api/templates/:id/clone
Body: {
  name: string
}

// 上传缩略图
POST /api/templates/upload/thumbnail
Body: FormData { file: File }

// 获取模板分类
GET /api/templates/categories

// 获取我的模板
GET /api/templates/my
Query: {
  page?: number
  pageSize?: number
}

// 增加使用次数
POST /api/templates/:id/usage
```

### Mock 数据
```javascript
const mockTemplates = [
  {
    id: 1,
    name: '智慧城市大屏模板',
    type: 'screen',
    category: '政务',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    description: '适用于智慧城市、交通监控等场景的大屏模板',
    config: {},
    isPublic: true,
    usageCount: 156,
    status: 'published',
    createdBy: 1,
    createdAt: '2023-12-01 10:00:00',
    updatedAt: '2024-01-10 15:30:00'
  },
  {
    id: 2,
    name: '财务报表模板',
    type: 'report',
    category: '财务',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    description: '标准财务三表模板，支持多级汇总',
    config: {},
    isPublic: true,
    usageCount: 89,
    status: 'published',
    createdBy: 2,
    createdAt: '2023-11-15 14:20:00',
    updatedAt: '2024-01-05 09:45:00'
  }
]
```

---

## 5. 数据连接管理 (Connection)

### 数据模型
```typescript
interface Connection {
  id: number | string
  name: string                     // 连接名称
  type: 'mysql' | 'postgresql' | 'oracle' | 'sqlserver'  // 数据库类型
  host: string                     // 主机地址
  port: number                     // 端口
  database: string                 // 数据库名
  username: string                 // 用户名
  password?: string                // 密码（加密）
  status: 'connected' | 'disconnected' | 'error'  // 连接状态
  lastTestTime?: string            // 最后测试时间
  createdAt: string
  updatedAt: string
}
```

### API 接口
```javascript
// 获取连接列表
GET /api/connections
Query: {
  page?: number
  pageSize?: number
  type?: string
}

// 创建连接
POST /api/connections
Body: {
  name: string
  type: string
  host: string
  port: number
  database: string
  username: string
  password: string
}

// 更新连接
PUT /api/connections/:id
Body: Partial<Connection>

// 删除连接
DELETE /api/connections/:id

// 测试连接
POST /api/connections/:id/test

// 测试连接配置（未保存）
POST /api/connections/test
Body: Connection
```

### Mock 数据
```javascript
const mockConnections = [
  {
    id: 1,
    name: '生产环境MySQL',
    type: 'mysql',
    host: '192.168.1.100',
    port: 3306,
    database: 'production_db',
    username: 'admin',
    status: 'connected',
    lastTestTime: '2024-01-15 14:30:00',
    createdAt: '2023-12-01 10:00:00',
    updatedAt: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    name: '测试环境PostgreSQL',
    type: 'postgresql',
    host: '192.168.1.101',
    port: 5432,
    database: 'test_db',
    username: 'testuser',
    status: 'connected',
    lastTestTime: '2024-01-15 10:15:00',
    createdAt: '2023-12-15 14:20:00',
    updatedAt: '2024-01-15 10:15:00'
  }
]
```

---

## 6. 用户管理 (User)

### 数据模型
```typescript
interface User {
  id: number | string
  username: string                 // 用户名
  phone: string                    // 手机号
  email?: string                   // 邮箱
  avatar?: string                  // 头像
  roleIds: number[]                // 角色ID列表
  status: 'active' | 'inactive'    // 状态
  lastLoginTime?: string           // 最后登录时间
  createdAt: string
  updatedAt: string
}
```

### API 接口
```javascript
// 用户注册
POST /api/users/auth/register/
Body: {
  username: string
  phone: string
  password: string
  password_confirm: string
}

// 用户登录
POST /api/users/auth/login/
Body: {
  username: string
  password: string
}

// 刷新 Token
POST /api/users/auth/refresh/
Body: {
  refresh: string
}

// 获取当前用户信息
GET /api/users/auth/me/

// 更新用户信息
PUT /api/users/auth/me/
Body: {
  email?: string
  phone?: string
  avatar?: string
}

// 修改密码
POST /api/users/auth/change_password/
Body: {
  old_password: string
  new_password: string
  new_password_confirm: string
}

// 退出登录
POST /api/users/auth/logout/
```

### Mock 数据
```javascript
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    phone: '13800138000',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    roleIds: [1],
    status: 'active',
    lastLoginTime: '2024-01-15 14:30:00',
    createdAt: '2023-01-01 00:00:00',
    updatedAt: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    username: 'developer',
    phone: '13800138001',
    email: 'dev@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    roleIds: [3],
    status: 'active',
    lastLoginTime: '2024-01-15 10:15:00',
    createdAt: '2023-02-15 10:00:00',
    updatedAt: '2024-01-15 10:15:00'
  }
]
```

---

## 🔧 统一响应格式

### 成功响应
```javascript
{
  code: 200,
  message: 'success',
  data: any
}
```

### 错误响应
```javascript
{
  code: 400 | 401 | 403 | 404 | 500,
  message: '错误信息',
  errors?: object  // 详细错误信息（可选）
}
```

### 分页响应
```javascript
{
  code: 200,
  data: {
    list: any[],
    total: number,
    page: number,
    pageSize: number
  }
}
```

---

## 📝 接口命名规范

### RESTful 规范
- **GET** - 查询资源
- **POST** - 创建资源
- **PUT** - 更新资源（全量）
- **PATCH** - 更新资源（部分）
- **DELETE** - 删除资源

### URL 规范
```
GET    /api/resources          # 获取列表
GET    /api/resources/:id      # 获取详情
POST   /api/resources          # 创建
PUT    /api/resources/:id      # 更新
DELETE /api/resources/:id      # 删除
POST   /api/resources/:id/act
```

---

## 🎨 前端调用示例

### 使用已有的 API 模块
```javascript
import { getRoles, createRole, updateRole, deleteRole } from '@/api/role'
import { getDatasets, createDataset, previewDataset } from '@/api/dataset'
import { getTemplates, createTemplate, cloneTemplate } from '@/api/template'
import { userApi } from '@/api/modules/user'

// 获取角色列表
const roles = await getRoles({ page: 1, pageSize: 10 })

// 创建数据集
const dataset = await createDataset({
  name: '新数据集',
  type: 'excel',
  config: {}
})

// 用户登录
const loginResult = await userApi.login({
  username: 'admin',
  password: '123456'
})
```

---

## 📌 开发建议

### 1. 后端开发优先级
1. **用户认证模块** - 登录、注册、权限验证
2. **项目管理模块** - 项目 CRUD
3. **角色权限模块** - 角色 CRUD、权限配置
4. **数据集管理模块** - 数据集 CRUD、数据预览
5. **模板管理模块** - 模板 CRUD、模板市场
6. **数据连接模块** - 连接 CRUD、连接测试

### 2. 接口开发注意事项
- 所有接口需要统一的错误处理
- 需要实现 JWT Token 认证
- 分页查询统一使用 `page` 和 `pageSize` 参数
- 敏感信息（如密码）不要在响应中返回
- 文件上传需要限制大小和类型
- SQL 查询需要防止注入攻击

### 3. Mock 数据使用
- 开发阶段可以使用 Mock.js 或 MSW 进行接口模拟
- Mock 数据应该尽量贴近真实场景
- 建议使用 Faker.js 生成随机数据

---

## 🚀 下一步工作

1. ✅ 前端业务模块梳理完成
2. ✅ API 接口规范定义完成
3. ✅ Mock 数据示例提供完成
4. ⏳ 后端根据此文档实现接口
5. ⏳ 前端对接真实接口
6. ⏳ 接口联调测试

---

**文档版本**: v1.0
**更新时间**: 2024-01-15
**维护人**: 开发团队
