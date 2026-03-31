import type { CrudConfig } from '@/types/crud'

export const crudConfig: CrudConfig = {
  // 搜索表单配置
  search: {
    inline: true,
    labelWidth: '90px',
    fields: [
      {
        name: 'name',
        label: '角色名称',
        type: 'input',
        placeholder: '请输入角色名称',
        clearable: true
      },
      {
        name: 'scope',
        label: '数据权限',
        type: 'select',
        placeholder: '全部权限',
        clearable: true,
        options: [
          { label: '全部数据', value: 'all' },
          { label: '本部门', value: 'dept' },
          { label: '仅本人', value: 'self' },
          { label: '自定义', value: 'custom' }
        ]
      }
    ]
  },

  // 表格配置
  table: {
    stripe: true,
    border: false,
    size: 'default',
    // 工具栏按钮
    actions: [
      {
        key: 'add',
        label: '新增角色',
        type: 'primary',
        icon: 'plus'
      }
    ],
    columns: [
      {
        prop: 'name',
        label: '角色名称',
        minWidth: 220,
        fixed: 'left',
        render: (row: any) => {
          const systemTag = row.isSystem
            ? '<span style="margin-left: 8px; font-size: 11px; padding: 2px 8px; border-radius: 12px; background: rgba(102, 126, 234, 0.1); color: #667eea; border: 1px solid rgba(102, 126, 234, 0.2);">系统内置</span>'
            : ''
          return `
            <div class="role-name-cell">
              <div class="role-name-text">
                <span>${row.name}</span>
                ${systemTag}
              </div>
              <div style="font-size: 12px; color: var(--el-text-color-secondary); margin-top: 4px;">
                ${row.description || '-'}
              </div>
            </div>
          `
        }
      },
      {
        prop: 'scope',
        label: '数据权限',
        width: 120,
        render: (row: any) => {
          const scopeMap: Record<string, { text: string; color: string }> = {
            all: { text: '全部数据', color: '#f56c6c' },
            dept: { text: '本部门', color: '#409eff' },
            self: { text: '仅本人', color: '#67c23a' },
            custom: { text: '自定义', color: '#e6a23c' }
          }
          const scope = scopeMap[row.scope] || { text: row.scope, color: '#909399' }
          return `<span style="display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 12px; background: ${scope.color}15; color: ${scope.color}; font-weight: 500;">${scope.text}</span>`
        }
      },
      {
        prop: 'userCount',
        label: '关联用户',
        width: 100,
        align: 'center',
        sortable: true,
        render: (row: any) => {
          return `<span style="display: inline-flex; align-items: center; justify-content: center; min-width: 32px; padding: 4px 10px; background: rgba(64, 158, 255, 0.1); border: 1px solid rgba(64, 158, 255, 0.2); color: #409eff; border-radius: 12px; font-weight: 500; font-size: 13px;">${row.userCount || 0}</span>`
        }
      },
      {
        prop: 'createdAt',
        label: '创建时间',
        width: 170,
        sortable: true,
        render: (row: any) => {
          if (!row.createdAt) return '<span style="color: #909399">-</span>'
          const date = new Date(row.createdAt)
          return `<span style="color: #606266; font-size: 13px">${date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>`
        }
      },
      {
        prop: 'updatedAt',
        label: '最后修改',
        width: 170,
        sortable: true,
        render: (row: any) => {
          if (!row.updatedAt) return '<span style="color: #909399">-</span>'
          const date = new Date(row.updatedAt)
          return `<span style="color: #606266; font-size: 13px">${date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>`
        }
      },
      {
        key: 'actions',
        label: '操作',
        type: 'actions',
        width: 200,
        actions: [
          {
            key: 'configurePermission',
            label: '配置权限',
            icon: 'setting'
          },
          {
            key: 'edit',
            label: '编辑',
            icon: 'edit'
          },
          {
            key: 'delete',
            label: '删除',
            icon: 'delete',
            class: 'danger'
          }
        ]
      }
    ]
  },

  // 表单配置
  form: {
    fields: [
      {
        name: 'name',
        label: '角色名称',
        type: 'input',
        required: true,
        placeholder: '请输入角色名称',
        rules: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      },
      {
        name: 'description',
        label: '角色描述',
        type: 'textarea',
        placeholder: '请输入角色描述',
        rows: 3,
        rules: [
          { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
        ]
      },
      {
        name: 'scope',
        label: '数据权限',
        type: 'select',
        required: true,
        placeholder: '请选择数据权限范围',
        options: [
          { label: '全部数据', value: 'all' },
          { label: '本部门', value: 'dept' },
          { label: '仅本人', value: 'self' },
          { label: '自定义', value: 'custom' }
        ],
        defaultValue: 'self',
        rules: [
          { required: true, message: '请选择数据权限范围', trigger: 'change' }
        ]
      }
    ]
  },

  // 模态框配置
  modal: {
    title: '角色'
  }
}
