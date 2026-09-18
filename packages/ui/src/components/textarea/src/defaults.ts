// packages/ui/src/components/textarea/src/defaults.ts
// 公司默认 props：仅复用与 Textarea 语义相符的 TmInput 默认键
// 注：不复用 size——ant Textarea 无 size prop（多行文本域无三档尺寸），兜底会透传无效属性
import type { TextAreaProps } from 'ant-design-vue'
import { tmInputDefaults } from '../../input/src/defaults'

/**
 * TmTextarea 公司默认值集合
 * - allowClear: true —— Boolean 幻影 false 陷阱（见 input/defaults.ts），显式兜底
 * - bordered: true —— 同上（2026-08-06 修复的通用教训）
 */
export const tmTextareaDefaults: Partial<TextAreaProps> = {
  allowClear: tmInputDefaults.allowClear,
  bordered: tmInputDefaults.bordered,
}
