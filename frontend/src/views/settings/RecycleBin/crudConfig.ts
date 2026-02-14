import { h } from 'vue'
import { createToolbarActions, createRowActions } from '@/components/simple/actions'

/**
 * 回收站 CRUD 配置
 */
export const crudConfig = {
  showSearch: true,
  table: {
    rowKey: 'id',
    emptyText: '暂无数据',
    // 搜索表单配置
    searchForm: {
      fields: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          placeholder: '搜索项目名称'
        },
        {
          key: 'type',
          label: '类型',
          type: 'select',
          placeholder: '选择类型',
          options: [
            { label: '大屏项目', value: 'project' },
            { label: '数据源', value: 'datasource' },
            { label: '媒体资源', value: 'media' },
            { label: '组件包', value: 'component' }
          ]
        }
      ]
    },
    actions: createToolbarActions([]),
    columns: [
      {
        key: 'name',
        label: '名称 / 原位置',
        width: '35%',
        render: (row) => {
          if (!row) return h('span', '-')

          // 图标映射
          const iconPaths = {
            project: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
            datasource: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z',
            media: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
            component: 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z'
          }

          return h('div', { class: 'item-cell' }, [
            h('div', { class: `item-icon icon-${row.type}` }, [
              h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' }, [
                h('path', { d: iconPaths[row.type] || iconPaths.component })
              ])
            ]),
            h('div', { class: 'item-info' }, [
              h('div', { class: 'item-name' }, row.name),
              h('div', { class: 'item-location' }, row.location)
            ])
          ])
        }
      },
      {
        key: 'deletedBy',
        label: '删除人',
        width: '15%',
        render: (row) => {
          if (!row) return h('span', '-')
          return h('div', { class: 'user-info' }, [
            h('div', { class: 'user-name' }, row.deletedBy),
            h('div', { class: 'user-id' }, row.deletedById)
          ])
        }
      },
      {
        key: 'deletedAt',
        label: '删除时间',
        width: '20%'
      },
      {
        key: 'daysLeft',
        label: '剩余天数',
        width: '10%',
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', {
            class: ['days-badge', { 'days-warning': row.daysLeft <= 3 }]
          }, `${row.daysLeft} 天`)
        }
      },
      {
        key: 'createdAt',
        label: '操作',
        width: '15%',
        type: 'actions',
        align: 'right',
        fixed: 'right',
        actions: createRowActions(['delete'])
      }
    ]
  },
  form: {
    fields: []
  },
  modal: {
    title: '回收站'
  }
}
