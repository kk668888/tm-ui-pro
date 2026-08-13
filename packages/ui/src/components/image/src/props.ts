// packages/ui/src/components/image/src/props.ts
// TmImage 类型定义：ant 原生 ImageProps（ExtractPropTypes 取原生 props，规避 HTMLAttributes extends）；
// TmImagePreviewGroupProps 本地可移植结构类型
import type { ExtractPropTypes } from 'vue'
import type { imageProps } from 'ant-design-vue/es/image'

/**
 * ant Image 原生 props（不含 ImgHTMLAttributes）
 * 注：ant 的 `ImageProps = Partial<ExtractPropTypes<...> & Omit<ImgHTMLAttributes, ...>>` 含
 * Vue DOM 属性类型，compiler-sfc 无法从 extends 解析（Failed to resolve extends base type）。
 * 这里取 ExtractPropTypes 部分（与其他组件一致）；class/style 等 DOM 属性经 $attrs 透传。
 */
type ImageBaseProps = Partial<ExtractPropTypes<ReturnType<typeof imageProps>>>

/** TmImage = ant 原生 ImageProps（ExtractPropTypes 部分） */
export type TmImageProps = ImageBaseProps

/**
 * TmImagePreviewGroup 组件 props
 * 说明：ant 未导出 ImagePreviewGroup 的类型，且 ImageProps['preview'] 索引类型无法被
 * compiler-sfc 的 defineProps<T> 解析，故本地声明（preview 与 ant Image preview 同款配置，
 * false 禁用预览）
 */
export type TmImagePreviewGroupProps = {
  /** 预览配置：false 禁用预览；对象时按 ant Image preview 配置（boolean | 配置对象） */
  preview?: boolean | Record<string, unknown>
}

// 类型透传：业务方可直接 import TmImageProps / ImageProps
export type { ImageProps } from 'ant-design-vue'
