/**
 * 字体大小自动联动工具
 * 根据字体大小自动计算输入框、按钮等元素的高度和内边距
 */

/**
 * 字体配置预设
 */
export const fontPresets = {
  // 菜单
  menu: { size: 14, color: '#333', weight: 400 },
  // 标题
  title: { size: 18, color: '#000', weight: 600 },
  // 正文
  body: { size: 14, color: '#333', weight: 400 },
  // 强调文本
  emphasis: { size: 14, color: '#1890ff', weight: 500 },
  // 按钮文本
  button: { size: 14, color: '#fff', weight: 400 },
  // 提示文本
  hint: { size: 12, color: '#999', weight: 400 },
  // Tag文本
  tag: { size: 12, color: '#666', weight: 400 },
  // Table标题
  tableHeader: { size: 14, color: '#000', weight: 600 },
  // Table正文
  tableBody: { size: 13, color: '#333', weight: 400 }
}

/**
 * 根据字体大小计算相关尺寸
 * @param {number} fontSize - 字体大小(px)
 * @returns {object} 包含各种尺寸的对象
 */
export function calculateSizesByFontSize(fontSize = 14) {
  const base = Number(fontSize) || 14

  return {
    fontSize: `${base}px`,
    inputHeight: `${Math.round(base * 2.5)}px`,
    buttonHeight: `${Math.round(base * 2.5)}px`,
    paddingVertical: `${Math.round(base * 0.5)}px`,
    paddingHorizontal: `${Math.round(base * 0.8)}px`,
    lineHeight: `${Math.round(base * 1.5)}px`,
    borderRadius: `${Math.max(2, Math.round(base * 0.25))}px`
  }
}

/**
 * 生成CSS变量对象
 * @param {number} fontSize - 字体大小
 * @returns {object} CSS变量对象
 */
export function generateCSSVars(fontSize = 14) {
  const sizes = calculateSizesByFontSize(fontSize)
  return {
    '--form-font-size': sizes.fontSize,
    '--form-input-height': sizes.inputHeight,
    '--form-button-height': sizes.buttonHeight,
    '--form-padding-v': sizes.paddingVertical,
    '--form-padding-h': sizes.paddingHorizontal,
    '--form-line-height': sizes.lineHeight,
    '--form-border-radius': sizes.borderRadius
  }
}

/**
 * 生成细化的字体CSS变量
 * @param {object} fontConfig - 字体配置对象
 * @returns {object} CSS变量对象
 */
export function generateFontVars(fontConfig = {}) {
  const config = { ...fontPresets, ...fontConfig }

  return {
    // 菜单
    '--font-menu-size': `${config.menu.size}px`,
    '--font-menu-color': config.menu.color,
    '--font-menu-weight': config.menu.weight,

    // 标题
    '--font-title-size': `${config.title.size}px`,
    '--font-title-color': config.title.color,
    '--font-title-weight': config.title.weight,

    // 正文
    '--font-body-size': `${config.body.size}px`,
    '--font-body-color': config.body.color,
    '--font-body-weight': config.body.weight,

    // 强调
    '--font-emphasis-size': `${config.emphasis.size}px`,
    '--font-emphasis-color': config.emphasis.color,
    '--font-emphasis-weight': config.emphasis.weight,

    // 按钮
    '--font-button-size': `${config.button.size}px`,
    '--font-button-color': config.button.color,
    '--font-button-weight': config.button.weight,

    // 提示
    '--font-hint-size': `${config.hint.size}px`,
    '--font-hint-color': config.hint.color,
    '--font-hint-weight': config.hint.weight,

    // Tag
    '--font-tag-size': `${config.tag.size}px`,
    '--font-tag-color': config.tag.color,
    '--font-tag-weight': config.tag.weight,

    // Table标题
    '--font-table-header-size': `${config.tableHeader.size}px`,
    '--font-table-header-color': config.tableHeader.color,
    '--font-table-header-weight': config.tableHeader.weight,

    // Table正文
    '--font-table-body-size': `${config.tableBody.size}px`,
    '--font-table-body-color': config.tableBody.color,
    '--font-table-body-weight': config.tableBody.weight,

    // 自动计算的尺寸（基于正文字体）
    ...generateCSSVars(config.body.size)
  }
}
