// packages/ui/src/components/flex/index.ts
// TmFlex 出口：withInstall 附加 Vue 插件 install 方法
import Flex from './src/Flex.vue'
import { withInstall } from '../../utils/withInstall'

export const TmFlex = withInstall(Flex, 'TmFlex')
// 类型再导出：业务方可直接 import { TmFlexProps, FlexProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmFlex
