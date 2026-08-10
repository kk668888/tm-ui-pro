// packages/ui/src/components/switch/src/props.ts
// TmSwitch 类型定义：ant 原生 SwitchProps + 公司扩展 props
import type { SwitchProps } from 'ant-design-vue'

/** TmSwitch 在 ant Switch 之上扩展的公司特有属性 */
export interface TmSwitchExtProps {
  /** 业务 v-model 绑定值；内部 computed 桥接到 ant Switch 的 checked（默认布尔开合） */
  modelValue?: SwitchProps['checked']
  /**
   * 只读语义：ant Switch 无原生 readonly，readonly 为真时映射为禁用态
   * （业务显式传优先于 TmForm context；`disabled` 未传时置 undefined 保证 `??` 级联落空）
   */
  readonly?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmSwitchProps = SwitchProps & TmSwitchExtProps

// 类型透传：业务方可直接 import TmSwitchProps / SwitchProps
export type { SwitchProps } from 'ant-design-vue'
