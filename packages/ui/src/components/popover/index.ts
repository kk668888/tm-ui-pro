// packages/ui/src/components/popover/index.ts
// TmPopover 出口：withInstall 附加 Vue 插件 install 方法
import Popover from './src/Popover.vue'
import { withInstall } from '../../utils/withInstall'

export const TmPopover = withInstall(Popover, 'TmPopover')
// 类型再导出：业务方可直接 import { TmPopoverProps, PopoverProps } from '@tm/ui'
export * from './src/props'
export default TmPopover
