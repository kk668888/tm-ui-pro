// packages/ui/src/components/qrcode/src/props.ts
// TmQRCode 类型定义：ant 原生 QRCodeProps
import type { QRCodeProps } from 'ant-design-vue'

/** TmQRCode = ant 原生 QRCodeProps */
export type TmQRCodeProps = QRCodeProps

// 类型透传：业务方可直接 import TmQRCodeProps / QRCodeProps
export type { QRCodeProps } from 'ant-design-vue'
