<!-- packages/ui/src/components/collapse/src/Collapse.vue -->
<!--
  TmCollapse 薄封装组件：ant Collapse 折叠面板
  核心机制：
  1. ant Collapse 会 flattenChildren(slots.default()) 遍历子面板，读取每个面板 vnode 的
     key / props.header / children.header 生成面板（getNewChild + cloneElement）。
     模板 `<slot />` 编译为 <slot> 虚拟节点（key:_default），ant 拿不到真实 TmCollapsePanel，
     面板全部丢失 → 必须 render function 转发 slots.default() 返回真实子组件 VNode（Bug 2026-08-12）。
  2. 公司默认：无（ant 原生 defaultActiveKey / bordered 等兜底）
  3. useForwardBindings 消幻影 false（accordion/bordered 缺省不覆盖 ant 默认）+ useForwardRef 方法透传
-->
<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import { Collapse as ACollapse } from 'ant-design-vue'
import type { TmCollapseProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Collapse 实例类型（ant 未导出 CollapseInstance，用 InstanceType 推导） */
type CollapseInstance = InstanceType<typeof ACollapse>

export default defineComponent({
  name: 'TmCollapse',
  inheritAttrs: false,
  props: {
    activeKey: { type: [String, Number, Array] as PropType<TmCollapseProps['activeKey']> },
    defaultActiveKey: { type: [String, Number, Array] as PropType<TmCollapseProps['defaultActiveKey']> },
    accordion: { type: Boolean },
    bordered: { type: Boolean },
    ghost: { type: Boolean },
    collapsible: { type: String as PropType<TmCollapseProps['collapsible']> },
    expandIconPosition: { type: String as PropType<TmCollapseProps['expandIconPosition']> },
    destroyInactivePanel: { type: Boolean },
  },
  setup(props, { expose, slots }) {
    // 方法透传：父组件 ref 可直接访问内部 ant Collapse 实例
    const { innerRef, exposed } = useForwardRef<CollapseInstance>()
    expose(exposed)

    // default 直接透传（见文件头注释 1），具名插槽（expandIcon / header 等）走通用转发
    const namedSlots = Object.keys(slots).filter((name) => name !== 'default')

    // 透传对象：$attrs + 业务显式 props（accordion/bordered 幻影 false 跳过）
    const forwardBindings = useForwardBindings(props, [])

    return () => {
      const childSlots: Record<string, unknown> = {
        default: () => slots.default?.(),
      }
      for (const name of namedSlots) {
        childSlots[name] = (data: unknown) => slots[name]?.(data ?? {})
      }
      return h(ACollapse, { ref: innerRef, ...forwardBindings.value }, childSlots)
    }
  },
})
</script>
