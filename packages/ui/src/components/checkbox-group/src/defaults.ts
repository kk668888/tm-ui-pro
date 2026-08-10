// packages/ui/src/components/checkbox-group/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// TmCheckboxGroup 无需要强制兜底的公司默认——ant 原生 disabled=false 已是合理语义。
import type { CheckboxGroupProps } from 'ant-design-vue'

/** 公司默认 props 集合（当前为空：保持 ant 原生默认，仅作扩展预留） */
export const tmCheckboxGroupDefaults: Partial<CheckboxGroupProps> = {}
