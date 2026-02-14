import { h } from 'vue'
import { createToolbarActions, createRowActions } from '@/components/simple/actions'
import { validateIP } from '@/utils/validate'

// 创建 CRUD 配置
export const crudConfig = {
  showSearch: false,
  table: {
    rowKey: 'id',
    emptyText: '暂无数据',
    // 搜索表单配置
    searchForm: {
      fields: [
        {
          key: 'ip',
          label: 'IP 地址',
          type: 'text',
          placeholder: '搜索 IP 地址或 CIDR'
        },
        {
          key: 'description',
          label: '备注说明',
          type: 'text',
          placeholder: '搜索备注内容'
        }
      ]
    },
    actions: createToolbarActions(['add']),
    columns: [
      {
        key: 'ip',
        label: 'IP 地址',
        width: '25%',
        sortable: true,
        render: (row: any) => {
          if (!row || !row.ip) return h('span', '-')
          return h('span', { class: 'ip-badge' }, row.ip)
        }
      },
      {
        key: 'description',
        label: '备注说明',
        width: '30%',
        sortable: true,
        render: (row: any) => {
          if (!row) return h('span', '-')
          return h('span', { class: 'description-text' }, row.description || '-')
        }
      },
      { key: 'addedBy', label: '添加人', width: '12%', sortable: true },
      {
        key: 'createdAt',
        label: '添加时间',
        width: '18%',
        format: 'datetime',
        sortable: true
      },
      {
        key: 'actions',
        label: '操作',
        type: 'actions',
        align: 'right',
        fixed: 'right',
        width: '120px',
        actions: createRowActions(['edit', 'delete'])
      }
    ]
  },
  form: {
    fields: [
      {
        key: 'ip',
        label: 'IP 地址或网段',
        type: 'text',
        required: true,
        placeholder: '例如：192.168.1.1 或 192.168.1.0/24',
        maxlength: 100,
        validator: validateIP
      },
      {
        key: 'description',
        label: '备注说明',
        type: 'textarea',
        placeholder: '例如：研发部办公室 Wi-Fi',
        maxlength: 200,
        rows: 4
      }
    ]
  },
  modal: {
    title: '访问白名单'
  }
}
