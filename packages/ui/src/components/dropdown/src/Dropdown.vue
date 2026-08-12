<!-- packages/ui/src/components/dropdown/src/Dropdown.vue -->
<!--
  TmDropdown 薄封装组件：ant Dropdown 下拉菜单
  核心机制：
  1. ant 原生透传：menu / trigger / placement / arrow 等原样下发
  2. open 幻影 false 跳过：open 是受控 prop，缺省被归一化为 false → 直接透传会让菜单永不弹出，
     useForwardBindings 跳过幻影 false，保持 ant 非受控（hover/点击即弹出，与 Popover 同思路）
  3. 关键：default 插槽必须经 render 函数直接转发 slots.default()。
     ant Dropdown 用 `slots.default()?.[0]` + cloneElement 给触发元素挂 ant-dropdown-trigger 类
     与触发监听；模板 `<slot />` 编译后 ant 拿到的是 <slot> 虚拟节点（key:_default）而非真实触发元素，
     导致点击/hover 不生效。render 函数转发 slots.default() 返回真实 VNode，触发机制正常。
  4. useForwardRef 方法透传
-->
<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import { Dropdown as ADropdown } from 'ant-design-vue'
import type { TmDropdownProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Dropdown 实例类型（ant 未导出 DropdownInstance，用 InstanceType 推导） */
type DropdownInstance = InstanceType<typeof ADropdown>

export default defineComponent({
  name: 'TmDropdown',
  inheritAttrs: false,
  props: {
    menu: { type: [Object, Array] as PropType<TmDropdownProps['menu']> },
    trigger: { type: [String, Array] as PropType<TmDropdownProps['trigger']> },
    placement: { type: String },
    arrow: { type: Boolean },
    open: { type: Boolean },
    disabled: { type: Boolean },
    overlayClassName: { type: String },
    overlayStyle: { type: Object as PropType<Record<string, unknown>> },
    getPopupContainer: { type: Function as PropType<TmDropdownProps['getPopupContainer']> },
    autoAdjustOverflow: { type: Boolean },
  },
  setup(props, { expose, slots }) {
    // 方法透传：父组件 ref 可直接访问内部 ant Dropdown 实例
    const { innerRef, exposed } = useForwardRef<DropdownInstance>()
    expose(exposed)

    // default 直接透传（见文件头注释 3），具名插槽（overlay）走通用转发
    const namedSlots = Object.keys(slots).filter((name) => name !== 'default')

    // 透传对象：$attrs + 业务显式 props（open 幻影 false 跳过，保持非受控）
    const forwardBindings = useForwardBindings(props, [])

    return () => {
      const childSlots: Record<string, unknown> = {
        default: () => slots.default?.(),
      }
      for (const name of namedSlots) {
        childSlots[name] = (data: unknown) => slots[name]?.(data ?? {})
      }
      return h(ADropdown, { ref: innerRef, ...forwardBindings.value }, childSlots)
    }
  },
})
</script>
