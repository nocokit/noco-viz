import type { CrudConfig } from '@/types/crud'
import { h } from 'vue'
import StatusTag from '@/components/common/StatusTag/index.vue'

export const departmentConfig: CrudConfig = {
  // 搜索表单配置
  search: {
    inline: true,
    labelWidth: '80px',
    fields: [
      {
        name: 'label',
        label: '部门名称',
        type: 'input',
        placeholder: '请输入部门名称',
        clearable: true
      },
      {
        name: 'isActive',
        label: '状态',
        type: 'select',
        placeholder: '全部状态',
        clearable: true,
        options: [
          { label: '启用', value: true },
          { label: '禁用', value: false }
        ]
      }
    ]
  },

  // 表格配置
  table: {
    stripe: true,
    border: false,
    size: 'default',
    // 工具栏按钮
    actions: [
      {
        key: 'add',
        label: '新增部门',
        type: 'primary',
        icon: 'plus'
      }
    ],
    columns: [
      {
        prop: 'label',
        label: '部门名称',
        minWidth: 220,
        fixed: 'left',
        render: (row: any) => {
          return `
            <div class="department-name-cell">
              <div class="department-name">${row.label}</div>
              ${row.description ? `<div class="department-desc">${row.description}</div>` : ''}
            </div>
          `
        }
      },
      {
        prop: 'count',
        label: '成员数',
        width: 100,
        align: 'center',
        sortable: true,
        render: (row: any) => {
          return `<span class="member-count">${row.count || 0}</span>`
        }
      },
      {
        prop: 'parent',
        label: '上级部门',
        width: 180,
        render: (row: any) => {
          return row.parent?.label || '<span class="text-secondary">无</span>'
        }
      },
      {
        prop: 'isActive',
        label: '状态',
        width: 100,
        align: 'center',
        render: (row: any) => {
          return h(StatusTag, {
            type: row.isActive ? 'success' : 'default',
            text: row.isActive ? '启用' : '禁用'
          })
        }
      },
      {
        prop: 'createdAt',
        label: '创建时间',
        width: 170,
        render: (row: any) => {
          const date = new Date(row.createdAt)
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
        width: 160,
        actions: [
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
        name: 'label',
        label: '部门名称',
        type: 'input',
        required: true,
        placeholder: '请输入部门名称',
        rules: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      },
      {
        name: 'parentId',
        label: '上级部门',
        type: 'select',
        placeholder: '请选择上级部门（可选）',
        options: [] // 动态加载
      },
      {
        name: 'description',
        label: '部门描述',
        type: 'textarea',
        placeholder: '请输入部门描述',
        rows: 3
      },
      {
        name: 'count',
        label: '成员数',
        type: 'number',
        placeholder: '请输入成员数',
        min: 0,
        defaultValue: 0
      },
      {
        name: 'isActive',
        label: '状态',
        type: 'switch',
        inline: true,
        defaultValue: true,
        activeText: '启用',
        inactiveText: '禁用'
      }
    ]
  },

  // 模态框配置
  modal: {
    title: '部门',
    width: '600px',
    addTitle: '新增部门',
    editTitle: '编辑部门',
    cancelText: '取消',
    addSubmitText: '确定',
    editSubmitText: '保存',
    submittingText: '保存中...'
  }
}
