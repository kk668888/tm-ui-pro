# CardGrid 卡片栅格单元

Card 卡片的库内别名：在 `<TmCard>` 内容区声明等宽栅格单元。与原生 `<a-card-grid>` **完全等价**——`withInstall` 别名复用让两者是同一个组件对象，行为与原生写法一致。

## 何时使用

- 卡片内需要排布等宽的快捷入口 / 功能格（卡内小宫格）。
- 需要悬停高亮（`hoverable`）的卡内单元。

## 基础用法

`TmCardGrid` 必须作为 `<TmCard>` 的**直接内容子级**使用，才继承卡片的边框与间距样式；每行单元数由 ant 样式（宽度 25%）控制，超出自动换行。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import CardGridDemo from '../../../packages/ui/src/components/card/demos/grid.vue'
import CardGridDemoCode from '../../../packages/ui/src/components/card/demos/grid.vue?raw'

// TmPropsTable 数据：TmCardGrid Props 表格（ant 原生 API）
const cardGridProps = [
  {
    prop: 'hoverable',
    desc: '鼠标悬停时单元高亮（背景变浅灰）',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: '默认插槽',
    desc: '栅格单元内容',
    type: 'slot',
    default: '-',
  },
]
</script>

<DemoBlock :code="CardGridDemoCode">
  <CardGridDemo />
</DemoBlock>

## API

### TmCardGrid Props

<TmPropsTable :data="cardGridProps" />

### TmCardGrid Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 栅格单元内容 |

### 其余能力

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值；完整清单见 [ant-design-vue Card.Grid 文档](https://www.antdv.com/components/card-cn)。
