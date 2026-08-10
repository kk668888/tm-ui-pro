// packages/ui/src/components/cascader/src/props.ts
// TmCascader 类型定义：ant 原生 CascaderProps + 公司扩展 props
import type { CascaderProps } from 'ant-design-vue'

/** TmCascader 在 ant Cascader 之上扩展的公司特有属性 */
export interface TmCascaderExtProps {
  /** 业务 v-model 绑定值（选中路径值数组）；内部 computed 桥接到 ant Cascader 的 value */
  modelValue?: CascaderProps['value']
  /** 只读语义：ant Cascader 无原生 readonly，为真时经 useReadonlyLock 锁死弹层 */
  readonly?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmCascaderProps = CascaderProps & TmCascaderExtProps

// 类型透传：业务方可直接 import TmCascaderProps / CascaderProps
export type { CascaderProps } from 'ant-design-vue'
