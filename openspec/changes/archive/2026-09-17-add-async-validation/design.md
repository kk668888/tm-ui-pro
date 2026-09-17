## Context

动机见 `proposal.md - Why`；行为契约见 `specs/validation/rules/spec.md`。以下是塑造本设计的技术现状（均为对当前依赖的实测结论）。

**两侧框架的校验器都原生支持异步，缺的只是本工具的判据内核。**

- **ant / async-validator**（`async-validator@4.2.5` dist-node `index.js:1274-1279`）：

  ```js
  if (res && res.then) {
    res.then(() => cb(), (e) => cb(e))
  }
  ```

  即 `validator` 返回 Promise 就会被 await，**reject 出的 Error 的 message 即字段提示文案**。本工具 ant 侧自定义分支**已经是**返回 Promise 的写法（`adapters/ant.ts`），形状天然对。

- **vxe**（`vxe-table@4.20.7` `es/table/module/validator/hook.js:483-494`）：

  ```js
  if (customValid) {
    if (XEUtils.isError(customValid)) { /* 同步 Error：即判失败 */ }
    else if (customValid.catch) { /* 异步：push 进 syncValidList，Promise.all 等待 */ }
  }
  ```

  两种形态**同时支持**：同步返回 `Error` 走 `isError` 分支；返回 Promise 走 `.catch` 分支，**失败必须 reject**（`e.message` 即单元格提示）。批量校验侧 `validCellRules` 末尾 `Promise.all(syncValidList)`（`hook.js:507`）保证等待。

**结论**：改动面只在判据内核类型 + 两个适配器的**自定义判据分支**，框架侧零改动、组件侧零改动。

**既有设计的约束**（来自 `add-validation-rules/design.md`）：

- D2 决定"只在正则与声明式都表达不了时才产出自定义校验函数"，分叉面被收敛到计算类 2 个类型 + 自定义判据——异步能力**正好落在已有的自定义判据分支上**，不新增分叉面。
- D4 决定"空值借原生短路"，因此异步判据的空值短路也是同一个口径。
- D5 决定"扩展只写自有登记表"，异步能力不需要任何新的全局机制。

## Goals / Non-Goals

**Goals:**

- 自定义判据可返回 Promise，两个适配器都正确等待结果
- 同步判据**行为与产出形态完全不变**（零回归）
- 内置 11 种类型的产出**逐字节不变**
- 空值不触发异步判据（不对空值发起外部请求）
- 零新增依赖、零新增全局状态、零组件改动、零新增配置字段

**Non-Goals:**

- 不给内置类型引入异步（如 `uniqueName` 内置化）——异步需求本质来自业务外部数据源，入口是自定义判据
- 不做请求去重 / 防抖 / 取消（AbortController）——竞态与节流留给业务在判据内自行处理，工具只做文档警示
- 不做跨字段校验（如"两次密码一致"）——仍归自定义判据（其判据函数可闭包捕获整个 model）
- 不加 `async: true` 之类的配置开关——异步与否由判据返回值形态自然决定，开关是冗余状态

## Decisions

### D1：异步能力只经 `registerValidator` 进入，配置对象与内置类型零改动

对外 API 面**不新增任何字段**：`BaseRuleConfig` 不变，`type` 仍是唯一判别字段；异步与否不写在配置里，而由**注册的判据函数**决定。

*备选*：给配置加 `async?: boolean`，或给内置类型加异步版本（如 `uniqueIdCard`）。**否决理由**：异步的成因永远是"判据要问外部"，而外部数据源的接入点天然就是自定义判据；配置开关只会引入"声明了 async 但判据是同步"（或反之）的不一致状态。**采纳理由**：一处放宽类型（`CustomPredicate`）即覆盖全部异步场景，配置面零学习成本。

### D2：同步 / 异步**双求值函数**，内置走同步、自定义走异步

`adapters/shared.ts` 保留既有 `evaluatePredicate`（同步，供内置计算类使用），**新增** `evaluatePredicateAsync`（供自定义判据使用）。

*备选*：把 `evaluatePredicate` 统一改成 `async`，两侧都 `await`。**否决理由**：① 内置计算类判据是纯计算，改成 async 后 vxe 侧产出由"同步返回 `Error`"变成"返回 Promise"，**既有产出形态与文档描述都要改**（无谓回归面）；② 自增一个 microtask 对所有内置类型生效；③ 丢失"内置恒同步"这一可断言的语义。**采纳理由**：两函数各司其职，语义清晰可断言——**内置恒同步、自定义可异步**——且内置产出逐字节不变。

### D3：空值短路必须发生在**调用判据之前**

`evaluatePredicateAsync` 的第一行是 `if (isEmptyValue(value)) return undefined`，之后才 `await predicate(value)`。

*理由*：这不只是性能优化——异步判据往往是一次网络请求，"用户清空输入框后仍发起一次远程查询"是实打实的错误行为。这条在 spec 里落为独立 Scenario 并配测试。

### D4：判据抛出的异常**不吞**，原样冒泡为校验失败

不在求值函数里 `try/catch`：判据内抛出的异常沿 Promise 链冒泡到框架，ant 侧成为字段提示、vxe 侧成为单元格提示，文案即异常的 message。

*备选*：捕获异常并替换为配置的格式文案（fail-closed 且文案可控）。**否决理由**：会把"外部数据源不可用"伪装成"格式不正确"，让真实故障难以定位，且掩盖判据自身的编码错误。**采纳理由**：诚实暴露故障；判据作者若希望"请求失败即视为不通过"，应在判据内自行 `catch` 并返回 `false`（配 `message` 文案），控制权留在作者手里。此约定写入文档。

### D5：判据类型归口 `types.ts`

把 `ValuePredicate`（同步）与 `CustomPredicate`（可异步）一并放 `types.ts`，`registry.ts` 与 `adapters/shared.ts` 从那里导入，`registry.ts` 保留同名 re-export 维持既有导出路径。

*理由*：两个判据类型必须口径一致（`CustomPredicate` 是 `ValuePredicate` 的放宽），分处两文件时这层关系不可见；`types.ts` 本就是"纯类型、零运行时依赖"的对外类型归口。*代价*：`shared.ts` 与 `adapters/index.ts` 各改一行 re-export，属可接受的小幅搬动。

### D6：自定义判据的 vxe `validator` 恒为异步形态

自定义判据分支产出的 vxe `validator` **一律返回 Promise**（不再按判据是否 async 分支判断），失败 reject。

*备选*：生成期嗅探判据是否为 `AsyncFunction`（`predicate.constructor.name`），同步判据保持同步产出。**否决理由**：嗅探不可靠——同步函数返回 Promise（`() => Promise.resolve(true)`）会被误判为同步，导致 Promise 被当 truthy **静默恒通过**，这是比"多一次微任务"严重得多的正确性缺陷。**采纳理由**：形态统一即语义统一，vxe 两种形态均支持，行为等价。

### D7：文档必须写明 vxe 异步校验的两个固有特性

工具不解决、只警示（`vxe-table/es/table/module/validator/hook.js` 实测）：

1. **同一单元格内多个异步规则并发**：`syncValidList.push(...)` + `Promise.all`，源码注释原文即"异步校验是并发无序的"，错误顺序不定。
2. **trigger 触发的异步校验存在竞态**：编辑即时触发的异步判据，快速连续改动时旧请求的结果可能后到并覆盖新结果。

**建议**：异步判据优先在**提交前**用 `fullValidate` 统一跑，而非依赖编辑即时触发。

## Risks / Trade-offs

- **异步判据竞态**（见 D7）→ 工具层不引入去重/取消机制，改为在文档与 skill 中明确警示并给出"提交前批量校验"的推荐用法；判据作者可用闭包内的序号/`AbortController` 自行防护。
- **判据异常直冒到用户界面**（D4 的代价）→ 文案可能是 `AxiosError: Network Error` 这类技术信息。已在文档中把"判据内自行 catch"写成推荐姿势；若后续实践中反馈强烈，可再议"异常 → 格式文案"的开关（不在本期）。
- **自定义判据的 vxe 产出形态变更**（同步 `Error` → Promise）→ 属可观察的产出变化，但 vxe 两种形态行为等价、且这是**内部规则对象**而非业务手写 API，判定为非 BREAKING；既有测试中针对自定义判据的同步断言需同步改为 await。
- **异步判据在 jsdom 下测试** → 用可控 deferred（手动 resolve/reject 的 Promise）而非真实计时器，避免 flaky；并断言"空值时判据未被调用"（以调用计数验证，而非仅看结论）。

## Migration Plan

纯扩展，无迁移。既有同步判据的调用方**无需任何改动**（类型放宽是向后兼容的超集）。回滚即还原类型与自定义判据分支，无数据/配置影响。

## Open Questions

- 是否内置几个常用异步判据（如 `remoteUnique`）？——倾向不做：外部数据源的接入方式（axios / fetch / 业务 request 封装）因项目而异，内置反而强加依赖，留给业务 `registerValidator` 更合适。
