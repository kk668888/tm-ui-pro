# TableSummaryCell 总结栏单元格

ant Table 模板写法的库内别名：汇总栏中的**单元格**，用 `index` 指定列位、`col-span` / `row-span` 做合并、`align` 控制对齐。与原生 `<a-table-summary-cell>` **完全等价**。

> ⚠️ **只对原生 `<a-table>` 有效**
>
> 库内表格主推 `TmTable`（**vxe-table** 封装），它不消费 ant 的模板列子组件（含汇总栏）。本组件服务「业务直接用 ant `<a-table>`」的场景，与 `TmTable` **不混用**。

## 何时使用

- 汇总行中显示合计 / 平均 / 小计等**数值**，并与上方列对齐。
- 「合计」这类**说明文字需要横跨多列**（`col-span`）。
- 需要竖向合并单元格（`row-span`）构造多行汇总的骨架。

## 基础用法

每个 Cell 用 `:index` 声明落在第几列（从 0 开始），`align` 建议与对应列一致；跨列用 `:col-span`，跨行用 `:row-span`。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import SummaryDemo from '../../../packages/ui/src/components/table-columns/demos/summary.vue'
import SummaryDemoCode from '../../../packages/ui/src/components/table-columns/demos/summary.vue?raw'

// TmPropsTable 数据：TmTableSummaryCell Props 表格（数据驱动渲染）
const summaryCellProps = [
  {
    prop: 'index',
    desc: '该单元格所在列位（**从 0 开始**，对应列声明顺序）。这是定位单元格的唯一依据，不是「第几个写」',
    type: 'number',
    default: '-',
  },
  {
    prop: 'col-span',
    desc: '横向合并的列数（默认 1）。如 `:col-span="2"` 表示横跨当前列与下一列，被合并掉的列不要再写 Cell',
    type: 'number',
    default: '1',
  },
  {
    prop: 'row-span',
    desc: '纵向合并的行数（用于多行汇总时合并上下行单元格）',
    type: 'number',
    default: '-',
  },
  {
    prop: 'align',
    desc: '单元格对齐方式；建议与同列 `align` 一致（数值列通常 `right`），否则合计值会与列内容错位',
    type: "'left' | 'center' | 'right'",
    default: "'left'",
  },
]
</script>

<DemoBlock :code="SummaryDemoCode">
  <SummaryDemo />
</DemoBlock>

## 合并单元格的写法

```vue
<TmTableSummary>
  <TmTableSummaryRow>
    <!-- 「合计」横跨第 0、1 列（商品 + 单价），第 1 列不再单独写 Cell -->
    <TmTableSummaryCell :index="0" :col-span="2" align="right">合计金额</TmTableSummaryCell>
    <!-- 合计值落在第 2 列（数量列），与列对齐 -->
    <TmTableSummaryCell :index="2" align="right">{{ total }}</TmTableSummaryCell>
  </TmTableSummaryRow>
</TmTableSummary>
```

两个易错点：

1. **被合并的列不要重复写 Cell**：`index=0` 且 `col-span=2` 已经占了第 0、1 列，再写 `:index="1"` 会多出一个单元格、整行错位。
2. **`:index` 必须写**：不写时列位无从确定（ant 内部按 `index` 计算该单元格所占的列区间与固定列偏移）。

## 依赖汇总上下文

`TmTableSummaryCell` 通过 `inject` 读取汇总上下文（列定义、粘性偏移）来计算列宽与固定信息，因此**必须位于 `<a-table>` 的 `#summary` 插槽 → `TmTableSummary` → `TmTableSummaryRow` 之内**。抽到自定义组件里渲染会因父链断裂导致列位错乱。

## 一个内部细节

当单元格的右边界正好落在「出现横向滚动条的最后一列」上时，ant 会自动把 `col-span` 加 1，让汇总栏覆盖滚动条占位列——这是 ant 原生行为（`mergedColSpan = lastIndex + 1 === scrollColumnIndex ? colSpan + 1 : colSpan`），业务侧无需手动处理。

## API

### TmTableSummaryCell Props

<TmPropsTable :data="summaryCellProps" />

### TmTableSummaryCell Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 单元格内容（文本、数值或任意 vnode） |

### 与 TmTable（vxe）的关系

`TmTable`（vxe）的合计单元格由 `footer-method` 的返回值决定，不支持这种「模板单元格 + 列位声明」的写法，两者**不混用**。

### TmTableSummaryCell Types

无公司扩展键、无自定义类型；ant 主入口仅导出组件本体（未导出 Props 类型）：

```ts
import { TableSummaryCell } from 'ant-design-vue'
```
