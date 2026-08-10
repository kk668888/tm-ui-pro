// packages/ui/src/components/switch/index.ts
// TmSwitch 出口：withInstall 附加 Vue 插件 install 方法
import Switch from './src/Switch.vue'
import { withInstall } from '../../utils/withInstall'

export const TmSwitch = withInstall(Switch, 'TmSwitch')
// 类型再导出：业务方可直接 import { TmSwitchProps, SwitchProps } from '@tm/ui'
export * from './src/props'
export default TmSwitch
