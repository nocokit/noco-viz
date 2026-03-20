/**
 * 词云图配置
 * 需要安装: npm install echarts-wordcloud
 */

const mockData = [
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
  { name: '智慧城市', value: 300 }
]

export const defaultWordCloudConfig = {
  backgroundColor: 'transparent',
  tooltip: {
    show: true,
    backgroundColor: 'rgba(10, 25, 41, 0.95)',
    borderColor: '#00f2f2',
    borderWidth: 1,
    textStyle: { color: '#bcd0e3', fontSize: 12 }
  },
  series: [{
    type: 'wordCloud',
    shape: 'circle',
    left: 'center',
    top: 'center',
    width: '90%',
    height: '90%',
    right: null,
    bottom: null,
    sizeRange: [12, 60],
    rotationRange: [-90, 90],
    rotationStep: 45,
    gridSize: 8,
    drawOutOfBound: false,
    layoutAnimation: true,
    textStyle: {
      fontFamily: 'Microsoft YaHei, Arial, sans-serif',
      fontWeight: 'bold',
      color: () => {
        const colors = ['#00f2f2', '#0099cc', '#66ffff', '#ffaa00', '#ff6b9d', '#00cc99', '#9966ff', '#b967ff']
        return colors[Math.floor(Math.random() * colors.length)]
      }
    },
    emphasis: {
      focus: 'self',
      textStyle: { textShadowBlur: 10, textShadowColor: '#00f2f2' }
    },
    data: mockData
  }]
}

export const mockWordCloudData = mockData
