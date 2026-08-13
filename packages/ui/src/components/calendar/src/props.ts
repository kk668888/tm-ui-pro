// packages/ui/src/components/calendar/src/props.ts
// TmCalendar 类型定义：ant 原生 CalendarProps（泛型，具体化为 Dayjs）
import type { Dayjs } from 'dayjs'
import type { CalendarProps } from 'ant-design-vue'

/**
 * TmCalendar = ant CalendarProps<Dayjs>
 * 说明：ant 顶层导出的 CalendarProps 是泛型（CalendarProps<DateType>），
 * 组件实例的 props 具体化为 Dayjs（ant calendar 以 dayjs 版本为默认导出）
 */
export type TmCalendarProps = CalendarProps<Dayjs>

// 类型透传：业务方可直接 import TmCalendarProps / CalendarProps
export type { CalendarProps } from 'ant-design-vue'
