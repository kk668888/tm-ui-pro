// packages/ui/src/components/form/src/composables/useFormContext.ts
// TmForm ↔ TmFormItem 联动上下文：provide/inject 通道
//
// 设计要点：
// - v2 扩展：FormContext 从空占位升级为承载 submitting / readonly / disabled 的联动上下文。
//   providing 侧（TmForm）用 computed 下发，consuming 侧（TmFormItem / TmInput / TmSelect）
//   通过 inject 拿到 ComputedRef<FormContext>，响应式追踪最新 props 值。
// - useFormContext() 用 inject(FORM_KEY, undefined)：在无 TmForm 祖先时返回 undefined，
//   不报错也不影响渲染（独立使用控件的容错场景）。
// - TmForm/TmFormItem 是 ant Form/FormItem 的纯薄封装，内部 ant Form↔FormItem 的真实联动
//   由 ant 自身的 provide/inject 通道维护，本通道仅用于「公司层扩展」，两者互不干扰。
import { inject, provide, type InjectionKey, type ComputedRef } from 'vue'

/**
 * Form 与 FormItem / 表单控件间联动上下文（v2 扩展）
 *
 * - submitting：提交 loading 态，TmFormItem slot props 暴露给按钮区（防止重复提交）
 * - readonly：全局只读模式，TmInput/TmSelect inject 后自动合并到自身 prop（业务显式传优先）
 * - disabled：全局禁用模式，行为同 readonly
 */
export interface FormContext {
  submitting?: boolean
  readonly?: boolean
  disabled?: boolean
}

/** TmForm → 后代组件的联动注入键（Symbol 保证隔离） */
export const FORM_KEY: InjectionKey<ComputedRef<FormContext>> = Symbol('TmForm')

/**
 * Form 组件向后代提供联动上下文（v2：接收 ComputedRef 保证响应式）
 *
 * @param ctx computed ref，内含 submitting / readonly / disabled
 */
export function provideForm(ctx: ComputedRef<FormContext>): void {
  provide(FORM_KEY, ctx)
}

/**
 * 后代组件注入联动上下文
 *
 * @returns ComputedRef<FormContext>；无 TmForm 祖先时返回 undefined（容错）
 */
export function useFormContext(): ComputedRef<FormContext> | undefined {
  return inject(FORM_KEY, undefined)
}
