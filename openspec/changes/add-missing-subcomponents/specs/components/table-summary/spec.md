## Purpose

定义 TmTableSummary 表格总结栏容器的公开行为：ant Table.Summary 的库内别名（服务业务直接使用 ant `<a-table>` 的场景），承载总结栏（合计行等）的固定与渲染契约。

## ADDED Requirements

### Requirement: 总结栏渲染契约

TmTableSummary 作为 ant Table 的总结栏承载 SHALL 将插槽内的 TmTableSummaryRow 渲染到表格底部总结区域；`fixed` 传参时总结栏 SHALL 随横向滚动固定（别名复用，行为与原生写法一致）。

#### Scenario: 合计行展示
- **WHEN** 总结栏内放置含「合计」单元格的行
- **THEN** 该行渲染在表格底部，与表体对齐

#### Scenario: 固定总结栏
- **WHEN** 业务传 `fixed` 且表格横向滚动
- **THEN** 总结栏随滚动保持固定可见

### Requirement: 原生属性透传

TmTableSummary SHALL 透传原生属性，业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性
- **THEN** 属性原样作用于总结栏容器
