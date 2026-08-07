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
import { computed, useAttrs, useSlots } from 'vue'
import { Select as ASelect, type SelectProps } from 'ant-design-vue'
import type { TmSelectProps } from './props'
import { tmSelectDefaults } from './defaults'
import { useRemoteSearch } from './composables/useRemoteSearch'
import { useApiLoader } from './composables/useApiLoader'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useFormContext } from '../../form/src/composables/useFormContext'

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
  api: undefined,
  resultMap: undefined,
  // 公司默认值兜底；业务显式传入同名 prop 时自动覆盖
  showSearch: tmSelectDefaults.showSearch,
  allowClear: tmSelectDefaults.allowClear,
  // bordered / showArrow / virtual / autoClearSearchValue / defaultActiveFirstOption:
  // 关键默认（2026-08-06）——根因与 TmInput 完全一致：
  // 类型化 defineProps 把 antd Boolean 属性（默认 true）生成 Boolean 运行时 prop、
  // 未传时默认 false，覆盖 antd 的 `prop = true` 解构兜底。
  // 必须在 withDefaults 显式兜底为 true；业务显式传 false 仍可覆盖。
  bordered: tmSelectDefaults.bordered,
  showArrow: tmSelectDefaults.showArrow,
  virtual: tmSelectDefaults.virtual,
  autoClearSearchValue: tmSelectDefaults.autoClearSearchValue,
  defaultActiveFirstOption: tmSelectDefaults.defaultActiveFirstOption,
  // 公司扩展默认：搜索体验（2026-08-06 新增 api 数据源）
  // fieldNames 默认 undefined（ant 原生 prop），映射时由 mapApiResponse 内部兜底 'label'/'value'
  debounce: tmSelectDefaults.debounce,
  minLength: tmSelectDefaults.minLength,
  // disabled 级联（v2）：类型化 defineProps 把 Boolean 属性默认 false，
  // 导致「未传」被识别成 false，`false ?? formContext?.disabled` 永远不落空，
  // TmForm 级联失效。withDefaults 显式置 undefined，区分「未传」→ 可落空到 context。
  // （readonly 不在 ant SelectProps 中——ant Select 运行时完全不处理 readonly，
  //  无需在此声明；Select 的 readonly 级联仅透传为无效果 attr，见 antProps 注释。）
  disabled: undefined,
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

/** 注入祖先 TmForm 联动上下文（无祖先时返回 undefined，不影响独立使用） */
const formContext = useFormContext()

// slot keys 显式抽出并断言为 string[]：让 vue-tsc/vite:dts 双路径对 v-for + 动态 #[name]
// 不再触发 TS7022 circular inference（T14 收口 2）。
// useSlots() 拿到响应式 slots 对象；Object.keys 一次性快照（slot 集合在 mount 后稳定，无需响应式）。
const slotNames = Object.keys(useSlots()) as string[]

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

// api 挂载加载控制器：挂载时调 api({}) 获取初始列表并映射为 options（获取数据模式）
const { options: apiOptions, loading: apiLoading } = useApiLoader(
  () => props.api,
  { fieldNames: props.fieldNames, resultMap: props.resultMap },
)

// 远程搜索控制器：options（拉取结果）/ loading（请求状态）/ search（取数入口）/ currentQuery（搜索词）
const {
  options: remoteOptions,
  loading: loadingState,
  currentQuery,
  search,
} = useRemoteSearch(
  () => props.remote,
  // 搜索体验配置：防抖 + 最小输入长度（仅 remote 模式生效）
  { debounce: props.debounce, minLength: props.minLength },
)

// searchActive：remote 模式且输入达到 minLength → 判定为「激活搜索」，渲染 searchResult 临时覆盖
const searchActive = computed(
  () => props.remote !== undefined && currentQuery.value.length >= props.minLength,
)

// baseOptions：api 模式用 api 挂载结果，否则本地业务 options（搜索未激活时的常驻列表）
// 兜底为空数组，保证传给 ant 的 options 恒为数组（避免 undefined 下发）
const baseOptions = computed(() =>
  props.api !== undefined ? apiOptions.value : (props.options ?? []),
)

/**
 * 合并后的 options（三态）：
 * - 搜索激活：用 remoteOptions（searchResult，临时覆盖 baseOptions）
 * - 搜索未激活：回退 baseOptions（api 初始列表 或 本地 options）
 * api 与 remote 写入不同槽位，互不覆盖；单点写入避免双重下发。
 */
const mergedOptions = computed(() =>
  searchActive.value ? remoteOptions.value : baseOptions.value,
)

/**
 * 扩展属性剥离：仅剔除 ant 不识别的扩展键 + 与 v-model:value 冲突的数值通道
 * - remote / modelValue / api / resultMap / debounce / minLength：公司扩展键，
 *   ant 不识别，必须剔除避免 ant 警告
 * - value / defaultValue / onUpdate:value：v-model:value="inner" 单点写入的数值通道，
 *   若同时透传会与 computed inner 冲突，必须由 inner 单点写入
 * - options / loading / filterOption：单点重新写入（见下方），先剥离避免重复键
 *
 * 注意：fieldNames 是 ant Select 原生 prop（选项字段映射），【不剥离】——
 * 它同时被 mapApiResponse 用于响应字段映射，且透传给 ASelect 控制选项渲染，语义协调。
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
    api: _api,
    resultMap: _rm,
    debounce: _db,
    minLength: _ml,
    value: _v,
    defaultValue: _dv,
    options: _o,
    loading: _l,
    filterOption: _fo,
    'onUpdate:value': _ouv,
    open: _open,
    ...rest
  } = props
  const isReadonly = formContext?.value?.readonly === true
  return {
    ...rest,
    // 单点写入 options：远程模式用 remoteOptions，本地模式用业务 options
    options: mergedOptions.value,
    // loading 合并：业务 loading ∪ 远程搜索 loading ∪ api 挂载 loading，避免任一来源被覆盖
    loading: Boolean(props.loading) || loadingState.value || apiLoading.value,
    // filterOption 自适应：业务显式传入则尊重；否则本地模式启用 ant 内置过滤、远程模式禁用（服务端过滤）
    filterOption: props.filterOption ?? (props.remote !== undefined ? false : true),
    // open 受控：readonly 时强制 false（ant Select 的 open 是受控 prop，BaseSelect 内部
    // open 恒等于 props.open，传 false 后用户点击无法打开下拉——实现「只读不可下拉」）；
    // 非 readonly 时仅业务显式传 true 才下发受控打开，false/未传置 undefined 走 ant 内部管理
    open: isReadonly ? false : props.open || undefined,
    // allowClear：readonly 时不显示清除按钮（只读语义禁止清空值）；非 readonly 走业务/默认
    allowClear: isReadonly ? false : rest.allowClear,
    // FormContext 级联：业务显式传优先；否则取 TmForm context；两者皆无走 ant 默认
    disabled: rest.disabled ?? formContext?.value?.disabled,
    // readonly 非 ant Select 声明 prop（ant Select 运行时只认 disabled 与受控 open），
    // 此处仅透传 context 值作为无效果 attr（未来 ant 支持时自动生效），业务无法显式覆盖
    readonly: formContext?.value?.readonly,
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
  if (props.remote !== undefined) void search(query)
}
</script>

<template>
  <!--
    v-bind="forwardBindings" 承载 $attrs 与已剥离 modelValue/remote 的 ant 原生 props（单一 v-bind）
    v-model:value="inner" 单点完成 value 写入与 update:value 监听（标准 Vue 受控写法）
    @search="onSearch" 内部驱动远程取数；业务的 @search 监听器经 forwardBindings 透传，由 mergeProps 合并共存
  -->
  <ASelect ref="innerRef" v-bind="forwardBindings" v-model:value="inner" @search="onSearch">
    <!--
      动态透传全部插槽：default/placeholder/notFoundContent/clearIcon/...
      用 Object.keys($slots) 迭代字符串键（避免 vue-tsc TS7022 circular inference）
    -->
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ASelect>
</template>
