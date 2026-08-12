<!-- packages/ui/src/components/dropdown/src/DropdownButton.vue -->
<!--
  TmDropdownButton 薄封装组件：ant Dropdown.Button 下拉按钮组
  核心机制：与 TmDropdown 一致——
  - default 插槽经 render 函数直接转发 slots.default()（ant 用 slots.default()?.[0] + cloneElement
    给触发元素挂 ant-dropdown-trigger 类与监听，模板 <slot /> 会让 ant 拿到 <slot> 虚拟节点不生效）
  - open 幻影 false 跳过保持非受控
  - useForwardRef 方法透传
-->
<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import { DropdownButton as ADropdownButton } from 'ant-design-vue'
import type { TmDropdownButtonProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Dropdown.Button 实例类型（ant 未导出 DropdownButtonInstance，用 InstanceType 推导） */
type DropdownButtonInstance = InstanceType<typeof ADropdownButton>

export default defineComponent({
  name: 'TmDropdownButton',
  inheritAttrs: false,
  props: {
    menu: { type: [Object, Array] as PropType<TmDropdownButtonProps['menu']> },
    trigger: { type: [String, Array] as PropType<TmDropdownButtonProps['trigger']> },
    placement: { type: String },
    arrow: { type: Boolean },
    open: { type: Boolean },
    disabled: { type: Boolean },
    size: { type: String as PropType<TmDropdownButtonProps['size']> },
    type: { type: String },
    loading: { type: Boolean },
    danger: { type: Boolean },
  },
  setup(props, { expose, slots }) {
    // 方法透传：父组件 ref 可直接访问内部 ant Dropdown.Button 实例
    const { innerRef, exposed } = useForwardRef<DropdownButtonInstance>()
    expose(exposed)

    // default 直接透传（见文件头注释），具名插槽（overlay）走通用转发
    const namedSlots = Object.keys(slots).filter((name) => name !== 'default')

    // 透传对象：$attrs + 业务显式 props（open 幻影 false 跳过，保持非受控）。
    // 剔除 menu：ant DropdownButton 不消费 menu（仅声明但泄漏为 ButtonGroup 属性），
    // 下拉内容应经 #overlay 插槽提供。
    const forwardBindings = useForwardBindings(props, [], ['menu'])

    return () => {
      const childSlots: Record<string, unknown> = {
        default: () => slots.default?.(),
      }
      for (const name of namedSlots) {
        childSlots[name] = (data: unknown) => slots[name]?.(data ?? {})
      }
      return h(ADropdownButton, { ref: innerRef, ...forwardBindings.value }, childSlots)
    }
  },
})
</script>
