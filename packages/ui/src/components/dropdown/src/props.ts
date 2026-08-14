// packages/ui/src/components/dropdown/src/props.ts
// TmDropdown 类型定义：可移植接口（无公司扩展键）
// 注：ant 的 `DropdownProps = Partial<ExtractPropTypes<...>>` 引用 MenuItemType 等复杂类型，
// compiler-sfc 无法解析（Unresolvable type reference），故用纯接口定义，保证可编译。
// 完整 ant 类型仍 re-export。
/**
 * TmDropdown = 可移植的 Dropdown 接口
 * - menu 为松散透传（ant 原生 MenuProps | MenuItemType[] 结构）
 * - class/style 等 DOM 属性经 $attrs 透传
 */
export interface TmDropdownProps {
  /** 菜单配置（ant 原生：MenuProps | MenuItemType[]，松散类型透传） */
  menu?: Record<string, unknown> | unknown[]
  /** 触发方式（ant 原生） */
  trigger?: 'click' | 'hover' | 'contextmenu' | Array<'click' | 'hover' | 'contextmenu'>
  /** 弹层位置（ant 原生） */
  placement?: string
  /** 是否显示箭头（ant 原生） */
  arrow?: boolean
  /** 受控展开状态（缺省保持 ant 非受控，幻影 false 跳过） */
  open?: boolean
  /** 禁用（ant 原生） */
  disabled?: boolean
  /** 弹层类名 / 内联样式（ant 原生） */
  overlayClassName?: string
  overlayStyle?: Record<string, unknown>
  /** 弹层挂载容器（ant 原生） */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** 弹层越界自动调整（ant 原生，公司默认 true 兜底） */
  autoAdjustOverflow?: boolean
}

/** TmDropdownButton = Dropdown 接口 + 按钮形态 props */
export interface TmDropdownButtonProps extends TmDropdownProps {
  /** 按钮尺寸（ant 原生） */
  size?: 'small' | 'middle' | 'large'
  /** 按钮类型（ant 原生） */
  type?: string
  /** 加载态（ant 原生） */
  loading?: boolean
  /** 危险态（ant 原生） */
  danger?: boolean
}

// 类型透传：业务可 import { TmDropdownProps, DropdownProps } from '@kibus/tm-ui-plus'（DropdownProps 为 ant 完整类型）
export type { DropdownProps } from 'ant-design-vue'
