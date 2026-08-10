// packages/ui/src/components/tree-select/src/props.ts
// TmTreeSelect 类型定义：ant 原生 TreeSelectProps + 公司扩展 props
import type { TreeSelectProps } from 'ant-design-vue'

/** TmTreeSelect 在 ant TreeSelect 之上扩展的公司特有属性 */
export interface TmTreeSelectExtProps {
  /** 业务 v-model 绑定值（单选值 / 多选数组 / labelInValue 等 ant 原生形态）；内部桥接到 ant TreeSelect 的 value */
  modelValue?: TreeSelectProps['value']
  /** 只读语义：ant TreeSelect 无原生 readonly，为真时经 useReadonlyLock 锁死弹层 */
  readonly?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmTreeSelectProps = TreeSelectProps & TmTreeSelectExtProps

// 类型透传：业务方可直接 import TmTreeSelectProps / TreeSelectProps
export type { TreeSelectProps } from 'ant-design-vue'
