import { theme } from 'ant-design-vue'

/**
 * 亮色主题配置
 */
export const lightTheme = {
  token: {
    // 主色
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',

    // 背景色
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',

    // 文字色
    colorText: 'rgba(0, 0, 0, 0.88)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
    colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
    colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',

    // 边框色
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',

    // 圆角
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // 字体 - 基础
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,

    // 间距
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
  },
  // 细化字体配置
  typography: {
    menu: { size: 14, color: '#333', weight: 400 },
    title: { size: 18, color: '#000', weight: 600 },
    body: { size: 14, color: '#333', weight: 400 },
    emphasis: { size: 14, color: '#1677ff', weight: 500 },
    button: { size: 14, color: '#fff', weight: 400 },
    hint: { size: 12, color: '#999', weight: 400 },
    tag: { size: 12, color: '#666', weight: 400 },
    tableHeader: { size: 14, color: '#000', weight: 600 },
    tableBody: { size: 13, color: '#333', weight: 400 }
  }
}

/**
 * 暗色主题配置
 */
export const darkTheme = {
  token: {
    // 主色
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',

    // 背景色
    colorBgContainer: '#1f1f1f',
    colorBgElevated: '#262626',
    colorBgLayout: '#0a0a0a',

    // 文字色
    colorText: 'rgba(255, 255, 255, 0.85)',
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
    colorTextQuaternary: 'rgba(255, 255, 255, 0.25)',

    // 边框色
    colorBorder: 'rgba(255, 255, 255, 0.15)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.06)',

    // 圆角
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // 字体 - 基础
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,

    // 间距
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
  },
  algorithm: theme.darkAlgorithm,
  // 细化字体配置
  typography: {
    menu: { size: 14, color: '#e5e5e5', weight: 400 },
    title: { size: 18, color: '#fff', weight: 600 },
    body: { size: 14, color: '#d4d4d4', weight: 400 },
    emphasis: { size: 14, color: '#1890ff', weight: 500 },
    button: { size: 14, color: '#fff', weight: 400 },
    hint: { size: 12, color: '#888', weight: 400 },
    tag: { size: 12, color: '#999', weight: 400 },
    tableHeader: { size: 14, color: '#fff', weight: 600 },
    tableBody: { size: 13, color: '#d4d4d4', weight: 400 }
  }
}
