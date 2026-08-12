## Purpose

Defines TmAutoComplete, a thin ant-design-vue AutoComplete wrapper with option data-source semantics aligned to TmSelect.

## ADDED Requirements

### Requirement: 数据源对齐 TmSelect

TmAutoComplete SHALL 将 `options` 数据源语义与 TmSelect 对齐（`label` / `value` 结构），业务可复用既有数据源。

#### Scenario: options 数据源

- **WHEN** 传入 `:options="[{ value: 'a', label: '选项A' }]"`
- **THEN** 输入时下拉匹配显示选项A

#### Scenario: 选择后回填

- **WHEN** 用户选中选项
- **THEN** 输入框回填选中值，触发 ant 事件

### Requirement: ant 原生透传

TmAutoComplete SHALL 透传 ant AutoComplete 原生 props / events（`value` / `options` / `placeholder` / `disabled` / `allowClear` / `filterOption` / `onSelect` / `onChange`）。

#### Scenario: 受控值

- **WHEN** 传入 `v-model:value`
- **THEN** 输入框按受控值渲染

### Requirement: filterOption 公司默认开启过滤

ant AutoComplete 的 `filterOption` 默认 `false`（输入不过滤、展示全部选项），配合 `defaultActiveFirstOption` 易误选首个选项。TmAutoComplete SHALL 提供公司默认 `filterOption`（按选项 `value` 大小写不敏感子串匹配），业务传 `filterOption` 函数覆盖、传 `false` 关闭。

#### Scenario: 默认按 value 过滤

- **WHEN** 输入 `o` 且选项为 Apple / Banana / Orange
- **THEN** 下拉仅展示匹配项（Orange），不展示 Apple

#### Scenario: 业务关闭过滤

- **WHEN** 传入 `filter-option="false"`
- **THEN** 输入不过滤，展示全部选项（ant 原生行为）
