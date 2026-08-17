// packages/ui/src/components/input-mac/src/defaults.ts
// 公司默认 props：业务传入可覆盖
import type { TmInputMacProps } from './props'

/** TmInputMac 公司默认值（与 TmInput/TmInputIp 的 size 默认保持一致） */
export const tmInputMacDefaults: Partial<TmInputMacProps> = {
  size: 'middle',
  separator: ':',
}