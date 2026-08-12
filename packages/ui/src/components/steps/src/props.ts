// packages/ui/src/components/steps/src/props.ts
// TmSteps 类型定义：ant 原生 StepsProps / StepProps（无公司扩展键）
import type { StepsProps } from 'ant-design-vue'
import type { StepProps } from 'ant-design-vue'

/** TmSteps = ant 原生 StepsProps */
export type TmStepsProps = StepsProps

/** TmStep = ant 原生 StepProps */
export type TmStepProps = StepProps

// 类型透传
export type { StepsProps, StepProps } from 'ant-design-vue'
