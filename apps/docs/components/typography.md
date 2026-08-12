# Typography 排版

基于 [ant-design-vue](https://www.antdv.com/components/typography-cn) Typography 的薄封装。导出 `TmTypographyTitle` / `TmTypographyParagraph` / `TmTypographyText` / `TmTypographyLink` 四子组件，保留 ant 排版全部能力（标题层级 / 省略 / 复制 / 编辑），无公司扩展键。

## 何时使用

- 页面标题、正文、内联文本、链接需要统一排版层级。
- 需要省略（`ellipsis`）、复制（`copyable`）、编辑（`editable`）等文本能力。

## 基础用法

标题 / 段落 / 文本（含语义色 / code / mark）/ 链接 / 可复制。

<script setup>
import TypographyDemo from '../../../packages/ui/src/components/typography/demos/basic.vue'
import TypographyDemoCode from '../../../packages/ui/src/components/typography/demos/basic.vue?raw'

const titleProps = [
  {
    prop: 'level',
    desc: '标题层级 1~5（渲染 h1~h5）',
    type: '1 | 2 | 3 | 4 | 5',
    default: '1',
  },
  {
    prop: 'copyable / ellipsis / editable',
    desc: '复制 / 省略 / 编辑能力（ant 原生）',
    type: 'boolean | object',
    default: 'false',
  },
]

const textProps = [
  {
    prop: 'type',
    desc: '文本语义色：secondary / success / warning / danger',
    type: 'TextProps',
    default: '-',
  },
  {
    prop: 'mark / code / keyboard / underline',
    desc: '内联修饰（ant 原生）',
    type: 'boolean',
    default: 'false',
  },
]
</script>

<DemoBlock :code="TypographyDemoCode">
  <TypographyDemo />
</DemoBlock>

## API

### 子组件映射

| Tm 组件 | 对应 ant | 渲染标签 |
| --- | --- | --- |
| `TmTypographyTitle` | Typography.Title | h1~h5 |
| `TmTypographyParagraph` | Typography.Paragraph | div |
| `TmTypographyText` | Typography.Text | span |
| `TmTypographyLink` | Typography.Link | a |

### TmTypographyTitle Props

<TmPropsTable :data="titleProps" />

### TmTypographyText Props

<TmPropsTable :data="textProps" />

其余属性透传 ant Typography 全部 props / slots / events（Paragraph 的 `copyable` / `ellipsis`，Link 的 `href` / `target` 等）。

### Methods

业务侧通过 `ref` 可访问内部 ant Typography 各实例（经 `useForwardRef` 透传）。
