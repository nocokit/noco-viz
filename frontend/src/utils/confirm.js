/**
 * 确认对话框工具
 * 完全原生实现，无任何外部依赖
 */

let dialogContainer = null

// 创建对话框容器
const createDialogContainer = () => {
  if (!dialogContainer) {
    dialogContainer = document.createElement('div')
    dialogContainer.className = 'dialog-container'
    dialogContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10000;
      display: none;
    `
    document.body.appendChild(dialogContainer)
  }
  return dialogContainer
}

// 创建确认对话框
const createConfirmDialog = (options) => {
  const {
    title = '提示',
    content = '',
    message = '',
    confirmButtonText = '确定',
    cancelButtonText = '取消',
    type = 'warning',
    showCancelButton = true,
    dangerouslyUseHTMLString = false
  } = options

  const container = createDialogContainer()

  // 创建遮罩层
  const overlay = document.createElement('div')
  overlay.className = 'dialog-overlay'
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    opacity: 0;
    transition: opacity 0.3s;
  `

  // 创建对话框
  const dialog = document.createElement('div')
  dialog.className = 'dialog-box'
  dialog.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    background: var(--bg-card, #1c1d21);
    border-radius: 12px;
    width: 90%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  `

  // 图标颜色
  const colorMap = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  }

  const color = colorMap[type] || colorMap.warning

  // 图标
  const iconMap = {
    success: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="color: ${color}">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>`,
    error: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="color: ${color}">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>`,
    warning: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="color: ${color}">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>`,
    info: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="color: ${color}">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>`
  }

  const messageContent = content || message
  const messageHTML = dangerouslyUseHTMLString ? messageContent : `<div>${messageContent}</div>`

  dialog.innerHTML = `
    <div class="dialog-header" style="
      padding: 24px 24px 16px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
    ">
      <div class="dialog-icon" style="flex-shrink: 0;">
        ${iconMap[type] || iconMap.warning}
      </div>
      <div style="flex: 1; min-width: 0;">
        <h3 style="
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-main, #ffffff);
        ">${title}</h3>
        <div class="dialog-content" style="
          font-size: 14px;
          color: var(--text-secondary, #9ca3af);
          line-height: 1.6;
          word-break: break-word;
        ">${messageHTML}</div>
      </div>
    </div>
    <div class="dialog-footer" style="
      padding: 16px 24px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    ">
      ${showCancelButton ? `
        <button class="dialog-btn dialog-btn-cancel" style="
          padding: 8px 20px;
          border: 1px solid var(--border, #2d2e33);
          border-radius: 6px;
          background: var(--bg-card, #1c1d21);
          color: var(--text-main, #ffffff);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        ">${cancelButtonText}</button>
      ` : ''}
      <button class="dialog-btn dialog-btn-confirm" style="
        padding: 8px 20px;
        border: 1px solid ${type === 'error' ? '#ef4444' : 'var(--primary, #3b82f6)'};
        border-radius: 6px;
        background: ${type === 'error' ? '#ef4444' : 'var(--primary, #3b82f6)'};
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      ">${confirmButtonText}</button>
    </div>
  `

  container.appendChild(overlay)
  container.appendChild(dialog)
  container.style.display = 'block'

  // 添加按钮悬停效果
  const cancelBtn = dialog.querySelector('.dialog-btn-cancel')
  const confirmBtn = dialog.querySelector('.dialog-btn-confirm')

  if (cancelBtn) {
    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.background = 'var(--bg-hover, #26272c)'
      cancelBtn.style.borderColor = 'var(--text-secondary, #9ca3af)'
    })
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.background = 'var(--bg-card, #1c1d21)'
      cancelBtn.style.borderColor = 'var(--border, #2d2e33)'
    })
  }

  confirmBtn.addEventListener('mouseenter', () => {
    confirmBtn.style.opacity = '0.9'
  })
  confirmBtn.addEventListener('mouseleave', () => {
    confirmBtn.style.opacity = '1'
  })

  // 显示动画
  setTimeout(() => {
    overlay.style.opacity = '1'
    dialog.style.opacity = '1'
    dialog.style.transform = 'translate(-50%, -50%) scale(1)'
  }, 10)

  return new Promise((resolve, reject) => {
    const close = (confirmed) => {
      overlay.style.opacity = '0'
      dialog.style.opacity = '0'
      dialog.style.transform = 'translate(-50%, -50%) scale(0.9)'

      setTimeout(() => {
        container.style.display = 'none'
        container.innerHTML = ''

        if (confirmed) {
          resolve('confirm')
        } else {
          reject('cancel')
        }
      }, 300)
    }

    // 确认按钮
    confirmBtn.addEventListener('click', () => close(true))

    // 取消按钮
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => close(false))
    }

    // 点击遮罩层关闭
    overlay.addEventListener('click', () => close(false))

    // ESC 键关闭
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        close(false)
        document.removeEventListener('keydown', handleEsc)
      }
    }
    document.addEventListener('keydown', handleEsc)
  })
}

// 确认对话框
export const confirm = (content, title = '提示', options = {}) => {
  if (typeof content === 'object') {
    return createConfirmDialog(content)
  }
  return createConfirmDialog({
    title,
    content,
    ...options
  })
}

// 删除确认对话框
export const confirmDelete = (content = '此操作将永久删除该数据，是否继续？', options = {}) => {
  return createConfirmDialog({
    title: '删除确认',
    content,
    type: 'error',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    ...options
  })
}

// 警告对话框
export const alert = (content, title = '提示', options = {}) => {
  return createConfirmDialog({
    title,
    content,
    showCancelButton: false,
    confirmButtonText: '确定',
    type: 'info',
    ...options
  })
}

// 默认导出
export default {
  confirm,
  confirmDelete,
  alert
}
