// packages/ui/src/components/transfer/index.ts
// TmTransfer 出口：withInstall 附加 Vue 插件 install 方法
import Transfer from './src/Transfer.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTransfer = withInstall(Transfer, 'TmTransfer')
// 类型再导出：业务方可直接 import { TmTransferProps, TransferProps } from '@tm/ui'
export * from './src/props'
export default TmTransfer
