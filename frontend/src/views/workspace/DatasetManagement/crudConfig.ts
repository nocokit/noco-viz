import { h } from 'vue'
import { createToolbarActions, createRowActions } from '@/components/simple/actions'

export const crudConfig = {
  showSearch: true,
  table: {
    rowKey: 'id',
    emptyText: '暂无数据集',
    searchForm: {
      fields: [
        {
          key: 'name',
          label: '数据集名称',
          type: 'text',
          placeholder: '搜索数据集名称或 key'
        },
        {
          key: 'description',
          label: '描述',
          type: 'text',
          placeholder: '搜索描述'
        }
      ]
    },
    actions: createToolbarActions(['add']),
    columns: [
      {
        key: 'name',
        label: '数据集名称',
        width: '28%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          return h('div', [
            h('div', {
              style: {
                fontWeight: '600',
                fontSize: '13px',
                color: 'var(--el-text-color-primary)'
              }
            }, row.name),
            h('div', {
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
        key: 'description',
        label: '描述',
        width: '24%',
        render: (row) => h('span', row?.description || '-')
      },
      {
        key: 'itemTypesText',
        label: '包含类型',
        width: '16%',
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', {
            style: {
              fontSize: '12px',
              color: 'var(--el-text-color-secondary)'
            }
          }, row.itemTypesText || '-')
        }
      },
      {
        key: 'itemCount',
        label: '数据项数',
        width: '12%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', {
            style: {
              fontWeight: '500',
              color: 'var(--el-text-color-primary)'
            }
          }, `${row.itemCount ?? 0} 个`)
        }
      },
      {
        key: 'updatedAt',
        label: '更新时间',
        width: '12%',
        sortable: true,
        render: (row) => h('span', row?.updatedAt || '-')
      },
      {
        key: 'actions',
        label: '操作',
        type: 'actions',
        align: 'center',
        fixed: 'right',
        width: '150px',
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
        placeholder: '例如：比亚迪',
        rules: [
          { required: true, message: '请输入数据集名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
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
      }
    ]
  },
  modal: {
    title: '数据集'
  }
}
