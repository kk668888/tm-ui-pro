// packages/ui/src/components/watermark/index.ts
// TmWatermark 出口：withInstall 附加 Vue 插件 install 方法
import Watermark from './src/Watermark.vue'
import { withInstall } from '../../utils/withInstall'

export const TmWatermark = withInstall(Watermark, 'TmWatermark')
// 类型再导出：业务方可直接 import { TmWatermarkProps, WatermarkProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmWatermark
