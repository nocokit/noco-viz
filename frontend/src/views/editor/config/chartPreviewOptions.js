/**
 * 图表预览配置
 * 用于编辑器左侧组件面板的图表预览
 */

const colors = {
  primary: '#00f2f2',
  secondary: '#ffaa00',
  bg: 'transparent'
}

/**
 * 获取图表预览配置
 * @param {string} chartType - 图表类型
 * @param {object} chart - 图表对象（包含 color 等属性）
 * @returns {object} ECharts 配置对象
 */
export function getChartPreviewOption(chartType, chart = {}) {
  const configs = {
    // ========== 基础图表 ==========
    bar: {
      backgroundColor: colors.bg,
      grid: { top: 10, bottom: 10, left: 15, right: 10 },
      xAxis: { show: false },
      yAxis: { show: false },
      series: [{
        type: 'bar',
        data: [120, 200, 150, 80, 70],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colors.primary },
              { offset: 1, color: 'rgba(0, 242, 242, 0.1)' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '35%'
      }]
    },

    line: {
      backgroundColor: colors.bg,
      grid: { top: 10, bottom: 10, left: 15, right: 10 },
      xAxis: { show: false, boundaryGap: false },
      yAxis: { show: false },
      series: [
        {
          type: 'line',
          data: [320, 450, 380, 520, 600],
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: '#29B983' }
        },
        {
          type: 'line',
          data: [220, 350, 280, 420, 500],
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: '#706EE7' }
        }
      ]
    },

    pie: {
      backgroundColor: colors.bg,
      series: [{
        type: 'pie',
        radius: ['40%', '60%'],
        center: ['50%', '50%'],
        data: [
          { value: 483, itemStyle: { color: '#706EE7' } },
          { value: 540, itemStyle: { color: '#29C287' } }
        ],
        label: { show: false }
      }]
    },

    area: {
      backgroundColor: colors.bg,
      grid: { top: 10, bottom: 10, left: 15, right: 10 },
      xAxis: { show: false, boundaryGap: false },
      yAxis: { show: false },
      series: [
        {
          type: 'line',
          data: [300, 450, 380, 500, 600],
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 0 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(41, 194, 135, 0.6)' },
                { offset: 1, color: 'rgba(41, 194, 135, 0.1)' }
              ]
            }
          }
        },
        {
          type: 'line',
          data: [200, 280, 250, 320, 400],
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 0 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(112, 110, 231, 0.6)' },
                { offset: 1, color: 'rgba(112, 110, 231, 0.1)' }
              ]
            }
          }
        }
      ]
    },

    scatter: {
      backgroundColor: colors.bg,
      grid: { top: 10, bottom: 10, left: 15, right: 10 },
      xAxis: { show: false },
      yAxis: { show: false },
      series: [{
        type: 'scatter',
        data: [[10, 8, 20], [8, 6, 30], [13, 7, 15], [9, 8, 25], [11, 8, 40]],
        symbolSize: val => val[2],
        itemStyle: { color: 'rgba(255, 107, 157, 0.8)' }
      }]
    },

    radar: {
      backgroundColor: colors.bg,
      radar: {
        indicator: [
          { max: 100 }, { max: 100 }, { max: 100 }, { max: 100 }, { max: 100 }
        ],
        splitArea: { show: false },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      series: [{
        type: 'radar',
        data: [{
          value: [70, 85, 60, 90, 75],
          areaStyle: { color: 'rgba(0, 242, 242, 0.3)' },
          lineStyle: { color: colors.primary }
        }]
      }]
    },

    gauge: {
      backgroundColor: colors.bg,
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 2,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [[0.3, colors.secondary], [0.7, '#006699'], [1, colors.primary]]
          }
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: { show: false },
        data: [{ value: 70 }]
      }]
    },

    funnel: {
      backgroundColor: colors.bg,
      series: [{
        type: 'funnel',
        data: [
          { value: 100, itemStyle: { color: '#706EE7' } },
          { value: 80, itemStyle: { color: '#FFC107' } },
          { value: 60, itemStyle: { color: '#29C287' } }
        ],
        label: { show: false },
        left: '10%',
        width: '80%'
      }]
    },

    heatmap: {
      backgroundColor: colors.bg,
      grid: { top: 5, bottom: 5, left: 5, right: 5 },
      xAxis: {
        type: 'category',
        data: ['A', 'B', 'C'],
        show: false,
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'category',
        data: ['X', 'Y'],
        show: false,
        axisLine: { show: false },
        axisTick: { show: false }
      },
      visualMap: {
        show: false,
        min: 0,
        max: 5,
        inRange: { color: ['#0d213c', colors.primary] }
      },
      series: [{
        type: 'heatmap',
        data: [[0, 0, 5], [0, 1, 1], [1, 0, 0], [1, 1, 3], [2, 0, 2], [2, 1, 4]],
        itemStyle: { borderColor: '#050d19', borderWidth: 2 }
      }]
    },

    // ========== 特殊图表 ==========
    liquid: {
      backgroundColor: colors.bg,
      series: [{
        type: 'pie',
        radius: ['60%', '70%'],
        data: [
          { value: 75, itemStyle: { color: colors.primary } },
          { value: 25, itemStyle: { color: 'rgba(255,255,255,0.05)' } }
        ],
        label: { show: false }
      }]
    },

    'word-cloud': {
      backgroundColor: colors.bg,
      series: [{
        type: 'scatter',
        data: [
          [1, 8, '#706EE7'], [2, 6, '#29C287'], [3, 9, '#706EE7'],
          [4, 5, '#5AD651'], [5, 7, '#706EE7'], [6, 10, '#29C287'], [7, 4, '#5AD651']
        ],
        symbolSize: val => val[1] * 3,
        itemStyle: { color: params => params.data[2], opacity: 0.8 }
      }],
      xAxis: { show: false },
      yAxis: { show: false },
      grid: { top: 10, bottom: 10, left: 10, right: 10 }
    },

    sankey: {
      backgroundColor: colors.bg,
      series: [{
        type: 'sankey',
        data: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'D' }
        ],
        links: [
          { source: 'A', target: 'C', value: 10 },
          { source: 'A', target: 'D', value: 5 },
          { source: 'B', target: 'C', value: 8 },
          { source: 'B', target: 'D', value: 3 }
        ],
        itemStyle: {
          color: '#6E72DF',
          borderColor: '#6E72DF'
        },
        lineStyle: {
          color: 'source',
          curveness: 0.5
        },
        label: { show: false },
        left: '5%',
        right: '5%',
        top: '10%',
        bottom: '10%'
      }]
    },

    treemap: {
      backgroundColor: colors.bg,
      series: [{
        type: 'pie',
        radius: ['30%', '50%'],
        data: [
          { value: 40, itemStyle: { color: '#003366' } },
          { value: 30, itemStyle: { color: '#006699' } },
          { value: 20, itemStyle: { color: '#0099cc' } },
          { value: 10, itemStyle: { color: colors.primary } }
        ],
        label: { show: false }
      }]
    },

    sunburst: {
      backgroundColor: colors.bg,
      series: [{
        type: 'pie',
        radius: ['30%', '50%'],
        data: [
          { value: 40, itemStyle: { color: '#003366' } },
          { value: 30, itemStyle: { color: '#006699' } },
          { value: 20, itemStyle: { color: '#0099cc' } },
          { value: 10, itemStyle: { color: colors.primary } }
        ],
        label: { show: false }
      }]
    },

    // ========== 信息组件 ==========
    'number-flip': {
      backgroundColor: colors.bg,
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: '60%',
            fontSize: 28,
            fontWeight: 'bold',
            fill: '#706EE7'
          }
        },
        {
          type: 'rect',
          left: 10,
          bottom: 10,
          shape: { width: 60, height: 6 },
          style: { fill: '#29C287' }
        }
      ]
    },

    text: {
      backgroundColor: colors.bg,
      graphic: [{
        type: 'rect',
        left: 'center',
        top: 'middle',
        shape: { width: 60, height: 30 },
        style: { fill: 'rgba(0, 242, 242, 0.2)', stroke: colors.primary, lineWidth: 1 }
      }]
    },

    'kpi-card': {
      backgroundColor: colors.bg,
      graphic: [{
        type: 'rect',
        left: 'center',
        top: 'middle',
        shape: { width: 60, height: 30 },
        style: { fill: 'rgba(0, 242, 242, 0.2)', stroke: colors.primary, lineWidth: 1 }
      }]
    },

    'progress-bar': {
      backgroundColor: colors.bg,
      graphic: [{
        type: 'rect',
        left: 'center',
        top: 'middle',
        shape: { width: 60, height: 30 },
        style: { fill: 'rgba(0, 242, 242, 0.2)', stroke: colors.primary, lineWidth: 1 }
      }]
    },

    table: {
      backgroundColor: colors.bg,
      graphic: [{
        type: 'rect',
        left: 'center',
        top: 'middle',
        shape: { width: 60, height: 30 },
        style: { fill: 'rgba(0, 242, 242, 0.2)', stroke: colors.primary, lineWidth: 1 }
      }]
    },

    // ========== 装饰组件 ==========
    'border-01': {
      backgroundColor: colors.bg,
      graphic: [
        {
          type: 'rect',
          left: 5,
          top: 5,
          shape: { width: 70, height: 60 },
          style: { fill: 'none', stroke: colors.primary, lineWidth: 1.5 }
        },
        {
          type: 'line',
          left: 5,
          top: 5,
          shape: { x1: 0, y1: 0, x2: 8, y2: 8 },
          style: { stroke: colors.primary, lineWidth: 1.5 }
        },
        {
          type: 'line',
          left: 75,
          top: 5,
          shape: { x1: 0, y1: 0, x2: -8, y2: 8 },
          style: { stroke: colors.primary, lineWidth: 1.5 }
        }
      ]
    },

    'border-02': {
      backgroundColor: colors.bg,
      graphic: [
        {
          type: 'rect',
          left: 8,
          top: 8,
          shape: { width: 64, height: 54 },
          style: { fill: 'none', stroke: colors.primary, lineWidth: 1 }
        },
        {
          type: 'rect',
          left: 5,
          top: 5,
          shape: { width: 70, height: 60 },
          style: { fill: 'none', stroke: colors.primary, lineWidth: 0.5 }
        }
      ]
    },

    'border-03': {
      backgroundColor: colors.bg,
      graphic: [
        // 四角短线
        { type: 'line', left: 5, top: 5, shape: { x1: 0, y1: 0, x2: 15, y2: 0 }, style: { stroke: colors.secondary, lineWidth: 2 } },
        { type: 'line', left: 5, top: 5, shape: { x1: 0, y1: 0, x2: 0, y2: 15 }, style: { stroke: colors.secondary, lineWidth: 2 } },
        { type: 'line', left: 60, top: 5, shape: { x1: 0, y1: 0, x2: 15, y2: 0 }, style: { stroke: colors.secondary, lineWidth: 2 } },
        { type: 'line', left: 75, top: 5, shape: { x1: 0, y1: 0, x2: 0, y2: 15 }, style: { stroke: colors.secondary, lineWidth: 2 } },
        { type: 'line', left: 5, top: 50, shape: { x1: 0, y1: 0, x2: 0, y2: 15 }, style: { stroke: colors.secondary, lineWidth: 2 } },
        { type: 'line', left: 5, top: 65, shape: { x1: 0, y1: 0, x2: 15, y2: 0 }, style: { stroke: colors.secondary, lineWidth: 2 } },
        { type: 'line', left: 75, top: 50, shape: { x1: 0, y1: 0, x2: 0, y2: 15 }, style: { stroke: colors.secondary, lineWidth: 2 } },
        { type: 'line', left: 60, top: 65, shape: { x1: 0, y1: 0, x2: 15, y2: 0 }, style: { stroke: colors.secondary, lineWidth: 2 } }
      ]
    },

    'border-04': {
      backgroundColor: colors.bg,
      graphic: [
        {
          type: 'rect',
          left: 5,
          top: 5,
          shape: { width: 70, height: 60 },
          style: { fill: 'none', stroke: colors.primary, lineWidth: 1.5 }
        },
        {
          type: 'line',
          left: 5,
          top: 35,
          shape: { x1: 0, y1: 0, x2: 75, y2: 0 },
          style: { stroke: colors.primary, lineWidth: 0.5 }
        },
        {
          type: 'line',
          left: 40,
          top: 5,
          shape: { x1: 0, y1: 0, x2: 0, y2: 65 },
          style: { stroke: colors.primary, lineWidth: 0.5 }
        }
      ]
    },

    'decoration-01': {
      backgroundColor: colors.bg,
      graphic: [
        {
          type: 'line',
          left: 10,
          top: 35,
          shape: { x1: 0, y1: 0, x2: 60, y2: 0 },
          style: { stroke: colors.primary, lineWidth: 2 }
        },
        {
          type: 'line',
          left: 25,
          top: 25,
          shape: { x1: 0, y1: 0, x2: 30, y2: 0 },
          style: { stroke: colors.primary, lineWidth: 1, opacity: 0.5 }
        },
        {
          type: 'line',
          left: 25,
          top: 45,
          shape: { x1: 0, y1: 0, x2: 30, y2: 0 },
          style: { stroke: colors.primary, lineWidth: 1, opacity: 0.5 }
        }
      ]
    },

    'decoration-02': {
      backgroundColor: colors.bg,
      graphic: [
        {
          type: 'polygon',
          left: 20,
          top: 20,
          shape: { points: [[0, 0], [40, 0], [40, 40], [0, 40]] },
          style: { fill: 'none', stroke: colors.secondary, lineWidth: 2 }
        },
        {
          type: 'line',
          left: 20,
          top: 20,
          shape: { x1: 0, y1: 0, x2: 40, y2: 40 },
          style: { stroke: colors.secondary, lineWidth: 1, opacity: 0.5 }
        }
      ]
    },

    'decoration-03': {
      backgroundColor: colors.bg,
      graphic: [
        {
          type: 'line',
          left: 5,
          top: 35,
          shape: { x1: 0, y1: 0, x2: 70, y2: 0 },
          style: { stroke: colors.primary, lineWidth: 2 }
        },
        {
          type: 'polygon',
          left: 5,
          top: 30,
          shape: { points: [[0, 5], [8, 0], [0, 10]] },
          style: { fill: colors.primary }
        },
        {
          type: 'polygon',
          left: 67,
          top: 30,
          shape: { points: [[8, 5], [0, 0], [8, 10]] },
          style: { fill: colors.primary }
        }
      ]
    },

    'bg-box': {
      backgroundColor: colors.bg,
      graphic: [
        {
          type: 'rect',
          left: 5,
          top: 5,
          shape: { width: 70, height: 60 },
          style: { fill: 'rgba(0, 51, 102, 0.3)', stroke: 'rgba(0, 242, 242, 0.3)', lineWidth: 1 }
        },
        {
          type: 'line',
          left: 5,
          top: 5,
          shape: { x1: 0, y1: 0, x2: 70, y2: 60 },
          style: { stroke: 'rgba(0, 242, 242, 0.1)', lineWidth: 1 }
        },
        {
          type: 'line',
          left: 5,
          top: 65,
          shape: { x1: 0, y1: 0, x2: 70, y2: -60 },
          style: { stroke: 'rgba(0, 242, 242, 0.1)', lineWidth: 1 }
        }
      ]
    }
  }

  // 返回配置，如果没有找到则返回默认配置
  return configs[chartType] || {
    backgroundColor: colors.bg,
    series: [{
      type: 'bar',
      data: [1, 2, 3],
      itemStyle: { color: chart.color || colors.primary }
    }],
    xAxis: { show: false },
    yAxis: { show: false }
  }
}
