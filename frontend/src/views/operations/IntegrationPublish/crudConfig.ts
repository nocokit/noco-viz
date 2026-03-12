import { h } from 'vue'
import { createToolbarActions, createRowActions } from '@/components/simple/actions'

// 创建 CRUD 配置
export const crudConfig = {
  showSearch: true,
  table: {
    rowKey: 'id',
    emptyText: '暂无数据',
    // 搜索表单配置
    searchForm: {
      fields: [
        {
          key: 'projectId',
          label: '项目ID',
          type: 'text',
          placeholder: '搜索项目ID'
        },
        {
          key: 'authType',
          label: '认证方式',
          type: 'select',
          placeholder: '选择认证方式',
          options: [
            { label: '全部', value: '' },
            { label: '无认证 (Public)', value: 'public' },
            { label: '签名验证 (Sign)', value: 'sign' }
          ]
        },
        {
          key: 'status',
          label: '状态',
          type: 'select',
          placeholder: '选择状态',
          options: [
            { label: '全部', value: '' },
            { label: '已上线', value: 'online' },
            { label: '已下线', value: 'offline' }
          ]
        }
      ]
    },
    actions: createToolbarActions(['add']),
    columns: [
      {
        key: 'projectId',
        label: '项目名称',
        width: 180,
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          return h('div', [
            h('div', { class: 'project-name' }, `项目 #${row.projectId}`),
            h('div', { class: 'project-id' }, `ID: ${row.id}`)
          ])
        }
      },
      {
        key: 'authType',
        label: '认证方式',
        width: 120,
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          const isPublic = row.authType === 'public'
          return h('span', {
            class: isPublic ? 'auth-badge auth-public' : 'auth-badge auth-sign'
          }, isPublic ? '无认证 (Public)' : '签名验证 (Sign)')
        }
      },
      {
        key: 'domains',
        label: '嵌入域名白名单',
        minWidth: 200,
        render: (row) => {
          if (!row || !row.domains || row.domains.length === 0) {
            return h('span', { class: 'text-secondary' }, '-')
          }
          return h('div', { class: 'domain-list' },
            row.domains.map(domain =>
              h('span', {
                class: domain === '*' ? 'domain-tag unrestricted' : 'domain-tag'
              }, domain === '*' ? '* (不限制)' : domain)
            )
          )
        }
      },
      {
        key: 'params',
        label: '接收参数',
        width: 150,
        render: (row) => {
          if (!row || !row.params) return h('span', { class: 'text-secondary' }, '-')
          return h('span', { class: 'params-text' }, row.params)
        }
      },
      {
        key: 'status',
        label: '状态',
        width: 100,
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          const isOnline = row.status === 'online'
          return h('span', {
            class: isOnline ? 'status-online' : 'status-offline'
          }, isOnline ? '● 已上线' : '● 已下线')
        }
      },
      {
        key: 'actions',
        label: '操作',
        type: 'actions',
        align: 'right',
        fixed: 'right',
        width: 150,
        actions: createRowActions(['edit', 'delete'])
      }
    ]
  },
  form: {
    fields: [
      {
        key: 'projectId',
        label: '项目ID',
        type: 'number',
        required: true,
        placeholder: '请输入项目ID'
      },
      {
        key: 'authType',
        label: '认证方式',
        type: 'select',
        required: true,
        options: [
          { label: '无认证 (Public)', value: 'public' },
          { label: '签名验证 (Sign)', value: 'sign' }
        ],
        default: 'public'
      },
      {
        key: 'domains',
        label: '嵌入域名白名单',
        type: 'textarea',
        placeholder: '每行一个域名，例如：\noa.example.com\nfinance.internal.net\n或输入 * 表示不限制',
        rows: 4,
        help: '多个域名请换行输入'
      },
      {
        key: 'params',
        label: '接收参数',
        type: 'text',
        placeholder: '例如：orgId, year'
      },
      {
        key: 'status',
        label: '状态',
        type: 'select',
        required: true,
        options: [
          { label: '已上线', value: 'online' },
          { label: '已下线', value: 'offline' }
        ],
        default: 'online'
      },
      {
        key: 'sampleUrl',
        label: '示例URL',
        type: 'text',
        placeholder: '例如：?orgId=100&sign=XXX'
      }
    ]
  },
  modal: {
    title: '集成发布配置'
  }
}

