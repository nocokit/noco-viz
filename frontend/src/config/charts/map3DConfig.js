/**
 * 3D地图配置
 * 需要安装: npm install echarts-gl
 */

export const map3DConfig = {
  title: '3D地图数据可视化',
  description: '立体地图展示，支持3D视角交互',
  configSchema: {
    map: {
      type: 'select',
      label: '地图类型',
      default: 'china',
      options: [
        { label: '中国地图', value: 'china' },
        { label: '世界地图', value: 'world' }
      ]
    },
    viewControl: {
      type: 'object',
      label: '视角控制',
      properties: {
        distance: { type: 'number', label: '距离', default: 100, min: 50, max: 200 },
        alpha: { type: 'number', label: '水平角度', default: 40, min: 0, max: 90 },
        beta: { type: 'number', label: '垂直角度', default: 0, min: -180, max: 180 },
        autoRotate: { type: 'boolean', label: '自动旋转', default: false }
      }
    },
    regionHeight: {
      type: 'number',
      label: '区域高度',
      default: 4,
      min: 0,
      max: 20
    },
    lightIntensity: {
      type: 'number',
      label: '光照强度',
      default: 1,
      min: 0,
      max: 2,
      step: 0.1
    },
    showLabel: {
      type: 'boolean',
      label: '显示标签',
      default: true
    }
  },
  mockData: [
    { name: '北京', value: 1200 },
    { name: '上海', value: 2400 },
    { name: '广东', value: 3600 },
    { name: '浙江', value: 2100 },
    { name: '江苏', value: 1800 },
    { name: '四川', value: 1500 },
    { name: '湖北', value: 1200 },
    { name: '河南', value: 900 },
    { name: '山东', value: 1100 },
    { name: '福建', value: 800 }
  ]
}

/**
 * 获取3D地图ECharts配置
 */
export function getMap3DOption(config = {}, data = map3DConfig.mockData) {
  const {
    map = 'china',
    viewControl = {},
    regionHeight = 4,
    lightIntensity = 1,
    showLabel = true
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
        if (params.data) {
          return `
            <div style="padding: 4px 8px;">
              <div style="color: #00f2f2; font-weight: bold; margin-bottom: 4px;">
                ${params.name}
              </div>
              <div style="color: #66ffff;">
                数值: <span style="color: #fff; font-weight: bold;">${params.data.value}</span>
              </div>
            </div>
          `
        }
        return params.name
      }
    },

    visualMap: {
      show: true,
      min: 0,
      max: 4000,
      text: ['高', '低'],
      textStyle: {
        color: '#bcd0e3',
        fontSize: 11
      },
      inRange: {
        color: ['#0a1929', '#0099cc', '#00f2f2', '#66ffff']
      },
      calculable: true,
      left: 'left',
      bottom: '10%',
      backgroundColor: 'rgba(10, 25, 41, 0.5)',
      borderColor: '#00f2f2',
      borderWidth: 1,
      padding: 10
    },

    geo3D: {
      map: map,
      roam: true,
      boxHeight: regionHeight,
      regionHeight: regionHeight,

      // 视角控制
      viewControl: {
        distance: viewControl.distance || 100,
        alpha: viewControl.alpha || 40,
        beta: viewControl.beta || 0,
        autoRotate: viewControl.autoRotate || false,
        autoRotateSpeed: 5,
        rotateSensitivity: 1,
        zoomSensitivity: 1,
        panSensitivity: 1,
        minAlpha: 5,
        maxAlpha: 90
      },

      // 光照效果
      light: {
        main: {
          intensity: lightIntensity,
          shadow: true,
          shadowQuality: 'medium',
          alpha: 30,
          beta: 40
        },
        ambient: {
          intensity: 0.4
        },
        ambientCubemap: {
          texture: null,
          exposure: 1,
          diffuseIntensity: 0.5,
          specularIntensity: 0.5
        }
      },

      // 后处理特效
      postEffect: {
        enable: true,
        bloom: {
          enable: true,
          bloomIntensity: 0.1
        },
        SSAO: {
          enable: true,
          quality: 'medium',
          radius: 2
        }
      },

      // 区域样式
      itemStyle: {
        color: '#0a1929',
        opacity: 0.8,
        borderWidth: 0.8,
        borderColor: '#00f2f2'
      },

      emphasis: {
        itemStyle: {
          color: '#0099cc',
          borderColor: '#66ffff',
          borderWidth: 1.5
        },
        label: {
          show: true,
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: 'rgba(0, 242, 242, 0.5)',
            padding: [4, 8],
            borderRadius: 4
          }
        }
      },

      label: {
        show: showLabel,
        textStyle: {
          color: '#bcd0e3',
          fontSize: 11,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: [2, 4],
          borderRadius: 2
        },
        distance: 5
      },

      // 地面
      groundPlane: {
        show: false
      },

      // 环境
      environment: '#001529',

      // 着色方式
      shading: 'realistic',

      realisticMaterial: {
        detailTexture: null,
        textureTiling: 1,
        roughness: 0.6,
        metalness: 0,
        roughnessAdjust: 0.5
      },

      lambertMaterial: {
        detailTexture: null,
        textureTiling: 1
      }
    },

    series: [
      {
        type: 'map3D',
        map: map,
        data: data,

        itemStyle: {
          color: (params) => {
            // 根据数值渐变颜色
            const colors = ['#0a1929', '#0099cc', '#00f2f2', '#66ffff']
            const value = params.data ? params.data.value : 0
            const ratio = Math.min(value / 4000, 1)

            if (ratio < 0.33) return colors[0]
            if (ratio < 0.66) return colors[1]
            if (ratio < 0.9) return colors[2]
            return colors[3]
          },
          opacity: 0.85,
          borderWidth: 0.8,
          borderColor: '#00f2f2'
        },

        emphasis: {
          itemStyle: {
            color: '#00f2f2',
            borderColor: '#66ffff',
            borderWidth: 1.5
          }
        },

        label: {
          show: showLabel,
          formatter: '{b}',
          textStyle: {
            color: '#bcd0e3',
            fontSize: 11,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: [2, 4],
            borderRadius: 2
          }
        }
      }
    ]
  }
}

export default {
  config: map3DConfig,
  getOption: getMap3DOption
}
