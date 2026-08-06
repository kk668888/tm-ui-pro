// packages/ui/src/components/form/src/composables/useFormContext.ts
// TmForm ↔ TmFormItem 联动上下文：provide/inject 通道（v1 预留占位）
//
// 设计要点：
// - v1 FormContext 接口为空，仅作为「通道可用」的预留占位。
//   后续公司级联动（如统一字段通信、跨字段校验提示、字段元数据下发）将注入此处，
//   届时只需扩展 FormContext 接口，Form/FormItem 模板无需改动。
// - useFormContext() 用 inject(FORM_KEY, undefined)：FormItem 在无 TmForm 祖先时返回 undefined，
//   不报错也不影响渲染（独立使用 FormItem 的容错场景）。
// - TmForm/TmFormItem 是 ant Form/FormItem 的纯薄封装，内部 ant Form↔FormItem 的真实联动
//   由 ant 自身的 provide/inject 通道维护，本通道仅用于「公司层扩展」，两者互不干扰。
import { inject, provide, type InjectionKey } from 'vue'

/**
 * Form 与 FormItem 间联动上下文（v1 预留）
 *
 * 当前为空接口占位，保证 provide/inject 通道可用。
 * 后续承载公司级表单联动：字段通信、跨字段校验、字段元数据等。
 */
export interface FormContext {
  // 预留：公司级表单联动 / 字段通信将注入此处
}

/** TmForm → TmFormItem 联动的注入键（Symbol 保证隔离） */
export const FORM_KEY: InjectionKey<FormContext> = Symbol('TmForm')

/**
 * Form 组件向后代提供联动上下文
 *
 * @param ctx 当前仅占位（空对象），后续扩展公司级联动字段
 */
export function provideForm(ctx: FormContext): void {
  provide(FORM_KEY, ctx)
}

/**
 * FormItem 注入联动上下文（v1 占位，返回 undefined 也不影响渲染）
 *
 * @returns 祖先 TmForm 提供的 FormContext；无 TmForm 祖先时返回 undefined
 */
export function useFormContext(): FormContext | undefined {
  // 默认值显式传 undefined：避免 inject 在无 provider 时走 fallback 警告
  return inject(FORM_KEY, undefined)
}
