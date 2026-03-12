import type { CrudConfig } from '@/types/crud'
import { h } from 'vue'
import StatusTag from '@/components/common/StatusTag/index.vue'

export const crudConfig: CrudConfig = {
  // 搜索表单配置
  search: {
    inline: true,
    labelWidth: '90px',
    fields: [
      {
        name: 'name',
        label: '数据源名称',
        type: 'input',
        placeholder: '请输入数据源名称',
        clearable: true
      },
      {
        name: 'type',
        label: '类型',
        type: 'select',
        placeholder: '全部类型',
        clearable: true,
        options: [
          { label: 'MySQL', value: 'mysql' },
          { label: 'PostgreSQL', value: 'postgresql' },
          { label: 'MongoDB', value: 'mongodb' },
          { label: 'Redis', value: 'redis' },
          { label: 'REST API', value: 'restapi' },
          { label: 'GraphQL', value: 'graphql' }
        ]
      },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        placeholder: '全部状态',
        clearable: true,
        options: [
          { label: '正常', value: 'active' },
          { label: '异常', value: 'error' }
        ]
      }
    ]
  },

  // 表格配置
  table: {
    stripe: true,
    border: false,
    size: 'default',
    columns: [
      {
        prop: 'name',
        label: '数据源信息',
        minWidth: 220,
        fixed: 'left',
        render: (row: any) => {
          return `
            <div class="datasource-name-cell">
              <div class="datasource-name">${row.name}</div>
              <div class="datasource-host">${row.config?.host || 'N/A'}:${row.config?.port || ''}</div>
            </div>
          `
        }
      },
      {
        prop: 'type',
        label: '类型',
        width: 110,
        render: (row: any) => {
          const typeMap: Record<string, string> = {
            mysql: 'MySQL',
            postgresql: 'PostgreSQL',
            mongodb: 'MongoDB',
            redis: 'Redis',
            restapi: 'REST API',
            graphql: 'GraphQL'
          }
          return `<span class="db-type-badge">${typeMap[row.type] || row.type}</span>`
        }
      },
      {
        prop: 'status',
        label: '状态',
        width: 100,
        align: 'center',
        render: (row: any) => {
          return h(StatusTag, {
            type: row.status === 'active' ? 'success' : 'error',
            text: row.status === 'active' ? '正常' : '异常',
            style: 'dot'
          })
        }
      },
      {
        prop: 'activeConnections',
        label: '活跃连接',
        width: 140,
        align: 'center',
        render: (row: any) => {
          const active = row.activeConnections || 0
          const max = row.maxConnections || 100
          const percent = Math.round((active / max) * 100)
          const color = percent > 80 ? '#f56c6c' : percent > 50 ? '#e6a23c' : '#67c23a'
          return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
              <span style="font-weight: 600; font-size: 13px; color: ${color}">${active} / ${max}</span>
              <div style="width: 70px; height: 6px; background: #f5f7fa; border-radius: 3px; overflow: hidden;">
                <div style="width: ${percent}%; height: 100%; background: ${color}; transition: width 0.3s;"></div>
              </div>
            </div>
          `
        }
      },
      {
        prop: 'latency',
        label: '响应延迟',
        width: 110,
        align: 'center',
        sortable: true,
        render: (row: any) => {
          const latency = row.latency || 0
          const color = latency > 200 ? '#f56c6c' : latency > 100 ? '#e6a23c' : '#67c23a'
          return `<span style="font-weight: 600; font-size: 13px; color: ${color}">${latency} ms</span>`
        }
      },
      {
        prop: 'slowQueries',
        label: '慢查询',
        width: 90,
        align: 'center',
        sortable: true,
        render: (row: any) => {
          const count = row.slowQueries || 0
          return count > 0
            ? `<span style="color: #f56c6c; font-weight: 600; font-size: 13px">${count}</span>`
            : `<span style="color: #909399; font-size: 13px">${count}</span>`
        }
      },
      {
        prop: 'lastCheck',
        label: '最后检查时间',
        width: 170,
        render: (row: any) => {
          if (!row.lastCheck) return '<span style="color: #909399">-</span>'
          const date = new Date(row.lastCheck)
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
        width: 180,
        fixed: 'right',
        actions: [
          {
            key: 'testConnection',
            label: '测试'
          },
          {
            key: 'viewDetails',
            label: '详情'
          }
        ]
      }
    ]
  }
}
