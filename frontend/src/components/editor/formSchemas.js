/**
 * 编辑器表单配置 - 基础版
 * 只包含组件ID、组件名称、布局与变换
 */

// 页面配置 Schema
export const pageConfigSchema = [
  {
    title: '页面信息',
    icon: 'info',
    divider: false,
    fields: [
      {
        label: '页面标题',
        key: 'title',
        type: 'input',
        inline: true,
        props: { placeholder: '请输入页面标题' }
      }
    ]
  },
  {
    title: '画布尺寸',
    icon: 'canvas',
    divider: false,
    grid: { columns: 2 },
    fields: [
      {
        label: '宽度',
        key: 'width',
        type: 'number',
        props: { min: 800, max: 7680, step: 1 }
      },
      {
        label: '高度',
        key: 'height',
        type: 'number',
        props: { min: 600, max: 4320, step: 1 }
      }
    ]
  },
  {
    title: '背景设置',
    icon: 'background',
    divider: false,
    fields: [
      {
        label: '背景色',
        key: 'backgroundColor',
        type: 'color',
        inline: true
      },
      {
        label: '背景图',
        key: 'backgroundImage',
        type: 'image-picker',
        inline: false
      }
    ]
  }
]

export const basicComponentSchema = [
  // 基础信息
  {
    title: '基础信息',
    icon: 'info',
    divider: false,
    fields: [
      {
        label: '组件ID',
        key: 'id',
        type: 'input',
        inline: true,
        props: {
          readonly: true,
          disabled: true
        }
      },
      {
        label: '组件名称',
        key: 'name',
        type: 'input',
        inline: true,
        props: {
          placeholder: '请输入组件名称'
        }
      }
    ]
  },

  // 布局与变换
  {
    title: '布局与变换',
    icon: 'layout',
    divider: false,
    grid: { columns: 2 },
    fields: [
      {
        label: 'W',
        key: 'w',
        type: 'number',
        props: {
          min: 1,
          step: 1
        }
      },
      {
        label: 'H',
        key: 'h',
        type: 'number',
        props: {
          min: 1,
          step: 1
        }
      },
      {
        label: 'X',
        key: 'x',
        type: 'number',
        props: {
          step: 1
        }
      },
      {
        label: 'Y',
        key: 'y',
        type: 'number',
        props: {
          step: 1
        }
      }
    ]
  },

  // 旋转角度
  {
    title: '',
    divider: false,
    fields: [
      {
        label: '旋转角度',
        key: 'rotation',
        type: 'number',
        inline: true,
        props: {
          min: 0,
          max: 360,
          step: 1,
          suffix: '°'
        }
      },
      {
        label: '图层顺序',
        key: 'zIndex',
        type: 'number',
        inline: true,
        props: {
          min: -10,
          max: 100,
          step: 1,
          placeholder: '自动'
        }
      }
    ]
  }
]

/**
 * 完整的组件配置 Schema
 */
export const componentFormSchemaFlat = [
  // 基础信息
  {
    title: '基础信息',
    icon: 'info',
    divider: false,
    fields: [
      {
        label: '组件ID',
        key: 'id',
        type: 'input',
        inline: true,
        props: {
          readonly: true,
          disabled: true
        }
      },
      {
        label: '组件名称',
        key: 'name',
        type: 'input',
        inline: true,
        props: {
          placeholder: '请输入组件名称'
        }
      }
    ]
  },

  // 布局与变换 - 尺寸和位置
  {
    title: '布局与变换',
    icon: 'layout',
    divider: false,
    grid: { columns: 2 },
    fields: [
      {
        label: 'W',
        key: 'w',
        type: 'number',
        props: {
          min: 1,
          step: 1
        }
      },
      {
        label: 'H',
        key: 'h',
        type: 'number',
        props: {
          min: 1,
          step: 1
        }
      },
      {
        label: 'X',
        key: 'x',
        type: 'number',
        props: {
          step: 1
        }
      },
      {
        label: 'Y',
        key: 'y',
        type: 'number',
        props: {
          step: 1
        }
      }
    ]
  },

  // 旋转角度
  {
    title: '',
    divider: true,
    fields: [
      {
        label: '旋转角度',
        key: 'rotation',
        type: 'number',
        inline: true,
        props: {
          min: 0,
          max: 360,
          step: 1,
          suffix: '°'
        }
      },
      {
        label: '图层顺序',
        key: 'zIndex',
        type: 'number',
        inline: true,
        props: {
          min: -10,
          max: 100,
          step: 1,
          placeholder: '自动'
        }
      }
    ]
  },

  // 视觉样式
  {
    title: '视觉样式',
    icon: 'color',
    divider: false,
    fields: [
      {
        label: '背景色',
        key: 'bgColor',
        type: 'color',
        inline: true,
        props: {
          placeholder: 'transparent'
        }
      },
      {
        label: '透明度',
        key: 'opacity',
        type: 'slider',
        inline: true,
        props: {
          min: 0,
          max: 100,
          step: 1,
          suffix: '%'
        }
      }
    ]
  },

  // 边框样式
  {
    title: '',
    divider: false,
    grid: { columns: 2 },
    fields: [
      {
        label: '边框宽度',
        key: 'borderWidth',
        type: 'number',
        props: {
          min: 0,
          step: 1
        }
      },
      {
        label: '圆角',
        key: 'borderRadius',
        type: 'number',
        props: {
          min: 0,
          step: 1
        }
      }
    ]
  },

  // 边框颜色
  {
    title: '',
    divider: false,
    fields: [
      {
        label: '边框颜色',
        key: 'borderColor',
        type: 'color',
        inline: true,
        props: {
          placeholder: '#409eff'
        }
      }
    ]
  },

  // 内边距
  {
    title: '内边距',
    icon: 'padding',
    divider: false,
    grid: { columns: 2 },
    fields: [
      {
        label: '上下',
        key: 'paddingVertical',
        type: 'number',
        props: {
          min: 0,
          step: 1,
          suffix: 'px',
          defaultValue: 8
        }
      },
      {
        label: '左右',
        key: 'paddingHorizontal',
        type: 'number',
        props: {
          min: 0,
          step: 1,
          suffix: 'px',
          defaultValue: 8
        }
      }
    ]
  }
]

/**
 * 完整的组件配置 Schema - 带分类和折叠
 * 包含：基础信息、布局和变换、颜色和背景、字体配置
 */
export const fullComponentSchema = [
  // 基础信息
  {
    title: '基础信息',
    icon: 'info',
    divider: true,
    collapsible: false,
    defaultCollapsed: false,
    fields: [
      {
        label: '组件ID',
        key: 'id',
        type: 'input',
        inline: true,
        props: { readonly: true, disabled: true }
      },
      {
        label: '组件名称',
        key: 'name',
        type: 'input',
        inline: true,
        props: { placeholder: '请输入组件名称' }
      }
    ]
  },

  // 布局和变换 - 可折叠
  {
    title: '布局和变换',
    icon: 'layout',
    divider: true,
    collapsible: false,
    defaultCollapsed: false,
    grid: { columns: 2 },
    fields: [
      {
        label: 'W',
        key: 'w',
        type: 'number',
        props: { min: 1, step: 1 }
      },
      {
        label: 'H',
        key: 'h',
        type: 'number',
        props: { min: 1, step: 1 }
      },
      {
        label: 'X',
        key: 'x',
        type: 'number',
        props: { step: 1 }
      },
      {
        label: 'Y',
        key: 'y',
        type: 'number',
        props: { step: 1 }
      }
    ]
  },

  // 旋转
  {
    title: '',
    divider: false,
    collapsible: false,
    fields: [
      {
        label: '旋转角度',
        key: 'rotation',
        type: 'number',
        inline: true,
        props: {
          min: 0,
          max: 360,
          step: 1,
          suffix: '°'
        }
      }
    ]
  },

  // 颜色和背景 - 可折叠
  {
    title: '颜色和背景',
    icon: 'color',
    divider: true,
    collapsible: false,
    defaultCollapsed: false,
    fields: [
      {
        label: '背景色',
        key: 'bgColor',
        type: 'color',
        inline: true,
        props: {
          placeholder: 'transparent'
        }
      },
      {
        label: '透明度',
        key: 'opacity',
        type: 'slider',
        inline: true,
        props: {
          min: 0,
          max: 100,
          step: 1,
          suffix: '%'
        }
      }
    ]
  },

  // 边框样式 - 可折叠
  {
    title: '边框样式',
    icon: 'border',
    divider: true,
    collapsible: false,
    defaultCollapsed: false,
    fields: [
      {
        label: '显示边框',
        key: 'showBorder',
        type: 'switch',
        inline: true
      },
      {
        label: '边框宽度',
        key: 'borderWidth',
        type: 'number',
        inline: true,
        props: {
          min: 0,
          step: 1
        }
      },
      {
        label: '边框颜色',
        key: 'borderColor',
        type: 'color',
        inline: true,
        props: {
          placeholder: '#409eff'
        }
      },
      {
        label: '圆角',
        key: 'borderRadius',
        type: 'number',
        inline: true,
        props: {
          min: 0,
          step: 1
        }
      }
    ]
  },

  // 内边距 - 可折叠
  {
    title: '内边距',
    icon: 'padding',
    divider: true,
    collapsible: false,
    defaultCollapsed: false,
    grid: { columns: 2 },
    fields: [
      {
        label: '上下',
        key: 'paddingVertical',
        type: 'number',
        props: { min: 0, step: 1, suffix: 'px', defaultValue: 8 }
      },
      {
        label: '左右',
        key: 'paddingHorizontal',
        type: 'number',
        props: { min: 0, step: 1, suffix: 'px', defaultValue: 8 }
      }
    ]
  }

  // 字体配置已移至 FontConfigPanel 组件（左侧垂直标签页）
]
