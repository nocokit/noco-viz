# NocoViz 后端 API 开发文档

## 文档说明

本文档详细列出了 NocoViz 大屏可视化平台所需的所有后端接口。适用于后端开发团队进行 API 开发和对接。

## 基础信息

### API 基础路径
```
生产环境: https://api.nocoviz.com/v1
开发环境: http://localhost:3000/v1
```

### 通用响应格式

#### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": 1702545600000
}
```

#### 错误响应
```json
{
  "code": 400,
  "message": "错误描述",
  "error": "ERROR_CODE",
  "timestamp": 1702545600000
}
```

### HTTP 状态码规范
- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权（未登录或 Token 失效）
- `403` - 禁止访问（无权限）
- `404` - 资源不存在
- `500` - 服务器内部错误

### 认证方式
使用 JWT Token 认证，请求头格式：
```
Authorization: Bearer <token>
```

---

## 1. 用户认证模块

### 1.1 用户登录
**接口路径:** `POST /auth/login`

**请求参数:**
```json
{
  "username": "admin",
  "password": "123456",
  "remember": true
}
```

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "email": "admin@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "role": "admin",
      "permissions": ["*"],
      "organization": {
        "id": 1,
        "name": "总公司"
      }
    }
  }
}
```

### 1.2 刷新 Token
**接口路径:** `POST /auth/refresh`

**请求参数:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "token": "new_token_here",
    "expiresIn": 7200
  }
}
```

### 1.3 用户登出
**接口路径:** `POST /auth/logout`

**请求头:** 需要 Token

**响应数据:**
```json
{
  "code": 200,
  "message": "登出成功"
}
```

### 1.4 获取当前用户信息
**接口路径:** `GET /auth/profile`

**请求头:** 需要 Token

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "email": "admin@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "role": "admin",
    "permissions": ["*"],
    "organization": {
      "id": 1,
      "name": "总公司",
      "path": "/总公司"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-12-14T10:00:00Z"
  }
}
```

### 1.5 修改密码
**接口路径:** `PUT /auth/password`

**请求参数:**
```json
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

---

## 2. 项目管理模块

### 2.1 获取项目列表
**接口路径:** `GET /projects`

**查询参数:**
- `page` - 页码，默认 1
- `pageSize` - 每页数量，默认 20
- `search` - 搜索关键词（项目名称）
- `type` - 项目类型：screen（大屏）/ report（报表）
- `status` - 状态：draft（草稿）/ published（已发布）
- `folderId` - 文件夹 ID
- `sortBy` - 排序字段：createTime / updateTime / name
- `sortOrder` - 排序方式：asc / desc

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "list": [
      {
        "id": 1,
        "name": "智慧城市交通大脑",
        "type": "screen",
        "description": "实时监控城市交通状况",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "status": "published",
        "folderId": 1,
        "folderName": "交通项目",
        "creator": {
          "id": 1,
          "name": "张三"
        },
        "createTime": "2024-01-01T00:00:00Z",
        "updateTime": "2024-12-14T10:00:00Z",
        "viewCount": 1520,
        "tags": ["交通", "监控"]
      }
    ]
  }
}
```

### 2.2 获取项目详情
**接口路径:** `GET /projects/:id`

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "智慧城市交通大脑",
    "type": "screen",
    "description": "实时监控城市交通状况",
    "thumbnail": "https://example.com/thumbnail.jpg",
    "status": "published",
    "folderId": 1,
    "config": {
      "canvas": {
        "width": 1920,
        "height": 1080,
        "background": "#050d19"
      },
      "components": [
        {
          "id": "comp_1",
          "type": "bar",
          "x": 100,
          "y": 100,
          "width": 400,
          "height": 300,
          "config": { ... },
          "dataConfig": { ... }
        }
      ]
    },
    "creator": {
      "id": 1,
      "name": "张三",
      "avatar": "https://example.com/avatar.jpg"
    },
    "createTime": "2024-01-01T00:00:00Z",
    "updateTime": "2024-12-14T10:00:00Z",
    "publishTime": "2024-01-05T00:00:00Z",
    "viewCount": 1520,
    "tags": ["交通", "监控"],
    "permissions": {
      "canEdit": true,
      "canDelete": true,
      "canShare": true
    }
  }
}
```

### 2.3 创建项目
**接口路径:** `POST /projects`

**请求参数:**
```json
{
  "name": "新项目名称",
  "type": "screen",
  "description": "项目描述",
  "folderId": 1,
  "template": "template_001",
  "config": {
    "canvas": {
      "width": 1920,
      "height": 1080,
      "background": "#050d19"
    }
  },
  "tags": ["交通", "监控"]
}
```

**响应数据:**
```json
{
  "code": 201,
  "data": {
    "id": 123,
    "name": "新项目名称",
    "type": "screen",
    "status": "draft",
    "createTime": "2024-12-14T10:00:00Z"
  }
}
```

### 2.4 更新项目
**接口路径:** `PUT /projects/:id`

**请求参数:**
```json
{
  "name": "更新后的项目名称",
  "description": "更新后的描述",
  "thumbnail": "https://example.com/new-thumbnail.jpg",
  "config": { ... },
  "tags": ["新标签"]
}
```

**响应数据:**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "updateTime": "2024-12-14T10:00:00Z"
  }
}
```

### 2.5 删除项目
**接口路径:** `DELETE /projects/:id`

**查询参数:**
- `permanent` - 是否永久删除，默认 false（移到回收站）

**响应数据:**
```json
{
  "code": 200,
  "message": "删除成功"
}
```

### 2.6 发布项目
**接口路径:** `POST /projects/:id/publish`

**请求参数:**
```json
{
  "version": "1.0.0",
  "changelog": "发布说明"
}
```

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "status": "published",
    "publishTime": "2024-12-14T10:00:00Z",
    "publishUrl": "https://view.nocoviz.com/screen/abc123"
  }
}
```

### 2.7 复制项目
**接口路径:** `POST /projects/:id/copy`

**请求参数:**
```json
{
  "name": "副本项目名称",
  "folderId": 1
}
```

**响应数据:**
```json
{
  "code": 201,
  "data": {
    "id": 124,
    "name": "副本项目名称"
  }
}
```

### 2.8 批量操作项目
**接口路径:** `POST /projects/batch`

**请求参数:**
```json
{
  "action": "delete",
  "ids": [1, 2, 3],
  "options": {
    "permanent": false
  }
}
```

**支持的操作:**
- `delete` - 批量删除
- `move` - 批量移动
- `publish` - 批量发布
- `unpublish` - 批量取消发布

---

## 3. 文件夹管理模块

### 3.1 获取文件夹树
**接口路径:** `GET /folders/tree`

**响应数据:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "交通项目",
      "parentId": null,
      "children": [
        {
          "id": 2,
          "name": "子文件夹",
          "parentId": 1,
          "children": []
        }
      ],
      "projectCount": 5
    }
  ]
}
```

### 3.2 创建文件夹
**接口路径:** `POST /folders`

**请求参数:**
```json
{
  "name": "新文件夹",
  "parentId": 1
}
```

### 3.3 更新文件夹
**接口路径:** `PUT /folders/:id`

**请求参数:**
```json
{
  "name": "更新后的文件夹名"
}
```

### 3.4 删除文件夹
**接口路径:** `DELETE /folders/:id`

**查询参数:**
- `moveToFolder` - 移动子项目到指定文件夹 ID

---

## 4. 数据源管理模块

### 4.1 获取数据源列表
**接口路径:** `GET /datasources`

**查询参数:**
- `page` - 页码
- `pageSize` - 每页数量
- `type` - 数据源类型：mysql / postgresql / api / excel / csv
- `status` - 状态：active / inactive

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "total": 50,
    "list": [
      {
        "id": 1,
        "name": "生产数据库",
        "type": "mysql",
        "status": "active",
        "config": {
          "host": "192.168.1.100",
          "port": 3306,
          "database": "production_db",
          "username": "readonly_user"
        },
        "lastTestTime": "2024-12-14T09:00:00Z",
        "testStatus": "success",
        "createTime": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 4.2 创建数据源
**接口路径:** `POST /datasources`

**请求参数（MySQL示例）:**
```json
{
  "name": "生产数据库",
  "type": "mysql",
  "config": {
    "host": "192.168.1.100",
    "port": 3306,
    "database": "production_db",
    "username": "readonly_user",
    "password": "encrypted_password",
    "ssl": false,
    "connectionTimeout": 30000
  },
  "description": "生产环境只读数据库"
}
```

**请求参数（API示例）:**
```json
{
  "name": "业务 API",
  "type": "api",
  "config": {
    "baseUrl": "https://api.example.com",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer token",
      "Content-Type": "application/json"
    },
    "timeout": 10000
  }
}
```

### 4.3 测试数据源连接
**接口路径:** `POST /datasources/:id/test`

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "success": true,
    "message": "连接成功",
    "responseTime": 245,
    "timestamp": "2024-12-14T10:00:00Z"
  }
}
```

### 4.4 更新数据源
**接口路径:** `PUT /datasources/:id`

### 4.5 删除数据源
**接口路径:** `DELETE /datasources/:id`

### 4.6 执行数据查询
**接口路径:** `POST /datasources/:id/query`

**请求参数:**
```json
{
  "sql": "SELECT * FROM orders WHERE date >= ?",
  "params": ["2024-01-01"],
  "limit": 1000
}
```

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "columns": ["id", "order_no", "amount", "date"],
    "rows": [
      [1, "ORD001", 1999.00, "2024-01-01"],
      [2, "ORD002", 2999.00, "2024-01-02"]
    ],
    "rowCount": 2,
    "executionTime": 123
  }
}
```

---

## 5. 数据集管理模块

### 5.1 获取数据集列表
**接口路径:** `GET /datasets`

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "total": 30,
    "list": [
      {
        "id": 1,
        "name": "销售数据",
        "type": "sql",
        "datasourceId": 1,
        "datasourceName": "生产数据库",
        "query": "SELECT * FROM sales",
        "updateInterval": 300,
        "lastUpdateTime": "2024-12-14T09:55:00Z",
        "createTime": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 5.2 创建数据集
**接口路径:** `POST /datasets`

**请求参数:**
```json
{
  "name": "销售数据",
  "type": "sql",
  "datasourceId": 1,
  "config": {
    "sql": "SELECT * FROM sales WHERE date >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
    "params": [],
    "cache": true,
    "cacheTTL": 300
  },
  "fields": [
    {
      "name": "date",
      "type": "date",
      "alias": "日期"
    },
    {
      "name": "amount",
      "type": "number",
      "alias": "金额"
    }
  ]
}
```

### 5.3 获取数据集数据
**接口路径:** `GET /datasets/:id/data`

**查询参数:**
- `refresh` - 是否强制刷新缓存

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "fields": [
      {"name": "date", "type": "date"},
      {"name": "amount", "type": "number"}
    ],
    "rows": [
      {"date": "2024-12-14", "amount": 15000},
      {"date": "2024-12-13", "amount": 12000}
    ],
    "rowCount": 2,
    "lastUpdateTime": "2024-12-14T10:00:00Z",
    "fromCache": true
  }
}
```

### 5.4 更新数据集
**接口路径:** `PUT /datasets/:id`

### 5.5 删除数据集
**接口路径:** `DELETE /datasets/:id`

---

## 6. 模板库模块

### 6.1 获取模板列表
**接口路径:** `GET /templates`

**查询参数:**
- `category` - 分类：traffic / energy / business / monitor
- `industry` - 行业
- `search` - 搜索关键词

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "total": 50,
    "list": [
      {
        "id": 1,
        "name": "智慧交通监控大屏",
        "category": "traffic",
        "industry": "交通",
        "thumbnail": "https://example.com/template1.jpg",
        "preview": "https://preview.nocoviz.com/template/1",
        "description": "实时监控城市交通状况",
        "useCount": 520,
        "rating": 4.8,
        "isPremium": false
      }
    ]
  }
}
```

### 6.2 获取模板详情
**接口路径:** `GET /templates/:id`

### 6.3 从模板创建项目
**接口路径:** `POST /templates/:id/create`

**请求参数:**
```json
{
  "name": "基于模板的新项目",
  "folderId": 1
}
```

---

## 7. 媒体资源库模块

### 7.1 获取媒体列表
**接口路径:** `GET /media`

**查询参数:**
- `type` - 类型：image / video / icon / font
- `folderId` - 文件夹 ID
- `search` - 搜索关键词

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "total": 100,
    "list": [
      {
        "id": 1,
        "name": "背景图.jpg",
        "type": "image",
        "url": "https://cdn.example.com/images/bg.jpg",
        "thumbnail": "https://cdn.example.com/images/bg_thumb.jpg",
        "size": 2048000,
        "width": 1920,
        "height": 1080,
        "createTime": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 7.2 上传媒体文件
**接口路径:** `POST /media/upload`

**请求类型:** `multipart/form-data`

**请求参数:**
- `file` - 文件
- `folderId` - 文件夹 ID
- `type` - 类型

**响应数据:**
```json
{
  "code": 201,
  "data": {
    "id": 123,
    "name": "新图片.jpg",
    "url": "https://cdn.example.com/images/new.jpg",
    "thumbnail": "https://cdn.example.com/images/new_thumb.jpg",
    "size": 1024000
  }
}
```

### 7.3 删除媒体文件
**接口路径:** `DELETE /media/:id`

---

## 8. 组织架构模块

### 8.1 获取组织树
**接口路径:** `GET /organizations/tree`

**响应数据:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "总公司",
      "parentId": null,
      "type": "company",
      "children": [
        {
          "id": 2,
          "name": "技术部",
          "parentId": 1,
          "type": "department",
          "children": [],
          "memberCount": 15
        }
      ],
      "memberCount": 50
    }
  ]
}
```

### 8.2 创建组织
**接口路径:** `POST /organizations`

**请求参数:**
```json
{
  "name": "新部门",
  "parentId": 1,
  "type": "department",
  "description": "部门描述",
  "managerId": 10
}
```

### 8.3 更新组织
**接口路径:** `PUT /organizations/:id`

### 8.4 删除组织
**接口路径:** `DELETE /organizations/:id`

---

## 9. 用户管理模块

### 9.1 获取用户列表
**接口路径:** `GET /users`

**查询参数:**
- `page` - 页码
- `pageSize` - 每页数量
- `organizationId` - 组织 ID
- `roleId` - 角色 ID
- `status` - 状态：active / inactive
- `search` - 搜索关键词

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "total": 200,
    "list": [
      {
        "id": 1,
        "username": "zhangsan",
        "nickname": "张三",
        "email": "zhangsan@example.com",
        "phone": "13800138000",
        "avatar": "https://example.com/avatar.jpg",
        "role": {
          "id": 1,
          "name": "管理员"
        },
        "organization": {
          "id": 2,
          "name": "技术部"
        },
        "status": "active",
        "createTime": "2024-01-01T00:00:00Z",
        "lastLoginTime": "2024-12-14T09:00:00Z"
      }
    ]
  }
}
```

### 9.2 创建用户
**接口路径:** `POST /users`

**请求参数:**
```json
{
  "username": "newuser",
  "password": "initial_password",
  "nickname": "新用户",
  "email": "newuser@example.com",
  "phone": "13800138000",
  "roleId": 2,
  "organizationId": 2,
  "sendEmail": true
}
```

### 9.3 更新用户
**接口路径:** `PUT /users/:id`

### 9.4 删除用户
**接口路径:** `DELETE /users/:id`

### 9.5 重置用户密码
**接口路径:** `POST /users/:id/reset-password`

**请求参数:**
```json
{
  "newPassword": "new_password",
  "sendEmail": true
}
```

---

## 10. 角色权限模块

### 10.1 获取角色列表
**接口路径:** `GET /roles`

**响应数据:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "管理员",
      "code": "admin",
      "description": "系统管理员",
      "permissions": [
        "project:create",
        "project:edit",
        "project:delete",
        "user:manage"
      ],
      "userCount": 5,
      "createTime": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 10.2 创建角色
**接口路径:** `POST /roles`

**请求参数:**
```json
{
  "name": "设计师",
  "code": "designer",
  "description": "负责大屏设计",
  "permissions": [
    "project:create",
    "project:edit",
    "template:use"
  ]
}
```

### 10.3 更新角色
**接口路径:** `PUT /roles/:id`

### 10.4 删除角色
**接口路径:** `DELETE /roles/:id`

### 10.5 获取权限列表
**接口路径:** `GET /permissions`

**响应数据:**
```json
{
  "code": 200,
  "data": [
    {
      "id": "project:create",
      "name": "创建项目",
      "category": "项目管理",
      "description": "允许创建新项目"
    },
    {
      "id": "project:edit",
      "name": "编辑项目",
      "category": "项目管理",
      "description": "允许编辑现有项目"
    }
  ]
}
```

---

## 11. 审计日志模块

### 11.1 获取审计日志
**接口路径:** `GET /audit-logs`

**查询参数:**
- `page` - 页码
- `pageSize` - 每页数量
- `userId` - 用户 ID
- `action` - 操作类型
- `module` - 模块
- `startTime` - 开始时间
- `endTime` - 结束时间

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "total": 1000,
    "list": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "name": "张三"
        },
        "action": "create",
        "module": "project",
        "resourceId": 123,
        "resourceName": "新项目",
        "ip": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "details": {
          "projectType": "screen"
        },
        "createTime": "2024-12-14T10:00:00Z"
      }
    ]
  }
}
```

---

## 12. 系统监控模块

### 12.1 获取系统状态
**接口路径:** `GET /monitor/system`

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "cpu": {
      "usage": 45.5,
      "cores": 8
    },
    "memory": {
      "total": 16384,
      "used": 8192,
      "free": 8192,
      "usage": 50.0
    },
    "disk": {
      "total": 512000,
      "used": 256000,
      "free": 256000,
      "usage": 50.0
    },
    "network": {
      "inbound": 1024,
      "outbound": 512
    },
    "timestamp": "2024-12-14T10:00:00Z"
  }
}
```

### 12.2 获取数据源监控
**接口路径:** `GET /monitor/datasources`

**响应数据:**
```json
{
  "code": 200,
  "data": [
    {
      "datasourceId": 1,
      "datasourceName": "生产数据库",
      "status": "healthy",
      "responseTime": 245,
      "queryCount": 1520,
      "errorCount": 5,
      "lastCheckTime": "2024-12-14T10:00:00Z"
    }
  ]
}
```

### 12.3 获取访问统计
**接口路径:** `GET /monitor/analytics`

**查询参数:**
- `startDate` - 开始日期
- `endDate` - 结束日期
- `granularity` - 粒度：hour / day / week / month

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "pageViews": [
      {"date": "2024-12-14", "count": 1520},
      {"date": "2024-12-13", "count": 1420}
    ],
    "uniqueVisitors": [
      {"date": "2024-12-14", "count": 320},
      {"date": "2024-12-13", "count": 290}
    ],
    "topProjects": [
      {
        "projectId": 1,
        "projectName": "智慧交通",
        "viewCount": 520
      }
    ]
  }
}
```

---

## 13. 系统设置模块

### 13.1 获取系统配置
**接口路径:** `GET /settings`

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "system": {
      "name": "NocoViz 企业版",
      "logo": "https://example.com/logo.png",
      "timezone": "Asia/Shanghai",
      "language": "zh-CN"
    },
    "security": {
      "sessionTimeout": 7200,
      "passwordPolicy": {
        "minLength": 8,
        "requireUppercase": true,
        "requireNumber": true,
        "requireSpecial": false
      },
      "ipWhitelist": {
        "enabled": true,
        "ips": ["192.168.1.0/24"]
      }
    },
    "storage": {
      "provider": "local",
      "maxFileSize": 10485760,
      "allowedTypes": ["jpg", "png", "svg", "mp4"]
    }
  }
}
```

### 13.2 更新系统配置
**接口路径:** `PUT /settings`

**请求参数:**
```json
{
  "system": {
    "name": "新系统名称"
  },
  "security": {
    "sessionTimeout": 3600
  }
}
```

---

## 14. IP 白名单模块

### 14.1 获取 IP 白名单
**接口路径:** `GET /ip-whitelist`

**响应数据:**
```json
{
  "code": 200,
  "data": {
    "enabled": true,
    "list": [
      {
        "id": 1,
        "ip": "192.168.1.0/24",
        "description": "办公网络",
        "createTime": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 14.2 添加 IP
**接口路径:** `POST /ip-whitelist`

**请求参数:**
```json
{
  "ip": "192.168.2.0/24",
  "description": "分公司网络"
}
```

### 14.3 删除 IP
**接口路径:** `DELETE /ip-whitelist/:id`

---

## 15. 备份恢复模块

### 15.1 获取备份列表
**接口路径:** `GET /backups`

**响应数据:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "backup_20241214_100000",
      "type": "full",
      "size": 1024000000,
      "status": "completed",
      "createTime": "2024-12-14T10:00:00Z",
      "completedTime": "2024-12-14T10:15:00Z"
    }
  ]
}
```

### 15.2 创建备份
**接口路径:** `POST /backups`

**请求参数:**
```json
{
  "type": "full",
  "description": "每日自动备份"
}
```

### 15.3 恢复备份
**接口路径:** `POST /backups/:id/restore`

**请求参数:**
```json
{
  "confirmCode": "RESTORE_CONFIRM"
}
```

### 15.4 下载备份
**接口路径:** `GET /backups/:id/download`

**响应:** 文件流

---

## 16. 回收站模块

### 16.1 获取回收站列表
**接口路径:** `GET /recycle`

**查询参数:**
- `type` - 类型：project / datasource / dataset

**响应数据:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "type": "project",
      "name": "已删除的项目",
      "deletedBy": {
        "id": 1,
        "name": "张三"
      },
      "deleteTime": "2024-12-14T09:00:00Z",
      "expiryTime": "2025-01-14T09:00:00Z"
    }
  ]
}
```

### 16.2 恢复项目
**接口路径:** `POST /recycle/:id/restore`

### 16.3 永久删除
**接口路径:** `DELETE /recycle/:id`

### 16.4 清空回收站
**接口路径:** `DELETE /recycle/clear`

---

## 附录

### A. 权限代码列表

#### 项目管理
- `project:view` - 查看项目
- `project:create` - 创建项目
- `project:edit` - 编辑项目
- `project:delete` - 删除项目
- `project:publish` - 发布项目
- `project:share` - 分享项目

#### 数据管理
- `datasource:view` - 查看数据源
- `datasource:create` - 创建数据源
- `datasource:edit` - 编辑数据源
- `datasource:delete` - 删除数据源
- `dataset:view` - 查看数据集
- `dataset:create` - 创建数据集
- `dataset:edit` - 编辑数据集
- `dataset:delete` - 删除数据集

#### 用户管理
- `user:view` - 查看用户
- `user:create` - 创建用户
- `user:edit` - 编辑用户
- `user:delete` - 删除用户

#### 系统管理
- `system:settings` - 系统设置
- `system:monitor` - 系统监控
- `system:backup` - 备份管理
- `audit:view` - 查看审计日志

### B. 错误代码列表

| 错误代码 | HTTP状态码 | 说明 |
|---------|-----------|------|
| `AUTH_FAILED` | 401 | 认证失败 |
| `TOKEN_EXPIRED` | 401 | Token 已过期 |
| `PERMISSION_DENIED` | 403 | 无权限 |
| `RESOURCE_NOT_FOUND` | 404 | 资源不存在 |
| `VALIDATION_ERROR` | 400 | 参数验证失败 |
| `DUPLICATE_RESOURCE` | 409 | 资源已存在 |
| `DATABASE_ERROR` | 500 | 数据库错误 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

### C. 数据类型定义

#### 项目状态
- `draft` - 草稿
- `published` - 已发布
- `archived` - 已归档

#### 数据源类型
- `mysql` - MySQL 数据库
- `postgresql` - PostgreSQL 数据库
- `oracle` - Oracle 数据库
- `sqlserver` - SQL Server 数据库
- `mongodb` - MongoDB 数据库
- `api` - REST API
- `excel` - Excel 文件
- `csv` - CSV 文件

### D. 开发建议

1. **认证机制**
   - 使用 JWT Token 进行认证
   - Token 有效期建议 2 小时
   - Refresh Token 有效期建议 7 天
   - 敏感操作需要验证当前密码

2. **数据安全**
   - 所有密码必须加密存储（bcrypt）
   - 数据源密码使用 AES 加密
   - API 请求使用 HTTPS
   - 敏感数据不记录到日志

3. **性能优化**
   - 数据集查询结果使用 Redis 缓存
   - 列表接口支持分页
   - 大数据量返回支持流式传输
   - 静态资源使用 CDN

4. **错误处理**
   - 统一错误响应格式
   - 详细的错误日志
   - 用户友好的错误提示
   - 异常监控和告警

5. **API 版本管理**
   - 使用 URL 路径进行版本控制（/v1, /v2）
   - 保持向后兼容
   - 新功能使用新版本
   - 废弃接口提前通知

---

**文档版本:** v1.0.0
**最后更新:** 2024-12-14
**维护团队:** NocoViz 后端开发组
