## Purpose

定义 TmAutoCompleteOptGroup 自动完成选项分组的公开行为：将多个 TmAutoCompleteOption 以带标题分组渲染，库薄封装 SHALL NOT 破坏 ant 的分组识别。

## ADDED Requirements

### Requirement: 分组渲染契约

TmAutoCompleteOptGroup 作为 TmAutoComplete 插槽子内容时 SHALL 渲染为带标题的候选分组：`label` 作为组标题，插槽内选项归入该组展示。

#### Scenario: 分组展示
- **WHEN** `<TmAutoCompleteOptGroup label="推荐">` 内含候选项
- **THEN** 候选列表以「推荐」为标题分组展示

### Requirement: 原生属性透传

TmAutoCompleteOptGroup SHALL 透传原生属性与事件，业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性
- **THEN** 属性原样作用于分组节点
