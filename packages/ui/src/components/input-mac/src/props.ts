// packages/ui/src/components/input-mac/src/props.ts
// TmInputMac 类型定义：自研交互组件（segment 系第二位，复用 useSegmentedInput 内核）
// 与 TmInputIp 同构，多一个 separator 可配置项。
import type { SizeType } from 'ant-design-vue/es/config-provider/SizeContext'

/** MAC 地址段分隔符（IEEE 标准用冒号；隔行线按业务要求可选） */
export type TmInputMacSeparator = ':' | '-'

/** TmInputMac 自有属性 */
export interface TmInputMacProps {
  /** v-model 绑定值：完整规范 MAC 串（大写、每段 2 位，如 "0A:1B:2C:3D:4E:5F"）；段落不全或未归一化时为 '' */
  modelValue?: string
  /** 控件尺寸（与 ant 表单控件同体系，默认 middle） */
  size?: SizeType
  /** 禁用：置灰不可交互；未传时级联 TmForm disabled */
  disabled?: boolean
  /** 只读：段值可见不可编辑（不置灰）；未传时级联 TmForm readonly */
  readonly?: boolean
  /** 段分隔符（默认 ':'；'-' 模式保存/组装/粘贴解析均用该分隔符，不做双格式容错） */
  separator?: TmInputMacSeparator
}