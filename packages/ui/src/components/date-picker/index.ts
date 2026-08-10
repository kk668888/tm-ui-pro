// packages/ui/src/components/date-picker/index.ts
// TmDatePicker / TmRangePicker 出口：withInstall 附加 Vue 插件 install 方法
import DatePicker from './src/DatePicker.vue'
import RangePicker from './src/RangePicker.vue'
import { withInstall } from '../../utils/withInstall'

export const TmDatePicker = withInstall(DatePicker, 'TmDatePicker')
export const TmRangePicker = withInstall(RangePicker, 'TmRangePicker')
// 类型再导出：业务方可直接 import { TmDatePickerProps, DatePickerProps, ... } from '@tm/ui'
export * from './src/props'
export default TmDatePicker
