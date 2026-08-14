<!-- packages/ui/src/components/timeline/src/Timeline.vue -->
<!--
  TmTimeline 薄封装组件：ant Timeline 时间轴
  核心机制：
  1. ant Timeline 会 filterEmpty(slots.default()) 遍历子项（TimelineItem），读取每个子项 vnode 的
     props.label / children.label 判断展示内容。模板 `<slot />` 编译为 <slot> 虚拟节点，
     ant 拿不到真实 TimelineItem → 必须 render function 转发 slots.default() 返回真实子组件 VNode（Bug 2026-08-12）。
  2. 子项 TimelineItem 未在 @kibus/tm-ui-plus 注册（设计 Non-Goals），业务 children 使用 ant 的 TimelineItem 组件。
  3. 公司默认：无（ant 原生 mode / reverse / pending 等兜底）
  4. useForwardBindings 消幻影 false + useForwardRef 方法透传
-->
<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import { Timeline as ATimeline } from 'ant-design-vue'
import type { TmTimelineProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Timeline 实例类型（ant 未导出 TimelineInstance，用 InstanceType 推导） */
type TimelineInstance = InstanceType<typeof ATimeline>

export default defineComponent({
  name: 'TmTimeline',
  inheritAttrs: false,
  props: {
    mode: { type: String as PropType<TmTimelineProps['mode']> },
    pending: { type: [String, Boolean, Number, Object, Function] as PropType<TmTimelineProps['pending']> },
    pendingDot: { type: [String, Number, Object, Function] as PropType<TmTimelineProps['pendingDot']> },
    reverse: { type: Boolean },
  },
  setup(props, { expose, slots }) {
    // 方法透传：父组件 ref 可直接访问内部 ant Timeline 实例
    const { innerRef, exposed } = useForwardRef<TimelineInstance>()
    expose(exposed)

    // default 直接透传（见文件头注释 1），具名插槽（pending / pendingDot / label 等）走通用转发
    const namedSlots = Object.keys(slots).filter((name) => name !== 'default')

    // 透传对象：$attrs + 业务显式 props（reverse 幻影 false 跳过）
    const forwardBindings = useForwardBindings(props, [])

    return () => {
      const childSlots: Record<string, unknown> = {
        default: () => slots.default?.(),
      }
      for (const name of namedSlots) {
        childSlots[name] = (data: unknown) => slots[name]?.(data ?? {})
      }
      return h(ATimeline, { ref: innerRef, ...forwardBindings.value }, childSlots)
    }
  },
})
</script>
