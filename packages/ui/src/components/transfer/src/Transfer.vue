<!-- packages/ui/src/components/transfer/src/Transfer.vue -->
<!--
  TmTransfer 薄封装组件：ant Transfer 穿梭框 + 公司默认标题 + 默认 render
  核心机制：
  1. titles 公司默认 ['源列表', '目标列表']（withDefaults + companyDefaults 显式转发），业务覆盖
  2. render 公司默认显示 item.title（ant Transfer 默认 render 为 null，选项无文字）；
     业务传 render 覆盖
  3. ant 原生透传：dataSource / targetKeys / showSearch / disabled 等原样下发
  4. useForwardBindings 消幻影 false + useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Transfer as ATransfer } from 'ant-design-vue'
import type { TmTransferProps } from './props'
import { tmTransferDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Transfer 实例类型（ant 未导出 TransferInstance，用 InstanceType 推导） */
type TransferInstance = InstanceType<typeof ATransfer>

defineOptions({ name: 'TmTransfer', inheritAttrs: false })

/** 组件 props：TmTransferProps = TransferProps；titles 公司默认兜底 */
const props = withDefaults(defineProps<TmTransferProps>(), {
  titles: tmTransferDefaults.titles,
})

// render 合并：props.render ?? 公司默认显示 item.title（?? 仅兜底 null/undefined，业务传函数覆盖）
const mergedProps = computed(() => ({
  ...props,
  render: props.render ?? tmTransferDefaults.render,
}))

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Transfer 实例 */
const { innerRef, exposed } = useForwardRef<TransferInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 公司默认 titles/render + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(mergedProps, ['titles', 'render'])
</script>

<template>
  <ATransfer ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ATransfer>
</template>
