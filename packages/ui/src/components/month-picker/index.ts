// packages/ui/src/components/month-picker/index.ts
// TmMonthPicker 出口：通过 withInstall 附加 Vue 插件 install 方法
import MonthPicker from './src/MonthPicker.vue'
import { withInstall } from '../../utils/withInstall'

export const TmMonthPicker = withInstall(MonthPicker, 'TmMonthPicker')
// 类型再导出：业务方可直接 import { TmMonthPickerProps, DatePickerProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmMonthPicker
