# Tasks: upgrade-typescript-7

## Spike 结论（2026-09-01，实证）

**结构性事实：`typescript@7.0.2`（原生 Go 编译器）今天无法驱动 Vue 工具链。**
`vue-tsc@3.3.11` 启动时 `require.resolve('typescript/lib/tsc')`，而 TS7 的 `exports` 不再导出该子路径 → `ERR_PACKAGE_PATH_NOT_EXPORTED` 崩溃；`vite-plugin-dts@5`（unplugin-dts）走同一 volar 底座。原生编译器不暴露经典 Compiler API、也不能解析 `.vue`。

**官方 hybrid 方案（已实证放行）：** `typescript` 别名为 `npm:@typescript/typescript6@^6.0.2`（内置完整 TS6 JS 编译器，vue-tsc 检测到 `@typescript/typescript6` 后改道 `@typescript/old` = 真实 `typescript@^6`）。所有经典 API 工具跑真实 TS6.0.2，typecheck/build/test 全绿。附带收益：`typescript-eslint` 的 `typescript <6.1.0` peer 冲突随之消失。

**由此：本变更实际交付的是「TS6 官方过渡线 + 生态就绪」，而非字面 7.0.2 的原生类型检查。** 详见下方待决决定。

## 1. 基线

- [x] 1.1 建分支 `feat/upgrade-typescript-7`（基于 master）
- [x] 1.2 全绿基线复核：跑 `pnpm typecheck` 与 `pnpm build:ui`，确认当前 TS5.5 下零诊断（含修复 input-mac 测试标题的一处既有坏串 bug）
- [x] 1.3 拷贝 `packages/ui/dist/*.d.ts` 为基线产物（/tmp/ts7-baseline-dist，300 个 d.ts），作为 diff 参照

## 2. Spike（go/no-go 闸门）

- [x] 2.1 三件套版本 bump：根 + `packages/ui` + `apps/demo` + `apps/demo2`。**修正**：`typescript` 用 `npm:@typescript/typescript6@^6.0.2` 而非 `^7.0.2`（4 处；补漏 apps/demo2 的 `vue-tsc ^2.1.0` 未升）
- [x] 2.2 `pnpm install` 成功；lockfile 解析能确认原生分平台包（`@typescript/typescript6@6.0.2` 落地）；无 peer 硬冲突（TS7 式 `<6.1.0` 告警随别名消失）
- [x] 2.3 `pnpm typecheck` 实证：vue-tsc 3.3.11 + TS6 别名全绿（ui + demo + demo2）
- [x] 2.4 `pnpm build:ui` 实证：vite-plugin-dts@5（unplugin-dts）正常产出 300 个 `dist/*.d.ts`
- [x] 2.5 spike 结论已记录（见上文）：走 TS6 hybrid 主路，**不**回退

## 3. 新诊断裁决与类型收敛

- [x] 3.1 对比基线收集诊断：全部集中在 tsconfig 层——`baseUrl` 弃用（TS5101，TS6 迁移门槛）与无 baseUrl 时 `paths` 需显式 `./`（TS5090）；**无代码级新诊断**
- [x] 3.2 真缺陷修复：tsconfig 迁移（移除 3 处 `baseUrl`、`"@/*"` 改 `"./src/*"`），零语义变化
- [x] 3.3 语义误报：无，未引入任何 `@ts-expect-error`
- [x] 3.4 疑似编译期 bug：无
- [x] 3.5 `pnpm typecheck` 绿灯，无任何 `@ts-nocheck`/全局关闭

## 4. d.ts 产物与全量回归

- [x] 4.1 比对产物：`index.d.ts`（主入口）**零差异**；170/300 组件文件差异为 `__VLS_template()` 内联块的压缩重排 + import 子集调整，`ExtractPropTypes` props 内容逐字保留。判定公共签名实质等价。**残留风险**：建议发版前对下游消费者做一次真实 typecheck 抽查
- [x] 4.2 `pnpm lint` 回归：typescript-eslint 在 TS6 链正常工作，**无新增告警**；repo 现存 7 处**既有** lint 债（`.claude/skills` eval 产物 4 处 + `useSegmentedInput.ts` 未用 import + 其 spec 未用变量 2 处，全部在被改动文件之外）
- [x] 4.3 `pnpm test:coverage` 回归：vitest 全绿，覆盖率 Statements 93.56% / Lines 94.65%
- [x] 4.4 `pnpm check` 全链路一键通过（lint + typecheck + test:coverage + build:ui）；随带顺清既有 7 处 lint 债（useSegmentedInput 未用 import/变量 + 两处 skill eval 产物）

> **入库范围澄清**：`apps/demo2/` 与 `.claude/skills/prefer-tm-ui/prefer-tm-ui-workspace/` 均在 `.gitignore`（仓库既有：demo2 为演示用同构副本，skill workspace 为本地 eval 产物），**未纳入版本控制**。本次对其改动（demo2 的 typescript/vue-tsc 版本与 tsconfig、fixture 的 lint 修复）在真实文件系统与 lint/check 中**生效**，但不进入本分支 commit。入库改动集中在：根/ui/demo 三份 package.json（+ui 的 vite-plugin-dts）、三份 tsconfig、pnpm-lock.yaml、pnpm-workspace.yaml（supply-chain exclude）、eslint 相关源码修复（useSegmentedInput）。

## 5. 收尾

- [x] 5.1 下游消费方 typecheck 抽查：临时项目用 **TS5.9.3** import 升级后 `dist` 的 TmAlert/TmButton/TmInput/TmTable 及 `/table` 子路径，`tsc --noEmit` exit 0——实证新 d.ts 对旧版 TS 消费方完全兼容，残留风险从「疑似」降到「实证等价」
- [x] 5.2 合并评审（code-reviewer 独立核验完成）：版本/别名一致性、tsconfig 迁移、三处源码修复全部确认正确，无 CRITICAL；**结论「可合并（带警示）」**。随带清理 S1 文档残留（demo README 依赖表、vite.config `cleanVueFileName` 注释 4.5.x→5.x）；`resolver.ts:22` 与 `vite.config:103` 为 4.5.x 版本特定行为 caveat，未逐项复核 5.x 一致，保留历史版本戳。W1/W2（demo2 与 demo 重名导致 `--filter demo` 歧义 + lockfile 引用 gitignored demo2 importer）为**既有隐患**，建议另起变更处理，详见评审报告
- [ ] 5.3 合入 master（建议 squash），随后 CI `pnpm install --frozen-lockfile` + `pnpm check` 复核（确认 `@typescript/typescript6` 别名在 CI 环境解析正常）
- [ ] 5.4 变更收尾：`openspec apply` 落地，归档本 change