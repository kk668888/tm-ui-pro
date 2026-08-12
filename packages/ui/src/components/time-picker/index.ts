// packages/ui/src/components/time-picker/index.ts
// TmTimePicker 出口：withInstall 附加 Vue 插件 install 方法
import TimePicker from './src/TimePicker.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTimePicker = withInstall(TimePicker, 'TmTimePicker')
// 类型再导出：业务方可直接 import { TmTimePickerProps, TimePickerProps } from '@tm/ui'
export * from './src/props'
export default TmTimePicker
