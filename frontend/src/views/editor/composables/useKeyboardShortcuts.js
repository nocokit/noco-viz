import { message } from 'ant-design-vue'

/**
 * 统一的消息提示函数 - 确保同时只显示一个消息
 */
const showMessage = {
  success: (content) => {
    message.destroy()
    message.success(content)
  },
  error: (content) => {
    message.destroy()
    message.error(content)
  },
  warning: (content) => {
    message.destroy()
    message.warning(content)
  },
  info: (content) => {
    message.destroy()
    message.info(content)
  }
}

/**
 * 键盘快捷键处理 composable
 * @param {Object} options - 配置选项
 */
export function useKeyboardShortcuts(options) {
  const {
    isSpacePressed,
    selectedComponent,
    selectedComponents,
    selectedComponentIds,
    copiedComponent,
    handleUndo,
    handleRedo,
    handleSave,
    deleteComponent,
    deselectComponent,
    handleCopy,
    handlePaste,
    handleDuplicate
  } = options

  /**
   * 检查是否在输入框中
   */
  const isInInputField = (target) => {
    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
  }

  /**
   * 键盘按下事件处理
   */
  const handleKeyDown = (e) => {
    // 空格键: 启用画布拖动模式
    if (e.code === 'Space' && !isSpacePressed.value) {
      if (!isInInputField(e.target)) {
        e.preventDefault()
        isSpacePressed.value = true
      }
      return
    }

    // Ctrl/Cmd + Z: 撤销
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      if (!isInInputField(e.target)) {
        e.preventDefault()
        handleUndo()
      }
      return
    }

    // Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y: 重做
    if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
      if (!isInInputField(e.target)) {
        e.preventDefault()
        handleRedo()
      }
      return
    }

    // Ctrl/Cmd + S: 保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
      return
    }

    // Delete/Backspace: 批量删除选中组件
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentIds.value.length > 0) {
      if (!isInInputField(e.target)) {
        e.preventDefault()
        // 批量删除
        selectedComponentIds.value.forEach(id => {
          deleteComponent(id)
        })
        showMessage.success(`已删除 ${selectedComponentIds.value.length} 个组件`)
        deselectComponent()
      }
      return
    }

    // Ctrl/Cmd + C: 批量复制组件
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedComponents.value.length > 0) {
      if (!isInInputField(e.target)) {
        e.preventDefault()
        handleCopy()
      }
      return
    }

    // Ctrl/Cmd + V: 批量粘贴组件
    if ((e.ctrlKey || e.metaKey) && e.key === 'v' && copiedComponent.value) {
      if (!isInInputField(e.target)) {
        e.preventDefault()
        handlePaste()
      }
      return
    }

    // Ctrl/Cmd + D: 批量快速复制组件
    if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedComponents.value.length > 0) {
      e.preventDefault()
      handleDuplicate()
      return
    }

    // ESC: 取消选中
    if (e.key === 'Escape') {
      deselectComponent()
      return
    }

    // 方向键: 移动组件
    if (selectedComponent.value && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (!isInInputField(e.target)) {
        e.preventDefault()
        const step = e.shiftKey ? 10 : 1
        switch (e.key) {
          case 'ArrowUp':
            selectedComponent.value.y -= step
            break
          case 'ArrowDown':
            selectedComponent.value.y += step
            break
          case 'ArrowLeft':
            selectedComponent.value.x -= step
            break
          case 'ArrowRight':
            selectedComponent.value.x += step
            break
        }
      }
    }
  }

  /**
   * 键盘抬起事件处理
   */
  const handleKeyUp = (e) => {
    if (e.code === 'Space') {
      isSpacePressed.value = false
    }
  }

  /**
   * 注册键盘事件监听
   */
  const registerKeyboardEvents = () => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
  }

  /**
   * 移除键盘事件监听
   */
  const unregisterKeyboardEvents = () => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
  }

  return {
    handleKeyDown,
    handleKeyUp,
    registerKeyboardEvents,
    unregisterKeyboardEvents
  }
}

