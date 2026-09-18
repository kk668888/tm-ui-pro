## Purpose

定义 TmTableColumn 表格列模板写法的公开行为：ant Table.Column 的库内别名（库内表格主推 TmTable/vxe 封装，本组件服务业务直接使用 ant `<a-table>` 模板写法的场景），与原生 `<a-table-column>` 等价承载列定义。

## Requirements

### Requirement: 模板列声明契约

TmTableColumn 作为 ant Table 的模板子组件时 SHALL 将 `title` / `dataIndex` / `width` / `key` 等属性转换为对应列定义，默认插槽作为该列单元格的自定义渲染内容，行为与 ant 原生 `<a-table-column>` 写法一致（别名复用，vnode.type 全等，SHALL NOT 破坏 ant Table 对列子组件的识别）。

#### Scenario: 模板列渲染
- **WHEN** 业务 `<TmTableColumn title="名称" data-index="name" />`
- **THEN** 表格出现「名称」列并按 `name` 字段取值渲染

### Requirement: 原生属性透传

TmTableColumn SHALL 透传列级原生属性（`sorter` / `fixed` / `align` / `customRender` 相关插槽等），行为与 ant 原生一致，不做二次裁决。

#### Scenario: 排序列
- **WHEN** 业务传 `sorter: true`
- **THEN** 该列表头出现排序交互，行为与原生写法一致
