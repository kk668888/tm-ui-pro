# List 列表

基于 [ant-design-vue](https://www.antdv.com/components/list-cn) List 的薄封装。保留 ant 全部能力（含 `TmListItem` / `TmListItemMeta` 子组件），无公司默认。

## 何时使用

- 最基础的列表展示，支持分页、加载态、栅格布局。
- 通用列表操作（编辑 / 删除 / 更多）承载。

## 基础用法

<script setup>
import ListDemo from '../../../packages/ui/src/components/list/demos/basic.vue'
import ListDemoCode from '../../../packages/ui/src/components/list/demos/basic.vue?raw'
import ListLoadMoreDemo from '../../../packages/ui/src/components/list/demos/load-more.vue'
import ListLoadMoreCode from '../../../packages/ui/src/components/list/demos/load-more.vue?raw'

const props = [
  { prop: 'dataSource', desc: '数据源数组（配合 #renderItem 渲染）', type: 'any[]', default: '-' },
  { prop: 'renderItem', desc: '列表项渲染插槽，携带 { item, index }', type: 'slot', default: '-' },
  { prop: 'pagination', desc: '分页配置（false 关闭）', type: 'boolean | object', default: 'false' },
  { prop: 'loading', desc: '加载状态', type: 'boolean', default: 'false' },
  { prop: 'grid / header / footer', desc: '栅格布局 / 头部 / 尾部（ant 原生）', type: 'ListProps', default: '-' },
  { prop: 'loadMore', desc: '加载更多区域插槽（配合分页追加数据，见上方示例）', type: 'slot', default: '-' },
  { prop: 'TmListItem / TmListItemMeta', desc: '子组件：`actions` / `extra`；`avatar` / `title` / `description`', type: 'ListItemProps | ListItemMetaProps', default: '-' },
]
</script>

<DemoBlock :code="ListDemoCode">
  <ListDemo />
</DemoBlock>

## 加载更多

数据分页追加，`loadMore` 插槽自定义底部加载按钮。

<DemoBlock :code="ListLoadMoreCode">
  <ListLoadMoreDemo />
</DemoBlock>

## API

### TmList Props

<TmPropsTable :data="props" />

### TmListItem / TmListItemMeta

- `TmListItem`：列表项容器，支持 `actions` / `extra` 插槽。
- `TmListItemMeta`：元信息，支持 `avatar` / `title` / `description` 插槽与 props。

### Methods

业务侧通过 `ref` 可访问内部 ant List 实例（经 `useForwardRef` 透传）。
