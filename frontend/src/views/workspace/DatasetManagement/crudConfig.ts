import { h } from 'vue'
import { createToolbarActions, createRowActions } from '@/components/simple/actions'
import StatusTag from '@/components/common/StatusTag/index.vue'

// 创建 CRUD 配置
export const crudConfig = {
  showSearch: true,
  table: {
    rowKey: 'id',
    emptyText: '暂无数据集',
    // 搜索表单配置
    searchForm: {
      fields: [
        {
          key: 'name',
          label: '数据集名称',
          type: 'text',
          placeholder: '搜索数据集名称或key'
        },
        {
          key: 'type',
          label: '类型',
          type: 'select',
          placeholder: '选择类型',
          options: [
            { label: '全部', value: '' },
            { label: 'SQL', value: 'sql' },
            { label: 'Excel', value: 'excel' },
            { label: 'API', value: 'api' }
          ]
        },
        {
          key: 'status',
          label: '状态',
          type: 'select',
          placeholder: '选择状态',
          options: [
            { label: '全部', value: '' },
            { label: '正常', value: 'active' },
            { label: '未激活', value: 'inactive' }
          ]
        }
      ]
    },
    actions: createToolbarActions(['add']),
    columns: [
      {
        key: 'name',
        label: '数据集名称',
        width: '25%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          return h('div', { class: 'dataset-cell' }, [
            h('div', {
              class: 'dataset-name',
              style: {
                fontWeight: '600',
                fontSize: '13px',
                color: 'var(--el-text-color-primary)'
              }
            }, row.name),
            h('div', {
              class: 'dataset-key',
              style: {
                fontSize: '11px',
                color: 'var(--el-text-color-placeholder)',
                fontFamily: 'Monaco, Menlo, Consolas, monospace',
                marginTop: '4px'
              }
            }, `key: ${row.key}`)
          ])
        }
      },
      {
        key: 'type',
        label: '类型',
        width: '12%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          const typeMap = {
            sql: { text: 'SQL', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' },
            excel: { text: 'Excel', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' },
            api: { text: 'API', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' }
          }
          const type = typeMap[row.type] || { text: row.type, color: '#666', bg: 'rgba(0,0,0,0.1)', border: 'rgba(0,0,0,0.2)' }
          return h('span', {
            class: 'type-badge',
            style: {
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '4px',
              display: 'inline-block',
              fontWeight: '600',
              textTransform: 'uppercase',
              background: type.bg,
              color: type.color,
              border: `1px solid ${type.border}`
            }
          }, type.text)
        }
      },
      {
        key: 'source',
        label: '数据源',
        width: '18%',
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', {
            class: 'source-text',
            style: {
              fontSize: '12px',
              color: 'var(--el-text-color-secondary)',
              fontFamily: 'Monaco, Menlo, Consolas, monospace'
            }
          }, row.source)
        }
      },
      {
        key: 'status',
        label: '状态',
        width: '15%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          const isActive = row.status === 'active'
          return h(StatusTag, {
            type: isActive ? 'success' : 'error',
            text: row.statusText || (isActive ? '正常' : '未激活'),
            style: 'dot'
          })
        }
      },
      {
        key: 'updatedAt',
        label: '更新时间',
        width: '15%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', {
            class: 'time-text',
            style: {
              fontSize: '12px',
              color: 'var(--el-text-color-secondary)'
            }
          }, row.updatedAt)
        }
      },
      {
        key: 'actions',
        label: '操作',
        type: 'actions',
        align: 'right',
        fixed: 'right',
        width: '100px',
        actions: createRowActions(['edit', 'delete'])
      }
    ]
  },
  form: {
    fields: [
      {
        key: 'name',
        label: '数据集名称',
        type: 'text',
        required: true,
        placeholder: '请输入数据集名称',
        rules: [
          { required: true, message: '请输入数据集名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      },
      {
        key: 'type',
        label: '类型',
        type: 'select',
        required: true,
        options: [
          { label: 'SQL', value: 'sql' },
          { label: 'Excel', value: 'excel' },
          { label: 'API', value: 'api' }
        ],
        default: 'sql',
        rules: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      {
        key: 'description',
        label: '描述',
        type: 'textarea',
        placeholder: '请输入数据集描述',
        rows: 3,
        rules: [
          { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
        ]
      },
      {
        key: 'status',
        label: '状态',
        type: 'select',
        required: true,
        options: [
          { label: '正常', value: 'active' },
          { label: '未激活', value: 'inactive' }
        ],
        default: 'active',
        rules: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    ]
  },
  modal: {
    title: '数据集'
  }
}