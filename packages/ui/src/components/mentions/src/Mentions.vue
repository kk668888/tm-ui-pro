<!-- packages/ui/src/components/mentions/src/Mentions.vue -->
<!--
  TmMentions 薄封装组件：ant Mentions @提及输入
  核心机制：
  1. ant 原生透传：value / prefix / options / placeholder / rows / onChange 等原样下发
  2. default 插槽经 render 函数直接转发 slots.default()（ant Mentions 处理子选项 MentionsOption，
     模板 <slot /> 编译后 ant 拿到 <slot> 虚拟节点会破坏子选项渲染，同 Tree/Menu 教训）
  3. useForwardBindings 消幻影 false + useForwardRef 方法透传
-->
<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import { Mentions as AMentions } from 'ant-design-vue'
import type { TmMentionsProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Mentions 实例类型（ant 未导出 MentionsInstance，用 InstanceType 推导） */
type MentionsInstance = InstanceType<typeof AMentions>

export default defineComponent({
  name: 'TmMentions',
  inheritAttrs: false,
  props: {
    value: { type: String },
    prefix: { type: [String, Array] as PropType<TmMentionsProps['prefix']> },
    options: { type: Array as PropType<TmMentionsProps['options']> },
    placeholder: { type: String },
    rows: { type: Number },
    disabled: { type: Boolean },
    autoSize: { type: [Boolean, Object] },
  },
  setup(props, { expose, slots }) {
    // 方法透传：父组件 ref 可直接访问内部 ant Mentions 实例
    const { innerRef, exposed } = useForwardRef<MentionsInstance>()
    expose(exposed)

    // default 直接透传（见文件头注释 2），具名插槽走通用转发
    const namedSlots = Object.keys(slots).filter((name) => name !== 'default')

    // 透传对象：$attrs + 业务显式 props（幻影 false 跳过）
    const forwardBindings = useForwardBindings(props, [])

    return () => {
      const childSlots: Record<string, unknown> = {
        default: () => slots.default?.(),
      }
      for (const name of namedSlots) {
        childSlots[name] = (data: unknown) => slots[name]?.(data ?? {})
      }
      return h(AMentions, { ref: innerRef, ...forwardBindings.value }, childSlots)
    }
  },
})
</script>
