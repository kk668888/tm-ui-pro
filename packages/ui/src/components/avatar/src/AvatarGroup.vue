<!-- packages/ui/src/components/avatar/src/AvatarGroup.vue -->
<!--
  TmAvatarGroup 薄封装组件：ant Avatar.Group 头像组
  核心机制：
  1. ant Avatar.Group 会 flattenChildren(slots.default()) 并 cloneElement 遍历子头像，
     为每个头像注入 size / style（maxCount 溢出折叠）。模板 `<slot />` 编译为 <slot> 虚拟节点，
     ant 无法 cloneElement 真实子头像 → 必须 render function 转发 slots.default() 返回真实子组件 VNode（Bug 2026-08-12）。
  2. 公司默认：无（ant 原生 maxCount / shape 等兜底）
  3. useForwardBindings 消幻影 false + useForwardRef 方法透传
-->
<script lang="ts">
import { defineComponent, h, type CSSProperties, type PropType } from 'vue'
import { AvatarGroup as AAvatarGroup } from 'ant-design-vue'
import type { TmAvatarGroupProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Avatar.Group 实例类型（用 InstanceType 推导） */
type AvatarGroupInstance = InstanceType<typeof AAvatarGroup>

export default defineComponent({
  name: 'TmAvatarGroup',
  inheritAttrs: false,
  props: {
    maxCount: { type: Number },
    maxStyle: { type: Object as PropType<CSSProperties> },
    maxPopoverPlacement: { type: String as PropType<TmAvatarGroupProps['maxPopoverPlacement']> },
    maxPopoverTrigger: { type: String as PropType<TmAvatarGroupProps['maxPopoverTrigger']> },
    size: { type: [Number, String, Object] as PropType<TmAvatarGroupProps['size']> },
    shape: { type: String as PropType<TmAvatarGroupProps['shape']> },
  },
  setup(props, { expose, slots }) {
    // 方法透传：父组件 ref 可直接访问内部 ant Avatar.Group 实例
    const { innerRef, exposed } = useForwardRef<AvatarGroupInstance>()
    expose(exposed)

    // default 直接透传（见文件头注释 1），具名插槽走通用转发
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
      return h(AAvatarGroup, { ref: innerRef, ...forwardBindings.value }, childSlots)
    }
  },
})
</script>
