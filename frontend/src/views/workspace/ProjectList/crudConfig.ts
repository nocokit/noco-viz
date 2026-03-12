// 项目类型配置
export const projectTypes = [
  {
    key: 'screen',
    title: '数据可视化大屏',
    subtitle: 'Screen Visualization',
    description: '适用于指挥中心、行业大屏、汇报演示。支持绝对定位画布、3D 模型集成及炫酷动效。',
    icon: 'M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z'
  },
  {
    key: 'report',
    title: '中国式复杂报表',
    subtitle: 'Enterprise Report',
    description: '适用于业务清单、财务报表、数据填报。支持类 Excel 布局、分页打印及复杂表头。',
    icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z'
  }
]

// 表单字段配置
export const formFields = [
  {
    prop: 'title',
    label: '项目名称',
    type: 'input',
    placeholder: '请输入项目名称，例如：智慧城市交通大脑',
    maxlength: 50,
    showWordLimit: true,
    required: true,
    rules: [
      { required: true, message: '请输入项目名称', trigger: 'blur' },
      { min: 2, max: 50, message: '项目名称长度在 2 到 50 个字符', trigger: 'blur' }
    ]
  },
  {
    prop: 'description',
    label: '项目描述',
    type: 'textarea',
    placeholder: '请简要描述项目用途和功能...',
    rows: 4,
    maxlength: 200,
    showWordLimit: true,
    rules: [
      { max: 200, message: '项目描述不能超过 200 个字符', trigger: 'blur' }
    ]
  },
  {
    prop: 'coverImage',
    label: '封面图片',
    type: 'slot',
    tip: '建议尺寸: 16:9, 支持 JPG、PNG 格式'
  }
]

// 表单验证规则
export const projectRules = {
  title: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 50, message: '项目名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '项目描述不能超过 200 个字符', trigger: 'blur' }
  ]
}

