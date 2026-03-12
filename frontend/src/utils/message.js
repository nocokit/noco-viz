/**
 * 消息提示工具
 * 完全原生实现，无任何外部依赖
 */

let messageContainer = null
let messageId = 0

// 创建消息容器
const createMessageContainer = () => {
  if (!messageContainer) {
    messageContainer = document.createElement('div')
    messageContainer.className = 'message-container'
    messageContainer.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      pointer-events: none;
    `
    document.body.appendChild(messageContainer)
  }
  return messageContainer
}

// 创建消息元素
const createMessageElement = (content, type = 'info', duration = 3000) => {
  const container = createMessageContainer()
  const id = messageId++

  const messageEl = document.createElement('div')
  messageEl.className = `message-item message-${type}`
  messageEl.setAttribute('data-id', id)
  messageEl.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    margin-bottom: 12px;
    background: var(--bg-card, #1c1d21);
    border: 1px solid var(--border, #2d2e33);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    font-size: 14px;
    color: var(--text-main, #ffffff);
    pointer-events: auto;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 300px;
    max-width: 500px;
  `

  // 类型颜色
  const colorMap = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  }

  const color = colorMap[type] || colorMap.info
  messageEl.style.borderLeftColor = color
  messageEl.style.borderLeftWidth = '3px'

  // 图标
  const iconMap = {
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: ${color}">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>`,
    error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: ${color}">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>`,
    warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: ${color}">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>`,
    info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: ${color}">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>`
  }

  messageEl.innerHTML = `
    <div class="message-icon" style="flex-shrink: 0; display: flex; align-items: center;">
      ${iconMap[type] || iconMap.info}
    </div>
    <div class="message-content" style="flex: 1;">${content}</div>
    <button class="message-close" style="
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      border: none;
      background: transparent;
      color: var(--text-secondary, #9ca3af);
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      padding: 0;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>
  `

  container.appendChild(messageEl)

  // 添加显示动画
  setTimeout(() => {
    messageEl.style.opacity = '1'
    messageEl.style.transform = 'translateY(0)'
  }, 10)

  // 关闭按钮事件
  const closeBtn = messageEl.querySelector('.message-close')
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = 'var(--bg-hover, #26272c)'
  })
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'transparent'
  })
  closeBtn.addEventListener('click', () => closeMessage(messageEl))

  // 自动关闭
  if (duration > 0) {
    setTimeout(() => closeMessage(messageEl), duration)
  }

  return messageEl
}

// 关闭消息
const closeMessage = (messageEl) => {
  if (!messageEl || !messageEl.parentNode) return

  messageEl.style.opacity = '0'
  messageEl.style.transform = 'translateY(-20px)'

  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.parentNode.removeChild(messageEl)
    }

    // 如果容器为空，移除容器
    if (messageContainer && messageContainer.children.length === 0) {
      document.body.removeChild(messageContainer)
      messageContainer = null
    }
  }, 300)
}

// 主函数
const message = (options) => {
  if (typeof options === 'string') {
    options = { content: options }
  }

  const {
    content,
    message: msg,
    type = 'info',
    duration = 3000
  } = options

  return createMessageElement(content || msg, type, duration)
}

// 快捷方法
message.success = (content, duration = 3000) => message({ content, type: 'success', duration })
message.error = (content, duration = 3000) => message({ content, type: 'error', duration })
message.warning = (content, duration = 3000) => message({ content, type: 'warning', duration })
message.info = (content, duration = 3000) => message({ content, type: 'info', duration })

// 关闭所有消息
message.closeAll = () => {
  if (messageContainer) {
    const messages = messageContainer.querySelectorAll('.message-item')
    messages.forEach(msg => closeMessage(msg))
  }
}

// 兼容旧的 API
export const success = message.success
export const error = message.error
export const warning = message.warning
export const info = message.info

export default message
