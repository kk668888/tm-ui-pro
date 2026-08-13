## Context

@tm/ui 已形成稳定的 ant-design-vue 薄封装模式：类型沿用上游导出，`useForwardBindings` 只转发业务显式值和公司默认值，动态插槽完整透传，`useForwardRef` 暴露内部实例能力，多子组件模块分别 `withInstall` 后聚合导出。变更动机和组件范围见 `proposal.md`，对外行为见 `specs/components/*/spec.md`。

当前依赖为 ant-design-vue 4.2.6。已从本地安装包确认 15 个目标模块均存在，其中 Comment 仍保留模块和类型，但属于上游废弃能力；Calendar 以 dayjs 版本为默认导出；Carousel 公开 `CarouselRef`；其余组件均可从顶层或对应模块取得组件与类型。

## Goals / Non-Goals

**Goals:**
- 让 15 个组件遵循既有薄封装骨架，避免 Boolean 可选属性被 Vue 归一化为幻影 `false` 后覆盖上游默认值。
- 多子组件能力按现有 form、layout、navigation 模块模式独立注册和导出，确保全量安装与 resolver 自动解析均可工作。
- 通过聚焦测试锁定默认值、受控状态、插槽、事件和公开方法，再以包构建验证类型产物。

**Non-Goals:**
- 不重新实现 ant-design-vue 的布局、状态管理、动画、图片预览或水印防篡改逻辑。
- 不在本批新增提案未列出的 `TmCardMeta`、`TmCardGrid`、`TmTimelineItem` 等导出；需要时另立变更扩展公开 API。
- 不为已废弃的 Comment 发明新的业务评论模型，只提供兼容封装和迁移文档。

## Decisions

### 1. 统一使用薄封装骨架，不抽象共享 SFC

每个 SFC 使用 `defineOptions({ name, inheritAttrs: false })`、类型化 `defineProps`、`useForwardBindings`、动态 slots 透传与 `useForwardRef`。即使脚本相似，也保留独立文件和详细注释，使每个组件的上游类型、公司默认和兼容注意事项可就地阅读。

**备选方案：**建立通用高阶包装器。否决，因为 Vue SFC 的类型、插槽和实例推导在不同上游组件间差异明显，高阶抽象会降低生成声明文件的可读性，并偏离仓库既有模式。

### 2. 只为 Card 和 Tooltip 定义公司默认

Card 使用 `bordered: true` 与 `size: 'default'` 作为业务卡片规范锚点；Tooltip 使用 `placement: 'top'`、`autoAdjustOverflow: true` 与箭头展示默认。默认值集中于各模块 `src/defaults.ts`，业务显式值优先。

其余组件采用上游默认，不把上游缺省值重复固化到公司层。所有 wrapper 仍调用 `useForwardBindings(props, companyDefaultKeys)`，确保 `open`、`visible`、`loading`、`autoplay`、`fullscreen` 等可选 Boolean 在未传入时不成为受控 `false`。

**备选方案：**为全部组件复制上游默认值。否决，因为这会扩大升级漂移面，并可能让 wrapper 与 ant-design-vue 修复后的默认行为不一致。

### 3. 多子组件模块按命名导出组织

以下提案明确要求的子组件与主组件分别 `withInstall`，模块默认导出对象：

| 模块 | 导出 |
| --- | --- |
| collapse | `TmCollapse`、`TmCollapsePanel` |
| descriptions | `TmDescriptions`、`TmDescriptionsItem` |
| avatar | `TmAvatar`、`TmAvatarGroup` |
| image | `TmImage`、`TmImagePreviewGroup` |
| list | `TmList`、`TmListItem`、`TmListItemMeta` |
| statistic | `TmStatistic`、`TmCountdown` |

其余模块默认导出单个 `TmXxx`。这种组织方式与 `components/form` 一致，既支持 `app.use(@tm/ui)` 全量注册，也支持 resolver 按组件名生成导入。

### 4. 方法透传以具体实例类型为准

Carousel 优先使用上游公开的 `CarouselRef`，Image/Calendar 等未稳定导出实例接口的组件使用 `InstanceType<typeof AComponent>`。所有组件通过 `useForwardRef` 暴露内部实例；测试至少覆盖 Carousel 的 `next` 或 `goTo`，并抽样验证其他组件引用可访问上游实例。

**备选方案：**仅透传 DOM 根节点。否决，因为会破坏仓库已经建立的“wrapper ref 等同上游组件 ref”契约。

### 5. Comment 作为兼容层保留但明确废弃边界

TmComment 直接包装本地 ant-design-vue 4.2.6 的 Comment 模块，保持其 props 与 slots，不新增扩展属性。文档显著标注上游废弃状态，推荐业务使用 Avatar、Flex、Space、Typography 等组合构建新评论界面；现存业务可通过 TmComment 平滑迁移到 @tm/ui。

**备选方案：**删除 TmComment 或自行复刻 DOM/CSS。否决，前者不满足提案的覆盖目标，后者会产生脱离上游主题令牌的维护负担。

### 6. 注册、文档和验证作为同一交付单元

`packages/ui/src/index.ts` 负责全量安装与类型导出；resolver 继续依赖 `Tm` 前缀泛化规则，不增加组件白名单。每个组件提供最小可运行 demo 与独立文档页，侧边栏纳入“数据展示”。测试以 wrapper 契约为重点，不重复验证 ant 内部算法。

## Risks / Trade-offs

- [15 个模块及多个子组件造成较大的单批改动] → 按骨架、实现、注册、测试、文档拆分任务，每组完成后运行聚焦测试，最终运行全量门禁。
- [上游 props 含大量 Boolean，直接展开会改变未受控行为] → 所有新组件强制使用 `useForwardBindings`，并用 Tooltip、Image、Calendar、Carousel 等受控或开关属性做回归测试。
- [Comment 在未来 ant-design-vue 版本可能被移除] → 避免深度二次扩展，文档标记废弃；未来升级时可单独发布破坏性迁移变更。
- [Calendar 和 Image 等浏览器 API 在 jsdom 中不完整] → 单测聚焦 wrapper 透传并对上游重交互部分使用稳定 stub，实际文档 demo 作为浏览器级验证面。
- [新增公司默认可能造成现有 ant 直用页面视觉差异] → 默认仅应用于新 TmCard/TmTooltip，业务可显式覆盖，文档列出默认值。

## Migration Plan

本变更仅新增公开组件，不修改既有组件 API，无数据迁移。发布时先完成包构建与文档构建，再由业务按需将 ant 直接导入替换为 Tm 组件；若发布后出现兼容问题，可回退新版本，不影响既有组件使用。
