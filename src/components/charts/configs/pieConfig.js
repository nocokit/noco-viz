/**
 * 饼图配置 - 赛博朋克风格
 */

export const defaultPieConfig = {
  title: {
    text: '饼图',
    left: 'center',
    textStyle: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 600
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
    backgroundColor: 'rgba(10, 11, 13, 0.95)',
    borderColor: 'rgba(5, 255, 161, 0.3)',
    borderWidth: 1,
    textStyle: {
      color: '#e5e5e5'
    },
    extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: {
      color: '#e5e5e5'
    },
    icon: 'circle'
  },
  series: [
    {
      name: '占比',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 2,
        shadowBlur: 12,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      },
      label: {
        show: true,
        color: '#e5e5e5',
        formatter: '{b}: {d}%',
        fontSize: 12,
        fontWeight: 500
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 240, 255, 0.6)'
        },
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: true,
        lineStyle: {
          color: '#555'
        }
      },
      data: [
        { value: 1048, name: '搜索引擎', itemStyle: { color: '#00f0ff', shadowColor: 'rgba(0, 240, 255, 0.5)' } },
        { value: 735, name: '直接访问', itemStyle: { color: '#b967ff', shadowColor: 'rgba(185, 103, 255, 0.5)' } },
        { value: 580, name: '邮件营销', itemStyle: { color: '#05ffa1', shadowColor: 'rgba(5, 255, 161, 0.5)' } },
        { value: 484, name: '联盟广告', itemStyle: { color: '#ff006e', shadowColor: 'rgba(255, 0, 110, 0.5)' } },
        { value: 300, name: '视频广告', itemStyle: { color: '#ffbe0b', shadowColor: 'rgba(255, 190, 11, 0.5)' } }
      ]
    }
  ]
}

export const mockPieData = [
  { value: 1048, name: '搜索引擎' },
  { value: 735, name: '直接访问' },
  { value: 580, name: '邮件营销' },
  { value: 484, name: '联盟广告' },
  { value: 300, name: '视频广告' }
]
