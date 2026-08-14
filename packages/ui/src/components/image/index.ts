// packages/ui/src/components/image/index.ts
// TmImage 出口：TmImage / TmImagePreviewGroup 多子组件模块
import Image from './src/Image.vue'
import ImagePreviewGroup from './src/ImagePreviewGroup.vue'
import { withInstall } from '../../utils/withInstall'

export const TmImage = withInstall(Image, 'TmImage')
export const TmImagePreviewGroup = withInstall(ImagePreviewGroup, 'TmImagePreviewGroup')

// 类型再导出：业务方可直接 import { TmImageProps, TmImagePreviewGroupProps, ImageProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default { TmImage, TmImagePreviewGroup }
