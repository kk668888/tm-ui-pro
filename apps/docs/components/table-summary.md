# TableSummary 总结栏容器

ant Table 模板写法的库内别名：**汇总栏容器**，承载 `Row` / `Cell` 渲染表格底部的合计行。与原生 `<a-table-summary>` **完全等价**。

> ⚠️ **只对原生 `<a-table>` 有效**
>
> 库内表格主推 `TmTable`（**vxe-table** 封装、`columns` prop 驱动），它**不消费** ant 的模板列子组件（含汇总栏）。本组件服务的是「业务直接用 ant `<a-table>`」的场景，与 `TmTable` **两套体系不混用**。

## 何时使用

- 表格底部需要有合计 / 平均 / 小计等**汇总行**。
- 数据量大需要横向滚动时，希望汇总行**始终贴在底部可见**（`fixed`）。
- 汇总行需要跨列合并单元格（配合 [`TmTableSummaryCell`](./table-summary-cell) 的 `col-span`）。

## 基础用法

**必须写在 `<a-table>` 的 `#summary` 插槽内**——ant 的 tfoot 容器通过 `provide` 下发列信息（列数、固定偏移），`TmTableSummary` 及其子组件依赖这份上下文完成列位计算。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import SummaryDemo from '../../../packages/ui/src/components/table-columns/demos/summary.vue'
import SummaryDemoCode from '../../../packages/ui/src/components/table-columns/demos/summary.vue?raw'

// TmPropsTable 数据：TmTableSummary Props 表格（数据驱动渲染）
const summaryProps = [
  {
    prop: 'fixed',
    desc: '汇总栏是否固定：为真时 ant 把汇总栏从 tfoot 抽出、作为独立底部容器渲染，横向滚动时保持可见（通常与 `:scroll="{ x }"` 搭配）',
    type: 'boolean',
    default: 'false',
  },
]
</script>

<DemoBlock :code="SummaryDemoCode">
  <SummaryDemo />
</DemoBlock>

## 写法要点

1. **位置**：`<a-table>` → `#summary` 插槽 → `<TmTableSummary>` → `<TmTableSummaryRow>` → `<TmTableSummaryCell>`，逐层嵌套，不能跳出表格。
2. **列位**：每个 Cell 用 `:index`（从 0 开始）指明落在第几列，ant 据此对齐；`col-span` / `row-span` 做合并（详见 [TmTableSummaryCell](./table-summary-cell)）。
3. **对齐**：建议与对应列的 `align` 保持一致，否则合计值会与列内容错位。
4. **何时用 `fixed`**：表格没有横向滚动时不需要；`:scroll="{ x }"` 时必须加，否则汇总栏会随内容滚出可视区。

## 依赖表格上下文（不要自行包裹）

ant 的 `TableSummary` 通过 `inject` 读取表格上下文（`useInjectTable`）来向表格登记「我是否固定」，`SummaryCell` 再 `inject` 汇总上下文取列信息。Vue 的 `provide`/`inject` 沿**父组件链**查找，若把 `TmTableSummary` 包进自定义组件再渲染，链条断开、汇总栏会渲染异常。请**直接**在 `#summary` 插槽内使用。

## API

### TmTableSummary Props

<TmPropsTable :data="summaryProps" />

### TmTableSummary Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 汇总行内容，放 `<TmTableSummaryRow>`（可多行） |

### 与 TmTable（vxe）的关系

`TmTable`（vxe）的合计能力走 vxe 自身的 `show-footer` / `footer-method` 配置，与本套 ant 模板写法**不混用**；需要模板写法请直接用原生 `<a-table>`。

### TmTableSummary Types

无公司扩展键、无自定义类型；ant 主入口仅导出组件本体（未导出 Summary 的 Props 类型）：

```ts
// 组件本体（供按需 import 使用）
import { TableSummary, TableSummaryRow, TableSummaryCell } from 'ant-design-vue'
```
