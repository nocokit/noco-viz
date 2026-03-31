import { h } from 'vue'
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'

/**
 * 视图模式配置 composable
 * 提供网格视图和列表视图的统一配置
 */
export function useViewModes() {
  const viewModes = [
    {
      id: 'grid',
      label: '网格视图',
      tooltip: '网格视图',
      icon: h(AppstoreOutlined)
    },
    {
      id: 'list',
      label: '列表视图',
      tooltip: '列表视图',
      icon: h(UnorderedListOutlined)
    }
  ]

  return {
    viewModes
  }
}
