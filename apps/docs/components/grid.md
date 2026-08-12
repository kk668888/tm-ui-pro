# Grid 栅格

基于 [ant-design-vue](https://www.antdv.com/components/grid-cn) Row / Col 的薄封装。导出 `TmRow` / `TmCol`，保留 ant 24 栅格全部能力（含响应式断点），无公司扩展键。

## 何时使用

- 需要 24 栅格体系构建响应式页面布局。
- 需要 gutter / offset / 断点（xs~xxl）等 ant 原生栅格能力。

## 基础用法

`TmRow` + `TmCol` 分列、offset 偏移、响应式断点。

<script setup>
import GridDemo from '../../../packages/ui/src/components/grid/demos/basic.vue'
import GridDemoCode from '../../../packages/ui/src/components/grid/demos/basic.vue?raw'

const rowProps = [
  {
    prop: 'gutter',
    desc: '列间距，支持响应式对象（如 `{ xs: 8, md: 16 }`）',
    type: 'number | object',
    default: '0',
  },
  {
    prop: 'justify / align / wrap',
    desc: '水平 / 垂直对齐与换行（ant 原生）',
    type: 'RowProps',
    default: '-',
  },
]

const colProps = [
  {
    prop: 'span / offset',
    desc: '栅格占位 / 偏移（1~24）',
    type: 'number',
    default: '-',
  },
  {
    prop: 'xs ~ xxl',
    desc: '响应式断点：xs / sm / md / lg / xl / xxl',
    type: 'number | object',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Col 全部 props（如 `order` / `flex` / `push` / `pull`）',
    type: 'ColProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="GridDemoCode">
  <GridDemo />
</DemoBlock>

## API

### TmRow Props

<TmPropsTable :data="rowProps" />

### TmCol Props

<TmPropsTable :data="colProps" />

### Methods

业务侧通过 `ref` 可访问内部 ant Row / Col 实例（经 `useForwardRef` 透传）。
