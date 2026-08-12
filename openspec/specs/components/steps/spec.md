## Purpose

Defines TmSteps, thin ant-design-vue Steps wrappers (TmSteps/TmStep) for unified step-progress flows.

## Requirements

### Requirement: 步骤条子组件族

TmSteps SHALL 导出两个子组件：`TmSteps` / `TmStep`，分别薄封装 ant Steps 的 Steps / Step。

#### Scenario: 步骤条渲染

- **WHEN** 渲染 `<TmSteps :current="1"><TmStep title="步骤一" /><TmStep title="步骤二" /><TmStep title="步骤三" /></TmSteps>`
- **THEN** 渲染 ant 步骤条，步骤二为当前态

#### Scenario: 状态覆盖

- **WHEN** 某 Step 传 `status="error"`
- **THEN** 该步骤呈现错误态

### Requirement: ant 原生透传

TmSteps 家族 SHALL 透传 ant Steps 原生 props / slots / events（`type` / `direction` / `size` / `items` / `progressDot`）。

#### Scenario: 方向与尺寸

- **WHEN** 传入 `direction="vertical"` 与 `size="small"`
- **THEN** 步骤条纵向小尺寸渲染
