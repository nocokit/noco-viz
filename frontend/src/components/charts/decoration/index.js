/**
 * 装饰组件统一导出
 */

import Border01 from './Border01.vue'
import Border02 from './Border02.vue'
import Border03 from './Border03.vue'
import Border04 from './Border04.vue'
import Decoration01 from './Decoration01.vue'
import Decoration02 from './Decoration02.vue'
import Decoration03 from './Decoration03.vue'
import BgBox from './BgBox.vue'

export {
  Border01,
  Border02,
  Border03,
  Border04,
  Decoration01,
  Decoration02,
  Decoration03,
  BgBox
}

// 装饰组件映射表
export const decorationComponents = {
  'border-01': Border01,
  'border-02': Border02,
  'border-03': Border03,
  'border-04': Border04,
  'decoration-01': Decoration01,
  'decoration-02': Decoration02,
  'decoration-03': Decoration03,
  'bg-box': BgBox
}

export default decorationComponents
