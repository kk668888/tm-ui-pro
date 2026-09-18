<!-- packages/ui/src/components/input-password/src/InputPassword.vue -->
<!--
  TmInputPassword：ant Input.Password 薄封装，逐机制对齐 TmInput 范本（见 input/src/Input.vue）
  核心机制（与 TmInput 同源，差异点见注释）：
  1. v-model 桥接：业务侧标准 v-model（modelValue），内部映射到 ant 的 v-model:value
  2. 扩展属性剥离：modelValue / value / defaultValue / onUpdate:value 四个值通道键剔除
     —— visible / onUpdate:visible 【不剥离】：本组件不代理该状态，业务显式传参经
     forwardBindings 原样到达 ant（未传走 ant 内部非受控，传了即受控显隐）
  3. $attrs 透传：inheritAttrs:false + useForwardBindings 手动合并
  4. slots 透传：v-for $slots 动态转发全部插槽（iconRender 单独适配，见下）
     —— 已知 ant 约束与适配：ant 以裸 boolean 调用 iconRender 插槽（iconRender(visible)），
     而模板 v-bind 转发 slot props 必须是对象（renderSlot 读 props.key 会崩），
     故 iconRender 排除出通用转发，单独包装为 { visible } 对象再转发业务，
     业务用法 #iconRender="{ visible }"（比 ant 原生裸 boolean 写法解构友好）
  5. 方法透传：useForwardRef 代理 ant 实例方法（ant Password 仅暴露 focus/blur）
  6. 公司默认值：allowClear / size / bordered 复用 TmInput 默认，visibilityToggle 兜底 true，
     readonly / disabled / visible 置 undefined 落空 FormContext / ant 非受控
  7. 已知 ant 原生限制：suffix 插槽不可用——Password 内部恒以 props.suffix（眼睛图标或 false）
     覆盖，false 也不会让位给 slots.suffix（?? 不触发默认值）；prefix / addon 插槽不受影响
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { InputPassword as AInputPassword } from 'ant-design-vue'
import type { TmInputPasswordProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmInputPasswordDefaults } from './defaults'

/**
 * ant InputPassword 实例类型
 * 注：ant-design-vue 未导出 InputPasswordInstance 类型，使用 Vue 标准的 InstanceType 推导
 * ant Password 仅 expose focus/blur（无 select），透传能力以 ant 实际暴露为准
 */
type InputPasswordInstance = InstanceType<typeof AInputPassword>

// name 用于全局注册与 devtools 识别；inheritAttrs:false 关闭自动透传，改为手动 $attrs 合并
defineOptions({ name: 'TmInputPassword', inheritAttrs: false })

const props = withDefaults(defineProps<TmInputPasswordProps>(), {
  // undefined 表示「未传」，由 ant 内部按 defaultValue 处理
  modelValue: undefined,
  // 公司默认值兜底（allowClear/size/bordered 与 TmInput 同源）；业务显式传入自动覆盖
  allowClear: tmInputPasswordDefaults.allowClear,
  size: tmInputPasswordDefaults.size,
  bordered: tmInputPasswordDefaults.bordered,
  // visibilityToggle: 幻影 false 兜底（见 defaults.ts 注释），业务显式 false 可覆盖
  visibilityToggle: tmInputPasswordDefaults.visibilityToggle,
  // readonly/disabled 级联（v2 范本）：显式置 undefined 区分「未传」→ 可落空到 context
  readonly: undefined,
  disabled: undefined,
  // visible: 显式置 undefined 保持「未传」语义 → ant 内部非受控状态
  visible: undefined,
})

/**
 * v-model 桥接事件
 * 由 computed setter 在 v-model:value 中转换发回，业务侧监听 update:modelValue
 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
}>()

/** 注入祖先 TmForm 联动上下文（无祖先时返回 undefined，不影响独立使用） */
const formContext = useFormContext()

// slot keys 显式抽出并断言为 string[]：让 vue-tsc/vite:dts 双路径对 v-for + 动态 #[name]
// 不再触发 TS7022 circular inference（与 TmInput 同源处理）
const slotNames = Object.keys(useSlots()) as string[]

/**
 * iconRender 不能走通用 v-bind 转发：ant 传给该插槽的 props 是裸 boolean（visible），
 * 模板 <slot v-bind> 编译为 renderSlot($slots, name, props)，props 必须是对象，
 * 传 boolean 直接崩溃（renderSlot 读 props.key）。单独包装为 { visible } 再转发。
 * 注意必须从 v-for 列表中【过滤掉】iconRender：编译产物里动态 v-for 项与静态
 * #iconRender 项会生成两个同名槽（createSlots），动态项的 v-if 空注释分支会
 * 覆盖静态转发分支，导致自定义图标静默丢失。
 */
const forwardSlotNames = slotNames.filter((name) => name !== 'iconRender')
const hasIconRenderSlot = slotNames.includes('iconRender')

/**
 * 方法透传：父组件通过 ref 可调用 ant Password 实例的 focus/blur 方法
 */
const { innerRef, exposed } = useForwardRef<InputPasswordInstance>()
defineExpose(exposed)

/**
 * 扩展属性剥离：仅剔除与 v-model:value="inner" 受控写法冲突的值通道字段
 * - modelValue：业务侧 v-model 字段，ant 不识别，必须剔除避免 ant 警告
 * - value / defaultValue / onUpdate:value：数值写入通道，由 inner 单点写入
 * - onChange / onInput 不剥离（通知事件非写入通道，与 TmInput 同源结论）
 */
const antProps = computed(() => {
  const {
    modelValue: _mv,
    value: _v,
    defaultValue: _dv,
    'onUpdate:value': _ouv,
    ...rest
  } = props
  // FormContext 级联：业务显式传优先；否则取 TmForm context；两者皆无走 ant 默认
  return {
    ...rest,
    readonly: rest.readonly ?? formContext?.value?.readonly,
    disabled: rest.disabled ?? formContext?.value?.disabled,
  }
})

/**
 * 透传对象：$attrs + 业务显式 props + 公司默认与级联合成键
 * visibilityToggle 列入 companyDefaults：withDefaults 兜底键必须显式转发，
 * 否则默认 true 会被 useForwardBindings 当作幻影值跳过、ant 收不到（默认静默失效）
 */
const forwardBindings = useForwardBindings(antProps, [
  'allowClear',
  'size',
  'bordered',
  'visibilityToggle',
  'readonly',
  'disabled',
])

/**
 * v-model 双向桥接：ant v-model:value 与业务 v-model(modelValue) 的转换
 * 写入 emit 时用 `v ?? ''` 归一化：清空等场景 ant 传入 undefined 时，
 * 业务侧仍收到 string 空串，保持 TmInputPasswordExtProps.modelValue 契约稳定
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
  <AInputPassword ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <!--
      iconRender 单独转发：业务 #iconRender="{ visible }" 拿到可见状态。
      外层 span 是点击载体——转发插槽返回的是 Fragment，ant 的 isValidElement 判真后
      会跳过自身的 span 包装，cloneElement 注入的 onClick 落在 Fragment 上不落 DOM，
      点击切换静默失效；包一层真实元素后 ant 对该 span 注入点击切换（冒泡自子内容触发）
    -->
    <template v-if="hasIconRenderSlot" #iconRender="visible">
      <span class="tm-input-password-icon-trigger"><slot name="iconRender" :visible="visible" /></span>
    </template>
    <!--
      其余插槽动态透传：prefix/addonBefore/addonAfter 等（iconRender 已过滤，见上方注释）
      注：ant 原生限制，suffix 插槽不可用（见文件头注 7），转发与否无效果
    -->
    <template v-for="name in forwardSlotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AInputPassword>
</template>
