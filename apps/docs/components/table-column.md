# TableColumn 表格列（模板写法）

ant Table 模板写法的库内别名：以 `<TmTableColumn>` 声明列，取代 `columns` 数组配置。与原生 `<a-table-column>` **完全等价**（同一组件对象别名复用，`withInstall` 就地在原对象上附加 `install` 并返回同一引用，故 ant 对模板列的识别不受影响）。

> ⚠️ **只对原生 `<a-table>` 有效**
>
> 库内表格主推 `TmTable`（**vxe-table** 封装、`columns` prop 驱动），它**不消费** ant 的模板列子组件。本组件服务的是「业务直接用 ant `<a-table>`」的场景，与 `TmTable` **两套体系不混用**——想用模板列写法，请直接用原生 `<a-table>`。

## 何时使用

- 业务直接使用原生 `<a-table>`，希望以模板方式声明列（列少、结构直观、可在模板里直接写渲染逻辑）。
- 需要在模板中就地写列级自定义渲染，而不愿在 `columns` 数组里写 `customRender` 函数。
- 组内少量列需要多层表头（配合 [`TmTableColumnGroup`](./table-column-group)）、底部汇总（配合 [`TmTableSummary`](./table-summary)）。

## 基础用法

列通过 `data-index`（取数据行的哪个字段）+ `title`（表头文案）声明；`width` / `align` 控制列宽与对齐。自定义渲染有两种粒度：**列级**用该列的 `#default` 插槽，**表格级**用 `<a-table>` 的 `#bodyCell` 插槽按 `column.dataIndex` 统一分发。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import ColumnDemo from '../../../packages/ui/src/components/table-columns/demos/column.vue'
import ColumnDemoCode from '../../../packages/ui/src/components/table-columns/demos/column.vue?raw'

// TmPropsTable 数据：TmTableColumn Props 表格（数据驱动渲染）
const columnProps = [
  {
    prop: 'data-index',
    desc: '取数据行的哪个字段作为单元格内容；支持数组路径（如 `[\'user\', \'name\']` 取嵌套字段）。**不传则该列只能靠插槽渲染**（操作列等）',
    type: 'string | string[]',
    default: '-',
  },
  {
    prop: 'title',
    desc: '表头文案（也可写成 `#title` 插槽或用 `customTitle` 渲染函数）',
    type: 'string | slot',
    default: '-',
  },
  {
    prop: 'key',
    desc: '列的唯一标识；不传时 ant 自动用 `data-index` 派生。用于受控列状态（筛选、排序、固定）',
    type: 'string',
    default: '由 data-index 派生',
  },
  {
    prop: 'width',
    desc: '列宽（数字按 px，也可传 `\'20%\'` 等百分比字符串）',
    type: 'string | number',
    default: '-',
  },
  {
    prop: 'align',
    desc: '单元格与表头对齐方式（同 ant 原生语义）',
    type: "'left' | 'center' | 'right'",
    default: "'left'",
  },
  {
    prop: 'fixed / ellipsis / sorter / filters / customCell 等',
    desc: '透传 ant TableColumn 全部原生属性（固定列、省略、排序、筛选、单元格合并与附加属性）',
    type: 'TableColumnProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="ColumnDemoCode">
  <ColumnDemo />
</DemoBlock>

## 自定义渲染的两种粒度

| 粒度 | 写法 | 插槽作用域 | 适用场景 |
| --- | --- | --- | --- |
| 列级 | `<TmTableColumn>` 内的 `#default` | `{ text, value, record, index, renderIndex, column }` | 该列渲染规则独立、逻辑局部 |
| 表格级 | `<a-table>` 的 `#bodyCell` | `{ column, text, record, index }` | 列多、渲染规则统一，避免逐列重复写插槽 |

> **两者同时存在时以表格级 `#bodyCell` 优先**（ant 4.2.6 实际渲染顺序：先跑列的 `customRender`，紧接着 `#bodyCell` 分支无条件覆盖结果）。若 `#bodyCell` 对某列**没有输出任何有效内容**（例如 v-if 全部未命中、只留下注释节点），ant 会自动回退——先回退到该列 `#default` 的渲染结果，再回退到原始字段值。所以「`#bodyCell` 兜多数列 + 个别列单独处理」时，个别列无需在 `#bodyCell` 里写兜底分支，但**也不要指望该列的 `#default` 生效**（除非 `#bodyCell` 对它放空）。

## 关键陷阱：不要同时传 `:columns`

ant 内部取列的逻辑是：

```js
const columns = props.columns || convertChildrenToColumns(slots.default?.())
```

只要 `columns` 是 truthy，模板列就被**整体忽略**。注意**空数组 `[]` 也是 truthy**——`:columns="[]"` 会让表格渲染成没有列（与 `TmSelect` 传空数组 `options` 会禁用 children 模式属于同类陷阱）。想用模板列写法就**完全不要传 `columns`**。

## API

### TmTableColumn Props

<TmPropsTable :data="columnProps" />

### TmTableColumn Slots

| 插槽 | 说明 | 作用域 |
| --- | --- | --- |
| `default` | 自定义该列单元格渲染 | `{ text, value, record, index, renderIndex, column }` |
| `title` | 自定义表头渲染 | `{ title, column }` |

### TmTableColumn Events

透传 ant TableColumn 全部原生 events；表头交互（排序 / 筛选）经由 `<a-table>` 的 `@change` 统一回传。

### 与 TmTable（vxe）的关系

| 维度 | `TmTable` | `TmTableColumn` 等模板列 |
| --- | --- | --- |
| 底层 | vxe-table | ant-design-vue Table |
| 配置方式 | `columns` prop 数组驱动 | `<a-table>` 模板子组件 |
| 适用场景 | 库内**推荐**：大数据量、虚拟滚动、工具栏、可编辑表格 | 直接使用原生 `<a-table>` 时的模板写法 |
| 混用 | ❌ 两者不可混用：`TmTable` 不认识 `TmTableColumn`，列不会渲染 | ❌ 同理，ant Table 不认识 vxe 的列组件 |

### TmTableColumn Types

本组件无公司扩展键、无自定义类型，类型由 ant 主入口提供（`@trustmo/tm-ui` 未重复再导出）：

```ts
// 注意：这些类型来自 ant-design-vue 本身，不从 @trustmo/tm-ui 导出
import type { TableColumnProps, TableColumnGroupType, TableColumnsType } from 'ant-design-vue'
```
