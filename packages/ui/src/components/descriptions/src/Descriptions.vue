<!-- packages/ui/src/components/descriptions/src/Descriptions.vue -->
<!--
  TmDescriptions 薄封装组件：ant Descriptions 描述列表
  核心机制：
  1. ant Descriptions 会 flattenChildren(slots.default()) 并 getRows() 遍历子项，
     读取每个 DescriptionsItem vnode 的 props（label / span / labelStyle / contentStyle）按行排版。
     模板 `<slot />` 编译为 <slot> 虚拟节点，ant 拿不到真实 TmDescriptionsItem 的 props，
     条目信息全部丢失 → 必须 render function 转发 slots.default() 返回真实子组件 VNode（Bug 2026-08-12）。
  2. 公司默认：无（ant 原生 column / layout 等兜底）
  3. useForwardBindings 消幻影 false（bordered/colon 缺省不覆盖 ant 默认）+ useForwardRef 方法透传
-->
<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import { Descriptions as ADescriptions } from 'ant-design-vue'
import type { TmDescriptionsProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Descriptions 实例类型（ant 未导出 DescriptionsInstance，用 InstanceType 推导） */
type DescriptionsInstance = InstanceType<typeof ADescriptions>

export default defineComponent({
  name: 'TmDescriptions',
  inheritAttrs: false,
  props: {
    column: { type: [Number, Object] as PropType<TmDescriptionsProps['column']> },
    layout: { type: String as PropType<TmDescriptionsProps['layout']> },
    size: { type: String as PropType<TmDescriptionsProps['size']> },
    bordered: { type: Boolean },
    colon: { type: Boolean },
    title: { type: [String, Number, Object, Function] as PropType<TmDescriptionsProps['title']> },
    extra: { type: [String, Number, Object, Function] as PropType<TmDescriptionsProps['extra']> },
  },
  setup(props, { expose, slots }) {
    // 方法透传：父组件 ref 可直接访问内部 ant Descriptions 实例
    const { innerRef, exposed } = useForwardRef<DescriptionsInstance>()
    expose(exposed)

    // default 直接透传（见文件头注释 1），具名插槽走通用转发
    const namedSlots = Object.keys(slots).filter((name) => name !== 'default')

    // 透传对象：$attrs + 业务显式 props（bordered/colon 幻影 false 跳过）
    const forwardBindings = useForwardBindings(props, [])

    return () => {
      const childSlots: Record<string, unknown> = {
        default: () => slots.default?.(),
      }
      for (const name of namedSlots) {
        childSlots[name] = (data: unknown) => slots[name]?.(data ?? {})
      }
      return h(ADescriptions, { ref: innerRef, ...forwardBindings.value }, childSlots)
    }
  },
})
</script>
