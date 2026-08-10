# components/table Specification

## Purpose
Defines TmTable's table rendering behaviors: ant-design-vue pagination and search form as the outer chrome around a vxe-grid body, remote and static data driving, density switching, and visual alignment with the ant design theme.
## Requirements
### Requirement: ant 分页器渲染

TmTable SHALL 在表格底部自动渲染 ant-design-vue 的 Pagination 组件作为分页器，不再使用 vxe 内置分页器。远程与静态两种数据模式 SHALL 均渲染分页器。分页器 SHALL 展示当前页码、页大小选择与总条数；业务未配置分页信息时 SHALL 使用默认页大小（10）与页大小选项（10/20/50）。

#### Scenario: 远程模式渲染 ant 分页器

- **WHEN** 配置了 `request` 且组件挂载
- **THEN** 表格底部渲染 ant Pagination，展示总条数与当前页码

#### Scenario: 静态模式渲染 ant 分页器

- **WHEN** 未配置 `request` 且传入静态 `data`
- **THEN** 表格底部渲染 ant Pagination，总条数等于 `data.length`

#### Scenario: 分页器样式遵循 ant 主题

- **WHEN** 表格在 ant ConfigProvider 主题上下文内渲染
- **THEN** 分页器视觉与 ant 主题 token 一致

### Requirement: 远程分页联动拉数

配置 `request` 时，TmTable SHALL 在 ant Pagination 的页码或页大小变化时发起一次新的数据请求，请求参数 SHALL 携带变化后的当前页码与页大小。加载期间 SHALL 显示加载态，且并发快速翻页时 SHALL 只采用最后一次请求的结果渲染（乱序响应被丢弃）。

#### Scenario: 翻页触发重新拉数

- **WHEN** 用户点击下一页，页码从 1 变为 2
- **THEN** TmTable 发起新的数据请求，携带 `currentPage: 2`，并用返回数据渲染第 2 页

#### Scenario: 切换页大小触发重新拉数

- **WHEN** 用户在分页器把页大小从 10 切换为 20
- **THEN** TmTable 发起新的数据请求，携带 `pageSize: 20` 且页码重置为 1

#### Scenario: 快速翻页丢弃乱序响应

- **WHEN** 用户快速连续翻页（第 2 页 → 第 3 页 → 第 4 页）且旧响应晚于新响应到达
- **THEN** 表格只渲染第 4 页的最新响应，旧响应不覆盖新数据

### Requirement: 静态数据本地分页

未配置 `request` 时，TmTable SHALL 将传入的静态 `data` 按当前页大小本地切片，仅渲染当前页的数据行。分页器 `total` SHALL 等于 `data` 总条数；翻页 SHALL 切换切片而不发起任何网络请求。

#### Scenario: 静态数据按页渲染

- **WHEN** 传入 25 条静态数据且页大小为 10
- **THEN** 表格渲染前 10 条，分页器显示总条数 25

#### Scenario: 翻页切换静态切片

- **WHEN** 用户在分页器翻到第 3 页
- **THEN** 表格渲染第 21–25 条数据，不发起网络请求

#### Scenario: 数据少于单页容量

- **WHEN** 静态数据不足一页（如 3 条，页大小 10）
- **THEN** 表格渲染全部 3 条，分页器仅显示单页

### Requirement: search 声明式搜索表单

配置 `search` 时，TmTable SHALL 在表格上方按声明字段渲染 ant-design-vue 搜索表单（栅格布局，支持输入框 / 下拉选择 / 日期等字段类型）。点击「查询」SHALL 收集各字段当前值为查询条件并触发一次数据请求；点击「重置」SHALL 清空全部字段值并触发一次数据请求。未配置 `search` 时 SHALL 不渲染搜索表单，也不影响表格其他行为。

#### Scenario: 查询收集字段值并发起请求

- **WHEN** 配置了 `search` 且用户在「姓名」字段输入后点击「查询」
- **THEN** 表格发起数据请求，请求参数携带查询条件 `{ name: 输入值 }`

#### Scenario: 重置清空字段并重拉

- **WHEN** 用户已输入查询条件后点击「重置」
- **THEN** 全部字段清空，表格发起不带查询条件的数据请求

#### Scenario: 未配置 search 不渲染表单

- **WHEN** 未配置 `search`
- **THEN** 表格上方不渲染任何搜索表单区域

### Requirement: 查询与分页参数合并

远程模式下，search 查询条件 SHALL 与分页参数在同一数据请求中同时传给业务取数函数。触发「查询」后页码 SHALL 重置为 1，确保结果从首页展示。

#### Scenario: 查询携带分页参数

- **WHEN** 用户点击「查询」且当前在第 3 页
- **THEN** 数据请求参数携带查询条件、`currentPage: 1` 与当前页大小

#### Scenario: 带条件翻页保留查询条件

- **WHEN** 用户查询后翻页
- **THEN** 后续数据请求 SHALL 保留查询条件并携带新的页码

### Requirement: 密度切换

TmTable 支持 `density` 扩展键控制行高密度：`compact`（紧凑）/ `default`（默认）/ `loose`（宽松）。切换密度 SHALL 立即改变表格行高渲染。

#### Scenario: 切换密度改变行高

- **WHEN** 用户将 `density` 从 `default` 切换为 `compact`
- **THEN** 表格行高变为紧凑档，视觉上更窄

#### Scenario: 未配置密度使用默认档

- **WHEN** 未配置 `density`
- **THEN** 表格使用默认行高渲染

### Requirement: 视觉规范默认与主题对齐

TmTable SHALL 提供公司视觉默认：`border`（边框）、`stripe`（斑马纹）、`showOverflow`（内容溢出 tooltip），业务可通过同名 prop 覆盖。表格主体的边框、表头背景、行 hover、斑马纹、选中态与校验错误色等 SHALL 跟随 ant 主题 token（单一真相源），实现与公司其他 ant 组件视觉一致。

#### Scenario: 默认视觉开箱即用

- **WHEN** 业务仅传 `data` 与 `columns`
- **THEN** 表格展示边框、斑马纹与内容溢出省略

#### Scenario: 主题变化联动表格配色

- **WHEN** 外层 ant ConfigProvider 的主题 token 变化（如主色 / 边框色）
- **THEN** 表格主色、边框、hover 等配色随之联动

