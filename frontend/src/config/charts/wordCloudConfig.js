/**
 * 词云图配置
 * 需要安装: npm install echarts-wordcloud
 */

export const wordCloudConfig = {
  title: '词云图',
  description: '关键词频率可视化',
  configSchema: {
    shape: {
      type: 'select',
      label: '形状',
      default: 'circle',
      options: [
        { label: '圆形', value: 'circle' },
        { label: '心形', value: 'cardioid' },
        { label: '菱形', value: 'diamond' },
        { label: '三角形', value: 'triangle' },
        { label: '星形', value: 'star' }
      ]
    },
    sizeRange: {
      type: 'object',
      label: '字体大小范围',
      properties: {
        min: { type: 'number', label: '最小', default: 12, min: 8, max: 30 },
        max: { type: 'number', label: '最大', default: 60, min: 30, max: 120 }
      }
    },
    rotationRange: {
      type: 'object',
      label: '旋转角度范围',
      properties: {
        min: { type: 'number', label: '最小', default: -90, min: -90, max: 0 },
        max: { type: 'number', label: '最大', default: 90, min: 0, max: 90 }
      }
    },
    gridSize: {
      type: 'number',
      label: '网格大小',
      default: 8,
      min: 4,
      max: 20
    }
  },
  mockData: [
    { name: '数据可视化', value: 1000 },
    { name: '大数据', value: 800 },
    { name: '人工智能', value: 750 },
    { name: '云计算', value: 700 },
    { name: '物联网', value: 650 },
    { name: '区块链', value: 600 },
    { name: '机器学习', value: 550 },
    { name: '深度学习', value: 500 },
    { name: '神经网络', value: 450 },
    { name: '自然语言处理', value: 400 },
    { name: '计算机视觉', value: 380 },
    { name: '数据分析', value: 360 },
    { name: '数据挖掘', value: 340 },
    { name: '智能制造', value: 320 },
    { name: '智慧城市', value: 300 },
    { name: '5G', value: 280 },
    { name: '边缘计算', value: 260 },
    { name: '量子计算', value: 240 },
    { name: '虚拟现实', value: 220 },
    { name: '增强现实', value: 200 },
    { name: '数字孪生', value: 180 },
    { name: '工业互联网', value: 160 },
    { name: '智能驾驶', value: 140 },
    { name: '智能家居', value: 120 },
    { name: '智能安防', value: 100 }
  ]
}

/**
 * 获取词云图ECharts配置
 */
export function getWordCloudOption(config = {}, data = wordCloudConfig.mockData) {
  const {
    shape = 'circle',
    sizeRange = { min: 12, max: 60 },
    rotationRange = { min: -90, max: 90 },
    gridSize = 8
  } = config

  return {
    backgroundColor: 'transparent',

    tooltip: {
      show: true,
      backgroundColor: 'rgba(10, 25, 41, 0.95)',
      borderColor: '#00f2f2',
      borderWidth: 1,
      textStyle: {
        color: '#bcd0e3',
        fontSize: 12
      },
      formatter: (params) => {
        return `
          <div style="padding: 4px 8px;">
            <div style="color: #00f2f2; font-weight: bold; margin-bottom: 4px;">
              ${params.name}
            </div>
            <div style="color: #66ffff;">
              权重: <span style="color: #fff; font-weight: bold;">${params.value}</span>
            </div>
          </div>
        `
      }
    },

    series: [
      {
        type: 'wordCloud',

        // 词云形状
        shape: shape,

        // 保持宽高比，填充容器
        left: 'center',
        top: 'center',
        width: '90%',
        height: '90%',
        right: null,
        bottom: null,

        // 文字大小范围
        sizeRange: [sizeRange.min, sizeRange.max],

        // 文字旋转范围
        rotationRange: [rotationRange.min, rotationRange.max],
        rotationStep: 45,

        // 网格大小，越大词云越稀疏
        gridSize: gridSize,

        // 绘制超出画布的文字
        drawOutOfBound: false,

        // 布局动画
        layoutAnimation: true,

        // 文字样式
        textStyle: {
          fontFamily: 'Microsoft YaHei, Arial, sans-serif',
          fontWeight: 'bold',

          // 根据数值设置颜色
          color: function () {
            const colors = [
              '#00f2f2', // 主题青色
              '#0099cc', // 科技蓝
              '#66ffff', // 亮青色
              '#ffaa00', // 橙色
              '#ff6b9d', // 粉红
              '#00cc99', // 青绿
              '#9966ff', // 紫色
              '#b967ff'  // 紫色渐变
            ]
            return colors[Math.floor(Math.random() * colors.length)]
          }
        },

        emphasis: {
          focus: 'self',
          textStyle: {
            textShadowBlur: 10,
            textShadowColor: '#00f2f2'
          }
        },

        data: data.map(item => ({
          name: item.name,
          value: item.value,
          textStyle: {
            fontSize: null // 自动计算
          }
        }))
      }
    ]
  }
}

export default {
  config: wordCloudConfig,
  getOption: getWordCloudOption
}
