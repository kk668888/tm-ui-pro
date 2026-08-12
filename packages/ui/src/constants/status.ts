// packages/ui/src/constants/status.ts
// 共享语义色映射：业务 status 枚举 → ant 预设语义色
// TmTag / TmAlert 等「状态 → 语义色」组件复用此表，避免多组件维护同义映射漂移。
// 设计：直接映射 ant 预设色名（success/processing/error/warning），零自定义 CSS，随 ConfigProvider 主题联动。
export const STATUS_COLOR = {
  success: 'success',
  processing: 'processing',
  failed: 'error',
  warning: 'warning',
} as const

/** status 合法枚举值（用于类型收窄） */
export type StatusValue = keyof typeof STATUS_COLOR
