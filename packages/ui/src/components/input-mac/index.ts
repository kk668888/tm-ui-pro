// packages/ui/src/components/input-mac/index.ts
// TmInputMac 出口：withInstall 附加 Vue 插件 install 方法
import InputMac from './src/InputMac.vue'
import { withInstall } from '../../utils/withInstall'

export const TmInputMac = withInstall(InputMac, 'TmInputMac')
export * from './src/props'
export default TmInputMac