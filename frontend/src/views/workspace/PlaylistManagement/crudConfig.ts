import type { CrudConfig } from '@/types/crud'

export const crudConfig: CrudConfig = {
  // 搜索配置
  searchPlaceholder: '搜索轮播组...',

  // 搜索表单配置
  search: {
    fields: [
      {
        name: 'keyword',
        label: '轮播组名称',
        type: 'input',
        placeholder: '搜索轮播组...',
        clearable: true
      }
    ]
  },

  // 表格配置
  table: {
    searchPlaceholder: '搜索轮播组...',
    stripe: true,
    border: false,
    size: 'default',
    rowKey: 'id',
    // 工具栏按钮
    actions: [
      {
        key: 'add',
        label: '新增轮播组',
        type: 'primary',
        icon: 'plus'
      }
    ],
    columns: [
      {
        prop: 'name',
        label: '轮播组名称',
        minWidth: 200,
        fixed: 'left',
        sortable: true,
        render: (row: any) => {
          const statusBadge = row.status === 'playing'
            ? '<span style="margin-left: 8px; font-size: 11px; padding: 2px 8px; border-radius: 12px; background: rgba(16, 185, 129, 0.15); color: #10b981;">● 播放中</span>'
            : '<span style="margin-left: 8px; font-size: 11px; padding: 2px 8px; border-radius: 12px; background: rgba(255, 255, 255, 0.1); color: var(--el-text-color-secondary);">闲置</span>'

          return `
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: #a78bfa;">
                <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
              </svg>
              <span style="font-weight: 500;">${row.name}</span>
              ${statusBadge}
            </div>
          `
        }
      },
      {
        prop: 'slides',
        label: '页面数',
        width: 100,
        align: 'center',
        sortable: true,
        render: (row: any) => {
          const count = row.slides?.length || 0
          return `<span style="display: inline-flex; align-items: center; justify-content: center; min-width: 32px; padding: 4px 10px; background: rgba(167, 139, 250, 0.1); border: 1px solid rgba(167, 139, 250, 0.2); color: #a78bfa; border-radius: 12px; font-weight: 500; font-size: 13px;">${count}</span>`
        }
      },
      {
        prop: 'resolution',
        label: '分辨率',
        width: 150,
        sortable: true,
        render: (row: any) => {
          return `<span style="font-family: monospace; color: var(--el-text-color-regular);">${row.resolution || '-'}</span>`
        }
      },
      {
        prop: 'transition',
        label: '过渡效果',
        width: 120,
        sortable: true,
        render: (row: any) => {
          const transitionMap: Record<string, { text: string; color: string }> = {
            fade: { text: '淡入淡出', color: '#409eff' },
            slide: { text: '滑动', color: '#67c23a' },
            zoom: { text: '缩放', color: '#e6a23c' },
            none: { text: '无过渡', color: '#909399' }
          }
          const transition = transitionMap[row.transition] || { text: row.transition, color: '#909399' }
          return `<span style="display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 12px; background: ${transition.color}15; color: ${transition.color}; font-weight: 500;">${transition.text}</span>`
        }
      },
      {
        prop: 'updatedAt',
        label: '最后更新',
        width: 170,
        sortable: true,
        render: (row: any) => {
          if (!row.updatedAt) return '<span style="color: #909399">-</span>'
          const date = new Date(row.updatedAt)
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
        width: 200,
        fixed: 'right',
        actions: [
          {
            key: 'config',
            label: '配置轮播',
            icon: 'setting',
            type: 'primary'
          },
          {
            key: 'edit',
            label: '编辑',
            icon: 'edit'
          },
          {
            key: 'delete',
            label: '删除',
            icon: 'delete',
            class: 'danger'
          }
        ]
      }
    ]
  },

  // 表单配置
  form: {
    fields: [
      {
        name: 'name',
        label: '轮播组名称',
        type: 'input',
        required: true,
        placeholder: '请输入轮播组名称，例如：公司大堂主屏',
        maxlength: 50,
        rules: [
          { required: true, message: '请输入轮播组名称', trigger: 'blur' },
          { min: 2, max: 50, message: '名称长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      },
      {
        name: 'resolution',
        label: '分辨率',
        type: 'select',
        required: true,
        placeholder: '请选择分辨率',
        defaultValue: '1920x1080',
        options: [
          { label: '1920x1080 (Full HD)', value: '1920x1080' },
          { label: '3840x2160 (4K)', value: '3840x2160' },
          { label: '2560x1440 (2K)', value: '2560x1440' },
          { label: '1366x768 (HD)', value: '1366x768' }
        ],
        rules: [
          { required: true, message: '请选择分辨率', trigger: 'change' }
        ]
      },
      {
        name: 'transition',
        label: '过渡效果',
        type: 'select',
        required: true,
        placeholder: '请选择过渡效果',
        defaultValue: 'fade',
        options: [
          { label: '淡入淡出 (Fade)', value: 'fade' },
          { label: '滑动 (Slide)', value: 'slide' },
          { label: '缩放 (Zoom)', value: 'zoom' },
          { label: '无过渡 (None)', value: 'none' }
        ],
        rules: [
          { required: true, message: '请选择过渡效果', trigger: 'change' }
        ]
      }
    ]
  },

  // 模态框配置
  modal: {
    title: '轮播组'
  }
}
