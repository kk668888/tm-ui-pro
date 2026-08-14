// packages/ui/src/components/menu/index.ts
// TmMenu 出口：TmMenu / TmMenuItem / TmSubMenu / TmMenuItemGroup / TmMenuDivider 多子组件模块
import Menu from './src/Menu.vue'
import MenuItem from './src/MenuItem.vue'
import SubMenu from './src/SubMenu.vue'
import MenuItemGroup from './src/MenuItemGroup.vue'
import MenuDivider from './src/MenuDivider.vue'
import { withInstall } from '../../utils/withInstall'

export const TmMenu = withInstall(Menu, 'TmMenu')
export const TmMenuItem = withInstall(MenuItem, 'TmMenuItem')
export const TmSubMenu = withInstall(SubMenu, 'TmSubMenu')
export const TmMenuItemGroup = withInstall(MenuItemGroup, 'TmMenuItemGroup')
export const TmMenuDivider = withInstall(MenuDivider, 'TmMenuDivider')

// 类型透传：业务方可直接 import { MenuProps, TmMenuProps, ... } from '@kibus/tm-ui-plus'
export type { MenuProps, SubMenuProps, MenuItemProps, MenuDividerProps, MenuTheme, MenuMode } from 'ant-design-vue'
// MenuItemGroupProps 未从 ant 顶层导出，从模块级深层导入（ant 无 exports map，路径稳定）
export type { MenuItemGroupProps } from 'ant-design-vue/es/menu'
export type {
  TmMenuProps,
  TmMenuItemProps,
  TmSubMenuProps,
  TmMenuItemGroupProps,
  TmMenuDividerProps,
} from './src/props'

export default { TmMenu, TmMenuItem, TmSubMenu, TmMenuItemGroup, TmMenuDivider }
