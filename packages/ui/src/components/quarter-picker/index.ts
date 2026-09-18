// packages/ui/src/components/quarter-picker/index.ts
// TmQuarterPicker 出口：通过 withInstall 附加 Vue 插件 install 方法
import QuarterPicker from './src/QuarterPicker.vue'
import { withInstall } from '../../utils/withInstall'

export const TmQuarterPicker = withInstall(QuarterPicker, 'TmQuarterPicker')
// 类型再导出：业务方可直接 import { TmQuarterPickerProps, DatePickerProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmQuarterPicker
