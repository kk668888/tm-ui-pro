<!-- packages/ui/src/components/menu/src/Menu.vue -->
<!--
  TmMenu 薄封装组件：ant Menu 导航菜单
  核心机制：
  1. ant 原生透传：items / mode / theme / selectable / selectedKeys / openKeys 等原样下发
  2. 关键：default 插槽必须经 render 函数直接转发 slots.default()。
     ant Menu 按键值（key/context）处理 MenuItem/SubMenu 子项选中态；模板 `<slot />` 编译后
     ant 拿到的是 <slot> 虚拟节点（key:_default），子项 key 关联断裂，导致点击后多项同时高亮。
     render 函数转发 slots.default() 返回真实子组件 VNode，选中态正常（Bug 2026-08-12）。
  3. useForwardBindings 消幻影 false（selectable 缺省不覆盖 ant 默认 true）+ useForwardRef 方法透传
-->
<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import { Menu as AMenu } from 'ant-design-vue'
import type { TmMenuProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Menu 实例类型（ant 未导出 MenuInstance，用 InstanceType 推导） */
type MenuInstance = InstanceType<typeof AMenu>

export default defineComponent({
  name: 'TmMenu',
  inheritAttrs: false,
  props: {
    items: { type: Array as PropType<TmMenuProps['items']> },
    mode: { type: String as PropType<TmMenuProps['mode']> },
    theme: { type: String as PropType<TmMenuProps['theme']> },
    selectable: { type: Boolean },
    selectedKeys: { type: Array as PropType<TmMenuProps['selectedKeys']> },
    openKeys: { type: Array as PropType<TmMenuProps['openKeys']> },
    inlineCollapsed: { type: Boolean },
    inlineIndent: { type: Number },
    subMenuOpenDelay: { type: Number },
    subMenuCloseDelay: { type: Number },
  },
  setup(props, { expose, slots }) {
    // 方法透传：父组件 ref 可直接访问内部 ant Menu 实例
    const { innerRef, exposed } = useForwardRef<MenuInstance>()
    expose(exposed)

    // default 直接透传（见文件头注释 2），具名插槽走通用转发
    const namedSlots = Object.keys(slots).filter((name) => name !== 'default')

    // 透传对象：$attrs + 业务显式 props（selectable 幻影 false 跳过）
    const forwardBindings = useForwardBindings(props, [])

    return () => {
      const childSlots: Record<string, unknown> = {
        default: () => slots.default?.(),
      }
      for (const name of namedSlots) {
        childSlots[name] = (data: unknown) => slots[name]?.(data ?? {})
      }
      return h(AMenu, { ref: innerRef, ...forwardBindings.value }, childSlots)
    }
  },
})
</script>
