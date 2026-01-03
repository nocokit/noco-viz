# 数据中心后端API接口文档

## 基础信息

**Base URL**: `http://localhost:3000/api`

**响应格式**:
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

## 一、数据集管理接口

### 1.1 获取数据集列表

**接口**: `GET /datasets`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |
| type | string | 否 | 数据类型: sql/excel/api |
| keyword | string | 否 | 搜索关键字 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "Q1_门店物料清单",
      "description": "静态数据导入，包含库存明细",
      "type": "excel",
      "connectionId": null,
      "status": "active",
      "rowCount": 1200,
      "createTime": "2025-01-01 10:00:00",
      "updateTime": "2025-01-01 10:00:00"
    }
  ]
}
```

### 1.2 创建数据集

**接口**: `POST /datasets`

**请求Body**:
```json
{
  "name": "数据集名称",
  "description": "数据集描述",
  "type": "sql",  // sql/excel/api
  "connectionId": 1,  // type为sql时必填
  "sqlQuery": "SELECT * FROM users",  // type为sql时必填
  "apiUrl": "https://api.example.com/data",  // type为api时必填
  "fileId": "xxx"  // type为excel时必填
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "数据集名称",
    ...
  }
}
```

### 1.3 更新数据集

**接口**: `PUT /datasets/:id`

**请求Body**: 同创建数据集

### 1.4 删除数据集

**接口**: `DELETE /datasets/:id`

### 1.5 预览数据集数据

**接口**: `GET /datasets/:id/preview`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认100 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "columns": [
      { "field": "id", "label": "ID", "width": 80 },
      { "field": "name", "label": "名称", "width": 150 }
    ],
    "data": [
      { "id": 1, "name": "数据1" },
      { "id": 2, "name": "数据2" }
    ],
    "total": 1000
  }
}
```

### 1.6 上传Excel文件

**接口**: `POST /datasets/upload/excel`

**请求**: multipart/form-data
- file: 文件对象

**响应示例**:
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileId": "xxx-xxx-xxx",
    "fileName": "data.xlsx",
    "rowCount": 1000,
    "columns": ["id", "name", "age"]
  }
}
```

### 1.7 验证SQL查询

**接口**: `POST /datasets/validate-sql`

**请求Body**:
```json
{
  "sql": "SELECT * FROM users",
  "connectionId": 1
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "SQL验证成功",
  "data": {
    "valid": true,
    "errors": [],
    "warnings": [],
    "estimatedRows": 1000
  }
}
```

### 1.8 测试API数据源

**接口**: `POST /datasets/test-api`

**请求Body**:
```json
{
  "url": "https://api.example.com/data",
  "method": "GET",
  "headers": {}
}
```

## 二、数据连接管理接口

### 2.1 获取连接列表

**接口**: `GET /connections`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "交易订单主库",
      "type": "mysql",
      "dbType": "MySQL 8.0",
      "host": "192.168.1.100:3306",
      "username": "root",
      "database": "orders",
      "status": "active",
      "usedByDatasets": 5,
      "createTime": "2025-01-01 10:00:00"
    }
  ]
}
```

### 2.2 创建连接

**接口**: `POST /connections`

**请求Body**:
```json
{
  "name": "连接名称",
  "type": "mysql",  // mysql/oracle/postgresql/mongodb
  "dbType": "MySQL 8.0",
  "host": "192.168.1.100:3306",
  "username": "root",
  "password": "password",
  "database": "dbname"
}
```

### 2.3 更新连接

**接口**: `PUT /connections/:id`

**请求Body**: 同创建连接

### 2.4 删除连接

**接口**: `DELETE /connections/:id`

### 2.5 测试连接

**接口**: `POST /connections/:id/test`

**响应示例**:
```json
{
  "code": 200,
  "message": "连接测试成功",
  "data": {
    "success": true,
    "latency": 50,  // 延迟(ms)
    "version": "MySQL 8.0.30"
  }
}
```

### 2.6 测试连接配置

**接口**: `POST /connections/test`

**请求Body**: 同创建连接

**响应**: 同测试连接

## 三、模板管理接口

### 3.1 获取模板列表

**接口**: `GET /templates`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 模板类型: official/shared/custom |
| category | string | 否 | 分类 |
| keyword | string | 否 | 搜索关键字 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "tpl-shared-001",
      "name": "华东区销售周报",
      "description": "用于周会汇报，包含团队排名和KPI完成率",
      "type": "shared",
      "category": "sales",
      "thumbnail": "https://example.com/thumb.jpg",
      "resolution": "1920 x 1080",
      "usageCount": 120,
      "author": "张三",
      "department": "销售部",
      "tags": ["销售", "周报", "KPI"],
      "createdAt": "2024-09-15",
      "updatedAt": "2024-11-18"
    }
  ]
}
```

### 3.2 发布模板

**接口**: `POST /templates/publish`

**请求Body**:
```json
{
  "name": "华东区销售周报",
  "description": "用于周会汇报，包含团队排名和KPI完成率",
  "category": "sales",
  "department": "销售部",
  "resolution": "1920 x 1080",
  "tags": ["销售", "周报", "KPI"],
  "thumbnail": "https://example.com/thumbnail.jpg",
  "visibility": "department",
  "config": {
    "width": 1920,
    "height": 1080,
    "backgroundColor": "#000",
    "components": []
  }
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": "tpl-shared-001",
    "name": "华东区销售周报",
    "type": "shared",
    "isSystem": false,
    "author": "当前用户",
    "usageCount": 0,
    "createdAt": "2025-01-01",
    "updatedAt": "2025-01-01"
  }
}
```

### 3.3 上传模板缩略图

**接口**: `POST /templates/upload/thumbnail`

**请求**: multipart/form-data
- file: 图片文件

**响应示例**:
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "url": "https://example.com/thumbnails/xxx.jpg"
  }
}
```

### 3.4 获取我的模板

**接口**: `GET /templates/my`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "tpl-shared-001",
      "name": "我发布的模板",
      "status": "published",
      ...
    }
  ]
}
```

### 3.5 更新模板

**接口**: `PUT /templates/:id`

**请求Body**: 同发布模板

### 3.6 删除模板

**接口**: `DELETE /templates/:id`

### 3.7 克隆模板

**接口**: `POST /templates/:id/clone`

**请求Body**:
```json
{
  "name": "新模板名称"
}
```

### 3.8 增加使用次数

**接口**: `POST /templates/:id/usage`

## 四、角色权限管理接口

### 4.1 获取角色列表

**接口**: `GET /roles`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |
| keyword | string | 否 | 搜索关键字 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "超级管理员",
      "description": "拥有系统所有权限",
      "isSystem": true,
      "scope": "all",
      "permissions": {
        "project": { "all": true, "view": true, "create": true, "edit": true, "delete": true, "export": true },
        "datasource": { "all": true, "view": true, "edit": true, "test": true, "delete": true },
        "ops": { "all": true, "monitor": true, "dbMonitor": true, "publish": true },
        "settings": { "all": true, "org": true, "role": true, "audit": true, "global": true }
      },
      "createdAt": "2025-01-01 10:00:00",
      "updatedAt": "2025-01-01 10:00:00"
    }
  ]
}
```

### 4.2 获取角色详情

**接口**: `GET /roles/:id`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "超级管理员",
    "description": "拥有系统所有权限",
    "isSystem": true,
    "scope": "all",
    "permissions": { /* ... */ },
    "createdAt": "2025-01-01 10:00:00",
    "updatedAt": "2025-01-01 10:00:00"
  }
}
```

### 4.3 创建角色

**接口**: `POST /roles`

**请求Body**:
```json
{
  "name": "项目管理员",
  "description": "管理所有项目及资源",
  "scope": "dept",
  "permissions": {
    "project": { "all": true, "view": true, "create": true, "edit": true, "delete": true, "export": true },
    "datasource": { "all": true, "view": true, "edit": true, "test": true, "delete": true },
    "ops": { "all": false, "monitor": false, "dbMonitor": false, "publish": false },
    "settings": { "all": false, "org": false, "role": false, "audit": false, "global": false }
  }
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 5,
    "name": "项目管理员",
    "description": "管理所有项目及资源",
    "isSystem": false,
    "scope": "dept",
    "permissions": { /* ... */ },
    "createdAt": "2025-01-01 10:00:00",
    "updatedAt": "2025-01-01 10:00:00"
  }
}
```

### 4.4 更新角色

**接口**: `PUT /roles/:id`

**请求Body**: 同创建角色

**响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 5,
    "name": "项目管理员",
    /* ... */
  }
}
```

### 4.5 删除角色

**接口**: `DELETE /roles/:id`

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功"
}
```

### 4.6 批量导入角色

**接口**: `POST /roles/import`

**请求Body**:
```json
{
  "roles": [
    {
      "name": "开发工程师",
      "description": "仅限编辑和开发大屏",
      "scope": "dept",
      "permissions": {
        "project": { "all": false, "view": true, "create": true, "edit": true, "delete": false, "export": true },
        "datasource": { "all": false, "view": true, "edit": false, "test": true, "delete": false },
        "ops": { "all": false, "monitor": true, "dbMonitor": false, "publish": false },
        "settings": { "all": false, "org": false, "role": false, "audit": false, "global": false }
      }
    }
  ]
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "导入成功",
  "data": {
    "imported": [
      {
        "id": 6,
        "name": "开发工程师",
        "description": "仅限编辑和开发大屏",
        "isSystem": false,
        "scope": "dept",
        "permissions": { /* ... */ }
      }
    ],
    "skipped": [],
    "total": 1
  }
}
```

### 4.7 导出角色

**接口**: `POST /roles/export`

**请求Body**:
```json
{
  "roleIds": [1, 2, 3]  // 不传或空数组则导出全部
}
```

**响应**: 返回JSON文件流

### 4.8 上传角色文件

**接口**: `POST /roles/upload`

**请求**: multipart/form-data
- file: JSON文件

**响应示例**:
```json
{
  "code": 200,
  "message": "文件解析成功",
  "data": {
    "roles": [
      {
        "name": "开发工程师",
        "description": "仅限编辑和开发大屏",
        "scope": "dept",
        "permissions": { /* ... */ }
      }
    ],
    "count": 1
  }
}
```

### 4.9 验证角色数据

**接口**: `POST /roles/validate`

**请求Body**:
```json
{
  "roles": [
    {
      "name": "测试角色",
      "description": "测试描述",
      "scope": "self",
      "permissions": { /* ... */ }
    }
  ]
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "验证成功",
  "data": {
    "valid": true,
    "errors": [],
    "warnings": [
      "角色'测试角色'已存在同名角色，导入时将跳过"
    ]
  }
}
```

### 4.10 获取权限树

**接口**: `GET /roles/permissions/tree`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "workspace",
      "label": "工作台权限",
      "children": [
        {
          "id": "project",
          "label": "项目管理",
          "permissions": ["view", "create", "edit", "delete", "export"]
        },
        {
          "id": "datasource",
          "label": "数据源管理",
          "permissions": ["view", "edit", "test", "delete"]
        }
      ]
    },
    {
      "id": "system",
      "label": "系统管理",
      "children": [
        {
          "id": "ops",
          "label": "运维中心",
          "permissions": ["monitor", "dbMonitor", "publish"]
        },
        {
          "id": "settings",
          "label": "系统设置",
          "permissions": ["org", "role", "audit", "global"]
        }
      ]
    }
  ]
}
```

### 4.11 复制角色

**接口**: `POST /roles/:id/clone`

**请求Body**:
```json
{
  "name": "新角色名称",
  "description": "新角色描述"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "复制成功",
  "data": {
    "id": 7,
    "name": "新角色名称",
    "description": "新角色描述",
    "isSystem": false,
    "scope": "self",
    "permissions": { /* 继承自源角色 */ }
  }
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 拒绝访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 实现建议

### 后端技术栈建议
- Node.js + Express / Koa
- Python + Flask / FastAPI
- Java + Spring Boot

### 数据库连接池
建议使用连接池管理数据库连接：
- MySQL: `mysql2/promise`
- PostgreSQL: `pg`
- Oracle: `oracledb`
- MongoDB: `mongodb`

### Excel文件处理
- Node.js: `xlsx` / `exceljs`
- Python: `pandas` / `openpyxl`

### SQL注入防护
- 使用参数化查询
- 验证SQL语句类型（只读/可写）
- 限制敏感操作权限

### 文件存储
- 本地存储: 使用文件系统
- 云存储: OSS/S3等对象存储服务
