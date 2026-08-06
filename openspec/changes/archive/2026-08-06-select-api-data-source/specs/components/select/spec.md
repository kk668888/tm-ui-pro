## Purpose

Defines TmSelect's data acquisition behaviors: loading initial options from an API on mount, mapping arbitrary API responses to options, remote search with debounce and minimum input length, and coexistence of API-loaded baseline options with search-time result overrides.

## ADDED Requirements

### Requirement: api 挂载加载数据

当业务配置 `api` 请求函数时，TmSelect SHALL 在挂载时调用一次该函数获取初始选项列表，并将映射后的结果渲染为下拉选项。`api` 是"获取数据"模式，与"搜索"模式（`remote`）语义独立。未配置 `api` 时 SHALL NOT 发起任何挂载请求。

#### Scenario: 挂载时加载并填充选项

- **WHEN** 组件挂载且配置了 `api`
- **THEN** 组件调用 `api` 一次，并把响应映射后的选项渲染为下拉选项

#### Scenario: 未配置 api 不发起请求

- **WHEN** 组件挂载且未配置 `api`
- **THEN** 不发起任何数据请求，下拉选项为空或仅来自本地 `options`

#### Scenario: api 请求失败不阻塞组件

- **WHEN** `api` 返回的 Promise reject
- **THEN** 组件不抛出未捕获错误、loading 状态复位，下拉保持为空

### Requirement: 响应映射为 options

TmSelect SHALL 将 `api` 返回的任意响应结构映射为 `{ label, value }` 选项数组。映射优先级：`resultMap` 自定义函数 > `fieldNames` 字段名映射 > 常见格式智能识别。`api` 挂载加载时 SHALL 调用 `api({})`，固定参数由业务闭包捕获，组件不注入搜索词。

#### Scenario: 智能识别常见响应格式

- **WHEN** `api` 返回顶层数组 `[{ label, value }]`、`{ data: [...] }`、`{ data: { records: [...] } }` 或 `{ data: { list: [...] } }`
- **THEN** 组件识别其中的数组并映射为选项，`label`/`value` 取默认字段名

#### Scenario: fieldNames 自定义字段名

- **WHEN** 配置了 `fieldNames: { label: 'name', value: 'id' }` 且响应元素含 `name`/`id` 字段
- **THEN** 选项的 `label` 取自 `name`、`value` 取自 `id`

#### Scenario: resultMap 完全自定义优先

- **WHEN** 同时配置了 `resultMap` 与 `fieldNames`
- **THEN** 仅 `resultMap` 生效，其返回值直接作为选项数组

#### Scenario: api 挂载调用不带搜索词

- **WHEN** 配置了 `api` 且组件挂载
- **THEN** `api` 收到空参数对象 `{}`，固定参数由业务闭包捕获

### Requirement: remote 搜索防抖与最小输入长度

`remote` 是"搜索"模式：仅当用户输入达到 `minLength` 才可能发起请求，且请求 SHALL 经过 `debounce` 毫秒防抖合并连续输入。防抖窗口内新输入 SHALL 取消上一次待发请求。

#### Scenario: 低于最小输入长度不发起请求

- **WHEN** 配置了 `minLength: 2` 且用户输入单个字符 `'a'`
- **THEN** 不调用 `remote`，下拉不更新

#### Scenario: 防抖合并连续输入

- **WHEN** 用户快速连续输入多个字符且间隔小于 `debounce` 毫秒
- **THEN** 仅发起一次请求，使用最终输入的完整字符串

### Requirement: api 与 remote 共存

同时配置 `api` 与 `remote` 时，TmSelect SHALL 用 `api` 结果作为常驻基础选项；用户搜索（≥minLength 且防抖后）时用 `remote` 结果临时覆盖渲染；清空输入后 SHALL 回退到 `api` 基础选项。两种数据源写入互不覆盖，loading 状态 SHALL 合并（任一请求进行中即为 loading）。

#### Scenario: 初始列表与搜索覆盖

- **WHEN** 配置了 `api` 和 `remote`，挂载后 `api` 填充了选项
- **AND** 用户输入达到 minLength 触发 `remote` 搜索并返回结果
- **THEN** 下拉渲染 `remote` 的搜索结果

#### Scenario: 清空输入回退基础列表

- **WHEN** 用户输入触发过 `remote` 搜索后清空输入
- **THEN** 下拉回退渲染 `api` 加载的基础选项

#### Scenario: loading 状态合并

- **WHEN** `api` 或 `remote` 任一请求进行中
- **THEN** 组件的 loading 为真；全部请求结束后为假
