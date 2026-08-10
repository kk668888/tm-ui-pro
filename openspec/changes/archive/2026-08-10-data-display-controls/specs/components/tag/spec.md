## Purpose

Defines TmTag, a thin ant-design-vue Tag wrapper that maps business status enums (success/processing/failed/warning) to semantic colors, so business pages never hand-write status colors and the company keeps a single color spec.

## ADDED Requirements

### Requirement: status 状态映射

TmTag SHALL 支持公司扩展键 `status`：`success` / `processing` / `failed` / `warning` 分别映射为公司统一的语义色（绿色 / 蓝色 / 红色 / 橙黄），业务无需手写颜色值。未知 status 值 SHALL 回退到中性默认色，不抛错。

#### Scenario: 已知 status 映射语义色

- **WHEN** 传入 `status: 'success'`
- **THEN** 标签呈现成功语义色（绿色），文本照常渲染

#### Scenario: 未知 status 回退默认

- **WHEN** 传入 `status: 'unknown-value'`
- **THEN** 标签回退到中性默认色，不抛错、不渲染异常

### Requirement: 显式 color 优先

TmTag SHALL 在业务显式传 `color` 时以该值覆盖 `status` 映射（业务精确控制优先于公司映射）。

#### Scenario: 显式 color 覆盖 status

- **WHEN** 同时传入 `status: 'success'` 与 `color: 'purple'`
- **THEN** 标签呈现 purple，status 映射不生效

### Requirement: ant 原生能力透传

TmTag SHALL 透传 ant Tag 原生 props / slots / events（如 `closable` / `onClose` / `icon` 等），业务对 ant 的用法不变。

#### Scenario: 可关闭标签

- **WHEN** 传入 `closable` 且用户点击关闭图标
- **THEN** 触发 ant 关闭行为与 onClose 回调
