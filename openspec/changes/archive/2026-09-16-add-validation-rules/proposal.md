## Why

组件库目前没有任何校验能力。TmForm 完全依赖业务手写 ant 的 `rules`（async-validator 格式），TmTable 的单元格编辑虽然透传 vxe 的 `editRules`，但同样要业务手写 vxe 规则格式。后果是：同一类格式判据（手机号 / IP / 身份证 / 统一社会信用代码 …）在各业务项目里被反复复制粘贴，且 **ant 与 vxe 两套规则格式各自手写、无法复用**——而这两套格式在字段层面高度同构（`required` / `pattern` / `min` / `max` / `validator` / `message`），差别只在 `validator` 的回调签名。

需要一套统一的校验工具函数：**一份判据内核，同时喂给 TmForm（ant 规则）与 TmTable 单元格编辑（vxe 规则）**，让业务按场景选用，而不是每次都重写格式判据。

## What Changes

- 新增校验模块 `packages/ui/src/validation/`：
  - **谓词内核**：纯函数，零外部依赖（正则 + 校验位算法），不 import ant / vxe
  - **双适配器**：`toAntRule` / `toVxeRule`，配置对象一步出规则，**恒返回规则数组**
  - **可扩展注册表**：`registerValidator(name, predicate)`，业务可注册自定义判据
- **默认校验清单（11 种）**：
  - 正则类：`ipv4`、`ipv6`、`mac`、`port`、`phone`、`email`、`url`
  - 声明式比较：`range`（数值区间）、`length`（长度）
  - 计算类：`idCard`（GB 11643 校验位）、`creditCode`（GB 32100 校验码）
- **空值语义**：按 `required` 分流——`required: false` 时空值直接通过，`required: true` 时空值不通过并给必填文案
- **文案拆两条**：`message`（格式错，按 type 给默认值）与 `requiredMessage`（空值，默认「请输入」）
- **不**桥接 vxe 的全局注册表 `VxeUI.validators`：`toVxeRule` 产出的 `validator` 一律是函数，不产字符串名，无全局副作用
- **不修改** TmForm / TmTable 组件源码：列级 `rules` 是 vxe 原生能力，批量校验用已由 `useForwardRef` 透传的 `fullValidate`
- 从包主入口导出 `toAntRule` / `toVxeRule` / `registerValidator` 及配套类型
- 文档站新增校验工具页面并登记 sidebar

## Capabilities

### New Capabilities

- `validation/rules`: 统一校验工具能力——判据内核（格式正则 + 校验位算法）、ant/vxe 双适配器、可注册扩展、`required` 驱动的空值语义

### Modified Capabilities

<!-- 无。TmForm / TmTable 的既有行为不变：TmFormItem.rules 本就透传 ant，
     TmTable.columns 列级 rules 是 vxe 原生能力，均不涉及规格级行为变更。 -->

## Impact

- **新增**：`packages/ui/src/validation/**`（谓词内核 / 适配器 / 注册表 / 类型 / 测试）
- **修改**：`packages/ui/src/index.ts`（新增导出，需同步该文件的导出清单）
- **修改**：`apps/docs`（新增校验工具页面 + sidebar 登记，遵循组件交付清单惯例）
- **依赖**：无新增外部依赖（纯正则与校验位算法自实现）
- **兼容性**：纯新增，不改变任何现有组件行为，非 BREAKING
- **待验证风险（落地第一个 spike）**：`columns[].rules` 在 vxe 的 `.d.ts` 中未见声明（运行时确定支持）；若 `TmTableProps['columns']` 塞不进 `rules` 导致 vue-tsc 失败，需退到网格级 `editRules`（按 field 索引的映射，vxe 原生同样支持），届时可能需要在 TmTable 类型上补一处扩展
