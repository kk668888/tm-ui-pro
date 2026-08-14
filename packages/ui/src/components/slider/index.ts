// packages/ui/src/components/slider/index.ts
// TmSlider 出口：withInstall 附加 Vue 插件 install 方法
import Slider from './src/Slider.vue'
import { withInstall } from '../../utils/withInstall'

export const TmSlider = withInstall(Slider, 'TmSlider')
// 类型再导出：业务方可直接 import { TmSliderProps, SliderProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmSlider
