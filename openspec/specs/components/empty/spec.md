## Purpose

Defines TmEmpty, a thin ant-design-vue Empty wrapper that applies a company default empty-state description so business pages get a consistent "no data" hint without repeating the prop.

## Requirements

### Requirement: 公司默认空态文案

TmEmpty SHALL 在业务未传 `description` 时使用公司默认文案「暂无数据」。

#### Scenario: 未传 description 用公司默认

- **WHEN** 未传 description
- **THEN** 空态展示公司默认文案「暂无数据」

### Requirement: 业务覆盖 description

TmEmpty SHALL 在业务显式传 `description` 时以业务值覆盖公司默认。

#### Scenario: 显式 description 覆盖默认

- **WHEN** 传入 `description: '列表为空，请先创建'`
- **THEN** 空态展示业务文案，公司默认不生效

### Requirement: ant 原生能力透传

TmEmpty SHALL 透传 ant Empty 原生 props / slots（如 `image` / `imageStyle` / default 插槽），业务对 ant 的用法不变。

#### Scenario: 自定义插画透传

- **WHEN** 传入自定义 image 或 default 插槽
- **THEN** 空态按业务自定义渲染
