// packages/ui/src/components/time-range-picker/index.ts
// TmTimeRangePicker 出口：通过 withInstall 附加 Vue 插件 install 方法
import TimeRangePicker from './src/TimeRangePicker.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTimeRangePicker = withInstall(TimeRangePicker, 'TmTimeRangePicker')
// 类型再导出：业务方可直接 import { TmTimeRangePickerProps, RangePickerProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmTimeRangePicker
