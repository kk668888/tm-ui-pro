## Purpose

定义 TmTableColumnGroup 表格表头分组的公开行为：ant Table.ColumnGroup 的库内别名（服务业务直接使用 ant `<a-table>` 的场景），将多列聚合为带标题的表头分组。

## ADDED Requirements

### Requirement: 表头分组契约

TmTableColumnGroup 作为 ant Table 的模板子组件时 SHALL 以 `title` 渲染跨列的分组表头，插槽内的 TmTableColumn 归入该分组；别名复用使行为与 ant 原生写法完全一致（SHALL NOT 破坏 ant 的分组识别）。

#### Scenario: 分组表头
- **WHEN** `<TmTableColumnGroup title="基本信息">` 内含两列
- **THEN** 表头出现「基本信息」分组，横跨其下两列

### Requirement: 原生属性透传

TmTableColumnGroup SHALL 透传原生属性，业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性
- **THEN** 属性原样作用于分组表头
