// packages/ui/src/components/week-picker/index.ts
// TmWeekPicker 出口：通过 withInstall 附加 Vue 插件 install 方法
import WeekPicker from './src/WeekPicker.vue'
import { withInstall } from '../../utils/withInstall'

export const TmWeekPicker = withInstall(WeekPicker, 'TmWeekPicker')
// 类型再导出：业务方可直接 import { TmWeekPickerProps, DatePickerProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmWeekPicker
