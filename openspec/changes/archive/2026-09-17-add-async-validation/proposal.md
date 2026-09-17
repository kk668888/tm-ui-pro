## Why

`add-validation-rules` 把"本地判据"这一层做统一了，但当时**明确把异步校验列进 Non-Goals**（原文："不做异步校验（服务端唯一性等）——本期只做本地判据"）。现在业务侧出现了本地判据表达不了的需求：**判据依赖外部数据源**——最典型的是"编号/名称唯一性"必须在提交时问服务端，无法在本地正则或校验位算法里算出来。

这类需求在业务里的现状是：绕开校验工具，自己在 ant 的 `rules` 里手写一个 async-validator 的 `validator`，或在 vxe 的 `rules` 里手写异步 validator——**又回到了两套格式各写一遍**，正是上一个变更要消灭的东西。

因此本期把那条 Non-Goal 收回来：让**自定义判据可以返回 Promise**，异步能力经既有 `registerValidator` 入口进入，配置对象与内置类型完全不动。

## What Changes

- **判据类型放宽**：`CustomPredicate` 由 `(value) => boolean` 放宽为 `(value) => boolean | Promise<boolean>`。同步判据仍是合法值，**向后兼容**。
- **新增异步求值**：`evaluatePredicateAsync`（空值在 `await` 之前短路，异步判据 MUST NOT 因空值被调用）。
- **两个适配器的自定义判据分支改异步**：ant 侧产出 async `validator`；vxe 侧产出返回 Promise 的 `validator`（失败 reject，`Error.message` 即提示文案）。
- **内置 11 种类型保持同步**：判据是纯计算，不引入无谓的 microtask，产出规则与实现**逐字节不变**。
- **不加配置字段**：没有 `async: true` 之类的开关——异步与否由判据函数的返回值形态自然决定。
- **判据内抛出的异常不吞**：原样作为校验失败传递（不替换成格式文案），避免把"外部数据源挂了"伪装成"格式不正确"。
- 文档站校验工具页新增「异步校验」章节，并**警示 vxe 异步校验的两个固有特性**（同单元格内并发无序、trigger 触发的竞态）。
- 新增异步校验 live demo（模拟远程唯一性检查）。
- 同步 `prefer-tm-ui` skill 与 `.agents` 镜像。

## Capabilities

### New Capabilities

<!-- 无新 capability：本期是既有 validation/rules 能力的扩展。 -->

### Modified Capabilities

- `validation/rules`: 新增「自定义判据支持异步校验」Requirement——自定义判据可返回 Promise，适配器等其结果；空值在调用判据前短路；判据异常原样冒泡；内置类型保持同步。

## Impact

- **修改**：`packages/ui/src/validation/types.ts`（判据类型归口 + 放宽）、`adapters/shared.ts`（新增异步求值）、`registry.ts`（类型改 re-export）、`adapters/ant.ts` 与 `adapters/vxe.ts`（**仅自定义判据分支**）
- **不变**：内置判据（`predicates/**`）、文案表（`messages.ts`）、`required` 拆条策略、双向等价策略、TmForm / TmTable 组件源码、包主入口导出清单
- **测试**：`__tests__/adapters.spec.ts` 补异步用例；`__tests__/integration.spec.ts` 补异步端到端
- **文档**：`apps/docs/tools/validation.md`、`packages/ui/src/validation/demos/`
- **依赖**：无新增
- **兼容性**：非 BREAKING。同步判据行为不变；唯一产出形态变化是**自定义判据**的 vxe `validator` 由"返回 `Error`"变为"返回 Promise"——vxe 两种形态均支持（`hook.js` 483–494 分别走 `isError` 与 `.catch` 分支），行为等价
