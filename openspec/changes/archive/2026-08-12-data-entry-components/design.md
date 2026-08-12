## Context

@tm/ui 批次 1（通用布局）、批次 2（导航）已实现并归档，薄封装范式成熟：`useForwardBindings(props, companyDefaults)` 消幻影 false、slots 全透传、`useForwardRef` 方法透传、公司默认收敛 `defaults.ts`。本批次补齐数据录入补充 8 组件（含单 Checkbox/Radio，补齐既有 group）。行为契约见 `specs/components/{slider,rate,tree,auto-complete,mentions,transfer,checkbox,radio}/spec.md`，动机见 `proposal.md`。

ant-design-vue 4.2.6 已确认导出：`Slider`、`Rate`、`Tree/TreeNode/DirectoryTree`、`AutoComplete`、`Mentions/MentionsOption`、`Transfer`、`Checkbox`、`Radio`。8 个 props 类型均无 HTMLAttributes 交集，可直接用于 `defineProps`。

## Goals / Non-Goals

**Goals:**
- 8 个数据录入组件与既有同构的薄封装骨架
- 单 Checkbox/Radio 与既有 CheckboxGroup/RadioGroup 值语义对齐
- Transfer 公司默认标题（源/目标列表）

**Non-Goals:**
- 不做 Tree 的懒加载节点管理（ant `loadData` 透传即可）
- 不做 Transfer 的渲染深度定制（ant `render` 透传）
- 不做 Checkbox/Radio 与 FormContext 的级联（既有 group 已实现，单组件透传即可）

## Decisions

### 1. 多子组件模块按 form 形态组织

tree（TmTree/TmTreeNode/TmDirectoryTree）与 mentions（TmMentions/TmMentionsOption）是多子组件模块，沿用既有形态：`index.ts` 分别 `withInstall` + 命名导出 + `export default` 对象形态。单组件模块（slider/rate/auto-complete/transfer/checkbox/radio）保持 `export default TmXxx`。

### 2. 单 Checkbox/Radio 与 group 值语义对齐

`TmCheckbox` 用 `v-model:checked`（布尔），`TmRadio` 用 `:checked`（在 TmRadioGroup 内时作为选项）。与既有 TmCheckboxGroup / TmRadioGroup 同源（ant Checkbox/Radio 组件），值语义天然一致。不做 FormContext 级联（group 已覆盖），保持薄透传。

### 3. Transfer 公司默认标题

`titles: ['源列表', '目标列表']` 在 `defaults.ts` 定义，companyDefaults 列表 `['titles']` 显式转发。未来公司改穿梭框文案只动 defaults。

### 4. Tree 用 treeData 配置为主

Tree 的现代 API 是 `treeData`（配置驱动），避免子组件 key 传导问题（批次 2 Menu 教训）。`TmTreeNode` 保留供需要子组件形式的业务使用。

### 5. 其余组件纯透传，无公司默认

slider / rate / auto-complete / mentions / checkbox / radio 无公司扩展键，companyDefaults 传 `[]`。

### 6. 不抽公共 SFC 模板

延续既有决策：复制骨架比抽象共享组件更易维护。

## Risks / Trade-offs

- [TmTreeNode 子组件 key 传导（ant TreeNode 读 vnode.key）] → 与 Menu 同理，若测试暴露选中异常则加 vnode key 转发；默认用 treeData 配置规避
- [AutoComplete options 与 ant Select options 结构差异] → 透传 ant AutoCompleteProps['options']，不本地重定义
- [单 Checkbox/Radio 无 FormContext 级联] → 有 group 场景需求用既有 group 组件，单组件面向独立使用
