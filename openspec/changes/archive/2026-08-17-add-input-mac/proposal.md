# add-input-mac

## Why

网络设备表单项里，IP 地址与 MAC 地址几乎总是成对出现（绑定、白名单、DHCP 静态分配）。上一变更 `add-input-ip` 交付了四段式 IPv4 输入 `TmInputIp` 并沉淀了分段输入内核 `useSegmentedInput`，但 MAC 地址仍只能用普通 `TmInput` 手输 `AA:BB:CC:DD:EE:FF` 全串，大小写与 `00` 前导零全靠肉眼自查，录入体验与校验体验均不达标。本变更补上 MAC 地址输入组件，成为自研交互组件族系（segment 系）的第二位成员，直接复用 `useSegmentedInput` 内核验证其复用价值。

## What Changes

- 新增 `TmInputMac` 组件（目录 `packages/ui/src/components/input-mac/`）：**六段式 MAC 地址输入**，六段原生 `<input inputmode="text">` 以 `:` 分隔，段内仅接受十六进制字符 `0-9 A-F a-f`，视觉对齐 ant 表单控件（复用 `TmInputIp` 自研视觉外壳方案：`var(--ant-color-*, fallback)` + `:focus-within` + size/disabled/readonly/error 态）
- 复用分段内核 `useSegmentedInput`（IPv4 与 MAC 共用同一套段状态机：跳段/回跳/方向键跨段/粘贴分发/受控回写/焦点方法），内核新增一个向后兼容的**归一化钩子**支持十六进制段大写与零填充
- 键入实时转大写：段内输入 `a-f` 即时显示为大写 `A-F`（统一存储/展示规范形式 `AA`）
- blur 自动填充：失焦时单字符段补前导 `0`（`A` → `0A`），并统一转大写；补零后六段齐全才 emit 完整规范 MAC 串
- 分隔符可配置：`separator?: ':' | '-'`（默认 `':'`），段组装、粘贴解析共用同一配置；**不**做双分隔符自动识别（Non-goal）
- v-model 契约：`modelValue: string`，六段齐全且每段补齐 2 位十六进制时 emit 规范串（大写、无前导零缺失），否则 emit `''`（表单侧「要么空要么完整合法」）
- 支持注入 TmForm 联动上下文（readonly/disabled 级联），与库内其他表单控件行为一致
- 非 Goal（明确不做）：IPv6（另行提案）、`-` 与 `:` 双格式粘贴容错、MAC 前缀/无前缀写法（`MAC-XX:...`）、mac 地址厂商 OUI 语义校验（仅格式校验）

## Capabilities

### New Capabilities

- `components/input-mac`: TmInputMac 六段式 MAC 地址输入组件——十六进制段键入与实时大写字形、blur 零填充归一化、分隔符可配置（`:`/`-`）、v-model 组装契约（补齐前 emit ''）、内核复用策略（useSegmentedInput + 归一化钩子）、ant token 视觉与 FormContext 级联

### Modified Capabilities

（无——现有组件 spec 均不受影响；`useSegmentedInput` 归一化钩子为纯新增可选参数，不影响已归档的 `components/input-ip` 行为）

## Impact

- **新增代码**：`packages/ui/src/components/input-mac/`（index.ts / src/InputMac.vue / src/props.ts / src/defaults.ts / demos/basic.vue / __tests__/InputMac.spec.ts）
- **内核扩展**：`packages/ui/src/composables/useSegmentedInput.ts` 新增可选 `normalize` 钩子（IPv4 不传则行为完全不变），`packages/ui/src/composables/__tests__/` 补充钩子单测
- **注册**：组件库主出口（`packages/ui/src/index.ts` 与 `components.ts` 清单）追加 `TmInputMac` 导出；demo 应用组件陈列页（`apps/demo/.../Form.section.vue`）接入演示；**文档站**（`apps/docs`）新增组件页 `input-mac.md` 与 sidebar 登记；**README** 组件清单补登记
- **依赖**：无新增第三方依赖；视觉方案复用 input-ip 的自包含 scoped 样式（不依赖 antd 内部 DOM/类名）
- **风险**：归一化钩子的落地位置（blur 时机与内核「半成品保留」契约的交互）需在 design.md 明确；复用内核的参数差异（maxLen=2）下「跳段」与「越界承载」路径的触发面需在 spec 中锁定