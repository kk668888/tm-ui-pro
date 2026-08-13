<!-- packages/ui/src/components/tooltip/src/Tooltip.vue -->
<!--
  TmTooltip 薄封装组件：ant Tooltip 文字提示（统一公司气泡视觉，反哺 Popover / Popconfirm 弹层一致性）
  核心机制：
  1. ant Tooltip 会 filterEmpty(slots.default()) 并把唯一子项 cloneElement 注入 aria/openClassName，
     模板 `<slot />` 编译为 <slot> 虚拟节点，cloneElement 无法作用于真实 trigger → 必须 render function
     转发 slots.default() 返回真实 trigger VNode（Bug 2026-08-12）。
  2. 公司默认 placement: 'top' / autoAdjustOverflow: true / arrow: true（defaults.ts，业务显式值优先）
  3. open / defaultOpen 缺省幻影 false 被 useForwardBindings 跳过，不形成受控态（业务传 open 才受控）
  4. useForwardBindings + useForwardRef 方法透传
-->
<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import { Tooltip as ATooltip } from 'ant-design-vue'
import type { TmTooltipProps } from './props'
import { tmTooltipDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Tooltip 实例类型（ant 未导出 TooltipInstance，用 InstanceType 推导） */
type TooltipInstance = InstanceType<typeof ATooltip>

export default defineComponent({
  name: 'TmTooltip',
  inheritAttrs: false,
  props: {
    title: { type: [String, Number, Object, Function] as PropType<TmTooltipProps['title']> },
    placement: { type: String as PropType<TmTooltipProps['placement']>, default: tmTooltipDefaults.placement },
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    arrow: { type: Boolean, default: tmTooltipDefaults.arrow },
    autoAdjustOverflow: { type: Boolean, default: tmTooltipDefaults.autoAdjustOverflow },
    color: { type: String },
    mouseEnterDelay: { type: Number },
    mouseLeaveDelay: { type: Number },
    trigger: { type: [String, Array] as PropType<TmTooltipProps['trigger']> },
  },
  setup(props, { expose, slots }) {
    // 方法透传：父组件 ref 可直接访问内部 ant Tooltip 实例
    const { innerRef, exposed } = useForwardRef<TooltipInstance>()
    expose(exposed)

    // default 直接透传（见文件头注释 1），具名插槽（title / overlay 等）走通用转发
    const namedSlots = Object.keys(slots).filter((name) => name !== 'default')

    // 透传对象：$attrs + 公司默认（placement/arrow/autoAdjustOverflow）+ 业务显式 props
    // open/defaultOpen 缺省幻影 false 跳过，不覆盖 ant 非受控默认
    const forwardBindings = useForwardBindings(props, [
      'placement',
      'arrow',
      'autoAdjustOverflow',
    ])

    return () => {
      const childSlots: Record<string, unknown> = {
        default: () => slots.default?.(),
      }
      for (const name of namedSlots) {
        childSlots[name] = (data: unknown) => slots[name]?.(data ?? {})
      }
      return h(ATooltip, { ref: innerRef, ...forwardBindings.value }, childSlots)
    }
  },
})
</script>
