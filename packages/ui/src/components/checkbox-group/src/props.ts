// packages/ui/src/components/checkbox-group/src/props.ts
// TmCheckboxGroup 类型定义：ant 原生 CheckboxGroupProps + 公司扩展 props
import type { CheckboxGroupProps } from 'ant-design-vue'

/** TmCheckboxGroup 在 ant CheckboxGroup 之上扩展的公司特有属性 */
export interface TmCheckboxGroupExtProps {
  /** 业务 v-model 绑定值（复选数组）；内部 computed 桥接到 ant CheckboxGroup 的 value */
  modelValue?: CheckboxGroupProps['value']
  /**
   * 只读语义：ant CheckboxGroup 无原生 readonly，readonly 为真时映射为禁用态
   * （业务显式传优先于 TmForm context；`disabled` 未传时置 undefined 保证 `??` 级联落空）
   */
  readonly?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmCheckboxGroupProps = CheckboxGroupProps & TmCheckboxGroupExtProps

// 类型透传：业务方可直接 import TmCheckboxGroupProps / CheckboxGroupProps
export type { CheckboxGroupProps } from 'ant-design-vue'
