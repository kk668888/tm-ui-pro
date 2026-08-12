// packages/ui/src/components/space/src/props.ts
// TmSpace 类型定义：ant 原生 SpaceProps + 公司扩展 split（公司默认 size 在 defaults.ts 提供）
import type { SpaceProps } from 'ant-design-vue'

/**
 * TmSpace = ant 原生 SpaceProps + 公司扩展 `split`
 * 注：ant 的 `split` 是具名插槽（spaceProps 未声明 split prop），业务写成 `split="|"` 会被静默忽略。
 * 本扩展键支持 prop 形式传入，wrapper 自动转为 #split 插槽渲染；业务显式传 #split 插槽时以插槽为准。
 */
export type TmSpaceProps = SpaceProps & {
  /** 分隔符（公司扩展）：以 prop 形式传入，自动转为 ant Space 的 #split 插槽；插槽形式优先 */
  split?: string
}

// 类型透传：业务方可直接 import TmSpaceProps / SpaceProps
export type { SpaceProps } from 'ant-design-vue'
