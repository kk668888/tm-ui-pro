// packages/ui/src/components/input-number/index.ts
// TmInputNumber 出口：withInstall 附加 Vue 插件 install 方法
import InputNumber from './src/InputNumber.vue'
import { withInstall } from '../../utils/withInstall'

export const TmInputNumber = withInstall(InputNumber, 'TmInputNumber')
// 类型再导出：业务方可直接 import { TmInputNumberProps, InputNumberProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmInputNumber
