<!-- packages/ui/src/components/form/src/FormItem.vue -->
<!--
  TmFormItem 范本组件：ant FormItem 的纯薄封装 + inject 联动通道预留
  核心机制（沿用 TmForm 已确立的封装模式）：
  1. props 透传：ant FormItem 原生 props（label/name/rules/help/required/...）原样下发
  2. $attrs 透传：inheritAttrs:false + 手动合并到 forwardBindings（单一 v-bind，plan-bug #1 修正）
  3. slots 透传：v-for $slots 动态转发全部插槽
  4. inject 联动：useFormContext() 注入祖先 TmForm 提供的联动上下文（v1 占位）
     - 无 TmForm 祖先时返回 undefined，也不影响渲染（独立使用容错）
  注：FormItem 无需 ref 方法透传（ant FormItem 暴露的 onFieldBlur/onFieldChange/clearValidate/
  resetField 等通常由 ant Form 内部调度，业务侧极少直接调用），故不使用 useForwardRef
-->
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { FormItem as AFormItem, type FormItemProps } from 'ant-design-vue'
import { useFormContext } from './composables/useFormContext'

// name 用于全局注册与 devtools 识别；inheritAttrs:false 关闭自动透传，改为手动 $attrs 合并
defineOptions({ name: 'TmFormItem', inheritAttrs: false })

/**
 * 组件 props：直接复用 ant FormItemProps（纯透传，不新增公司扩展键）
 *
 * 设计要点：
 * - 业务方使用 TmFormItem 时，IDE 提示等同于直接写 <AFormItem>（label/name/rules/help/...）。
 * - 不设公司默认值（FormItem 无公司层视觉规范诉求，全部沿用 ant 默认）。
 *
 * 类型来源（plan-bug #2/#3 实测核实结论）：
 * ant-design-vue 4.2.6 经 components.d.ts L49 → ./form/index.d.ts 显式 re-export
 * `export type { FormItemProps } from './FormItem'`，从 'ant-design-vue' 主入口可导入。
 */
const props = defineProps<FormItemProps>()

// inheritAttrs:false 下需手动取 $attrs；useAttrs 显式拿到外部透传对象
const $attrs = useAttrs()

// 注入祖先 TmForm 提供的联动上下文（v1 占位）。
// 返回值当前未使用——调用本身确保 inject 通道已就绪，后续扩展 FormContext 时可直接消费。
// 显式 void 标注「故意未使用返回值」，避免 lint/IDE 提示未使用变量。
void useFormContext()

/**
 * 合并透传对象：$attrs + props（单一 v-bind，plan-bug #1 修正）
 * 顺序：props 覆盖 $attrs——同名时受控 props 优先。
 * FormItem 是纯透传无扩展键，无需剥离任何字段。
 */
const forwardBindings = computed(() => ({
  ...$attrs,
  ...props,
}))
</script>

<template>
  <AFormItem v-bind="forwardBindings">
    <!--
      动态透传全部插槽：default 等
      用 Object.keys($slots) 迭代字符串键（避免 vue-tsc TS7022 circular inference）
    -->
    <template v-for="name in Object.keys($slots)" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AFormItem>
</template>
