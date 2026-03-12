/**
 * 编辑器表单配置 - 基础版
 * 只包含组件ID、组件名称、布局与变换
 */

export const basicComponentSchema = [
  // 基础信息
  {
    title: '基础信息',
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
      }
    ]
  },

  // 视觉样式
  {
    title: '视觉样式',
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
          placeholder: '#3b82f6'
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
  // 基础信息 - 可折叠
  {
    title: '基础信息',
    divider: true,
    collapsible: true,
    defaultCollapsed: false,
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

  // 布局和变换 - 可折叠
  {
    title: '布局和变换',
    divider: true,
    collapsible: true,
    defaultCollapsed: false,
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
    divider: true,
    collapsible: true,
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
      },
      {
        label: '边框颜色',
        key: 'borderColor',
        type: 'color',
        inline: true,
        props: {
          placeholder: '#3b82f6'
        }
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

  // 字体配置 - 可折叠,使用按钮组切换
  {
    title: '字体配置',
    divider: true,
    collapsible: true,
    defaultCollapsed: false,
    segmented: true,
    segments: [
      {
        label: '标题字体',
        value: 'title',
        fields: [
          {
            label: '字号',
            key: 'titleFontSize',
            type: 'number',
            inline: true,
            props: {
              min: 10,
              max: 72,
              step: 1,
              suffix: 'px'
            }
          },
          {
            label: '颜色',
            key: 'titleColor',
            type: 'color',
            inline: true,
            props: {
              placeholder: '#000000'
            }
          },
          {
            label: '粗细',
            key: 'titleFontWeight',
            type: 'select',
            inline: true,
            props: {
              options: [
                { label: '正常', value: 'normal' },
                { label: '粗体', value: 'bold' },
                { label: '100', value: '100' },
                { label: '200', value: '200' },
                { label: '300', value: '300' },
                { label: '400', value: '400' },
                { label: '500', value: '500' },
                { label: '600', value: '600' },
                { label: '700', value: '700' },
                { label: '800', value: '800' },
                { label: '900', value: '900' }
              ]
            }
          }
        ]
      },
      {
        label: 'Label字体',
        value: 'label',
        fields: [
          {
            label: '字号',
            key: 'labelFontSize',
            type: 'number',
            inline: true,
            props: {
              min: 10,
              max: 48,
              step: 1,
              suffix: 'px'
            }
          },
          {
            label: '颜色',
            key: 'labelColor',
            type: 'color',
            inline: true,
            props: {
              placeholder: '#666666'
            }
          }
        ]
      },
      {
        label: '显示字体',
        value: 'display',
        fields: [
          {
            label: '字号',
            key: 'displayFontSize',
            type: 'number',
            inline: true,
            props: {
              min: 10,
              max: 96,
              step: 1,
              suffix: 'px'
            }
          },
          {
            label: '颜色',
            key: 'displayColor',
            type: 'color',
            inline: true,
            props: {
              placeholder: '#333333'
            }
          },
          {
            label: '粗细',
            key: 'displayFontWeight',
            type: 'select',
            inline: true,
            props: {
              options: [
                { label: '正常', value: 'normal' },
                { label: '粗体', value: 'bold' },
                { label: '100', value: '100' },
                { label: '200', value: '200' },
                { label: '300', value: '300' },
                { label: '400', value: '400' },
                { label: '500', value: '500' },
                { label: '600', value: '600' },
                { label: '700', value: '700' },
                { label: '800', value: '800' },
                { label: '900', value: '900' }
              ]
            }
          }
        ]
      }
    ]
  }
]
