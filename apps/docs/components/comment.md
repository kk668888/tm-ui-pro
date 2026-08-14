# Comment 评论

基于 [ant-design-vue](https://www.antdv.com/components/comment-cn) Comment 的**兼容型**薄封装。保留 ant 全部 props / slots，不新增业务评论模型。

> ⚠️ **上游已废弃**：ant-design-vue 已标记 Comment 为废弃组件，未来版本可能移除。@kibus/tm-ui-plus 保留封装以满足全覆盖，但**新业务不建议使用**。

## 何时使用

- 存量评论界面平滑迁移到 @kibus/tm-ui-plus。
- 新评论界面推荐使用 **Avatar / Flex / Space / Typography** 组合构建。

## 基础用法

<script setup>
import CommentDemo from '../../../packages/ui/src/components/comment/demos/basic.vue'
import CommentDemoCode from '../../../packages/ui/src/components/comment/demos/basic.vue?raw'

const props = [
  { prop: 'author', desc: '作者（prop 或 #author 插槽）', type: 'VueNode', default: '-' },
  { prop: 'avatar', desc: '头像（#avatar 插槽）', type: 'VueNode', default: '-' },
  { prop: 'content', desc: '评论内容（#content 插槽）', type: 'VueNode', default: '-' },
  { prop: 'datetime', desc: '时间（prop 或插槽）', type: 'VueNode', default: '-' },
  { prop: 'actions', desc: '操作项数组 / 插槽', type: 'VueNode[]', default: '-' },
]
</script>

<DemoBlock :code="CommentDemoCode">
  <CommentDemo />
</DemoBlock>

> **推荐替代**（ant 官方建议）：
> ```vue
> <TmFlex vertical :gap="4">
>   <TmFlex align="center" :gap="8">
>     <TmAvatar>张</TmAvatar>
>     <span><TmTypographyText strong>张三</TmTypographyText></span>
>   </TmFlex>
>   <TmTypographyParagraph>评论内容</TmTypographyParagraph>
> </TmFlex>
> ```

## API

### TmComment Props

<TmPropsTable :data="props" />

### 废弃边界

- 不新增扩展属性（保持 ant 上游 props / slots 契约）。
- 未来 ant-design-vue 移除 Comment 时，可单独发布破坏性迁移变更。
