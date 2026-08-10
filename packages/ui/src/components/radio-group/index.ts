// packages/ui/src/components/radio-group/index.ts
// TmRadioGroup 出口：withInstall 附加 Vue 插件 install 方法
import RadioGroup from './src/RadioGroup.vue'
import { withInstall } from '../../utils/withInstall'

export const TmRadioGroup = withInstall(RadioGroup, 'TmRadioGroup')
// 类型再导出：业务方可直接 import { TmRadioGroupProps, RadioGroupProps } from '@tm/ui'
export * from './src/props'
export default TmRadioGroup
