## Purpose

定义 TmSelectOptGroup 下拉选项分组的公开行为：将多个 TmSelectOption 以带标题的分组渲染（ant Select.OptGroup 薄封装），库薄封装 SHALL NOT 破坏 ant 的分组识别。

## ADDED Requirements

### Requirement: 分组渲染契约

TmSelectOptGroup 作为 TmSelect 插槽子内容时 SHALL 渲染为带标题的选项分组：`label` 作为组标题，插槽内的 TmSelectOption 归入该组展示。

#### Scenario: 分组展示
- **WHEN** `<TmSelectOptGroup label="组一">` 内含两个 TmSelectOption
- **THEN** 下拉中以「组一」为标题分组展示两个选项

### Requirement: 原生属性透传

TmSelectOptGroup SHALL 透传原生属性与事件，业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性（如自定义 class）
- **THEN** 属性原样作用于分组节点
