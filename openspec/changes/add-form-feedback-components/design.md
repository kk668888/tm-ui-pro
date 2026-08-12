## Context

现状：tm-ui 已有 21 个组件，封装范式统一为——`defineOptions({ name, inheritAttrs:false })` + `useAttrs` + `useForwardRef`（ant 实例方法透传）+ 扩展属性剥离（`rest` 剔除公司扩展键）+ `withDefaults` 布尔陷阱兜底 + slots 全透传（`slotNames` 快照 v-for 转发）。薄封装组件（如 TmTag）用 `defaults.ts` 集中公司默认 props，增强组件（如 TmTable/TmButton）额外加扩展键。

本 change 的 7 个组件全部是"ant 已有 + 公司薄封装"，无新第三方依赖。复用点已确认：
- **TmTag** 的 `TAG_STATUS_COLOR`（`success/processing/failed/warning` → ant 预设语义色）可被 TmAlert 复用，但当前定义在 `components/tag/src/defaults.ts` 私有。
- **TmDatePicker** 的 `src/composables/useValueFormat.ts`（`value-format` 字符串模式 + v-model 桥接）是 TmTimePicker 的现成参照。

见 proposal.md - Why 的动机，不重复。

## Goals / Non-Goals

**Goals:**
- 7 个新组件严格遵循既有薄封装范式，代码风格、类型、注释与其他组件一致
- 有增强点的组件收敛到公司统一交互（Alert 语义色、Popconfirm 危险确认、TimePicker 字符串模式、Upload 受控 fileList）
- 纯透传组件（Spin/Popover/Result）保持"薄"——不加无意义扩展键，ant 属性全透传

**Non-Goals:**
- 不封装 `Menu/Card/Space/Divider` 等纯容器（ant 原生足够，AGENTS.md 倾向 ant 原生）
- 不做 Upload 的服务端直传 / 断点续传 / 大文件分片（ant 仅负责交互，业务自接上传服务）
- 不改动既有 21 个组件的现有行为（纯新增）

## Decisions

**D1. 语义色映射抽为共享 constants，Alert 与 Tag 复用**
`TAG_STATUS_COLOR` 从 `components/tag/src/defaults.ts` 上提至 `packages/ui/src/constants/status.ts`，导出 `STATUS_COLOR` + `StatusValue` 类型；TmTag 改引共享源（行为不变），TmAlert 复用同一张表。
- 备选：复制一份到 alert——会造成两处同义映射，后续语义色调整需同步两次。
- 取舍：上提是低风险重构（tag 测试已验证行为），换来单一真相源。

**D2. TmTimePicker 复用 useValueFormat 模式（非直接复用该 composable）**
`useValueFormat` 目前耦合 date-picker 的 `valueType`/`isRange` 逻辑。TimePicker 场景更简单（仅单值 + 可选 `value-format`）。抽取通用部分为 `packages/ui/src/components/time-picker/src/composables/useValueFormat.ts`（或复用共享 composables 目录），按 TimePicker 参数特化。
- 备选：直接 import date-picker 的 composable——它内部处理 Dayjs↔string 双向转换，但含 range 分支，TimePicker 用会有死代码。
- 取舍：小规模抽取，保持各组件 composable 独立清晰。

**D3. TmUpload 的受控 fileList + beforeUpload 校验（唯一复杂点）**
- 受控：内部 `reactive` 维护 fileList（v-model 双向），显式 `fileList` 优先
- 校验：暴露 `beforeUpload` 透传，ant 在 upload 前拦截（大小/类型），失败不进入列表
- 剥离：`action` 等业务配置全透传，公司不做服务端假设
- 风险点：ant Upload 的 `onChange` 事件形态复杂（`file.status` 流转），薄封装需完整透传 listeners，不重写内部逻辑。

**D4. TmPopconfirm 对齐 TmButton.confirm 交互**
- 默认文案：确认「确定」/ 取消「取消」（对齐 ant 默认 + 公司统一）
- `danger`：确认按钮 `danger` 语义（红色），与 TmButton 的删除二次确认视觉一致
- 透传 ant 其余 props（`title`/`placement`/`okText`/`cancelText` 等）

**D5. 纯透传组件（Spin/Popover/Result）零扩展键**
仅薄封装：`inheritAttrs:false` + `useForwardRef` + slots 透传 + Boolean 兜底（Spin 的 `spinning`、Result 无、Popover 的 `open` 需显式兜底）。不加 status/title 等公司扩展——ant 语义已够，避免为封装而封装。

**D6. index.ts 聚合导出 + install 注册**
按既有模式：`withInstall` 包装每个组件，`index.ts` 顶部 import + `install()` 里 `app.use()`。`TmResolver` 不改（对 `Tm*` fail-fast 返回主入口）。每个组件配 `demos/basic.vue` + `__tests__/*.spec.ts`，docs 组件页 + 侧边栏，demo 陈列页 Feedback/Form section。

## Risks / Trade-offs

- **Upload 事件复杂度** → 薄封装只透传不重写；单测聚焦 fileList 受控与 beforeUpload 拦截，不模拟完整上传流
- **共享 constants 上提影响 Tag** → 上提后跑 tag 既有单测回归；映射值不变，仅 import 路径变化
- **7 组件一次性交付体量大** → 拆为多任务分批（见 tasks.md），每个组件独立可测、可单独提交
- **TimePicker 与 DatePicker 行为一致性** → 复用同一 `value-format` 语义与测试模式，避免两套字符串桥接行为分叉
