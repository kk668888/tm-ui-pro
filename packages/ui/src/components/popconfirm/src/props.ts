// packages/ui/src/components/popconfirm/src/props.ts
// TmPopconfirm 类型定义：ant 原生 PopconfirmProps + 公司扩展 danger
import type { ExtractPropTypes } from 'vue'
import type { popconfirmProps } from 'ant-design-vue/es/popconfirm'

/**
 * ant Popconfirm 原生 props（不含 HTMLAttributes）
 * 注：ant `PopconfirmProps` 含 Vue DOM 属性类型，compiler-sfc 无法从 extends 解析；
 * 取 ExtractPropTypes 部分（与其他组件一致），class/style 等 DOM 属性经 $attrs 透传。
 */
type PopconfirmBaseProps = Partial<ExtractPropTypes<ReturnType<typeof popconfirmProps>>>

/** TmPopconfirm 在 ant Popconfirm 之上扩展的公司特有属性 */
export interface TmPopconfirmExtProps {
  /**
   * 危险确认：置位时确认按钮以危险语义（红色）渲染，对齐 TmButton 删除二次确认视觉
   */
  danger?: boolean
}

/** ant 原生（ExtractPropTypes）+ 公司扩展（IDE 提示 ant 原生属性与 danger） */
export type TmPopconfirmProps = PopconfirmBaseProps & TmPopconfirmExtProps

// 类型透传：业务可 import { TmPopconfirmProps, PopconfirmProps } from '@tm/ui'
export type { PopconfirmProps } from 'ant-design-vue'
