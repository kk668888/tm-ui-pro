<!-- packages/ui/src/components/select/src/Select.vue -->
<!--
  TmSelect 范本组件：薄封装 + remote 远程搜索扩展
  核心机制（沿用 TmButton/TmInput 已确立的封装模式）：
  1. v-model 桥接：业务侧用标准 v-model（modelValue），内部映射到 ant Select 的 v-model:value
     - parent→child：props.modelValue 经 computed get 写入 ASelect 的 value
     - child→parent：ASelect 触发 update:value 时，computed set emit update:modelValue
  2. 扩展属性剥离：remote/modelValue 不被 ant 识别，必须从透传对象剔除；
     value/defaultValue/onUpdate:value 由 v-model:value 单点写入，必须剥离避免冲突
  3. remote 远程搜索：传入 remote 时，模板 @search 自动驱动 useRemoteSearch 取数并填充 options
  4. $attrs 透传：inheritAttrs:false + 手动合并到 forwardBindings（单一 v-bind）
  5. slots 透传：v-for $slots 动态转发全部插槽
  6. 方法透传：useForwardRef 把 ASelect 实例的 focus/blur 等方法代理给父组件 ref
  7. 公司默认值：showSearch / allowClear 兜底；filterOption 按 remote 模式自适应
-->
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Select as ASelect, type SelectProps } from 'ant-design-vue'
import type { TmSelectProps } from './props'
import { tmSelectDefaults } from './defaults'
import { useRemoteSearch } from './composables/useRemoteSearch'
import { useForwardRef } from '../../../composables/useForwardRef'

/**
 * ant Select 实例类型
 * 注：ant-design-vue 4.2.6 未导出 SelectInstance（与 InputInstance 同款问题），
 * 使用 Vue 标准的 InstanceType<typeof ASelect> 推导，确保方法透传类型正确
 */
type SelectInstance = InstanceType<typeof ASelect>

// name 用于全局注册与 devtools 识别；inheritAttrs:false 关闭自动透传，改为手动 $attrs 合并
defineOptions({ name: 'TmSelect', inheritAttrs: false })

/**
 * 组件 props：TmSelectProps = SelectProps（ant 原生）+ { modelValue?, remote? }（公司扩展）
 *
 * 设计要点：
 * - 业务方使用 TmSelect 时，IDE 同时提示 ant 原生属性（options/placeholder/size/...）
 *   与公司扩展 modelValue/remote，开发体验等同于直接写 <ASelect>。
 * - modelValue 与 ant 的 value 经下方 computed get/set 桥接，业务侧用标准 v-model 即可。
 */
const props = withDefaults(defineProps<TmSelectProps>(), {
  // undefined 表示「未传」，交给 ant 内部处理
  modelValue: undefined,
  remote: undefined,
  // 公司默认值兜底；业务显式传入同名 prop 时自动覆盖
  showSearch: tmSelectDefaults.showSearch,
  allowClear: tmSelectDefaults.allowClear,
})

/**
 * v-model 桥接事件
 * 由 computed setter 在 v-model:value 中转换发回，业务侧监听 update:modelValue
 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: SelectProps['value']): void
}>()

// inheritAttrs:false 下需手动取 $attrs；useAttrs 显式拿到外部透传对象
const $attrs = useAttrs()

/**
 * 方法透传：父组件通过 ref 可调用 focus/blur/scrollTo 等任意 ant Select 实例方法
 * - innerRef：绑定到内部 <ASelect ref="innerRef">，挂载后由 Vue 自动填充 ASelect 实例
 * - exposed：Proxy 代理对象，运行时把任意 key 转发到 innerRef.value[key]
 * - defineExpose：把 exposed 注册为父组件 ref 能拿到的对外接口
 *
 * 关键（plan-bug #4 处理）：直接 defineExpose(exposed) 暴露 Proxy 做方法透传，
 * 不使用 defineExpose({ ...exposed, search })——后者会 spread Proxy，
 * 因 useForwardRef 的 Proxy 未实现 ownKeys/getOwnPropertyDescriptor trap，
 * spread 出来是空对象，导致 ant Select 方法（focus/blur 等）透传全部丢失。
 * search 扩展不暴露给 wrapper.vm，改为模板 @search="onSearch" 内部自动驱动。
 */
const { innerRef, exposed } = useForwardRef<SelectInstance>()
defineExpose(exposed)

// 远程搜索控制器：options（拉取结果）/ loading（请求状态）/ search（取数入口）
const { options: remoteOptions, loading: loadingState, search } = useRemoteSearch(
  () => props.remote,
)

/**
 * 合并后的 options：远程模式用 remoteOptions（由 search 填充），
 * 本地模式原样透传业务传入的 options。单点写入避免双重下发。
 */
const mergedOptions = computed(() =>
  props.remote ? remoteOptions.value : props.options,
)

/**
 * 扩展属性剥离：仅剔除 ant 不识别的扩展键 + 与 v-model:value 冲突的数值通道
 * - remote / modelValue：公司扩展键，ant 不识别，必须剔除避免 ant 警告
 * - value / defaultValue / onUpdate:value：v-model:value="inner" 单点写入的数值通道，
 *   若同时透传会与 computed inner 冲突，必须由 inner 单点写入
 * - options / loading / filterOption：单点重新写入（见下方），先剥离避免重复键
 *
 * 关键：onSearch / onChange 等【通知事件不剥离】。它们是 ant Select 的「通知事件」，
 * 仅用于向业务回调「值/搜索已变化」，不是数值写入通道，与 v-model:value 不冲突。
 * ant-design-vue 把 onSearch/onChange 定义为可选 listener prop，Vue 因此把
 * <TmSelect @search="foo"> 路由到 props.onSearch（而非 $attrs）。一旦剥离，回调静默失败。
 *
 * 解构出的剥离项重命名为 _ 前缀以标记「故意未使用」（与 TmButton/TmInput 剥离约定一致）
 */
const antProps = computed(() => {
  const {
    remote: _r,
    modelValue: _mv,
    value: _v,
    defaultValue: _dv,
    options: _o,
    loading: _l,
    filterOption: _fo,
    'onUpdate:value': _ouv,
    ...rest
  } = props
  return {
    ...rest,
    // 单点写入 options：远程模式用 remoteOptions，本地模式用业务 options
    options: mergedOptions.value,
    // loading 合并：业务 loading ∪ 远程搜索 loading，避免任一来源被覆盖
    loading: Boolean(props.loading) || loadingState.value,
    // filterOption 自适应：业务显式传入则尊重；否则本地模式启用 ant 内置过滤、远程模式禁用（服务端过滤）
    filterOption: props.filterOption ?? (props.remote ? false : true),
  }
})

/**
 * 合并透传对象：$attrs（class/style/id/外部监听器/data-* 等）+ antProps（已剥离冲突项）
 * Vue 模板不支持同一元素写两个 v-bind，因此预先合并为单个对象（plan-bug #1 修正）。
 * 顺序：antProps 覆盖 $attrs——同名时受控 props 优先，保证 v-model 桥接不被外部 attrs 覆盖
 */
const forwardBindings = computed(() => ({
  ...$attrs,
  ...antProps.value,
}))

/**
 * v-model 双向桥接：computed get/set 实现 ant v-model:value 与业务 v-model(modelValue) 的转换
 * - get：父组件传入的 modelValue → 写入 ASelect 的 value（parent→child）
 * - set：ASelect 通过 v-model:value 触发 set → emit update:modelValue（child→parent）
 *
 * 类型直接复用 SelectProps['value']（ant SelectValue），与 ant 的 v-model:value 两侧完全一致，
 * 兼容单选（RawValue）、多选（RawValue[]）、labelInValue（LabeledValue）等模式
 */
const inner = computed<SelectProps['value']>({
  get: () => props.modelValue,
  set: (v: SelectProps['value']) => emit('update:modelValue', v),
})

/**
 * 内部 search 事件处理：仅在配置了 remote 时触发 useRemoteSearch 取数
 * 与业务的 onSearch 监听器互不干扰——Vue 3 的 mergeProps 会把 v-bind 透传的 onSearch
 * 与模板 @search="onSearch" 合并为监听器数组，两者按序都被调用
 */
const onSearch = (query: string): void => {
  if (props.remote) void search(query)
}
</script>

<template>
  <!--
    v-bind="forwardBindings" 承载 $attrs 与已剥离 modelValue/remote 的 ant 原生 props（单一 v-bind）
    v-model:value="inner" 单点完成 value 写入与 update:value 监听（标准 Vue 受控写法）
    @search="onSearch" 内部驱动远程取数；业务的 @search 监听器经 forwardBindings 透传，由 mergeProps 合并共存
  -->
  <ASelect ref="innerRef" v-bind="forwardBindings" v-model:value="inner" @search="onSearch">
    <!-- 动态透传全部插槽：default/placeholder/notFoundContent/clearIcon/... -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ASelect>
</template>
