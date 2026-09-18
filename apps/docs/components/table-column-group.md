# TableColumnGroup 表头分组

ant Table 模板写法的库内别名：用 `<TmTableColumnGroup>` 把若干列聚成一个**跨列分组表头**，组内可继续嵌套分组（多层表头）。与原生 `<a-table-column-group>` **完全等价**。

> ⚠️ **只对原生 `<a-table>` 有效**
>
> 库内表格主推 `TmTable`（**vxe-table** 封装、`columns` prop 驱动），它**不消费** ant 的模板列子组件。本组件服务的是「业务直接用 ant `<a-table>`」的场景，与 `TmTable` **两套体系不混用**。

## 何时使用

- 多列同属一个业务维度，希望表头有一行统一的维度名（如「各科成绩」横跨语文/数学/英语）。
- 需要两行以上的多层表头（组内再嵌套组）。
- 分组标题需要居中、参与固定列或列宽分配。

## 基础用法

分组用 `title` 声明组头，组内直接放列；**组内列按声明顺序从左到右排布**，组头自动横跨其所有子列。嵌套分组即为多层表头。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import ColumnGroupDemo from '../../../packages/ui/src/components/table-columns/demos/column-group.vue'
import ColumnGroupDemoCode from '../../../packages/ui/src/components/table-columns/demos/column-group.vue?raw'

// TmPropsTable 数据：TmTableColumnGroup Props 表格（数据驱动渲染）
const columnGroupProps = [
  {
    prop: 'title',
    desc: '分组表头文案（横跨组内全部子列）；也可用 `#title` 插槽自定义渲染',
    type: 'string | slot',
    default: '-',
  },
  {
    prop: 'key',
    desc: '分组唯一标识（与列 `key` 同语义，用于列状态受控）',
    type: 'string',
    default: '-',
  },
  {
    prop: 'align',
    desc: '组头对齐方式；**不会**自动继承到子列，子列需各自声明 `align`',
    type: "'left' | 'center' | 'right'",
    default: "'left'",
  },
  {
    prop: 'fixed / ellipsis 等',
    desc: '透传 ant TableColumnGroup 全部原生属性',
    type: 'TableColumnGroupType',
    default: '-',
  },
]
</script>

<DemoBlock :code="ColumnGroupDemoCode">
  <ColumnGroupDemo />
</DemoBlock>

## 识别原理

ant 内部用**列组件对象上的静态标记**判定一个模板子组件是「分组」还是「普通列」：

```js
if (element.type?.__ANT_TABLE_COLUMN_GROUP) {
  column.children = convertChildrenToColumns(element.children.default?.())
} else {
  column.customRender = element.children.default
}
```

`TmTableColumnGroup` 是 ant `TableColumnGroup` 的**别名复用**（`withInstall` 就地在原对象上附加 `install` 并返回同一引用），因此该静态标记与递归识别都完整保留，行为与原生写法一致。

> 同样的原因：一个**包裹层**（自己 defineComponent 再透传 children）会丢失这个静态标记，分组会被当成普通列（拿不到 `data-index` 就没有内容）。这是本组件采用别名而非薄封装的原因。

## 关键陷阱：不要同时传 `:columns`

ant 取列的逻辑是 `props.columns || convertChildrenToColumns(children)`，只要 `columns` 是 truthy（**空数组 `[]` 也是 truthy**）就让模板列整体失效。用模板写法时**完全不要传 `columns`**。

## API

### TmTableColumnGroup Props

<TmPropsTable :data="columnGroupProps" />

### TmTableColumnGroup Slots

| 插槽 | 说明 | 作用域 |
| --- | --- | --- |
| `default` | 组内子列（`<TmTableColumn>` 或嵌套的 `<TmTableColumnGroup>`） | `-` |
| `title` | 自定义组头渲染 | `{ title, column }` |

### 与 TmTable（vxe）的关系

与 [`TmTableColumn`](./table-column) 完全一致：`TmTable` 走 vxe 的 `columns` 数组配置（支持 `children` 做分组表头），ant 模板列与之**不混用**。需要模板写法就使用原生 `<a-table>`。

### TmTableColumnGroup Types

无公司扩展键、无自定义类型；类型由 ant 主入口提供：

```ts
import type { TableColumnGroupType, TableColumnProps } from 'ant-design-vue'
```
