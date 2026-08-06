// packages/ui/src/components/select/src/props.ts
// TmSelect 类型定义：ant 原生 SelectProps + 公司扩展（modelValue / remote）
//
// 设计要点：
// - 业务方使用 TmSelect 时，IDE 同时提示 ant 原生属性（options/showSearch/allowClear/...）
//   与公司扩展 modelValue / remote，开发体验等同于直接写 <ASelect>。
// - modelValue 与 ant 的 value 经 Select.vue 内部 computed get/set 桥接，业务侧无需关心。
// - modelValue 类型直接复用 ant SelectProps['value']（SelectValue），保证 v-model:value
//   两侧类型完全一致，避免单选/多选/labelInValue 模式下的类型摩擦。
import type { SelectProps } from 'ant-design-vue'

/** 远程选项数据结构（label/value 两字段最小契约，业务可按需扩展） */
export interface TmSelectOption {
  label: string
  value: string | number
}

/**
 * 远程搜索函数签名
 * 业务方传入该函数后，TmSelect 启用远程模式：用户输入触发 @search → 调用 remote → 自动填充 options
 */
export type TmSelectRemote = (query: string) => Promise<TmSelectOption[]>

/** TmSelect 在 ant Select 之上扩展的公司特有属性 */
export interface TmSelectExtProps {
  /** 业务侧 v-model 绑定值；内部映射到 ant Select 的 value（与 ant SelectValue 同型） */
  modelValue?: SelectProps['value']
  /** 远程搜索函数，传入则启用远程模式，由 @search 事件自动驱动 options */
  remote?: TmSelectRemote
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmSelectProps = SelectProps & TmSelectExtProps

// 类型透传：业务方可直接 import TmSelectProps / SelectProps
export type { SelectProps } from 'ant-design-vue'
