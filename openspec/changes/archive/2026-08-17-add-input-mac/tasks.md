# add-input-mac 任务拆解

参照归档 add-input-ip 的任务结构（4 大组 + 收尾）；本变更在「内核扩展」多一组首任务。

## 1. useSegmentedInput 内核扩展（normalize 钩子）

- [x] 1.1 `UseSegmentedInputOptions` 新增可选 `normalize?: (seg: string) => string`（注释注明语义：仅 blur 收敛统一执行的后处理；IPv4 不传则行为完全不变）
- [x] 1.2 `isComplete` 改为「normalize 后再 validate」的完成期校验（段空或 normalize 后 validate 不过 → 不 complete）；normalize 未传时与现逻辑逐字节一致
- [x] 1.3 新增 `normalizeSegments(): void` 内部函数：对全部段执行 `seg`→`normalize(seg)`，归一后调 `commit()`（重算 isComplete 并 emit 规范串），并从返回对象导出
- [x] 1.4 `useSegmentedInput.spec.ts` 补用例：① 传入 `normalize: hex→uppercase+padStart(2,'0')`，input `a` 段值实时显示大写 `A`（sanitize 已转大写、未补零），`normalizeSegments()` 后段值变 `0A` 且 isComplete 翻转、onUpdate 收到规范串 ② 不传 normalize 时 `normalizeSegments()` 为 no-op 且 isComplete 语义与旧版本一致（回归护栏）

## 2. TmInputMac 组件实现

- [x] 2.1 `packages/ui/src/components/input-mac/` 目录骨架：`index.ts`（`import InputMac from './src/InputMac.vue'` + `export type TmInputMacProps` + default export）、`src/props.ts`（`TmInputMacProps { modelValue?: string; size?: SizeType; disabled?: boolean; readonly?: boolean; separator?: ':' | '-' }`）、`src/defaults.ts`（`{ size: 'middle', separator: ':' }`）
- [x] 2.2 `src/InputMac.vue`：template 六段 input + 分隔 span（`v-if="i > 1"` 防前导分隔符，footprint 与 input-ip 同构）；script 注入内核参数 `segments: 6 / maxLen: 2 / separator: props.separator / acceptChar: /^[0-9a-fA-F]$/ / sanitize: strip non-hex + toUpperCase / validate: /^[0-9A-F]{1,2}$/ / normalize: hex→uppercase+padStart(2,'0')`；段 input `:maxlength="2"`；`@blur` 处理 blur 归一（relatedTarget 离开外壳触发 `normalizeSegments()`）
- [x] 2.3 `src/InputMac.vue` 视觉外壳：`.tm-input-mac` 完全自包含（照抄 input-ip D2 方案：`--tmm-*` 变量映射 `var(--ant-*, 默认值)`、边框/圆角/hover/`:focus-within` 环/size 三档/disabled/error/readonly），类名前缀 `-ip`→`-mac`；`role="group"` + aria-label + 逐段 `aria-label` + 末段 `aria-describedby` + sr-only 错误节点
- [x] 2.4 组件测试 `__tests__/InputMac.spec.ts`：六段结构（0 前导 sep、恰 5 个 sep）、十六进制键入（a-f 实时大写显示）、blur 归一（`A`→`0A` 且 emit 规范串）、半成品 blur 仍 emit `''`、非法字符拦截、段满 2 位跳段、退格回跳、方向键跨段、粘贴带冒号分发/纯 hex 贪心分发/非法拒绝、separator="-" 生效、`-` 粘贴至 `:` 模式整串拒绝、parent→child 同步、FormContext disabled/readonly 级联与显式覆盖、ref.focus 定位空段

## 3. 注册与 demo

- [x] 3.1 `packages/ui/src/components.ts` 追加 `TmInputMac` import + 数组项；`packages/ui/src/index.ts` 追加组件 + `TmInputMacProps` type export
- [x] 3.2 `packages/ui/src/components/input-mac/demos/basic.vue` 演示（`hostMac = ref('0A:1B:2C:3D:4E:5F')` 回显 + 实时更新）
- [x] 3.3 demo 应用 `apps/demo/.../tm-components/features/components/Form.section.vue` 接入：`TmInputMac` import + `const hostMac = ref('0A:1B:2C:3D:4E:5F')` + col 展示与回显
- [x] 3.4 `Form.section.spec.ts` 追加断言：`.tm-input-mac input` count = 6、回显文本含 `hostMac=0A:1B:2C:3D:4E:5F`

## 4. 文档站与 README

- [x] 4.1 `apps/docs/components/input-mac.md` 组件页（首行描述/何时使用/script setup 导入 `demos/basic.vue` + `?raw`/DemoBlock/TmPropsTable API/Events/Methods/Types，含 `separator` prop 说明）
- [x] 4.2 `apps/docs/.vitepress/config.ts` sidebar 在 InputIp 后追加 `{ text: 'InputMac MAC 地址输入', link: '/components/input-mac' }`
- [x] 4.3 `packages/ui/README.md` 组件清单表 + `TmInputMac` default row + 专节（内核归一化与 v-model 契约一句话说明）

## 5. 收尾

- [x] 5.1 全量测试：`pnpm --filter @kibus/tm-ui-plus test run` 全绿（89 文件 / 628 测试，含既有 useSegmentedInput/InputIp 回归）；coverage Statements 93.56% / Branches 78.59% / Functions 82.08% / Lines 94.77% 全过阈值
- [x] 5.2 `openspec validate --all` 全绿（change/add-input-mac + spec/components/input-ip 均 ✓）；`openspec status --change add-input-mac` 四 artifact 完成
- [ ] 5.3 等待 review → 同步主规格 → 归档 → git 提交（中文信息）