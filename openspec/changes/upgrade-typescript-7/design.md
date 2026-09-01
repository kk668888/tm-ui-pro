# Design: upgrade-typescript-7

## Context

现状与约束（动机见 `proposal.md — Why`，不赘述）：

- Monorepo：根 + `packages/ui`（发布产物 `dist/*.d.ts`）+ `apps/demo` + `apps/demo2`（同构副本）+ `apps/docs`（VitePress，无 TS 检查）。
- 当前 `typescript ^5.5.0`，typecheck 走 `vue-tsc --noEmit`（根脚本跑 ui、demo 两处），UI 库 d.ts 产物由 `vite-plugin-dts` 生成。
- **关键结构事实**：`typescript@7.0.2` 是原生 Go 编译器（二进制 shim，esbuild 式分平台包分发），`require('typescript')` 的经典 Compiler API（`createProgram`/`createLanguageService`）已不可用，新 API 在 `./unstable/*`。而 `vue-tsc@3.x` 与 `vite-plugin-dts@5.x`（内部 = `unplugin-dts`）**共享 `@volar/typescript` 底座**——这条底座必须能够驱动原生编译器，否则整条 typecheck + d.ts 管线都断。
- 约束：tsconfig 基线（`moduleResolution: Bundler`、`lib: ESNext/DOM`、`declaration: true`、`strict`）保持不变；不顺手改组件代码；不把 ESLint 升级为 type-aware。

## Goals / Non-Goals

**Goals:**
- 三件套（`typescript` / `vue-tsc` / `vite-plugin-dts`）作为**一个耦合单元**升级到 TS7 原生体系，800 文件规模 typecheck 与构建保持绿灯。
- 升级前后**公共类型面（`dist/*.d.ts`）对下游可兼容**（TS5/TS6 消费方不受破坏）。
- lint / test / build 全链路回归无损。

**Non-Goals:**
- 不修改 `tsconfig.base.json` 与各子包 tsconfig（`module`/`moduleResolution`/`lib`/`strict` 等维持现状）。
- 不借机重构组件代码或清理类型债（新诊断按裁决策略处理，但不做超范围的架构改动）。
- 不将 ESLint 从非 type-aware 升级为 type-aware（那是独立变更，会放大本升级的面）。
- 不以 TS6 为迁移中间停留版（目标直上 7；TS6 仅作为 spike 失败时的**降级退路**，见 Risks）。

## 决策（含 2026-09-01 spike 实证结论）

> **主导事实：原生 TS7 无法驱动 Vue 工具链。** `typescript@7.0.2`（原生 Go 编译器，二进制 shim）不暴露 `typescript/lib/tsc` 等经典路径——`vue-tsc`/`vite-plugin-dts`（基于 `@volar/typescript`）启动即 `ERR_PACKAGE_PATH_NOT_EXPORTED`，且原生不解析 `.vue`。**正式采用官方 hybrid 方案**：`typescript` 别名为 `npm:@typescript/typescript6@^6.0.2`（内置真实 TS6.0.2 JS 编译器；vue-tsc 检测到 `@typescript/typescript6` 后改道 `@typescript/old` = `typescript@^6`）。经 spike 全链路验证：typecheck/build/test/coverage 全绿。**本变更因此交付「TS6 官方过渡线 + 全新 vue-tsc3/vite-plugin-dts5」而非字面 7.0.2 的原生类型检查。**

1. **三件套一体化升级，不拆件**
   - 依据：`@volar/typescript` 是 vue-tsc 与 unplugin-dts 的共同底座；`typescript` 别名统一到 TS6 后三者对齐。拆件必然制造版本序断层（如 vue-tsc2 + typescript6 崩）。
   - 备选（否决）：逐件升——会在 typecheck/d.ts 两管线制造不可用中间态。
2. **`typescript` 用官方别名 `npm:@typescript/typescript6@^6.0.2`，`vue-tsc ^3.3.0`、`vite-plugin-dts ^5.1.0`**
   - 证明：仅此方案能让 Vue 管线拿到真实编译器服务；`@typescript/old = typescript@^6`（真实 JS 版）为经典 API 工具提供 Compiler API。
   - 附带收益：TS6.0.2 满足 `typescript-eslint` 的 `typescript <6.1.0` peer，冲突告警消失。
   - 备选（否决）：裸 `typescript@^7.0.2`——vue-tsc 崩溃；`@ts-expect-error` 强压——volar 底座无法拿到编译器服务，不可行。
3. **tsconfig 迁移（TS6 移除 `baseUrl`）**
   - 移除三处 `baseUrl`（`paths` 默认相对 tsconfig 解析，零语义变化）、`"@/*"` 改 `"./src/*"`（无 baseUrl 时 `paths` 需显式 `./`）。
   - 用 `ignoreDeprecations: "6.0"` 保留 `baseUrl` 亦可，但项目有干净路径可选，取干净路径。
4. **Spike 作为 go/no-go 闸门已执行**——结论：via TS6 hybrid 主路放行，未发生回退。记录于 tasks.md。
5. **新诊断裁决三分类，禁止无理由消音**
   - 本次新诊断全部集中在 tsconfig 层（`baseUrl` 弃用 / `paths` 需 `./`），无代码级新诊断；未引入任何 `@ts-expect-error`/`@ts-nocheck`/`any` 放宽。
6. **`dist/*.d.ts` 产物 diff 作为发布闸门**
   - 主入口 `index.d.ts` 逐字一致；170/300 组件文件差异为 `__VLS_template()` 内联块的压缩重排 + import 子集调整（`ExtractPropTypes` props 内容逐字保留）→ 公共签名实质等价。残留风险：对下游消费方发版前做一次真实 typecheck 抽查。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| **TS7 native 尚未对齐 Vue 工具链**（本变更不触及） | 以 TS6 官方过渡线落地；后续待 volar 原生支持，据情另起变更切真 7，届时重新审批类型面在 native 下的漂移 |
| **`@typescript/typescript6` 别名精度**（`^6.0.2` 允许 6.x 漂移） | `pnpm check` 进 CI/发布 gate；TS6 minor 更新先回归 |
| **d.ts 产物结构变化**（`__VLS_*` 重排、unplugin-dts 重构） | 产物 diff 已在 spike 比对；发版流程持续盯 Diff 与下游消费方抽查 |
| **原生二进制/别名在特定环境的解析** | 开发机与 CI 均需拉到 `@typescript/typescript6` 别名；`pnpm install --frozen-lockfile` 复核 |
| **既有 lint 债放大 check 失败面** | 本次顺带清掉 7 处既有债（useSegmentedInput + skill eval 产物），`pnpm check` 已全绿 |
| **回滚成本** | 无代码伴随，回滚 = 还原 4 处 package.json + 3 份 tsconfig + lockfile 即可，零残留 |

## Migration Plan

1. `git checkout -b feat/upgrade-typescript-7`
2. **记录基线**：`pnpm typecheck && pnpm build:ui` 全绿；拷贝 `packages/ui/dist/*.d.ts` 为基线参考。
3. **Spike（go/no-go）**：三件套版本 bump（根 + ui + demo + demo2 四处）→ `pnpm install`（确认 lockfile 解析原生平台包）→ `pnpm typecheck` + `pnpm build:ui`。
   - 通过 → 继续；失败 → 回退，按 Risks 走降级路径。
4. **新诊断裁决**：对比 TS5.5 基线，逐条按三分类处理，直至 typecheck 绿灯且无廉价消音。
5. **d.ts 产物 diff**：与基线比对，确认公共导出签名等价。
6. **全量回归**：`pnpm lint`、`pnpm test:coverage`、`pnpm check`。
7. **收尾**：确认后合入；`openspec apply` 落地变更；CI `pnpm check --frozen-lockfile` 一键复核。

## Open Questions

暂无——唯一结构未知（volar 原生适配）不放在 Open Questions 里推迟，而是迁移计划第 3 步的显式闸门；spike 的结果决定走主路还是降级路，不预设答案。