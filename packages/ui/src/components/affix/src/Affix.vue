<!-- packages/ui/src/components/affix/src/Affix.vue -->
<!--
  TmAffix 薄封装组件：ant Affix 固定定位
  核心机制：
  1. ant 原生透传：offsetTop / offsetBottom / target / onChange 原样下发
  2. 无公司默认：companyDefaults 传 []，缺省 Boolean 幻影值跳过
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Affix as AAffix } from 'ant-design-vue'
import type { TmAffixProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Affix 实例类型（ant 未导出 AffixInstance，用 InstanceType 推导） */
type AffixInstance = InstanceType<typeof AAffix>

defineOptions({ name: 'TmAffix', inheritAttrs: false })

/** 组件 props：TmAffixProps = AffixProps（无公司默认） */
const props = defineProps<TmAffixProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Affix 实例 */
const { innerRef, exposed } = useForwardRef<AffixInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AAffix ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AAffix>
</template>
