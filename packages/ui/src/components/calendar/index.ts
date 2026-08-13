// packages/ui/src/components/calendar/index.ts
// TmCalendar 出口：withInstall 附加 Vue 插件 install 方法
import Calendar from './src/Calendar.vue'
import { withInstall } from '../../utils/withInstall'

export const TmCalendar = withInstall(Calendar, 'TmCalendar')
// 类型再导出：业务方可直接 import { TmCalendarProps, CalendarProps } from '@tm/ui'
export * from './src/props'
export default TmCalendar
