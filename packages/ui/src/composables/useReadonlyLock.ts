// packages/ui/src/composables/useReadonlyLock.ts
// useReadonlyLock：弹层类表单控件的「只读锁」+ disabled 级联（公共 composable）
//
// 从 TmSelect 内联只读逻辑提炼（design.md 决策 1）：
// ant 的 DatePicker / Cascader / TreeSelect 等弹层控件无原生 readonly——仅设 readonly attr
// 不够，面板仍会响应点击打开。必须受控锁死：
//   open:false         → 弹层面板不可打开
//   allowClear:false   → 只读语义禁止清空值
//   showSearch:false   → 关掉内嵌搜索输入框（仅 searchable 控件，如 Select/TreeSelect）
// disabled 用 `??` 级联 FormContext：业务显式传优先，未传落空到 context。
//
// readonly 判定：OR 合并（安全优先）——业务显式传 readonly=true 或 TmForm context readonly=true
// 任一为真即只读；业务显式 readonly=false 不能解除表单级 readonly（与 disabled 的 `??` 覆盖语义不同）。
import { computed, type ComputedRef } from 'vue'
import type { FormContext } from '../components/form/src/composables/useFormContext'

/** useReadonlyLock 配置项 */
export interface UseReadonlyLockOptions {
  /** 控件是否含内嵌搜索输入框（Select/TreeSelect 有，DatePicker/Cascader 无） */
  searchable?: boolean
}

/**
 * 只读锁 + disabled 级联的输出：
 * - isReadonly：组件是否需要额外分支（如模板条件）时使用
 * - antProps：锁调整后的字段，直接并入 forwardBindings 覆盖透传对象
 */
export interface UseReadonlyLockReturn {
  isReadonly: ComputedRef<boolean>
  antProps: ComputedRef<{
    open?: boolean
    allowClear?: boolean
    showSearch?: boolean
    disabled?: boolean
    readonly?: boolean
  }>
}

/**
 * 弹层控件只读锁 + disabled 级联
 *
 * @param props 控件 props（仅读取锁相关字段：readonly/disabled/open/allowClear/showSearch）
 * @param formContext useFormContext() 返回值（无 TmForm 祖先时为 undefined，容错）
 * @param options 配置项（searchable 是否锁搜索框）
 * @returns {@link UseReadonlyLockReturn}
 */
export function useReadonlyLock(
  props: {
    readonly?: boolean
    disabled?: boolean
    open?: boolean
    allowClear?: boolean
    // 放宽接收：ant Select 的 showSearch 是 boolean，Cascader/TreeSelect 的可能是 ShowSearchType 对象
    showSearch?: boolean | object | ((...args: never[]) => unknown)
  },
  formContext: ComputedRef<FormContext> | undefined,
  options?: UseReadonlyLockOptions,
): UseReadonlyLockReturn {
  // readonly 判定：OR 合并（安全优先）——业务显式传 readonly=true 或 TmForm context readonly=true
  // 任一为真即只读。注意：业务显式 readonly=false 不能解除表单级 readonly（readonly 是「安全围栏」，
  // 与 disabled 的 `??` 覆盖语义不同）；若后续需要「业务可解除」，需改 `??` 并同步设计决策。
  const isReadonly = computed(
    () => props.readonly === true || formContext?.value?.readonly === true,
  )

  // 锁调整字段：readonly 时锁死交互，否则按业务透传
  // open 直透（非 `|| undefined`）：配合各控件 withDefaults 置 open: undefined——
  // 未传时 undefined 走 ant 内部管理（不受控），显式 open={false} 保留为受控关闭（修复 review MEDIUM #1）
  const antProps = computed(() => {
    const readonly = isReadonly.value
    return {
      open: readonly ? false : props.open,
      allowClear: readonly ? false : props.allowClear,
      // 仅 searchable 控件锁搜索输入框；readonly 时强制 false，否则回传业务值（ant 均接受 boolean/对象）
      ...(options?.searchable
        ? { showSearch: readonly ? false : (props.showSearch as boolean | undefined) }
        : {}),
      // disabled 级联：业务显式传优先，否则取 context（withDefaults 置 undefined 保证落空）
      disabled: props.disabled ?? formContext?.value?.disabled,
      // 透传 context readonly 作为 attr（ant 弹层控件无原生 readonly 时是无效果 attr，未来支持自动生效）
      readonly: formContext?.value?.readonly,
    }
  })

  return { isReadonly, antProps }
}
