## Purpose

定义 TmFloatButton 浮动按钮及子组件的公开行为，为悬浮操作入口和返回顶部能力提供统一承载。

## Requirements

### Requirement: 浮动按钮组合
TmFloatButton SHALL 导出 TmFloatButton、TmFloatButtonGroup 与 TmFloatButtonBackTop，并支持图标、描述、形状、位置与事件。

#### Scenario: 渲染浮动按钮
- **WHEN** 业务提供图标或描述内容
- **THEN** 组件按配置显示浮动按钮

#### Scenario: 返回顶部
- **WHEN** 使用 BackTop 子组件并设置目标滚动容器
- **THEN** 点击后滚动回顶部

### Requirement: 原生属性透传
TmFloatButton SHALL 透传 FloatButton 原生属性、事件和插槽，业务显式配置 SHALL 覆盖公司默认值。

#### Scenario: 受控展开收起
- **WHEN** 业务显式传入 `open=false`
- **THEN** 浮动按钮保持收起状态
