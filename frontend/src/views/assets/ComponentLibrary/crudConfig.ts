import { h } from 'vue'
import { createToolbarActions, createRowActions } from '@/components/simple/actions'

// 创建 CRUD 配置
export const crudConfig = {
  showSearch: true,
  table: {
    rowKey: 'id',
    emptyText: '暂无组件数据',
    // 搜索表单配置
    searchForm: {
      fields: [
        {
          key: 'keyword',
          label: '关键词',
          type: 'text',
          placeholder: '搜索组件名称或描述'
        },
        {
          key: 'category',
          label: '分类',
          type: 'text',
          placeholder: '搜索分类'
        },
        {
          key: 'isPublic',
          label: '可见性',
          type: 'select',
          placeholder: '选择可见性',
          options: [
            { label: '全部', value: '' },
            { label: '公开', value: 'true' },
            { label: '私有', value: 'false' }
          ]
        }
      ]
    },
    actions: createToolbarActions(['add']),
    columns: [
      {
        key: 'name',
        label: '组件名称',
        width: '25%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          return h('div', { class: 'component-name-cell' }, [
            h('div', { class: 'component-name' }, row.name),
            h('div', { class: 'component-desc' }, row.description || '')
          ])
        }
      },
      {
        key: 'category',
        label: '分类',
        width: '12%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', { class: 'category-tag' }, row.category)
        }
      },
      {
        key: 'type',
        label: '类型',
        width: '10%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', { class: 'type-text' }, row.type)
        }
      },
      {
        key: 'isPublic',
        label: '可见性',
        width: '10%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', {
            class: row.isPublic ? 'status-public' : 'status-private'
          }, row.isPublic ? '公开' : '私有')
        }
      },
      {
        key: 'creatorName',
        label: '创建者',
        width: '12%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', { class: 'creator-text' }, row.creatorName || '-')
        }
      },
      {
        key: 'createdAt',
        label: '创建时间',
        width: '15%',
        format: 'datetime',
        sortable: true
      },
      {
        key: 'actions',
        label: '操作',
        type: 'actions',
        align: 'center',
        fixed: 'right',
        width: '180px',
        actions: createRowActions(['edit', 'delete'])
      }
    ]
  },
  form: {
    fields: [
      {
        key: 'name',
        label: '组件名称',
        type: 'text',
        required: true,
        placeholder: '请输入组件名称',
        maxlength: 100
      },
      {
        key: 'category',
        label: '分类',
        type: 'text',
        required: true,
        placeholder: '请输入分类，如：数据展示',
        maxlength: 50
      },
      {
        key: 'type',
        label: '类型',
        type: 'text',
        required: true,
        placeholder: '请输入类型，如：chart',
        maxlength: 50
      },
      {
        key: 'description',
        label: '描述',
        type: 'textarea',
        placeholder: '请输入组件描述',
        rows: 3,
        maxlength: 500
      },
      {
        key: 'version',
        label: '版本',
        type: 'text',
        placeholder: '如：1.0.0',
        default: '1.0.0'
      },
      {
        key: 'isPublic',
        label: '可见性',
        type: 'select',
        required: true,
        options: [
          { label: '公开', value: true },
          { label: '私有', value: false }
        ],
        default: false
      }
    ]
  },
  modal: {
    title: '组件'
  }
}

