// packages/ui/src/components/upload/index.ts
// TmUpload 出口：withInstall 附加 Vue 插件 install 方法
import Upload from './src/Upload.vue'
import { withInstall } from '../../utils/withInstall'

export const TmUpload = withInstall(Upload, 'TmUpload')
// 类型再导出：业务方可直接 import { TmUploadProps, UploadProps, UploadFile } from '@tm/ui'
export * from './src/props'
export default TmUpload
