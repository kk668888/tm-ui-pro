// packages/ui/src/components/alert/index.ts
// TmAlert 出口：withInstall 附加 Vue 插件 install 方法
import Alert from './src/Alert.vue'
import { withInstall } from '../../utils/withInstall'

export const TmAlert = withInstall(Alert, 'TmAlert')
// 类型再导出：业务方可直接 import { TmAlertProps, AlertProps } from '@tm/ui'
export * from './src/props'
export default TmAlert
