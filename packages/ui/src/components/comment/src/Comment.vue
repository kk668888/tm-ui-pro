<!-- packages/ui/src/components/comment/src/Comment.vue -->
<!--
  TmComment 兼容型薄封装组件：ant Comment 评论（上游已标记废弃，保留封装以满足全覆盖）
  核心机制：
  1. ant 原生透传：actions / author / avatar / content / datetime 等原样下发（不新增业务评论模型）
  2. 公司默认：无（ant 原生兜底）
  3. 动态插槽全透传（actions / author / avatar / content / datetime / default 嵌套评论）+ useForwardRef 方法透传
  4. 迁移提示：上游废弃，推荐使用 Avatar / Flex / Space / Typography 组合构建新评论界面（见文档）
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Comment as AComment } from 'ant-design-vue'
import type { TmCommentProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Comment 实例类型（ant 未导出 CommentInstance，用 InstanceType 推导） */
type CommentInstance = InstanceType<typeof AComment>

defineOptions({ name: 'TmComment', inheritAttrs: false })

/** 组件 props：TmCommentProps = CommentProps（无公司默认） */
const props = defineProps<TmCommentProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Comment 实例 */
const { innerRef, exposed } = useForwardRef<CommentInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AComment ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AComment>
</template>
