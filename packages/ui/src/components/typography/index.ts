// packages/ui/src/components/typography/index.ts
// TmTypography 出口：TmTypographyTitle / TmTypographyParagraph / TmTypographyText / TmTypographyLink
// 多子组件模块，按 form 模块形态组织
// 设计要点：
// - 命名导出全部 4 个子组件：src/index.ts 聚合时分别注册，确保 app.use(@kibus/tm-ui-plus) 后均可用。
// - default export 提供对象形态 { TmTypographyTitle, ... }，便于整体引用。
import Title from './src/Title.vue'
import Paragraph from './src/Paragraph.vue'
import Text from './src/Text.vue'
import Link from './src/Link.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTypographyTitle = withInstall(Title, 'TmTypographyTitle')
export const TmTypographyParagraph = withInstall(Paragraph, 'TmTypographyParagraph')
export const TmTypographyText = withInstall(Text, 'TmTypographyText')
export const TmTypographyLink = withInstall(Link, 'TmTypographyLink')

// 类型透传：业务方可直接 import { TmTypographyTitleProps, TitleProps, ... } from '@kibus/tm-ui-plus'
export type {
  TmTypographyTitleProps,
  TmTypographyParagraphProps,
  TmTypographyTextProps,
  TmTypographyLinkProps,
} from './src/props'
export type {
  TitleProps,
  ParagraphProps,
  TextProps,
  LinkProps,
} from './src/props'

export default { TmTypographyTitle, TmTypographyParagraph, TmTypographyText, TmTypographyLink }
