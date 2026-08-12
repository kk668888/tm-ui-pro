# Pagination 分页

基于 [ant-design-vue](https://www.antdv.com/components/pagination-cn) Pagination 的薄封装。保留 ant 全部能力，公司默认 `showSizeChanger=true` + `pageSizeOptions=[10,20,50]`（与 TmTable 分页配置对齐）。

## 何时使用

- 列表 / 表格分页，统一公司分页 UX。
- 与 TmTable 配合时，分页选项保持一致。

## 基础用法

公司默认 + 业务覆盖 + 总数展示。

<script setup>
import PaginationDemo from '../../../packages/ui/src/components/pagination/demos/basic.vue'
import PaginationDemoCode from '../../../packages/ui/src/components/pagination/demos/basic.vue?raw'

const props = [
  {
    prop: 'showSizeChanger',
    desc: '显示每页条数切换器：公司默认 `true`，业务可覆盖',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'pageSizeOptions',
    desc: '每页条数选项：公司默认 `[10, 20, 50]`（对齐 TmTable）',
    type: 'string[]',
    default: '[10, 20, 50]',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Pagination 全部 props / events（如 `total` / `current` / `pageSize` / `showTotal` / `showQuickJumper` / `@change`）',
    type: 'PaginationProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="PaginationDemoCode">
  <PaginationDemo />
</DemoBlock>

## API

### TmPagination Props

<TmPropsTable :data="props" />

### TmPagination Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `change` | 页码或每页条数变化时触发（透传 ant） | `(page, pageSize) => void` |
| 其余事件 | 透传 ant Pagination 全部 events | `-` |

### Methods

业务侧通过 `ref` 可访问内部 ant Pagination 实例（经 `useForwardRef` 透传）。
