## Purpose

定义 TmTableSummaryCell 总结栏单元格的公开行为：TmTableSummaryRow 内的单元格（ant Table.Summary.Cell 薄封装），以列索引定位与跨列/跨行能力。

## Requirements

### Requirement: 单元格契约

TmTableSummaryCell SHALL 以 `index` 声明其对应的列位（从 0 起），`col-span` / `row-span` 控制跨列/跨行，`align` 控制对齐；默认插槽为单元格内容。

#### Scenario: 跨列单元格
- **WHEN** 业务 `<TmTableSummaryCell :index="0" :col-span="2">合计</TmTableSummaryCell>`
- **THEN** 「合计」单元格占据前两列宽度

### Requirement: 原生属性透传

TmTableSummaryCell SHALL 透传原生属性，业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性
- **THEN** 属性原样作用于单元格节点
