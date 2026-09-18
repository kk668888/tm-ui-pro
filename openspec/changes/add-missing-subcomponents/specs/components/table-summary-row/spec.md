## Purpose

定义 TmTableSummaryRow 总结栏行的公开行为：TmTableSummary 内的行容器（ant Table.Summary.Row 薄封装）。

## ADDED Requirements

### Requirement: 行渲染契约

TmTableSummaryRow 作为 TmTableSummary 插槽子内容时 SHALL 渲染为总结栏中的一行，插槽内的 TmTableSummaryCell 按序排布，与表体列对齐。

#### Scenario: 行内单元对齐
- **WHEN** 行内放置三个单元格
- **THEN** 三者按列序渲染且与表体前三列水平对齐

### Requirement: 原生属性透传

TmTableSummaryRow SHALL 透传原生属性（如 `class` / 事件），业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性
- **THEN** 属性原样作用于行节点
