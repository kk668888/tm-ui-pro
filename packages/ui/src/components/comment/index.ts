// packages/ui/src/components/comment/index.ts
// TmComment 出口：withInstall 附加 Vue 插件 install 方法（兼容型封装，上游已标记废弃）
import Comment from './src/Comment.vue'
import { withInstall } from '../../utils/withInstall'

export const TmComment = withInstall(Comment, 'TmComment')
// 类型再导出：业务方可直接 import { TmCommentProps, CommentProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmComment
