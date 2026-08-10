// packages/ui/src/components/checkbox-group/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// TmCheckboxGroup 无需要强制兜底的公司默认——ant 原生 disabled=false 已是合理语义。
// 注：类型用 `{} as const`（而非 Partial<CheckboxGroupProps>）——展开空对象时不引入 ant 的
// options 等带默认值的键，避免与 Vue withDefaults 的 InferDefaults 类型推断冲突（TS2345）。
export const tmCheckboxGroupDefaults = {} as const
