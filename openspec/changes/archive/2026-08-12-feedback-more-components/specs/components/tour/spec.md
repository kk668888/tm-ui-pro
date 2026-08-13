## Purpose

定义 TmTour 引导组件的公开行为，为功能引导和首次体验提供统一的遮罩步骤能力。

## ADDED Requirements

### Requirement: 引导步骤
TmTour SHALL 支持多步骤引导、锚定元素、遮罩与箭头配置，并支持受控打开状态。

#### Scenario: 执行引导
- **WHEN** 业务提供步骤列表并触发打开
- **THEN** 组件依次展示引导步骤

### Requirement: 原生属性透传
TmTour SHALL 透传 Tour 原生属性、事件和插槽，业务显式配置 SHALL 覆盖公司默认值。

#### Scenario: 受控关闭引导
- **WHEN** 业务受控设置打开状态为 false
- **THEN** 引导层关闭并保持业务状态一致

#### Scenario: 关闭 / 完成自动闭合
- **WHEN** 用户点击关闭或完成引导
- **THEN** TmTour 将关闭事件桥接为 update:open=false，业务通过 v-model:open 即可闭合，无需额外处理 onClose
