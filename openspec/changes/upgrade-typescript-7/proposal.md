# upgrade-typescript-7

## Why

本仓库是组件库 monorepo，已积累 **518 个 `.ts` + 282 个 `.vue` SFC**（核心在 `packages/ui`，60+ 组件）。当前锁定 `typescript ^5.5.0`（JS 实现编译器）。`typescript@7.0.2` 已是 npm `latest`，而且是基于 Go 的**原生编译器**（tsgo/Corsa），类型检查性能约 **10x**——随组件族继续扩张，本地 `vue-tsc --noEmit` 反馈与 CI `pnpm check` 的类型检查耗时都有可感知收益。配套工具链（vue-tsc 3.x / vite-plugin-dts 5.x）已发布就绪，生态过渡窗口已到，正是升级时机。

## What Changes

- **升级 `typescript` `^5.5.0` → `npm:@typescript/typescript6@^6.0.2`**（官方 hybrid 别名）：顶层 `typescript@7.0.2` 是原生 Go 编译器（二进制 shim），但**实测原生编译器无法驱动 Vue 工具链**——`vue-tsc` 依赖 `typescript/lib/tsc` 子路径，TS7 不导出 → 崩溃；原生也不暴露经典 Compiler API、不能解析 `.vue`。官方过渡方案是把 `typescript` 别名为 `@typescript/typescript6`（内置真实 TS6.0.2 JS 编译器，vue-tsc/vite-plugin-dts 检测到后改道真实 TS6）。本变更落地此过渡线：TS6 官方基线 + 升级后的 vue-tsc3/vite-plugin-dts5 生态。
- **连带升级 `vue-tsc` `^2.x` → `^3.3.x`**（必须随动）：typecheck 核心链路（根脚本跑 ui + demo 两处 `vue-tsc --noEmit`）。volar 底座 `@volar/typescript` 是 vue-tsc 与 unplugin-dts 的共同依赖。
- **连带升级 `vite-plugin-dts` `^4.5.0` → `^5.1.0`**（必须随动）：UI 库打包产 `dist/index.d.ts`。5.x 已重构为 `unplugin-dts`。
- **tsconfig 迁移**：移除三处 `baseUrl`（TS6 弃用，`paths` 默认相对 tsconfig 解析，语义零变化）、`"@/*"` 改 `"./src/*"`（无 baseUrl 时 `paths` 需显式 `./`）。
- **涉及范围**：根 + `packages/ui` + `apps/demo` + `apps/demo2` 四处依赖声明；三份 tsconfig；`apps/docs` 为 VitePress 无 TS 检查，不动。
- **零行为变化**：纯工具链升级，组件外部契约（props/events/v-model）、运行时行为不变。**BREAKING**：无（公共类型面 `index.d.ts` 逐字一致）。

## Capabilities

### New Capabilities

（无——纯工具链变更，不引入新的行为规格。）

### Modified Capabilities

（无——编译器版本不影响任何组件的能力/契约；`.openspec.yaml` 已设置 `skip_specs: true`，不生产 spec delta，也**不**为满足校验凑数发明需求。）

## Impact

- **依赖声明**（4 处 + 根）：根/`packages/ui`/`apps/demo`/`apps/demo2` 的 `typescript`（别名 head)、`vue-tsc`；`vite-plugin-dts` 仅 `packages/ui` 有声明
- **类型检查**：`pnpm typecheck`（根脚本 = ui + demo 的 `vue-tsc --noEmit`）
- **UI 库构建与发布**：`pnpm build:ui`（`vite-plugin-dts@5`/unplugin-dts 产 d.ts）→ 主入口 `index.d.ts` 逐字一致；组件文件差异为 `__VLS` 内联重排（公共签名实质等价）；发版前建议对下游消费方做一次真实 typecheck 抽查
- **ESLint**：`@vue/eslint-config-typescript@^14` → typescript-eslint 8.x。TS6.0.2 满足其 `typescript <6.1.0` peer，无冲突告警；非 type-aware 配置不受影响
- **CI**：`pnpm check`（lint + typecheck + test:coverage + build:ui）全链路通过
- **风险**：
  1. **TS7 native 尚未对齐 Vue 工具链**——本变更交付 TS6 官方过渡线；待 volar 原生支持后再切真 7，届时需另起变更并注意类型面在 native 下的漂移
  2. **`@typescript/typescript6` 别名精度**——`^6.0.2` 允许 6.x 内漂移，后续 TS6 minor 更新需回归 `pnpm check`
  3. **d.ts 产物结构差异**——已判定公共签名等价，但产物形态（`__VLS_*` 重排）与 v2 不同，需在发版流程盯 Diff