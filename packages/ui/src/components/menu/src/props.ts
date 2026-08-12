// packages/ui/src/components/menu/src/props.ts
// TmMenu 类型定义：ant 原生 + 可移植接口（MenuItemGroup 例外）
// 注：Menu / MenuItem / SubMenu / MenuDivider 的 ant 类型可被 compiler-sfc 解析；
// MenuItemGroupProps 引用复杂类型解析失败，改用可移植接口。
import type { MenuProps } from 'ant-design-vue'
import type { MenuItemProps } from 'ant-design-vue'
import type { SubMenuProps } from 'ant-design-vue'
import type { MenuDividerProps } from 'ant-design-vue'

/** TmMenu = ant 原生 MenuProps */
export type TmMenuProps = MenuProps

/** TmMenuItem = ant 原生 MenuItemProps */
export type TmMenuItemProps = MenuItemProps

/** TmSubMenu = ant 原生 SubMenuProps */
export type TmSubMenuProps = SubMenuProps

/** TmMenuDivider = ant 原生 MenuDividerProps */
export type TmMenuDividerProps = MenuDividerProps

/**
 * TmMenuItemGroup = 可移植接口
 * 注：ant MenuItemGroupProps 引用复杂类型，compiler-sfc 无法解析（Unresolvable type reference）。
 */
export interface TmMenuItemGroupProps {
  /** 分组标题（ant 原生） */
  title?: string
}

// 类型透传
export type {
  MenuProps,
  MenuItemProps,
  SubMenuProps,
  MenuItemGroupProps,
  MenuDividerProps,
  MenuTheme,
  MenuMode,
} from 'ant-design-vue'
