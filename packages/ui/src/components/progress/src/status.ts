/** 映射表的业务键（用于类型收窄） */
export type ProgressStatusKey = 'success' | 'processing' | 'failed' | 'warning'

/** 映射值：ant status（+ warning 追加 strokeColor 兜底） */
interface ProgressStatusMapValue {
  status: 'success' | 'active' | 'exception' | 'normal'
  strokeColor?: string
}

/**
 * TmProgress 业务 status → ant Progress 展示映射
 *
 * ant Progress 原生 status 值域为 success / exception / normal / active，与共享业务语义
 * （success / processing / failed / warning，见 constants/status.ts）不一致。这里建立
 * TmProgress 独立映射：业务 status 命中的映射为 ant status（warning 追加 strokeColor 兜底，
 * 因 ant 无 warning 状态且 strokeColor 需 CSS 颜色值，此处为 ant 默认 warning 色 #faad14）。
 * ant 原生值（active / normal 等）不在映射表中，走原样透传。
 */
export const PROGRESS_STATUS_MAP: Record<ProgressStatusKey, ProgressStatusMapValue> = {
  success: { status: 'success' },
  processing: { status: 'active' },
  failed: { status: 'exception' },
  warning: { status: 'normal', strokeColor: '#faad14' },
}
