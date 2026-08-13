<!-- packages/ui/src/components/avatar/src/Avatar.vue -->
<!--
  TmAvatar 薄封装组件：ant Avatar 头像
  核心机制：
  1. ant 原生透传：src / size / shape / icon / alt 等原样下发（src 失败回退 ant 内部处理）
  2. 公司默认：无（ant 原生 shape / size 兜底）
  3. 动态插槽全透传（default 自定义内容 / icon）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Avatar as AAvatar } from 'ant-design-vue'
import type { TmAvatarProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Avatar 实例类型（ant 未导出 AvatarInstance，用 InstanceType 推导） */
type AvatarInstance = InstanceType<typeof AAvatar>

defineOptions({ name: 'TmAvatar', inheritAttrs: false })

/** 组件 props：TmAvatarProps = AvatarProps（无公司默认） */
const props = defineProps<TmAvatarProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Avatar 实例 */
const { innerRef, exposed } = useForwardRef<AvatarInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AAvatar ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AAvatar>
</template>
