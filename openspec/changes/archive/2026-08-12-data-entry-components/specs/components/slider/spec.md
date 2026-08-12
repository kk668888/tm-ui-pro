## Purpose

Defines TmSlider, a thin ant-design-vue Slider wrapper for range/step inputs, keeping ant's value-hint tooltip behavior.

## ADDED Requirements

### Requirement: tooltip 显示当前值

TmSlider SHALL 透传 ant Slider 的 `tipFormatter`，默认展示当前数值（ant 原生行为），业务可自定义格式化。

#### Scenario: 默认 tooltip 显示值

- **WHEN** 渲染 `<TmSlider v-model:value="val" />` 并 hover 滑块
- **THEN** tooltip 显示当前数值

#### Scenario: 业务覆盖格式化

- **WHEN** 传入自定义 `tipFormatter`
- **THEN** tooltip 按业务函数渲染

### Requirement: ant 原生透传

TmSlider SHALL 透传 ant Slider 原生 props / events（`min` / `max` / `step` / `range` / `marks` / `disabled` / `onChange` / `onAfterChange`），业务对 ant 的用法不变。

#### Scenario: 范围滑块

- **WHEN** 传入 `range` 与 `:value="[20, 80]"`
- **THEN** 渲染双滑块范围选择

#### Scenario: 步长与标记

- **WHEN** 传入 `:step="10"` 与 `:marks="{0:'0',50:'50',100:'100'}"`
- **THEN** 滑块按步长滑动并显示刻度
