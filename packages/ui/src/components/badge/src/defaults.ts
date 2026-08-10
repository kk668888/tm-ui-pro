// packages/ui/src/components/badge/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// TmBadge 无需要强制兜底的公司默认——ant 原生 count/showZero/dot/overflowCount 已是合理语义。
// 注：类型用 `{} as const`（而非 Partial<BadgeProps>）——展开空对象时不引入 ant 的
// 带默认值的键，避免与 Vue withDefaults 的 InferDefaults 类型推断冲突（TS2345，见 basic 修复）。
export const tmBadgeDefaults = {} as const
