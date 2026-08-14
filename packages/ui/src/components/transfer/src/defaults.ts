// packages/ui/src/components/transfer/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 注1：titles 用函数形式（() => TransferProps['titles']）——withDefaults 的 InferDefault
//      要求匹配「值或函数签名」，字符串字面量会触发 TS2345（同 basic 修复）。
// 注2：ant Transfer 的 render 默认 null（列表项不渲染文字），公司默认显示 item.title。
import type { TransferProps } from 'ant-design-vue'

/** 公司默认穿梭框标题：源列表 / 目标列表 */
export const DEFAULT_TRANSFER_TITLES = ['源列表', '目标列表']

/** 公司默认列表项渲染：显示 item.title（ant 默认 render 为 null，选项无文字） */
export const DEFAULT_TRANSFER_RENDER = (item: { title?: string }): string => item?.title ?? ''

export const tmTransferDefaults = {
  // 显式标注返回类型：ant TransferProps = Partial<ExtractPropTypes>（索引含 undefined），
  // withDefaults 的 InferDefault 要求无 undefined 的精确类型，否则 TS2345。
  titles: (): string[] => [...DEFAULT_TRANSFER_TITLES],
  render: DEFAULT_TRANSFER_RENDER as unknown as TransferProps['render'],
} as const
