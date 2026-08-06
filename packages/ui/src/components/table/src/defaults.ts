// packages/ui/src/components/table/src/defaults.ts
// 公司默认表格配置：与设计规范对齐（边框 + 斑马纹 + 内容溢出 tooltip + 分页 10/20/50）
//
// 设计原则：业务可通过显式同名 prop 覆盖任一默认值；withDefaults 在 Table.vue 中应用。
export const tmTableDefaults = {
  /** 边框：启用整表边框 */
  border: true,
  /** 斑马纹：奇偶行交替底色，提升可读性 */
  stripe: true,
  /** 内容溢出处理：超长文本以 tooltip 展示完整内容，避免破坏列宽 */
  showOverflow: true,
  /** 分页配置：首页 10 条，可切换 10/20/50 */
  pagerConfig: { pageSize: 10, pageSizes: [10, 20, 50] },
} as const
