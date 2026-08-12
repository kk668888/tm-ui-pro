<!-- packages/ui/src/components/tree/src/Tree.vue -->
<!--
  TmTree 薄封装组件：ant Tree 树形控件
  核心机制：
  1. ant 原生透传：treeData / checkable / checkedKeys / selectedKeys / expandedKeys 等原样下发
  2. 关键：default 插槽必须经 render 函数直接转发 slots.default()。
     ant Tree 的 treeUtil 会 processNode 处理子节点，模板 <slot /> 编译后 ant 拿到 <slot> 虚拟节点
     会造成递归（Maximum call stack，Bug 2026-08-12，同 Menu）。render 函数转发真实 TreeNode VNode。
  3. useForwardBindings 消幻影 false + useForwardRef 方法透传
-->
<script lang="ts">
import { defineComponent, h, type PropType } from 'vue'
import { Tree as ATree } from 'ant-design-vue'
import type { TmTreeProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Tree 实例类型（ant 未导出 TreeInstance，用 InstanceType 推导） */
type TreeInstance = InstanceType<typeof ATree>

export default defineComponent({
  name: 'TmTree',
  inheritAttrs: false,
  props: {
    treeData: { type: Array as PropType<TmTreeProps['treeData']> },
    checkable: { type: Boolean },
    checkedKeys: { type: [Array, Object] as PropType<TmTreeProps['checkedKeys']> },
    selectedKeys: { type: Array as PropType<TmTreeProps['selectedKeys']> },
    expandedKeys: { type: Array as PropType<TmTreeProps['expandedKeys']> },
    defaultExpandAll: { type: Boolean },
    blockNode: { type: Boolean },
  },
  setup(props, { expose, slots }) {
    // 方法透传：父组件 ref 可直接访问内部 ant Tree 实例
    const { innerRef, exposed } = useForwardRef<TreeInstance>()
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
      return h(ATree, { ref: innerRef, ...forwardBindings.value }, childSlots)
    }
  },
})
</script>
