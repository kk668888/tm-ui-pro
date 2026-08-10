// packages/ui/src/components/radio-group/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// TmRadioGroup 无需要强制兜底的公司默认——ant 原生 size='default' / disabled=false 已是合理语义，
// 但 size 仅支持 'large' | 'default' | 'small'（无 Input/Select 的 'middle'），故不强改。
import type { RadioGroupProps } from 'ant-design-vue'

/** 公司默认 props 集合（当前为空：保持 ant 原生默认，仅作扩展预留） */
export const tmRadioGroupDefaults: Partial<RadioGroupProps> = {}
