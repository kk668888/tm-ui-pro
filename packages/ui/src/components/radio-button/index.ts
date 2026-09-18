// packages/ui/src/components/radio-button/index.ts
// TmRadioButton 出口：通过 withInstall 附加 Vue 插件 install 方法
// 注意：本目录为「按钮态单选值单元」，与 radio（单选框）/ radio-group（单选组）并列
import RadioButton from './src/RadioButton.vue'
import { withInstall } from '../../utils/withInstall'

export const TmRadioButton = withInstall(RadioButton, 'TmRadioButton')
// 类型再导出：业务方可直接 import { TmRadioButtonProps, RadioProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmRadioButton
