# add-input-ip

## Why

组件库目前 64 个组件全部是 ant-design-vue 薄封装，缺少 IP 地址输入这一常见表单场景能力。业务侧填写 IP 时只能用普通 `TmInput` 手输 `192.168.1.1` 全串，格式错误只能等表单提交后才发现，键入体验与校验体验都不达标。本变更新增 `TmInputIp`，成为库内第一个「ant 设计体系之上的自研交互组件」。

## What Changes

- 新增 `TmInputIp` 组件（目录 `packages/ui/src/components/input-ip/`）：**四段式 IPv4 输入**，四个原生 `<input inputmode="numeric">` 段以 `.` 分隔，复用 ant design token（边框/focus/size 三档/disabled/readonly/error 态）实现与 ant 表单控件一致的视觉
- 用户只需键入数字：段满 3 位自动跳下一段，手动打 `.` 也可跳段（点可以省略）；段首退格跳回上一段并删除其末位；`←/→` 跨段移动焦点
- 键入即拦截：每段仅接受数字且实时约束 0–255，非法字符/越界数字根本输不进去
- 粘贴智能分发：在任意位置粘贴 `192.168.1.1`（带点）或 `19216811`（纯数字）均解析分发到四段
- v-model 契约：`modelValue: string`，四段齐全且全部合法时 emit 完整 IP 字符串，否则 emit `''`（表单侧「要么空要么完整合法」，无脏数据）
- blur 保留半成品显示不清空；初始值/编程设值非法（如 `999.1.1.1`）时各段照常显示、越界段标 error 态，不静默 clamp
- 支持注入 TmForm 联动上下文（readonly/disabled 级联），与库内其他表单控件行为一致
- 抽取分段输入内核 composable `useSegmentedInput`（段状态/跳转/粘贴分发/组装 emit），为未来 IPv6、port-range、CIDR 等分段类组件预留复用
- 非 Goal（明确不做）：IPv6（独立组件 `TmInputIpv6` 另行提案）、CIDR 掩码输入、「>255 提前断段」启发式（避免重新引入解析歧义）

## Capabilities

### New Capabilities

- `components/input-ip`: TmInputIp 四段式 IPv4 地址输入组件——分段键入与跳转交互、键入拦截与 0-255 约束、粘贴分发、v-model 组装契约（未齐 emit ''）、初始非法值展示策略、ant token 视觉与 FormContext 级联

### Modified Capabilities

（无——现有组件 spec 均不受影响）

## Impact

- **新增代码**：`packages/ui/src/components/input-ip/`（index.ts / src/InputIp.vue / src/props.ts / src/defaults.ts / demos/basic.vue / __tests__/InputIp.spec.ts）、`packages/ui/src/composables/useSegmentedInput.ts`
- **注册**：组件库主出口（`packages/ui/src/index.ts` 与 `components.ts` 清单）追加 `TmInputIp` 导出；demo 应用组件陈列页（`apps/demo/.../Form.section.vue`）接入演示；**文档站**（`apps/docs`）新增组件页与 sidebar 登记
- **依赖**：无新增第三方依赖；视觉依赖 antd 既有 token / `ant-input` 类名体系，不依赖 antd 内部 DOM 结构
- **风险**：库内首个自研交互组件，无既有范本可抄；四段式与单框控件的表单宽度/ARIA 语义（多 input 组装单一字段）需在 design.md 中明确约定
