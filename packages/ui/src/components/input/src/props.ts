// packages/ui/src/components/input/src/props.ts
// TmInput 类型定义：ant 原生 InputProps + 公司扩展 modelValue
//
// 设计要点：
// - 业务方使用 TmInput 时，IDE 同时提示 ant 原生属性（placeholder/size/allowClear/...）
//   与公司扩展 modelValue。
// - modelValue 与 ant 的 value 经 Input.vue 内部 computed get/set 桥接，业务侧无需关心。
// - 早期诊断中曾怀疑「TmInput 声明 'onUpdate:value' 会让 Vue 把 TmInput 视为透明转发者，
//   导致 v-model:value setter 失效」。后经更深入诊断定位真因为 useForwardRef 的 has 拦截器
//   拦截了 `$`/`__v_*` 等 Vue 内部 key，已在该 composable 中修正，因此此处无需 Omit listener prop。
import type { InputProps } from 'ant-design-vue'

/** TmInput 在 ant Input 之上扩展的公司特有属性 */
export interface TmInputExtProps {
  /** 业务侧 v-model 绑定值；内部映射到 ant Input 的 value */
  modelValue?: string | number
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmInputProps = InputProps & TmInputExtProps

// 类型透传：业务方可直接 import TmInputProps / InputProps
export type { InputProps } from 'ant-design-vue'
