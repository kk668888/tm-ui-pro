// packages/ui/src/components/table/src/defaults.ts
// 公司默认表格配置：与设计规范对齐（边框 + 斑马纹 + 内容溢出 tooltip + 分页 10/20/50）
//
// 设计原则：业务可通过显式同名 prop 覆盖任一默认值；withDefaults 在 Table.vue 中应用。
export const tmTableDefaults = {
  /** 边框：启用整表边框 */
  border: true,
  /**
   * 表头：默认显示
   * vxe 的 showHeader 默认取全局 getConfig().table.showHeader，运行时该值可能为 undefined
   * （vxe-pc-ui 与 vxe-table 共享 @vxe-ui/core 的 globalConfig，合并 / import 顺序副作用），
   * 导致 vxe-grid 的 computeTableExtendProps 因 props[key]!==undefined 跳过、不下发 showHeader，
   * vxe-table 随之加 not--header class 隐藏表头。公司默认显式 true，避免依赖全局副作用。
   */
  showHeader: true,
  /** 斑马纹：奇偶行交替底色，提升可读性 */
  stripe: false,
  /** 内容溢出处理：超长文本以 tooltip 展示完整内容，避免破坏列宽 */
  showOverflow: true,
  /**
   * 列宽是否自动铺满容器：vxe 的 fit 开关（默认 true，全局 config 为 true，但该 prop 默认值
   * 在运行时被解析为 false，需显式下发，否则未设 width 的列只按内容宽渲染、不撑满）
   * 业务显式传 fit: false 可恢复「按列内容宽度」渲染
   */
  fit: true,
  /** 分页器：默认显示；业务传 false 隐藏（纯展示静态表格 / API 文档属性表） */
  pagination: true,
  /** 分页配置：首页 10 条，可切换 10/20/50 */
  pagerConfig: { pageSize: 10, pageSizes: [10, 20, 50] },
  /**
   * 密度 → vxe row-config.height 映射（与 ant Table 三档行高对齐，见 design D5）
   * 业务显式传 row-config.height 时优先于 density
   */
  densityHeight: { compact: 36, default: 48, loose: 56 } as const,
  /** search 扩展键的表单按钮文案 */
  searchButtonText: '查询',
  resetButtonText: '重置'
} as const

