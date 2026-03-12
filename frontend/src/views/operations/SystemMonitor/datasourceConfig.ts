import type { CrudConfig } from '@/types/crud'

export const datasourceConfig: CrudConfig = {
  // 搜索表单配置
  search: {
    fields: [
      {
        name: 'keyword',
        label: '数据源/类型',
        type: 'input',
        placeholder: '搜索数据源名称或类型',
        clearable: true
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
        minWidth: 250,
        fixed: 'left',
        render: (row: any) => {
          const iconColors: Record<string, { bg: string; color: string }> = {
            MySQL: { bg: 'rgba(0, 117, 143, 0.1)', color: '#00758f' },
            Redis: { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' },
            PostgreSQL: { bg: 'rgba(49, 108, 244, 0.1)', color: '#316cf4' },
            MongoDB: { bg: 'rgba(0, 237, 100, 0.1)', color: '#00ed64' }
          }
          const icon = iconColors[row.type] || { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }

          return `
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; background: ${icon.bg}; color: ${icon.color}; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                  <path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4M4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4m0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <div style="font-size: 14px; font-weight: 600; color: #262626; margin-bottom: 4px;">${row.name}</div>
                <div style="font-size: 12px; color: #8c8c8c;">
                  <span style="display: inline-block; padding: 2px 6px; background: #f0f0f0; border-radius: 3px; font-weight: 500; margin-right: 6px;">${row.type}</span>
                  <span style="font-family: 'Monaco', 'Courier New', monospace;">${row.host}</span>
                </div>
              </div>
            </div>
          `
        }
      },
      {
        prop: 'responseTime',
        label: '响应时间',
        width: 120,
        align: 'center',
        sortable: true,
        render: (row: any) => {
          const time = row.responseTime || 0
          const color = time === 0 ? '#909399' : time > 50 ? '#f56c6c' : time > 20 ? '#e6a23c' : '#67c23a'
          return `
            <div style="text-align: center;">
              <div style="font-size: 16px; font-weight: 600; color: ${color};">${time}</div>
              <div style="font-size: 11px; color: #8c8c8c; text-transform: uppercase;">ms</div>
            </div>
          `
        }
      },
      {
        prop: 'connections',
        label: '连接数',
        width: 100,
        align: 'center',
        sortable: true,
        render: (row: any) => {
          const count = row.connections || 0
          return `
            <div style="text-align: center;">
              <div style="font-size: 16px; font-weight: 600; color: #262626;">${count}</div>
              <div style="font-size: 11px; color: #8c8c8c; text-transform: uppercase;">connections</div>
            </div>
          `
        }
      },
      {
        prop: 'status',
        label: '状态',
        width: 100,
        align: 'center',
        render: (row: any) => {
          const isOnline = row.status === 'online'
          const bgColor = isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          const textColor = isOnline ? '#10b981' : '#ef4444'
          const dotShadow = isOnline ? '0 0 6px rgba(16, 185, 129, 0.6)' : '0 0 6px rgba(239, 68, 68, 0.6)'

          return `
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: ${bgColor}; color: ${textColor}; border-radius: 6px; font-size: 13px; font-weight: 500;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: ${textColor}; box-shadow: ${dotShadow};"></span>
              <span>${isOnline ? '在线' : '离线'}</span>
            </div>
          `
        }
      },
      {
        key: 'actions',
        label: '操作',
        type: 'actions',
        align: 'right',
        fixed: 'right',
        width: 160,
        actions: [
          {
            key: 'test',
            label: '测试连接',
            icon: 'check'
          },
          {
            key: 'view',
            label: '详情',
            icon: 'view'
          }
        ]
      }
    ]
  }
}
