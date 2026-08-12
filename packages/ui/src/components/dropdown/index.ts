// packages/ui/src/components/dropdown/index.ts
// TmDropdown 出口：TmDropdown / TmDropdownButton 多子组件模块
import Dropdown from './src/Dropdown.vue'
import DropdownButton from './src/DropdownButton.vue'
import { withInstall } from '../../utils/withInstall'

export const TmDropdown = withInstall(Dropdown, 'TmDropdown')
export const TmDropdownButton = withInstall(DropdownButton, 'TmDropdownButton')

// 类型透传：业务方可直接 import { DropdownProps, TmDropdownProps, ... } from '@tm/ui'
export type { DropdownProps } from 'ant-design-vue'
export type { TmDropdownProps, TmDropdownButtonProps } from './src/props'

export default { TmDropdown, TmDropdownButton }
