import { h } from 'vue'
import { createToolbarActions } from '@/components/simple/actions'

// 创建 CRUD 配置
export const crudConfig = {
  showSearch: true,
  table: {
    rowKey: 'id',
    emptyText: '暂无审计日志',
    // 搜索表单配置
    searchForm: {
      fields: [
        {
          key: 'search',
          label: '搜索',
          type: 'text',
          placeholder: '搜索操作人 / IP...'
        },
        {
          key: 'dateRange',
          label: '日期',
          type: 'date',
          placeholder: '选择日期'
        },
        {
          key: 'module',
          label: '功能模块',
          type: 'select',
          placeholder: '所有模块',
          options: [
            { label: '所有模块', value: '' },
            { label: '系统登录', value: '系统登录' },
            { label: '用户管理', value: '用户管理' },
            { label: '角色管理', value: '角色管理' },
            { label: '项目管理', value: '项目管理' },
            { label: '数据源管理', value: '数据源管理' },
            { label: '模板管理', value: '模板管理' },
            { label: '系统设置', value: '系统设置' },
            { label: 'IP白名单', value: 'IP白名单' },
            { label: '备份管理', value: '备份管理' },
            { label: '媒体管理', value: '媒体管理' },
            { label: '播放列表', value: '播放列表' }
          ]
        },
        {
          key: 'status',
          label: '状态',
          type: 'select',
          placeholder: '所有状态',
          options: [
            { label: '所有状态', value: '' },
            { label: '成功', value: 'success' },
            { label: '失败', value: 'fail' }
          ]
        }
      ]
    },
    actions: [
      {
        key: 'export',
        label: '导出',
        type: 'default',
        icon: 'download'
      }
    ], // 添加导出按钮
    columns: [
      {
        key: 'timestamp',
        label: '操作时间',
        width: '16%',
        sortable: true,
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', { class: 'time-text' }, row.timestamp)
        }
      },
      {
        key: 'userName',
        label: '操作人',
        width: '12%',
        render: (row) => {
          if (!row) return h('span', '-')
          return h('div', { class: 'col-user' }, [
            h('div', {
              class: 'avatar',
              style: { background: row.avatarColor }
            }, row.userInitials),
            h('div', { class: 'user-name' }, row.userName)
          ])
        }
      },
      {
        key: 'ip',
        label: 'IP地址',
        width: '12%',
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', { class: 'user-ip' }, row.ip)
        }
      },
      {
        key: 'module',
        label: '功能模块',
        width: '12%'
      },
      {
        key: 'action',
        label: '操作类型',
        width: '12%',
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', {
            class: `action-badge action-${row.actionType}`
          }, row.action)
        }
      },
      {
        key: 'description',
        label: '操作对象 / 描述',
        width: '20%',
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', { innerHTML: row.description })
        }
      },
      {
        key: 'status',
        label: '状态',
        width: '8%',
        render: (row) => {
          if (!row) return h('span', '-')
          return h('span', {
            style: {
              fontSize: '12px',
              color: row.statusColor || 'inherit'
            }
          }, [
            h('span', {
              class: `status-dot status-${row.status}`
            }),
            h('span', row.statusText)
          ])
        }
      }
    ]
  }
}
