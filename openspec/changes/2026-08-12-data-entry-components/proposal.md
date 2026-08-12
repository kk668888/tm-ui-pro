## Why

@tm/ui 数据录入层已覆盖核心控件，但仍有 8 个常用录入组件裸用 ant：Slider / Rate / Tree / AutoComplete / Mentions / Transfer 缺失，且只有 CheckboxGroup / RadioGroup 而无单个 Checkbox / Radio，业务组合表单（如评分、滑块、穿梭框）无法复用公司统一规范。此批补齐数据录入补充组件，是「100% 覆盖」路线图的第三批。

## What Changes

- 新增 8 个 ant 薄封装组件：`TmSlider`、`TmRate`、`TmTree`、`TmAutoComplete`、`TmMentions`、`TmTransfer`、`TmCheckbox`、`TmRadio`
- `TmCheckbox`：薄封装 ant Checkbox（单个），与既有 TmCheckboxGroup 同模块拆出，`value` 语义对齐
- `TmRadio`：薄封装 ant Radio（单个），与既有 TmRadioGroup 同模块拆出，`value` 语义对齐
- `TmSlider`：薄封装 ant Slider，公司默认值兜底（`tooltip` 文案）
- `TmRate`：薄封装 ant Rate，公司默认字符 / 计数兜底
- `TmTree`：薄封装 ant Tree（目录 / 权限树场景），`checkable` / 节点扩展键兜底
- `TmAutoComplete`：薄封装 ant AutoComplete，`options` 数据源对齐 TmSelect 语义
- `TmMentions`：薄封装 ant Mentions，`options` 对齐
- `TmTransfer`：薄封装 ant Transfer 穿梭框，公司默认标题 / 分页兜底
- 全部遵循既有封装范式：扩展键剥离、`$attrs` 合并、slots 全透传、`useForwardRef` 方法透传、`withDefaults` Boolean 陷阱兜底
- 注册导出：`index.ts` 追加 install + export，resolver 泛化覆盖；文档页 + demos + 侧边栏

## Capabilities

### New Capabilities

- `components/slider`: TmSlider 滑块（ant 原生透传 + 公司默认）
- `components/rate`: TmRate 评分（ant 原生透传 + 公司默认）
- `components/tree`: TmTree 树形控件（目录 / 权限树，ant 原生透传 + 扩展键）
- `components/auto-complete`: TmAutoComplete 自动完成（数据源语义对齐 TmSelect）
- `components/mentions`: TmMentions 提及（数据源语义对齐 TmSelect）
- `components/transfer`: TmTransfer 穿梭框（公司默认标题 / 分页）
- `components/checkbox`: TmCheckbox 复选框（单个，value 语义对齐，同模块拆出）
- `components/radio`: TmRadio 单选框（单个，value 语义对齐，同模块拆出）

### Modified Capabilities

- （无）

## Impact

- `packages/ui/src/components/{slider,rate,tree,auto-complete,mentions,transfer,checkbox,radio}/`（新增组件目录）
- `packages/ui/src/index.ts`（install 注册 + 组件/类型 export）
- `packages/ui/src/resolver.ts`（泛化覆盖，无需改动，build 验证）
- `apps/docs/.vitepress/config.ts`（侧边栏「表单」分组扩充）
- `apps/docs/components/{slider,rate,tree,auto-complete,mentions,transfer,checkbox,radio}.md`（文档页 + demos）
- `openspec/specs/components/*`（新增 8 个能力规格）
