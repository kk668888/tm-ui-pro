<!-- packages/ui/src/components/calendar/src/Calendar.vue -->
<!--
  TmCalendar 薄封装组件：ant Calendar 日历
  核心机制：
  1. ant 原生透传：value / mode / fullscreen / validRange / disabledDate 等原样下发
  2. 实现形态：render function（defineComponent + props 对象）——ant 的 CalendarProps<Dayjs> 是
     深层泛型类型，template 的 defineProps<TmCalendarProps>() 无法被 compiler-sfc 解析，
     改用运行时 props 对象（PropType 索引类型由 tsc 检查，不触发 compiler-sfc props 提取）
  3. 公司默认：无（ant 原生 dayjs 面板等兜底）
  4. 动态插槽全透传（dateCellRender / monthCellRender / headerRender 等）+ useForwardRef 方法透传
-->
<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import { Calendar as ACalendar } from 'ant-design-vue'
import type { TmCalendarProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Calendar 实例类型（ant 未导出 CalendarInstance，用 InstanceType 推导） */
type CalendarInstance = InstanceType<typeof ACalendar>

export default defineComponent({
  name: 'TmCalendar',
  inheritAttrs: false,
  props: {
    value: { type: Object as PropType<TmCalendarProps['value']> },
    defaultValue: { type: Object as PropType<TmCalendarProps['defaultValue']> },
    mode: { type: String as PropType<TmCalendarProps['mode']> },
    fullscreen: { type: Boolean },
    validRange: { type: Array as unknown as PropType<TmCalendarProps['validRange']> },
    headerRender: { type: [Object, Function] as PropType<TmCalendarProps['headerRender']> },
    disabledDate: { type: Function as PropType<TmCalendarProps['disabledDate']> },
    locale: { type: Object as PropType<TmCalendarProps['locale']> },
  },
  setup(props, { expose, slots }) {
    // 方法透传：父组件 ref 可直接访问内部 ant Calendar 实例
    const { innerRef, exposed } = useForwardRef<CalendarInstance>()
    expose(exposed)

    // 具名插槽（dateCellRender / monthCellRender / headerRender / fullscreen 等）走通用转发
    const namedSlots = Object.keys(slots).filter((name) => name !== 'default')

    // 透传对象：$attrs + 业务显式 props（fullscreen 幻影 false 跳过）
    const forwardBindings = useForwardBindings(props, [])

    return () => {
      const childSlots: Record<string, unknown> = {
        default: () => slots.default?.(),
      }
      for (const name of namedSlots) {
        childSlots[name] = (data: unknown) => slots[name]?.(data ?? {})
      }
      return h(ACalendar, { ref: innerRef, ...forwardBindings.value }, childSlots)
    }
  },
})
</script>
