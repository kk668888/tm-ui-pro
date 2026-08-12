// packages/ui/src/components/transfer/src/props.ts
// TmTransfer 类型定义：ant 原生 TransferProps（公司默认 titles 在 defaults.ts 提供）
import type { TransferProps } from 'ant-design-vue'

/** TmTransfer = ant 原生 TransferProps */
export type TmTransferProps = TransferProps

// 类型透传：业务方可直接 import TmTransferProps / TransferProps
export type { TransferProps } from 'ant-design-vue'
