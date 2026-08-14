<!-- packages/ui/src/components/form/src/Form.vue -->
<!--
  TmForm 范本组件：ant Form 的纯薄封装 + provide/inject 联动通道 + 变更追踪

  核心机制（v2 扩展）：
  1. props 透传：ant Form 原生 props（layout/colon/hideRequiredMark/model/...）原样下发
  2. $attrs 透传：inheritAttrs:false + 手动合并到 forwardBindings（单一 v-bind）
  3. slots 透传：v-for $slots 动态转发全部插槽
  4. 方法透传：useForwardRef 把 ant Form 实例方法代理给父组件 ref
  5. v2 新增 — FormContext 联动通道：
     - submitting / readonly / disabled 经 computed provide 下发
     - TmFormItem slot props / TmInput / TmSelect 消费 context，实现级联只读/禁用
  6. v2 新增 — 变更追踪：
     - onMounted 自动快照 model 作为 initialValues
     - 暴露 isDirty() / getDirtyFields() / resetToInitial() / markInitial()
     - 供业务在「离开前确认保存」「提交后重置脏标记」等场景使用
  7. 公司默认值：layout=horizontal / hideRequiredMark=false 兜底，业务可覆盖
-->
<script setup lang="ts">
import { computed, onMounted, ref, useSlots } from 'vue'
import { Form as AForm, type FormInstance } from 'ant-design-vue'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { tmFormDefaults } from './defaults'
import type { TmFormProps } from './props'
import { provideForm, type FormContext } from './composables/useFormContext'

// name 用于全局注册与 devtools 识别；inheritAttrs:false 关闭自动透传
defineOptions({ name: 'TmForm', inheritAttrs: false })

/**
 * 组件 props：TmFormProps = ant FormProps + 公司扩展键（submitting/readonly/disabled，见 props.ts）
 * withDefaults 落地公司默认 layout/hideRequiredMark，扩展键默认 undefined（未传不生效）
 */
const props = withDefaults(defineProps<TmFormProps>(), {
  layout: tmFormDefaults.layout,
  hideRequiredMark: tmFormDefaults.hideRequiredMark,
  submitting: undefined,
  readonly: undefined,
  disabled: undefined,
})

const slotNames = Object.keys(useSlots()) as string[]

// ============================================================
// 方法透传 + 变更追踪方法合并暴露
// ============================================================

const { innerRef, exposed } = useForwardRef<FormInstance>()

/** 内部工具：JSON deep clone model 值 */
const snapshot = (): Record<string, unknown> => {
  const m = props.model ?? {}
  try {
    return JSON.parse(JSON.stringify(m)) as Record<string, unknown>
  } catch {
    // model 含不可序列化值（File/Date 等），降级为空对象
    return {}
  }
}

/**
 * 深克隆单个值（JSON 语义，与 snapshot 一致）。
 * resetToInitial 用它赋值，避免 model 与 initialSnapshot 共享嵌套引用
 * （共享引用会让「重置后再次修改 model」同时污染快照，dirty 判定失效）。
 */
const deepClone = (value: unknown): unknown => {
  try {
    return JSON.parse(JSON.stringify(value)) as unknown
  } catch {
    // 不可序列化值：保留原引用（与 snapshot 降级语义对齐）
    return value
  }
}

/** model 初始快照（onMounted 自动取一次，markInitial 手动更新） */
const initialSnapshot = ref<Record<string, unknown>>({})

onMounted(() => {
  initialSnapshot.value = snapshot()
})

/**
 * 深比较两个值（JSON 序列化语义，与 snapshot 的深克隆一致）。
 * 处理「快照深克隆 vs 比较浅比较」不一致 bug：model 含嵌套对象/数组时，
 * 浅比较（!==）会让 isDirty 永远为真（initial 与 current 引用恒不同），
 * 且 resetToInitial 无法复位。统一用深比较后，嵌套结构按内容判定。
 * 不可序列化值（Date/Blob 等）降级为引用比较（与 snapshot 降级语义对齐）。
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    // 含不可序列化值：回退引用比较
    return a === b
  }
}

/** 是否有任一字段值与初始值不同（深比较） */
const isDirty = (): boolean => {
  const current = (props.model ?? {}) as Record<string, unknown>
  const initial = initialSnapshot.value
  const allKeys = [...new Set([...Object.keys(initial), ...Object.keys(current)])]
  return allKeys.some((k) => !deepEqual(current[k], initial[k]))
}

/** 返回所有值已变更的字段名列表（深比较） */
const getDirtyFields = (): string[] => {
  const current = (props.model ?? {}) as Record<string, unknown>
  const initial = initialSnapshot.value
  const allKeys = [...new Set([...Object.keys(initial), ...Object.keys(current)])]
  return allKeys.filter((k) => !deepEqual(current[k], initial[k]))
}

/** 重置 model 到初始快照 + 清除校验状态 */
const resetToInitial = (): void => {
  const model = (props.model ?? {}) as Record<string, unknown>
  const initial = initialSnapshot.value
  // 逐字段深克隆赋值：不能 Object.assign(model, initial) 直接共享 initial 的嵌套引用，
  // 否则重置后再次修改 model 会同时污染快照（deepEqual 恒相等，dirty 判定失效）。
  for (const [key, value] of Object.entries(initial)) {
    model[key] = deepClone(value)
  }
  // 清除初始快照之后新增的字段
  for (const key of Object.keys(model)) {
    if (!(key in initial)) delete model[key]
  }
  // 联动清除 ant 校验错误
  innerRef.value?.clearValidate()
}

/** 手动标记当前 model 为「初始值」（编辑场景异步加载完数据后调用） */
const markInitial = (): void => {
  initialSnapshot.value = snapshot()
}

// 组合：自定义方法优先，未命中则透传到 ant Form 实例
const customMethods = { isDirty, getDirtyFields, resetToInitial, markInitial }
const formExposed = new Proxy(exposed as object, {
  get(target, key, receiver) {
    if (typeof key === 'string' && key in customMethods) {
      return customMethods[key as keyof typeof customMethods]
    }
    return Reflect.get(target, key, receiver)
  },
  has(target, key) {
    if (typeof key === 'string' && key in customMethods) return true
    return Reflect.has(target, key)
  },
})
defineExpose(formExposed)

// ============================================================
// FormContext 联动通道
// ============================================================

const formContext = computed<FormContext>(() => ({
  submitting: props.submitting,
  readonly: props.readonly,
  disabled: props.disabled,
}))
provideForm(formContext)

// ============================================================
// 透传合并（剥离公司扩展键，只把 ant 认识的 props 传给 AForm）
// ============================================================

// 扩展属性剥离：仅剔除纯公司扩展键（submitting/readonly），disabled 是 ant 原生 prop 保留透传
const antProps = computed(() => {
  const { submitting: _s, readonly: _r, ...rest } = props
  return rest
})

/** 透传对象：$attrs + 业务显式 props + 公司默认（layout/hideRequiredMark，见 useForwardBindings） */
const forwardBindings = useForwardBindings(antProps, ['layout', 'hideRequiredMark'])
</script>

<template>
  <AForm ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AForm>
</template>
