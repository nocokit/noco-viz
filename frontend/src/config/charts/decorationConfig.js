/**
 * 装饰组件配置文件
 * 包含所有边框和装饰元素的配置
 */

// ==================== 边框组件配置 ====================

export const border01Config = {
  title: '边框01 - 四角切角',
  description: '科技感四角切角边框',
  configSchema: {
    width: { type: 'number', label: '宽度', default: 400, min: 200, max: 1000 },
    height: { type: 'number', label: '高度', default: 300, min: 150, max: 800 },
    color: { type: 'color', label: '颜色', default: '#00f2f2' },
    cornerSize: { type: 'number', label: '角部大小', default: 20, min: 10, max: 50 }
  }
}

export const border02Config = {
  title: '边框02 - 双层边框',
  description: '双线科技感边框',
  configSchema: {
    width: { type: 'number', label: '宽度', default: 400, min: 200, max: 1000 },
    height: { type: 'number', label: '高度', default: 300, min: 150, max: 800 },
    color: { type: 'color', label: '颜色', default: '#0099cc' }
  }
}

export const border03Config = {
  title: '边框03 - 断线边框',
  description: '四角强调断线边框',
  configSchema: {
    width: { type: 'number', label: '宽度', default: 400, min: 200, max: 1000 },
    height: { type: 'number', label: '高度', default: 300, min: 150, max: 800 },
    color: { type: 'color', label: '颜色', default: '#ffaa00' },
    cornerSize: { type: 'number', label: '角部大小', default: 30, min: 15, max: 60 }
  }
}

export const border04Config = {
  title: '边框04 - 流光边框',
  description: '动态流光效果边框',
  configSchema: {
    width: { type: 'number', label: '宽度', default: 400, min: 200, max: 1000 },
    height: { type: 'number', label: '高度', default: 300, min: 150, max: 800 },
    color: { type: 'color', label: '颜色', default: '#66ffff' }
  }
}

// ==================== 装饰组件配置 ====================

export const decoration01Config = {
  title: '装饰01 - 中心扩散',
  description: '标题装饰线,中心扩散效果',
  configSchema: {
    width: { type: 'number', label: '宽度', default: 200, min: 100, max: 400 },
    height: { type: 'number', label: '高度', default: 50, min: 30, max: 100 },
    color: { type: 'color', label: '颜色', default: '#00f2f2' }
  }
}

export const decoration02Config = {
  title: '装饰02 - 对角装饰块',
  description: '角标装饰,对角分布',
  configSchema: {
    width: { type: 'number', label: '宽度', default: 150, min: 100, max: 300 },
    height: { type: 'number', label: '高度', default: 150, min: 100, max: 300 },
    color: { type: 'color', label: '颜色', default: '#ffaa00' },
    blockSize: { type: 'number', label: '块大小', default: 40, min: 20, max: 80 }
  }
}

export const decoration03Config = {
  title: '装饰03 - 箭头分隔线',
  description: '带箭头的分隔线装饰',
  configSchema: {
    width: { type: 'number', label: '宽度', default: 300, min: 150, max: 600 },
    height: { type: 'number', label: '高度', default: 100, min: 50, max: 200 },
    color: { type: 'color', label: '颜色', default: '#0099cc' },
    arrowSpacing: { type: 'number', label: '箭头间距', default: 40, min: 20, max: 80 }
  }
}

// ==================== 容器背景配置 ====================

export const bgBoxConfig = {
  title: 'BgBox - 容器背景',
  description: '网格科技背景,数据展示容器',
  configSchema: {
    width: { type: 'number', label: '宽度', default: 500, min: 300, max: 1200 },
    height: { type: 'number', label: '高度', default: 400, min: 200, max: 900 },
    bgColor: { type: 'color', label: '背景色', default: '#001529' },
    borderColor: { type: 'color', label: '边框色', default: '#00f2f2' },
    gridColor: { type: 'color', label: '网格色', default: '#0099cc' },
    gridSize: { type: 'number', label: '网格大小', default: 20, min: 10, max: 50 },
    scanLineColor: { type: 'color', label: '扫描线颜色', default: '#00f2f2' },
    scanDuration: {
      type: 'select',
      label: '扫描速度',
      default: '6s',
      options: [
        { label: '快速(3秒)', value: '3s' },
        { label: '正常(6秒)', value: '6s' },
        { label: '慢速(10秒)', value: '10s' }
      ]
    }
  }
}

// ==================== 导出所有配置 ====================

export default {
  'border-01': border01Config,
  'border-02': border02Config,
  'border-03': border03Config,
  'border-04': border04Config,
  'decoration-01': decoration01Config,
  'decoration-02': decoration02Config,
  'decoration-03': decoration03Config,
  'bg-box': bgBoxConfig
}
