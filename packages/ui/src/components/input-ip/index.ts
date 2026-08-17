// packages/ui/src/components/input-ip/index.ts
// TmInputIp 出口：withInstall 附加 Vue 插件 install 方法
import InputIp from './src/InputIp.vue'
import { withInstall } from '../../utils/withInstall'

export const TmInputIp = withInstall(InputIp, 'TmInputIp')
export * from './src/props'
export default TmInputIp
