import type { CrudConfig } from '@/types/crud'
import { h } from 'vue'
import StatusTag from '@/components/common/StatusTag/index.vue'

export const userConfig: CrudConfig = {
  // 搜索表单配置
  search: {
    inline: true,
    labelWidth: '80px',
    fields: [
      {
        name: 'username',
        label: '用户名',
        type: 'input',
        placeholder: '请输入用户名',
        clearable: true
      },
      {
        name: 'email',
        label: '邮箱',
        type: 'input',
        placeholder: '请输入邮箱',
        clearable: true
      },
      {
        name: 'departmentId',
        label: '部门',
        type: 'select',
        placeholder: '全部部门',
        clearable: true,
        options: [] // 动态加载
      },
      {
        name: 'isActive',
        label: '状态',
        type: 'select',
        placeholder: '全部状态',
        clearable: true,
        options: [
          { label: '启用', value: true },
          { label: '禁用', value: false }
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
        label: '新增用户',
        type: 'primary',
        icon: 'plus'
      }
    ],
    columns: [
      {
        prop: 'username',
        label: '用户信息',
        minWidth: 220,
        fixed: 'left',
        render: (row: any) => {
          return `
            <div class="user-info-cell">
              <div class="user-name">${row.username}</div>
              <div class="user-email">${row.email || '-'}</div>
            </div>
          `
        }
      },
      {
        prop: 'role',
        label: '角色',
        width: 120,
        render: (row: any) => {
          return row.role?.name
            ? `<span class="role-badge">${row.role.name}</span>`
            : '<span class="text-secondary">-</span>'
        }
      },
      {
        prop: 'department',
        label: '部门',
        width: 150,
        render: (row: any) => {
          return row.department?.label || '<span class="text-secondary">-</span>'
        }
      },
      {
        prop: 'isActive',
        label: '状态',
        width: 100,
        align: 'center',
        render: (row: any) => {
          return h(StatusTag, {
            type: row.isActive ? 'success' : 'default',
            text: row.isActive ? '启用' : '禁用'
          })
        }
      },
      {
        prop: 'lastLogin',
        label: '最后登录',
        width: 170,
        render: (row: any) => {
          if (!row.lastLogin) return '<span class="text-secondary">从未登录</span>'
          const date = new Date(row.lastLogin)
          return `<span style="color: #606266; font-size: 13px">${date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>`
        }
      },
      {
        prop: 'createdAt',
        label: '创建时间',
        width: 170,
        render: (row: any) => {
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
        key: 'actions',
        label: '操作',
        type: 'actions',
        width: 160,
        actions: [
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
        name: 'username',
        label: '用户名',
        type: 'input',
        required: true,
        placeholder: '请输入用户名',
        rules: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线', trigger: 'blur' }
        ]
      },
      {
        name: 'email',
        label: '邮箱',
        type: 'input',
        required: true,
        placeholder: '请输入邮箱',
        rules: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      {
        name: 'password',
        label: '密码',
        type: 'password',
        required: true,
        placeholder: '请输入密码（编辑时留空表示不修改）',
        rules: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少6位', trigger: 'blur' }
        ]
      },
      {
        name: 'roleId',
        label: '角色',
        type: 'select',
        placeholder: '请选择角色',
        options: [] // 动态加载
      },
      {
        name: 'departmentId',
        label: '部门',
        type: 'select',
        placeholder: '请选择部门',
        options: [] // 动态加载
      },
      {
        name: 'isActive',
        label: '状态',
        type: 'switch',
        inline: true,
        defaultValue: true,
        activeText: '启用',
        inactiveText: '禁用'
      }
    ]
  },

  // 模态框配置
  modal: {
    title: '用户',
    width: '600px',
    addTitle: '新增用户',
    editTitle: '编辑用户',
    cancelText: '取消',
    addSubmitText: '确定',
    editSubmitText: '保存',
    submittingText: '保存中...'
  }
}
