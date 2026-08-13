## Purpose

Defines TmMentions, thin ant-design-vue Mentions wrappers (TmMentions/TmMentionsOption) for @-mention input with data-source aligned to TmSelect.

## Requirements

### Requirement: 提及子组件族

TmMentions SHALL 导出两个子组件：`TmMentions` / `TmMentionsOption`，分别薄封装 ant Mentions 的 Mentions / MentionsOption。

#### Scenario: @提及输入

- **WHEN** 渲染 `<TmMentions><TmMentionsOption value="user1">用户一</TmMentionsOption></TmMentions>`
- **THEN** 输入 `@` 时弹出提及候选

#### Scenario: options 数据源

- **WHEN** 传入 `:options="[{ value: 'user1', label: '用户一' }]"`
- **THEN** 提及候选按数据源渲染

### Requirement: ant 原生透传

TmMentions SHALL 透传 ant Mentions 原生 props / events（`value` / `prefix` / `placeholder` / `rows` / `disabled` / `onChange` / `onSelect`）。

#### Scenario: 自定义前缀

- **WHEN** 传入 `prefix="#"` 或 `:prefix="['@','#']"`
- **THEN** 输入对应前缀字符时触发提及
