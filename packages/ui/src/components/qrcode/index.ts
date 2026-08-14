// packages/ui/src/components/qrcode/index.ts
// TmQRCode 出口：withInstall 附加 Vue 插件 install 方法
import QRCode from './src/QRCode.vue'
import { withInstall } from '../../utils/withInstall'

export const TmQRCode = withInstall(QRCode, 'TmQRCode')
// 类型再导出：业务方可直接 import { TmQRCodeProps, QRCodeProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmQRCode
