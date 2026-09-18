// packages/ui/src/components/upload-dragger/index.ts
// TmUploadDragger 出口：通过 withInstall 附加 Vue 插件 install 方法
// 类型透传：UploadProps / UploadFile 由 upload 模块统一再导出，此处不重复
import UploadDragger from './src/UploadDragger.vue'
import { withInstall } from '../../utils/withInstall'

export const TmUploadDragger = withInstall(UploadDragger, 'TmUploadDragger')
export default TmUploadDragger
