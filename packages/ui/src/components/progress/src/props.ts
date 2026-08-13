// packages/ui/src/components/progress/src/props.ts
// TmProgress 类型定义：ant ProgressProps，status 放宽为业务语义 + ant 原生值
import type { ProgressProps } from 'ant-design-vue'

/** 业务状态值域（与 TmTag / TmAlert 共享语义）+ ant 原生值域（success/exception/normal/active） */
export type TmProgressStatus =
  | 'success'
  | 'processing'
  | 'failed'
  | 'warning'
  | 'normal'
  | 'active'
  | 'exception'

/**
 * TmProgress = ant ProgressProps，status 覆盖为 TmProgressStatus
 * 说明：ant 原生 status 值域较窄，业务语义（processing/failed/warning）需经 src/status.ts 映射；
 * ant 原生值（active/normal/exception）走原样透传。
 */
export type TmProgressProps = Omit<ProgressProps, 'status'> & { status?: TmProgressStatus }

// 类型透传：业务方可直接 import TmProgressProps / ProgressProps
export type { ProgressProps } from 'ant-design-vue'
