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
import { computed, useAttrs, useSlots } from 'vue'
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

// slot keys 显式抽出并断言为 string[]：让 vue-tsc/vite:dts 双路径对 v-for + 动态 #[name]
// 不再触发 TS7022 circular inference（T14 收口 2）。
// useSlots() 拿到响应式 slots 对象；Object.keys 一次性快照（slot 集合在 mount 后稳定，无需响应式）。
const slotNames = Object.keys(useSlots()) as string[]

/**
 * 方法透传：父组件通过 ref 可调用 focus/blur/select 等任意 ant Input 实例方法
 * - innerRef：绑定到内部 <AInput ref="innerRef">，挂载后由 Vue 自动填充 AInput 实例
 * - exposed：Proxy 代理对象，运行时把任意 key 转发到 innerRef.value[key]
 * - defineExpose：把 exposed 注册为父组件 ref 能拿到的对外接口
 */
const { innerRef, exposed } = useForwardRef<InputInstance>()
defineExpose(exposed)

/**
 * 扩展属性剥离：仅剔除与 v-model:value="inner" 受控写法冲突的通道字段
 * - modelValue：业务侧 v-model 字段，ant 不识别，必须剔除避免 ant 警告
 * - value / defaultValue / onUpdate:value：v-model:value 单点写入的数值通道，
 *   若同时透传会与下方 computed inner 的 get/set 冲突，必须由 inner 单点写入
 *
 * 关键：onChange / onInput 【不剥离】。两者是 ant Input 的「通知事件」（event），
 * 仅用于向业务回调「值已变化」，不是数值写入通道，与 v-model:value 不冲突。
 * ant-design-vue 把 onChange/onInput 定义为可选 listener prop，Vue 因此把
 * <TmInput @change="foo"> 路由到 props.onChange（而非 $attrs）。一旦剥离，
 * 业务回调将永远到不了内部 AInput —— 静默失败无报错，必须保留透传。
 *
 * 解构出的剥离项重命名为 _ 前缀以标记「故意未使用」（与 TmButton 剥离约定一致）
 */
const antProps = computed(() => {
  const {
    modelValue: _mv,
    value: _v,
    defaultValue: _dv,
    'onUpdate:value': _ouv,
    ...rest
  } = props
  return rest
})

/**
 * 合并透传对象：$attrs（class/style/id/外部监听器/data-* 等）+ antProps（已剥离 v-model 冲突项）
 * Vue 模板不支持同一元素写两个 v-bind，因此预先合并为单个对象
 * 顺序：antProps 覆盖 $attrs——同名时受控 props 优先，保证 v-model 桥接不被外部 attrs 覆盖
 * （$attrs 与 props 同源于父组件，正常使用很少重叠；该优先级仅作受控写法的兜底保护）
 */
const forwardBindings = computed(() => ({
  ...$attrs,
  ...antProps.value,
}))

/**
 * v-model 双向桥接：用 computed get/set 实现 ant v-model:value 与业务 v-model(modelValue) 的转换
 * - get：父组件传入的 modelValue → 写入 AInput 的 value（parent→child）
 * - set：AInput 通过 v-model:value 触发 set → emit update:modelValue（child→parent）
 *
 * 类型说明（vue-tsc 修复）：
 * - 类型参数显式标注 `string | number | undefined`：modelValue 类型含 undefined（未传/置空），
 *   如实反映 ant Input 接收到 undefined 时的真实行为，不应用 cast 掩盖。
 * - setter 参数同样声明 `string | number | undefined`：与类型参数一致，
 *   满足 WritableComputedOptions 的 setter 签名（参数类型必须包含 undefined）。
 * - 写入 emit 时用 `v ?? ''` 归一化：当 vxe/ant 在 clear 等场景传入 undefined 时，
 *   落到业务侧的 update:modelValue 仍是 string，保持 TmInputExtProps.modelValue 的对外契约不变。
 */
const inner = computed<string | number | undefined>({
  get: () => props.modelValue,
  set: (v: string | number | undefined) => emit('update:modelValue', v ?? ''),
})
</script>

<template>
  <!--
    v-bind=forwardBindings 承载 $attrs 与已剥离 modelValue 的 ant 原生 props
    v-model:value="inner" 单点完成 value 写入与 update:value 监听（标准 Vue 受控写法）
  -->
  <AInput ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <!--
      动态透传全部插槽：prefix/suffix/addonBefore/addonAfter 等
      用 Object.keys($slots) 迭代字符串键（避免 vue-tsc TS7022 circular inference）
    -->
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AInput>
</template>
