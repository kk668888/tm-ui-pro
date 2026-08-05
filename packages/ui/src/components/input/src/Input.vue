<!-- packages/ui/src/components/input/src/Input.vue -->
<!--
  TmInput 范本组件：M3 第二个薄封装组件，验证 v-model 受控透传 + ref 方法透传
  核心机制（沿用 TmButton 已确立的封装模式）：
  1. v-model 桥接：业务侧用标准 v-model（modelValue），内部映射到 ant 的 v-model:value
     - parent→child：props.modelValue 经 computed get 写入 AInput 的 value
     - child→parent：AInput 触发 update:value 时，computed set emit update:modelValue
  2. 扩展属性剥离：modelValue 不是 ant 原生 prop，必须从透传对象中剔除，避免 ant 警告
  3. $attrs 透传：inheritAttrs:false + 手动合并到 forwardBindings
  4. slots 透传：v-for $slots 动态转发全部插槽
  5. 方法透传：useForwardRef 把 AInput 实例的 focus/blur/select 等方法代理给父组件 ref
  6. 公司默认值：allowClear / size 兜底，业务可覆盖
-->
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Input as AInput } from 'ant-design-vue'
import type { TmInputProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { tmInputDefaults } from './defaults'

/**
 * ant Input 实例类型
 * 注：ant-design-vue 未导出 InputInstance 类型，使用 Vue 标准的 InstanceType 推导
 * 该类型仅用于 useForwardRef 的泛型约束，确保 exposed.focus/blur/select 有正确类型
 */
type InputInstance = InstanceType<typeof AInput>

// name 用于全局注册与 devtools 识别；inheritAttrs:false 关闭自动透传，改为手动 $attrs 合并
defineOptions({ name: 'TmInput', inheritAttrs: false })

/**
 * 组件 props：TmInputProps = InputProps（ant 原生）+ { modelValue? }（公司扩展）
 *
 * 设计要点：
 * - 业务方使用 TmInput 时，IDE 同时提示 ant 原生属性（placeholder/size/allowClear/...）
 *   与公司扩展 modelValue，开发体验等同于直接写 <AInput>。
 * - 内部 v-model:value 桥接由 computed get/set 完成，与 TmInput 是否声明 'onUpdate:value'
 *   无关：listener 在模板编译期通过 v-model:value 写入 AInput 的 vnode.props，
 *   不会被「TmInput 声明了同名 listener prop」遮蔽（早先诊断时的疑虑已通过 has 修正排除）。
 */
const props = withDefaults(defineProps<TmInputProps>(), {
  // undefined 表示「未传」，由 ant 内部按 defaultValue 处理
  modelValue: undefined,
  // 公司默认值兜底；业务显式传入同名 prop 时自动覆盖
  allowClear: tmInputDefaults.allowClear,
  size: tmInputDefaults.size,
})

/**
 * v-model 桥接事件
 * 由 computed setter 在 v-model:value 中转换发回，业务侧监听 update:modelValue
 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
}>()

// inheritAttrs:false 下需手动取 $attrs；useAttrs 显式拿到外部透传对象（class/style/id/data-*等）
const $attrs = useAttrs()

/**
 * 方法透传：父组件通过 ref 可调用 focus/blur/select 等任意 ant Input 实例方法
 * - innerRef：绑定到内部 <AInput ref="innerRef">，挂载后由 Vue 自动填充 AInput 实例
 * - exposed：Proxy 代理对象，运行时把任意 key 转发到 innerRef.value[key]
 * - defineExpose：把 exposed 注册为父组件 ref 能拿到的对外接口
 */
const { innerRef, exposed } = useForwardRef<InputInstance>()
defineExpose(exposed)

/**
 * 扩展属性剥离：从 props 中剔除 modelValue（业务侧 v-model 字段，ant 不识别）
 * 同时剔除 value / defaultValue / onUpdate:value / onChange / onInput，
 * 因为这些与 v-model:value="inner" 受控写法冲突，必须由 computed inner 单点写入。
 *
 * 注：剔除后剩下的 onPressEnter / onKeydown / onFocus / onBlur 等 listener prop，
 * 即使值为 undefined 也会经 forwardBindings 透传到 AInput，但 Vue 在 setFullProps
 * 阶段对 undefined 值不写入 props，无副作用。
 */
const antProps = computed(() => {
  const {
    modelValue: _mv,
    value: _v,
    defaultValue: _dv,
    'onUpdate:value': _ouv,
    onChange: _oc,
    onInput: _oi,
    ...rest
  } = props
  void _mv
  void _v
  void _dv
  void _ouv
  void _oc
  void _oi
  return rest
})

/**
 * 合并透传对象：$attrs（class/style/id/外部监听器/data-* 等）+ antProps（已剥离 modelValue）
 * Vue 模板不支持同一元素写两个 v-bind，因此预先合并为单个对象
 * 顺序：antProps 覆盖 $attrs（业务 props 优先级高于外部透传，避免业务误覆盖）
 */
const forwardBindings = computed(() => ({
  ...$attrs,
  ...antProps.value,
}))

/**
 * v-model 双向桥接：用 computed get/set 实现 ant v-model:value 与业务 v-model(modelValue) 的转换
 * - get：父组件传入的 modelValue → 写入 AInput 的 value（parent→child）
 * - set：AInput 通过 v-model:value 触发 set → emit update:modelValue（child→parent）
 */
const inner = computed<string | number>({
  get: () => props.modelValue as string | number,
  set: (v: string | number) => emit('update:modelValue', v),
})
</script>

<template>
  <!--
    v-bind=forwardBindings 承载 $attrs 与已剥离 modelValue 的 ant 原生 props
    v-model:value="inner" 单点完成 value 写入与 update:value 监听（标准 Vue 受控写法）
  -->
  <AInput ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <!-- 动态透传全部插槽：prefix/suffix/addonBefore/addonAfter 等 -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AInput>
</template>
