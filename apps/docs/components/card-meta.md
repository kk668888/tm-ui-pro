# CardMeta 卡片元信息

Card 卡片的库内别名：卡片内的头像 / 标题 / 描述区块。与原生 `<a-card-meta>` **完全等价**——`withInstall` 别名复用让两者是同一个组件对象，行为与原生写法一致。

## 何时使用

- 卡片需要「头像 + 标题 + 描述」这类元信息头（用户卡、服务卡、文章卡）。
- 需要标题或描述承载更复杂结构（可点击标题、状态标签）时改用同名插槽。

## 基础用法

`title` / `description` 可直接传字符串；`avatar` 按 ant 约定传节点（demo 用 `#avatar` 插槽）。三个字段都有同名插槽，插槽优先级高于 prop。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import CardMetaDemo from '../../../packages/ui/src/components/card/demos/meta.vue'
import CardMetaDemoCode from '../../../packages/ui/src/components/card/demos/meta.vue?raw'

// TmPropsTable 数据：TmCardMeta Props 表格（ant 原生 API）
const cardMetaProps = [
  {
    prop: 'title',
    desc: '标题内容（也可用 `#title` 插槽传节点）',
    type: 'string | VNode',
    default: '-',
  },
  {
    prop: 'description',
    desc: '描述内容（也可用 `#description` 插槽传节点）',
    type: 'string | VNode',
    default: '-',
  },
  {
    prop: 'avatar',
    desc: '头像节点（也可用 `#avatar` 插槽传入）',
    type: 'VNode',
    default: '-',
  },
]
</script>

<DemoBlock :code="CardMetaDemoCode">
  <CardMetaDemo />
</DemoBlock>

## API

### TmCardMeta Props

<TmPropsTable :data="cardMetaProps" />

### TmCardMeta Slots

| 插槽 | 说明 |
| --- | --- |
| `avatar` | 头像区内容（左侧） |
| `title` | 标题区内容 |
| `description` | 描述区内容 |

### 其余能力

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值；完整清单见 [ant-design-vue Card.Meta 文档](https://www.antdv.com/components/card-cn)。
