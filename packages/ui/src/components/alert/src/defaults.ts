// packages/ui/src/components/alert/src/defaults.ts
// 公司默认配置：status 状态 → ant Alert 语义类型映射
//
// 说明：ant Alert 的 type 空间为 success/info/warning/error（无 processing），
// 故与 TmTag（color 空间含 processing）映射表不同——此处将 processing 归一到 info。

/**
 * status 状态 → ant Alert 语义类型 映射
 * 与 TmTag 复用同一 status 枚举（StatusValue），仅目标语义类型空间不同：
 * - success → success
 * - processing → info（ant Alert 无 processing，归一到 info）
 * - failed → error（ant 命名差异，显式映射）
 * - warning → warning
 */
export const ALERT_STATUS_TYPE = {
  success: 'success',
  processing: 'info',
  failed: 'error',
  warning: 'warning',
} as const
