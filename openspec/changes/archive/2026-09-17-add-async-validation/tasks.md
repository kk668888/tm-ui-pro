## 1. 判据内核（类型与求值）

- [x] 1.1 `types.ts` 收纳判据类型：`ValuePredicate`（同步，内置用）与放宽后的 `CustomPredicate`（`boolean | Promise<boolean>`）
- [x] 1.2 `registry.ts` 改为从 `types.ts` re-export `CustomPredicate`，保持既有导出路径不变（`validation/index.ts` 与包主入口零改动）
- [x] 1.3 `adapters/shared.ts` 新增 `evaluatePredicateAsync`：**空值在 `await` 之前短路**；同步 `evaluatePredicate` 原样保留不动
- [x] 1.4 `adapters/index.ts` 同步 re-export 路径

## 2. 两个适配器（仅自定义判据分支）

- [x] 2.1 `adapters/ant.ts` 自定义分支：改用 `evaluatePredicateAsync`，产出 async `validator`（失败 throw，async-validator 以 reject 的 message 为提示）
- [x] 2.2 `adapters/vxe.ts` 自定义分支：产出返回 Promise 的 `validator`（失败 reject，`Error.message` 即单元格提示）
- [x] 2.3 确认**内置分支零改动**：正则类仍产声明式 `pattern`、比较类仍产声明式区间、计算类仍为同步 `validator`

## 3. 测试

- [x] 3.1 `adapters.spec.ts`：异步判据通过 / 不通过（含配置文案）两例，两个适配器各断言一次
- [x] 3.2 `adapters.spec.ts`：**空值不调用异步判据**——以调用计数断言（而非仅看结论）
- [x] 3.3 `adapters.spec.ts`：同步自定义判据的回归（既有断言改为 await 后结论不变）
- [x] 3.4 `adapters.spec.ts`：判据抛出的异常成为校验失败，文案为异常 message
- [x] 3.5 `adapters.spec.ts`：内置类型产出形态不受影响（断言计算类 vxe `validator` 仍是同步返回 `Error`）
- [x] 3.6 `integration.spec.ts`：TmForm 端到端——异步判据驱动 `validate()`；TmTable 端到端——异步判据 + `fullValidate(true)` 等待并返回错误表

## 4. 文档站

- [x] 4.1 新增 live demo `validation/demos/form-async.vue`：模拟远程唯一性校验（可控 deferred，含"校验中"反馈）
- [x] 4.2 `apps/docs/tools/validation.md` 新增「异步校验」章节：用法 + 空值不触发 + 异常不吞约定 + **vxe 并发无序与 trigger 竞态警示** + 提交前 `fullValidate` 的推荐用法

## 5. skill 同步

- [x] 5.1 `.claude/skills/prefer-tm-ui/SKILL.md`：§3 校验段补一句异步能力，§4 坑位补充（异步判据优先提交前批量校验）
- [x] 5.2 `.claude/skills/prefer-tm-ui/references/tm-validation-guide.md`：补「异步校验」小节
- [x] 5.3 镜像同步到 `.agents/skills/prefer-tm-ui/`

## 6. 收口验证

- [x] 6.1 `vue-tsc` 类型检查通过
- [x] 6.2 validation 用例全绿
- [x] 6.3 `pnpm --filter @kibus/tm-ui-plus build` 成功，dts 含放宽后的 `CustomPredicate`
- [x] 6.4 openspec 归档：delta 落主规格 `openspec/specs/validation/rules/spec.md`
