import { onMounted, onUnmounted } from 'vue'

/**
 * 编辑器快捷键管理
 */
export function useEditorShortcuts(callbacks = {}) {
  const {
    onSave,
    onUndo,
    onRedo,
    onCopy,
    onPaste,
    onDuplicate,
    onDelete,
    onEscape,
    onArrowKey,
    onSpaceDown,
    onSpaceUp
  } = callbacks

  /**
   * 键盘按下事件处理
   */
  const handleKeyDown = (e) => {
    // 空格键: 启用画布拖动模式
    if (e.code === 'Space' && onSpaceDown) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        onSpaceDown()
      }
      return
    }

    // Ctrl/Cmd + S: 保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      onSave?.()
      return
    }

    // Ctrl/Cmd + Z: 撤销
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      onUndo?.()
      return
    }

    // Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y: 重做
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault()
      onRedo?.()
      return
    }

    // Delete/Backspace: 删除选中组件
    if ((e.key === 'Delete' || e.key === 'Backspace') && onDelete) {
      // 避免在输入框中误删除
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        onDelete()
      }
      return
    }

    // Ctrl/Cmd + C: 复制组件
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && onCopy) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        onCopy()
      }
      return
    }

    // Ctrl/Cmd + V: 粘贴组件
    if ((e.ctrlKey || e.metaKey) && e.key === 'v' && onPaste) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        onPaste()
      }
      return
    }

    // Ctrl/Cmd + D: 快速复制组件
    if ((e.ctrlKey || e.metaKey) && e.key === 'd' && onDuplicate) {
      e.preventDefault()
      onDuplicate()
      return
    }

    // ESC: 取消选中
    if (e.key === 'Escape' && onEscape) {
      onEscape()
      return
    }

    // 方向键: 移动组件
    if (onArrowKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        const step = e.shiftKey ? 10 : 1
        const direction = e.key.replace('Arrow', '').toLowerCase()
        onArrowKey(direction, step)
      }
    }
  }

  /**
   * 键盘抬起事件处理
   */
  const handleKeyUp = (e) => {
    if (e.code === 'Space' && onSpaceUp) {
      onSpaceUp()
    }
  }

  /**
   * 自动注册和卸载事件监听
   */
  const register = () => {
    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    })
  }

  return {
    handleKeyDown,
    handleKeyUp,
    register
  }
}
