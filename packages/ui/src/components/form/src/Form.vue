<!-- packages/ui/src/components/form/src/Form.vue -->
<!--
  TmForm 范本组件：ant Form 的纯薄封装 + provide/inject 联动通道预留 + validate 方法透传
  核心机制（沿用 TmButton/TmInput/TmSelect 已确立的封装模式）：
  1. props 透传：ant Form 原生 props（layout/colon/hideRequiredMark/model/...）原样下发
  2. $attrs 透传：inheritAttrs:false + 手动合并到 forwardBindings（单一 v-bind，plan-bug #1 修正）
  3. slots 透传：v-for $slots 动态转发全部插槽
  4. 方法透传：useForwardRef 把 ant Form 实例的 validate/validateFields/resetFields/clearValidate 等
     方法代理给父组件 ref，业务侧 ref.value.validate() 即可触发真实校验链路
  5. provide/inject：provideForm({}) 预留公司级联动通道（v1 占位，不影响 ant 内部联动）
  6. 公司默认值：layout=horizontal / hideRequiredMark=false 兜底，业务可覆盖
  注：纯薄封装，不新增公司扩展键（与 Button/Input/Select 不同）
-->
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Form as AForm, type FormProps, type FormInstance } from 'ant-design-vue'
import { useForwardRef } from '../../../composables/useForwardRef'
import { tmFormDefaults } from './defaults'
import { provideForm } from './composables/useFormContext'

// name 用于全局注册与 devtools 识别；inheritAttrs:false 关闭自动透传，改为手动 $attrs 合并
defineOptions({ name: 'TmForm', inheritAttrs: false })

/**
 * 组件 props：直接复用 ant FormProps（纯透传，不新增公司扩展键）
 *
 * 设计要点：
 * - 业务方使用 TmForm 时，IDE 提示等同于直接写 <AForm>（layout/model/rules/colon/...）。
 * - withDefaults 落地公司默认 layout/hideRequiredMark，业务显式传入同名 prop 时自动覆盖。
 *
 * 类型来源（plan-bug #2/#3 实测核实结论）：
 * ant-design-vue 4.2.6 经 components.d.ts L49 → ./form/index.d.ts 显式 re-export
 * `export type { FormProps, FormInstance } from './Form'`，二者均从 'ant-design-vue' 主入口可导入，
 * 且 FormInstance 含 validate/validateFields/resetFields/clearValidate/getFieldsValue/scrollToField 完整方法
 * 类型定义（见 node_modules/.../ant-design-vue/es/form/Form.d.ts L235-249）。
 * 故直接使用 FormInstance 作为 useForwardRef 泛型，无需 InstanceType<typeof AForm> fallback。
 */
const props = withDefaults(defineProps<FormProps>(), {
  // 公司默认值兜底；业务显式传入同名 prop 时自动覆盖
  layout: tmFormDefaults.layout,
  hideRequiredMark: tmFormDefaults.hideRequiredMark,
})

// inheritAttrs:false 下需手动取 $attrs；useAttrs 显式拿到外部透传对象（class/style/id/data-*等）
const $attrs = useAttrs()

/**
 * 方法透传：父组件通过 ref 可调用 validate/validateFields/resetFields/clearValidate 等任意 ant Form 实例方法
 * - innerRef：绑定到内部 <AForm ref="innerRef">，挂载后由 Vue 自动填充 AForm 实例
 * - exposed：Proxy 代理对象，运行时把任意 key 转发到 innerRef.value[key]
 * - defineExpose：把 exposed 注册为父组件 ref 能拿到的对外接口
 *
 * 关键（plan-bug #4 处理）：直接 defineExpose(exposed) 暴露 Proxy 做方法透传，
 * 不使用 defineExpose({ ...exposed })——后者会 spread Proxy，
 * 因 useForwardRef 的 Proxy 未实现 ownKeys/getOwnPropertyDescriptor trap，
 * spread 出来是空对象，导致 ant Form 方法（validate 等）透传全部丢失。
 * Form 无额外本地方法，直传 exposed 即可（参照 TmInput.vue）。
 */
const { innerRef, exposed } = useForwardRef<FormInstance>()
defineExpose(exposed)

/**
 * 合并透传对象：$attrs（class/style/id/外部监听器/data-* 等）+ props（ant 原生 + 公司默认）
 * Vue 模板不支持同一元素写两个 v-bind，因此预先合并为单个对象（plan-bug #1 修正）。
 * 顺序：props 覆盖 $attrs——同名时受控 props 优先；
 * 实际上 ant 已定义的 prop 会自动从 $attrs 分离，合并顺序仅作受控写法的兜底保护。
 *
 * 注：Form 是纯透传无扩展键，无需剥离任何字段（与 Input/Select 不同）。
 */
const forwardBindings = computed(() => ({
  ...$attrs,
  ...props,
}))

// 预留公司级联动上下文（v1 占位，不影响 ant Form↔FormItem 内部联动）
provideForm({})
</script>

<template>
  <!--
    v-bind="forwardBindings" 承载 $attrs 与 ant 原生 props（单一 v-bind，plan-bug #1 修正）
    ref="innerRef" 由 useForwardRef 绑定，挂载后填充 AForm 实例供方法透传
  -->
  <AForm ref="innerRef" v-bind="forwardBindings">
    <!-- 动态透传全部插槽：default 等 -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AForm>
</template>
