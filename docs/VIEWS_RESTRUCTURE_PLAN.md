# Views目录重构方案

## 📋 现状分析

当前所有页面都在 `src/views/` 根目录下,共28个Vue文件,缺乏模块化组织。

## 🎯 重构目标

按照路由模块分类,将views目录重构为模块化结构,提高代码可维护性。

---

## 📁 新目录结构

```
src/views/
├── workspace/              # 工作台模块
│   ├── ProjectList.vue           # 项目管理
│   ├── ConnectionManagement.vue  # 连接配置
│   ├── DatasetManagementNew.vue  # 数据集管理
│   ├── PlaylistManagement.vue    # 轮播管理
│   └── TemplateLibrary.vue       # 企业模板库
│
├── assets/                 # 资产管理模块
│   ├── MediaLibrary.vue          # 媒体资源库
│   └── CustomComponents.vue      # 自定义组件
│
├── security/               # 安全与权限模块
│   ├── OrganizationManagement.vue  # 组织架构
│   ├── RoleList.vue              # 角色列表
│   ├── RoleListRefactored.vue    # 角色列表(重构版)
│   ├── RolePermission.vue        # 角色权限
│   └── AuditLog.vue              # 审计日志
│
├── operations/             # 运维中心模块
│   ├── SystemMonitor.vue         # 系统监控
│   ├── DatasourceMonitor.vue     # 数据源监控
│   └── IntegrationPublish.vue    # 集成发布
│
├── settings/               # 系统设置模块
│   ├── SystemSettings.vue        # 系统配置
│   ├── IPWhitelist.vue           # IP白名单
│   ├── BackupRestore.vue         # 备份恢复
│   └── RecycleBin.vue            # 回收站
│
├── editor/                 # 编辑器模块
│   ├── ReportEditor.vue          # 报表编辑器
│   └── ScreenEditor/             # 大屏编辑器(已模块化)
│       ├── index.vue
│       ├── components/
│       ├── composables/
│       └── utils/
│
├── preview/                # 预览模块
│   └── PreviewScreen.vue         # 大屏预览
│
├── datasource/             # 数据源模块
│   ├── DataCenter.vue            # 数据中心
│   ├── DatasourceManagement.vue  # 数据源管理
│   ├── DatasetManagement.vue     # 数据集管理(旧版)
│   └── ExcelDataDetail.vue       # Excel数据源详情
│
├── common/                 # 公共页面
│   ├── NotFound.vue              # 404页面
│   ├── Dashboard.vue             # 仪表板
│   └── DecorationTest.vue        # 装饰测试页
│
└── index.js                # 统一导出(可选)
```

---

## 🔄 文件映射表

### 工作台模块 (workspace)
| 原路径 | 新路径 | 路由路径 |
|--------|--------|----------|
| ProjectList.vue | workspace/ProjectList.vue | /projects |
| ConnectionManagement.vue | workspace/ConnectionManagement.vue | /connections |
| DatasetManagementNew.vue | workspace/DatasetManagementNew.vue | /datasets |
| PlaylistManagement.vue | workspace/PlaylistManagement.vue | /playlist |
| TemplateLibrary.vue | workspace/TemplateLibrary.vue | /templates |

### 资产管理模块 (assets)
| 原路径 | 新路径 | 路由路径 |
|--------|--------|----------|
| MediaLibrary.vue | assets/MediaLibrary.vue | /media |
| CustomComponents.vue | assets/CustomComponents.vue | /components |

### 安全与权限模块 (security)
| 原路径 | 新路径 | 路由路径 |
|--------|--------|----------|
| OrganizationManagement.vue | security/OrganizationManagement.vue | /organization |
| RoleList.vue | security/RoleList.vue | /role-list |
| RoleListRefactored.vue | security/RoleListRefactored.vue | - |
| RolePermission.vue | security/RolePermission.vue | /role-permission |
| AuditLog.vue | security/AuditLog.vue | /audit |

### 运维中心模块 (operations)
| 原路径 | 新路径 | 路由路径 |
|--------|--------|----------|
| SystemMonitor.vue | operations/SystemMonitor.vue | /monitor |
| DatasourceMonitor.vue | operations/DatasourceMonitor.vue | /datasource-monitor |
| IntegrationPublish.vue | operations/IntegrationPublish.vue | /integration |

### 系统设置模块 (settings)
| 原路径 | 新路径 | 路由路径 |
|--------|--------|----------|
| SystemSettings.vue | settings/SystemSettings.vue | /settings |
| IPWhitelist.vue | settings/IPWhitelist.vue | /whitelist |
| BackupRestore.vue | settings/BackupRestore.vue | /backup |
| RecycleBin.vue | settings/RecycleBin.vue | /recycle |

### 编辑器模块 (editor)
| 原路径 | 新路径 | 路由路径 |
|--------|--------|----------|
| ReportEditor.vue | editor/ReportEditor.vue | /editor/report/:id |
| ScreenEditor.vue | editor/ScreenEditor/index.vue | /editor/screen/:id |

### 预览模块 (preview)
| 原路径 | 新路径 | 路由路径 |
|--------|--------|----------|
| PreviewScreen.vue | preview/PreviewScreen.vue | /preview/:id |

### 数据源模块 (datasource)
| 原路径 | 新路径 | 路由路径 |
|--------|--------|----------|
| DataCenter.vue | datasource/DataCenter.vue | - |
| DatasourceManagement.vue | datasource/DatasourceManagement.vue | - |
| DatasetManagement.vue | datasource/DatasetManagement.vue | - |
| ExcelDataDetail.vue | datasource/ExcelDataDetail.vue | /datasource/excel/:id |

### 公共页面 (common)
| 原路径 | 新路径 | 路由路径 |
|--------|--------|----------|
| NotFound.vue | common/NotFound.vue | /:pathMatch(.*)* |
| Dashboard.vue | common/Dashboard.vue | - |
| DecorationTest.vue | common/DecorationTest.vue | - |

---

## 📝 重构步骤

### 第1步: 创建模块目录
```bash
mkdir -p src/views/{workspace,assets,security,operations,settings,editor,preview,datasource,common}
```

### 第2步: 移动文件

**工作台模块**
```bash
mv src/views/ProjectList.vue src/views/workspace/
mv src/views/ConnectionManagement.vue src/views/workspace/
mv src/views/DatasetManagementNew.vue src/views/workspace/
mv src/views/PlaylistManagement.vue src/views/workspace/
mv src/views/TemplateLibrary.vue src/views/workspace/
```

**资产管理模块**
```bash
mv src/views/MediaLibrary.vue src/views/assets/
mv src/views/CustomComponents.vue src/views/assets/
```

**安全与权限模块**
```bash
mv src/views/OrganizationManagement.vue src/views/security/
mv src/views/RoleList.vue src/views/security/
mv src/views/RoleListRefactored.vue src/views/security/
mv src/views/RolePermission.vue src/views/security/
mv src/views/AuditLog.vue src/views/security/
```

**运维中心模块**
```bash
mv src/views/SystemMonitor.vue src/views/operations/
mv src/views/DatasourceMonitor.vue src/views/operations/
mv src/views/IntegrationPublish.vue src/views/operations/
```

**系统设置模块**
```bash
mv src/views/SystemSettings.vue src/views/settings/
mv src/views/IPWhitelist.vue src/views/settings/
mv src/views/BackupRestore.vue src/views/settings/
mv src/views/RecycleBin.vue src/views/settings/
```

**编辑器模块**
```bash
mv src/views/ReportEditor.vue src/views/editor/
# ScreenEditor 已经是模块化的,保持不动或移动整个文件夹
```

**预览模块**
```bash
mv src/views/PreviewScreen.vue src/views/preview/
```

**数据源模块**
```bash
mv src/views/DataCenter.vue src/views/datasource/
mv src/views/DatasourceManagement.vue src/views/datasource/
mv src/views/DatasetManagement.vue src/views/datasource/
mv src/views/ExcelDataDetail.vue src/views/datasource/
```

**公共页面**
```bash
mv src/views/NotFound.vue src/views/common/
mv src/views/Dashboard.vue src/views/common/
mv src/views/DecorationTest.vue src/views/common/
```

### 第3步: 更新路由文件

修改 `src/router/index.js`,更新所有import路径:

```javascript
// 工作台
import ProjectList from '@/views/workspace/ProjectList.vue'

// 运维中心
import SystemMonitor from '@/views/operations/SystemMonitor.vue'
import DatasourceMonitor from '@/views/operations/DatasourceMonitor.vue'

// 资产管理
component: () => import('@/views/assets/MediaLibrary.vue')

// 安全与权限
component: () => import('@/views/security/RoleList.vue')

// 系统设置
import SystemSettings from '@/views/settings/SystemSettings.vue'

// 编辑器
component: () => import('@/views/editor/ScreenEditor/index.vue')

// 公共页面
component: () => import('@/views/common/NotFound.vue')
```

---

## ✅ 验证清单

重构完成后,检查以下项:

- [ ] 所有文件已移动到正确的模块目录
- [ ] 路由文件import路径已更新
- [ ] 所有路由页面可正常访问
- [ ] 没有遗留文件在views根目录
- [ ] npm run dev 正常运行
- [ ] 所有页面功能正常

---

## 🎯 重构收益

### 可维护性
- ✅ **模块化清晰**: 每个功能模块独立目录
- ✅ **易于查找**: 根据功能快速定位文件
- ✅ **职责明确**: 模块边界清晰

### 可扩展性
- ✅ **便于新增**: 新页面直接放到对应模块
- ✅ **模块级配置**: 每个模块可有独立配置
- ✅ **独立开发**: 团队可按模块分工

### 代码质量
- ✅ **降低复杂度**: 大目录拆分为小模块
- ✅ **减少冲突**: 团队协作时文件冲突减少
- ✅ **便于测试**: 模块级测试更容易

---

## 📦 模块说明

### workspace (工作台)
核心业务功能模块,包含项目、数据集、模板等日常工作页面。

### assets (资产管理)
媒体资源、自定义组件等资产管理功能。

### security (安全与权限)
组织架构、角色权限、审计日志等安全相关功能。

### operations (运维中心)
系统监控、数据源监控、集成发布等运维功能。

### settings (系统设置)
系统配置、IP白名单、备份恢复等系统级设置。

### editor (编辑器)
各类编辑器页面,如报表编辑器、大屏编辑器。

### preview (预览)
各类预览页面。

### datasource (数据源)
数据源相关的所有页面。

### common (公共页面)
404、仪表板等通用页面。

---

## 🚀 后续优化

1. **创建模块级README**: 每个模块添加README说明
2. **模块级路由**: 考虑将路由也按模块拆分
3. **模块级Store**: Pinia store按模块组织
4. **模块级API**: API请求按模块分组

---

**重构完成后,views目录将从单层28个文件变为9个模块分类,大幅提升可维护性!**
