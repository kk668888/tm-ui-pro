# TableSummaryRow 总结栏行

ant Table 模板写法的库内别名：汇总栏中的**行容器**，内部按顺序放若干个 [`TmTableSummaryCell`](./table-summary-cell)。与原生 `<a-table-summary-row>` **完全等价**。

> ⚠️ **只对原生 `<a-table>` 有效**
>
> 库内表格主推 `TmTable`（**vxe-table** 封装），它不消费 ant 的模板列子组件（含汇总栏）。本组件服务「业务直接用 ant `<a-table>`」的场景，与 `TmTable` **不混用**。

## 何时使用

- 汇总栏需要**多行**时（例如第一行「小计」、第二行「合计（含税）」）。
- 需要按列分段跨列合并时（配合 [Cell](./table-summary-cell) 的 `col-span` / `row-span`）。

## 基础用法

`TmTableSummaryRow` 本身是**透明容器**（无 props，只对应一个 `<tr>`），行内单元格用 `:index` 指定列位。多写几个 Row 即得多行汇总。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import SummaryDemo from '../../../packages/ui/src/components/table-columns/demos/summary.vue'
import SummaryDemoCode from '../../../packages/ui/src/components/table-columns/demos/summary.vue?raw'

// TmPropsTable 数据：TmTableSummaryRow Props 表格（数据驱动渲染）
const summaryRowProps = [
  {
    prop: '（无自有 props）',
    desc: '仅渲染一个 `<tr>`，全部布局信息由行内 Cell 的 `index` / `col-span` / `row-span` 决定；如需给行加类名 / 样式，直接用普通 `class` / `style`（经 $attrs 落到 `<tr>` 上）',
    type: '-',
    default: '-',
  },
]
</script>

<DemoBlock :code="SummaryDemoCode">
  <SummaryDemo />
</DemoBlock>

## 写法要点

1. **层级**：`<TmTableSummary>` → `<TmTableSummaryRow>`（可多行） → `<TmTableSummaryCell>`。
2. **行内列位由 Cell 决定**：Row 不参与列位分配，所以「先写哪个 Cell」不等于「落在哪一列」——每列由 Cell 的 `:index` 指定；留空列请显式写一个空 Cell 占位（或跳过该 index，ant 仍按 index 对齐）。
3. **跨列合并**：由 Cell 的 `:col-span` 声明（如 `<Cell :index="0" :col-span="2">`），详见 [TmTableSummaryCell](./table-summary-cell)。
4. **粘性**：需要横向滚动时始终可见，由外层 `TmTableSummary` 的 `fixed` 控制，Row 无需额外配置。

## 依赖表格上下文

Row 自身不读取上下文，但它内部的 **Cell** 会 `inject` 汇总上下文（列数、固定列偏移）。因此 Row（连同其 Cell）必须留在 `<a-table>` 的 `#summary` 插槽内，**不要**把 Row/Cell 抽到自定义组件里再渲染（父链断裂会导致列位与固定计算错乱）。

## API

### TmTableSummaryRow Props

<TmPropsTable :data="summaryRowProps" />

### TmTableSummaryRow Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 行内单元格，放 `<TmTableSummaryCell>`（数量与列数对应） |

### 与 TmTable（vxe）的关系

`TmTable`（vxe）的多行合计由 `footer-method` 返回二维数组表达，与本套 ant 模板写法**不混用**。

### TmTableSummaryRow Types

无公司扩展键、无自定义类型；ant 主入口仅导出组件本体（未导出 Props 类型）：

```ts
import { TableSummaryRow } from 'ant-design-vue'
```
