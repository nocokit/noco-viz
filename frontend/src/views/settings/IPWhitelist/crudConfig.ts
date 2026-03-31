import type { CrudConfig } from '@/types/crud'
import { validateIP } from '@/utils/validate'

export const crudConfig: CrudConfig = {
  // 搜索表单配置（新格式：与操作按钮在同一行）
  search: {
    fields: [
      {
        name: 'keyword',
        label: 'IP/备注',
        type: 'input',
        placeholder: '按 IP 地址或备注搜索',
        clearable: true
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
        label: '新增白名单',
        type: 'primary',
        icon: 'plus'
      }
    ],
    columns: [
      {
        prop: 'ip',
        label: 'IP 地址',
        minWidth: 200,
        fixed: 'left',
        sortable: true,
        render: (row: any) => {
          return `<span class="ip-badge">${row.ip || '-'}</span>`
        }
      },
      {
        prop: 'description',
        label: '备注说明',
        minWidth: 250,
        sortable: true,
        render: (row: any) => {
          return `<span class="description-text">${row.description || '-'}</span>`
        }
      },
      {
        prop: 'addedBy',
        label: '添加人',
        width: 120,
        sortable: true
      },
      {
        prop: 'createdAt',
        label: '添加时间',
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
        key: 'actions',
        label: '操作',
        type: 'actions',
        width: 160,
        fixed: 'right',
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
            danger: true
          }
        ]
      }
    ]
  },

  // 表单配置
  form: {
    fields: [
      {
        name: 'ip',
        label: 'IP 地址或网段',
        type: 'input',
        required: true,
        placeholder: '例如：192.168.1.1 或 192.168.1.0/24',
        rules: [
          { required: true, message: '请输入 IP 地址或网段', trigger: 'blur' },
          { validator: validateIP, trigger: 'blur' }
        ]
      },
      {
        name: 'description',
        label: '备注说明',
        type: 'textarea',
        placeholder: '例如：研发部办公室 Wi-Fi',
        rows: 4,
        rules: [
          { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
        ]
      }
    ]
  },

  // 模态框配置
  modal: {
    title: '访问白名单'
  }
}

