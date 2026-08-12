// packages/ui/src/components/radio/index.ts
// TmRadio 出口：withInstall 附加 Vue 插件 install 方法
// 注意：本目录为「单 Radio」，与既有 radio-group 目录并列；组场景用 TmRadioGroup。
import Radio from './src/Radio.vue'
import { withInstall } from '../../utils/withInstall'

export const TmRadio = withInstall(Radio, 'TmRadio')
// 类型再导出：业务方可直接 import { TmRadioProps, RadioProps } from '@tm/ui'
export * from './src/props'
export default TmRadio
