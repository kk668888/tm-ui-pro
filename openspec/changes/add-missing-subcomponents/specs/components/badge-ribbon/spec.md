## Purpose

定义 TmBadgeRibbon 缎带徽标的公开行为：ant Badge.Ribbon 的库内薄封装，将插槽内容包入带缎带角标的容器。

## ADDED Requirements

### Requirement: 缎带包裹契约

TmBadgeRibbon SHALL 将默认插槽内容包入容器并在其上缘渲染缎带：`text` 为缎带文本、`color` 为自定义颜色、`placement` 控制缎带位于左上或右上。

#### Scenario: 右上缎带
- **WHEN** 业务传 `text="新" placement="right"` 并包入一张卡片
- **THEN** 卡片右上角展示「新」缎带，卡片内容不受影响

### Requirement: 原生属性透传

TmBadgeRibbon SHALL 透传原生属性与事件，业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性
- **THEN** 属性原样作用于缎带节点
