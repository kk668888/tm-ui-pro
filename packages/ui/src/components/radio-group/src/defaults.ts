// packages/ui/src/components/radio-group/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// TmRadioGroup 无需要强制兜底的公司默认——ant 原生 size='default' / disabled=false 已是合理语义，
// 且 size 仅支持 'large' | 'default' | 'small'（无 Input/Select 的 'middle'），故不强改。
// 注：类型用 `{} as const`（而非 Partial<RadioGroupProps>）——展开空对象时不引入 ant 的
// options 等带默认值的键，避免与 Vue withDefaults 的 InferDefaults 类型推断冲突（TS2345）。
export const tmRadioGroupDefaults = {} as const
