<!-- packages/ui/src/components/form/src/FormItem.vue -->
<!--
  TmFormItem 范本组件：ant FormItem 的纯薄封装 + inject 联动通道消费

  核心机制（v2 扩展）：
  1. props 透传：ant FormItem 原生 props（label/name/rules/help/required/...）原样下发
  2. $attrs 透传：inheritAttrs:false + 手动合并到 forwardBindings（单一 v-bind）
  3. slots 透传：v-for $slots 动态转发全部插槽 + slot props 暴露 FormContext
  4. v2 新增 — useFormContext() 消费：
     - 注入祖先 TmForm 下发的 calculated FormContext（含 submitting/readonly/disabled）
     - 无 TmForm 祖先时返回 undefined，不影响独立使用
     - 通过 slot props 暴露给子控件（特别是非 @kibus/tm-ui-plus 的第三方控件）
  注：FormItem 无需 ref 方法透传（ant FormItem 暴露的方法通常由 ant Form 内部调度）
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { FormItem as AFormItem, type FormItemProps } from 'ant-design-vue'
import { useFormContext } from './composables/useFormContext'
import { useForwardBindings } from '../../../composables/useForwardBindings'

// name 用于全局注册与 devtools 识别；inheritAttrs:false 关闭自动透传
defineOptions({ name: 'TmFormItem', inheritAttrs: false })

const props = defineProps<FormItemProps>()
const slotNames = Object.keys(useSlots()) as string[]

/**
 * 注入祖先 TmForm 提供的联动上下文（v2：从空占位升级为真实消费）
 * 无祖先时返回 undefined——独立使用 FormItem 不受影响
 */
const formContext = useFormContext()

/**
 * slot props：把 FormContext 的 submitting / readonly / disabled 透传给子组件
 *
 * 使用方式：
 * ```vue
 * <TmFormItem label="名称" name="name" v-slot="{ readonly, disabled }">
 *   <input :readonly="readonly" :disabled="disabled" />
 * </TmFormItem>
 * ```
 */
const slotScope = computed(() => ({
  submitting: formContext?.value?.submitting,
  readonly: formContext?.value?.readonly,
  disabled: formContext?.value?.disabled,
}))

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过，见 useForwardBindings） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AFormItem v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <!--
        default slot 暴露 FormContext 字段：业务通过 v-slot="{ readonly, disabled }" 取用
        非 default slot（help/extra/label/tooltip 等）原样透传 ant 的 slotData
      -->
      <slot
        v-if="name === 'default'"
        :name="name"
        v-bind="{ ...(slotData ?? {}), ...slotScope }"
      />
      <slot v-else :name="name" v-bind="slotData ?? {}" />
    </template>
  </AFormItem>
</template>
