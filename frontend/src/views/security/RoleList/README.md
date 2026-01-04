# RoleList 角色列表模块

## 📁 模块结构

```
RoleList/
├── index.vue                 # 主入口文件(当前版本)
├── RoleListRefactored.vue    # 重构版本(使用公共组件库)
├── components/               # 页面级组件
│   ├── RoleTable.vue        # 角色表格组件(待拆分)
│   ├── RoleForm.vue         # 角色表单组件(待拆分)
│   └── RoleDetail.vue       # 角色详情组件(待拆分)
├── composables/              # 页面级逻辑
│   └── useRole.js           # 角色管理逻辑(待创建)
└── README.md                 # 本文档
```

## 🎯 模块说明

### 主要功能
- 角色列表展示
- 角色创建/编辑
- 角色删除
- 权限分配
- 用户统计

### 当前状态
- ✅ index.vue - 原始版本,单文件实现
- ✅ RoleListRefactored.vue - 重构版本,使用公共组件库
- ⏳ 待拆分为更细粒度的子组件

## 📝 组件拆分计划

### 1. RoleTable.vue (角色表格)
**功能**: 展示角色列表
```vue
<RoleTable
  :roles="roles"
  :loading="loading"
  @edit="handleEdit"
  @delete="handleDelete"
  @row-click="handleRowClick"
/>
```

**Props**:
- roles: 角色数据数组
- loading: 加载状态

**Events**:
- edit: 编辑角色
- delete: 删除角色
- row-click: 点击行

---

### 2. RoleForm.vue (角色表单)
**功能**: 新建/编辑角色表单
```vue
<RoleForm
  v-model="formData"
  :mode="editMode"
  @submit="handleSubmit"
  @cancel="handleCancel"
/>
```

**Props**:
- modelValue: 表单数据
- mode: 'create' | 'edit'

**Events**:
- submit: 提交表单
- cancel: 取消操作

---

### 3. RoleDetail.vue (角色详情)
**功能**: 展示角色详细信息
```vue
<RoleDetail
  :role="selectedRole"
  :visible="detailVisible"
  @close="handleCloseDetail"
/>
```

**Props**:
- role: 角色对象
- visible: 是否显示

**Events**:
- close: 关闭详情

## 🧠 Composable拆分计划

### useRole.js (角色管理逻辑)
```javascript
export function useRole() {
  const roles = ref([])
  const loading = ref(false)
  const selectedRole = ref(null)

  const loadRoles = async () => { ... }
  const createRole = async (data) => { ... }
  const updateRole = async (id, data) => { ... }
  const deleteRole = async (id) => { ... }

  return {
    roles,
    loading,
    selectedRole,
    loadRoles,
    createRole,
    updateRole,
    deleteRole
  }
}
```

## 🔄 重构对比

### 原始版本 (index.vue)
- 文件大小: 417行
- CSS代码: 150行
- 耦合度: 高
- 可复用性: 低

### 重构版本 (RoleListRefactored.vue)
- 文件大小: 320行 (-23%)
- CSS代码: 45行 (-70%)
- 使用公共组件: DataTable, FormModal, SearchBar等
- 耦合度: 低
- 可复用性: 高

### 模块化版本 (计划)
- 主文件: 约100行
- 子组件: 3个,每个约80行
- Composable: 约200行
- 职责单一,易于维护

## 🚀 使用示例

### 当前使用方式
```javascript
// 路由配置
{
  path: 'role-list',
  component: () => import('@/views/security/RoleList')
}
```

### 在其他页面中复用组件(未来)
```vue
<script setup>
import { RoleTable } from '@/views/security/RoleList/components'
import { useRole } from '@/views/security/RoleList/composables'

const { roles, loadRoles } = useRole()
</script>

<template>
  <RoleTable :roles="roles" />
</template>
```

## 📚 相关文档
- [公共组件库文档](../../../../COMPONENTS_README.md)
- [重构对比分析](../../../../REFACTOR_COMPARISON.md)
- [模块化升级方案](../../../../VIEWS_MODULAR_UPGRADE.md)

## 🎯 下一步行动

1. **评估**: 决定是否需要进一步拆分
2. **拆分**: 创建 RoleTable、RoleForm、RoleDetail 组件
3. **提取**: 创建 useRole composable
4. **重构**: 更新 index.vue 使用拆分后的组件
5. **测试**: 确保功能正常
6. **文档**: 更新本README

## 💡 最佳实践

### 何时拆分组件?
- ✅ 组件超过200行
- ✅ 有明确的功能边界
- ✅ 需要在其他地方复用
- ✅ 逻辑复杂,需要独立维护

### 何时提取Composable?
- ✅ 业务逻辑超过100行
- ✅ 多个组件共享相同逻辑
- ✅ 需要单元测试
- ✅ 状态管理复杂

### 文件命名规范
- 组件: PascalCase (RoleTable.vue)
- Composable: camelCase (useRole.js)
- 工具函数: camelCase (roleHelper.js)
- 样式文件: kebab-case (role-list.css)

---

**创建时间**: 2026-01-03
**维护者**: 前端开发团队
**状态**: 🟡 规划中
