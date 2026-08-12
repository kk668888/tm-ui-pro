# Anchor 锚点

基于 [ant-design-vue](https://www.antdv.com/components/anchor-cn) Anchor 的薄封装。导出 `TmAnchor` / `TmAnchorLink`，保留 ant 全部能力，无公司扩展键。

## 何时使用

- 长页面文档锚点导航。
- 需要嵌套层级、滚动固定、高亮当前锚点。

## 基础用法

锚点导航（含二级链接）。

<script setup>
import AnchorDemo from '../../../packages/ui/src/components/anchor/demos/basic.vue'
import AnchorDemoCode from '../../../packages/ui/src/components/anchor/demos/basic.vue?raw'

const props = [
  {
    prop: 'affix',
    desc: '是否随滚动固定：默认 `true`，传 `false` 禁用',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'bounds / offsetTop / targetOffset / items',
    desc: '偏移与配置项（ant 原生）',
    type: 'AnchorProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="AnchorDemoCode">
  <AnchorDemo />
</DemoBlock>

## API

### 子组件映射

| Tm 组件 | 对应 ant |
| --- | --- |
| `TmAnchor` | Anchor |
| `TmAnchorLink` | Anchor.Link |

### TmAnchor Props

<TmPropsTable :data="props" />

### TmAnchorLink Props

| 属性 | 说明 |
| --- | --- |
| `href` / `title` / `target` | 锚点链接 / 标题 / 打开方式（ant 原生） |

### Methods

业务侧通过 `ref` 可访问内部 ant Anchor 实例（经 `useForwardRef` 透传）。
