// packages/ui/src/components/steps/index.ts
// TmSteps 出口：TmSteps / TmStep 多子组件模块
import Steps from './src/Steps.vue'
import Step from './src/Step.vue'
import { withInstall } from '../../utils/withInstall'

export const TmSteps = withInstall(Steps, 'TmSteps')
export const TmStep = withInstall(Step, 'TmStep')

// 类型透传：业务方可直接 import { StepsProps, StepProps, TmStepsProps, ... } from '@tm/ui'
export type { StepsProps, StepProps } from 'ant-design-vue'
export type { TmStepsProps, TmStepProps } from './src/props'

export default { TmSteps, TmStep }
