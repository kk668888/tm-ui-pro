<!-- packages/ui/src/components/tree/src/DirectoryTree.vue -->
<!--
  TmDirectoryTree 薄封装组件：ant DirectoryTree 目录树
  核心机制：
  1. ant 原生透传：treeData / expandAction / selectable 等原样下发
  2. 无公司默认：companyDefaults 传 []，缺省 Boolean 幻影值跳过
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { DirectoryTree as ADirectoryTree } from 'ant-design-vue'
import type { TmDirectoryTreeProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant DirectoryTree 实例类型（ant 未导出 DirectoryTreeInstance，用 InstanceType 推导） */
type DirectoryTreeInstance = InstanceType<typeof ADirectoryTree>

defineOptions({ name: 'TmDirectoryTree', inheritAttrs: false })

/** 组件 props：TmDirectoryTreeProps = DirectoryTreeProps（无公司默认） */
const props = defineProps<TmDirectoryTreeProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant DirectoryTree 实例 */
const { innerRef, exposed } = useForwardRef<DirectoryTreeInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ADirectoryTree ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ADirectoryTree>
</template>
