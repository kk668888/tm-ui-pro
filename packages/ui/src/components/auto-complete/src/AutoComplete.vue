<!-- packages/ui/src/components/auto-complete/src/AutoComplete.vue -->
<!--
  TmAutoComplete 薄封装组件：ant AutoComplete 自动完成
  核心机制：
  1. ant 原生透传：value / options / placeholder / allowClear 等原样下发
  2. filterOption 公司默认开启（按 value 大小写不敏感子串过滤）：
     ant 默认 filterOption=false（输入不过滤、展示全部选项 + defaultActiveFirstOption 易误选首项）。
     业务传 filterOption=false 关闭，传函数自定义。
  3. useForwardBindings 消幻影 false + useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { AutoComplete as AAutoComplete } from 'ant-design-vue'
import type { TmAutoCompleteProps } from './props'
import { tmAutoCompleteDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant AutoComplete 实例类型（ant 未导出 AutoCompleteInstance，用 InstanceType 推导） */
type AutoCompleteInstance = InstanceType<typeof AAutoComplete>

defineOptions({ name: 'TmAutoComplete', inheritAttrs: false })

/** 组件 props：TmAutoCompleteProps = AutoCompleteProps（无公司默认） */
const props = defineProps<TmAutoCompleteProps>()

// filterOption 合并：props.filterOption ?? 公司默认（?? 仅对 null/undefined，业务传 false 可关闭过滤）
const mergedProps = computed(() => ({
  ...props,
  filterOption: props.filterOption ?? tmAutoCompleteDefaults.filterOption,
}))

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant AutoComplete 实例 */
const { innerRef, exposed } = useForwardRef<AutoCompleteInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 公司默认 filterOption + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(mergedProps, ['filterOption'])
</script>

<template>
  <AAutoComplete ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AAutoComplete>
</template>
