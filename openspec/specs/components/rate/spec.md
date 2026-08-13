## Purpose

Defines TmRate, a thin ant-design-vue Rate wrapper for star/score input, keeping ant's default character and tooltip behavior.

## Requirements

### Requirement: 默认星形与文案

TmRate SHALL 透传 ant Rate 原生 `character`（默认星形）与 `tooltips`，业务可覆盖。

#### Scenario: 默认星级

- **WHEN** 渲染 `<TmRate v-model:value="val" />`
- **THEN** 渲染 ant 默认星形评分

#### Scenario: 业务覆盖

- **WHEN** 传自定义 `character` 或 `tooltips`
- **THEN** 按业务配置渲染

### Requirement: ant 原生透传

TmRate SHALL 透传 ant Rate 原生 props / events（`count` / `allowHalf` / `allowClear` / `disabled` / `onChange`）。

#### Scenario: 半星

- **WHEN** 传入 `allow-half`
- **THEN** 支持半星评分

#### Scenario: 自定义数量

- **WHEN** 传入 `:count="10"`
- **THEN** 渲染 10 星
