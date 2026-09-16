## Context

动机见 `proposal.md - Why`；行为契约见 `specs/validation/rules/spec.md`。以下是塑造本设计的技术现状与约束（均为对当前依赖的实测结论）：

**两侧规则格式高度同构。** ant（async-validator）与 vxe 的规则字段几乎一一对应：

| 字段 | ant | vxe |
|---|---|---|
| `required` / `pattern` / `min` / `max` / `type` / `message` | ✅ | ✅ |
| 自定义校验 | `validator(rule, value, callback)` | `validator({ cellValue, row, column, ... })` |

即：**除 `validator` 回调签名外，两者字段一致**。vxe 侧实测见 `vxe-table/es/table/module/validator/hook.js`（构造内部 Rule 时透传 `required/min/max/type/pattern/validator/trigger`）。

**空值短路是两侧原生行为。** async-validator 与 vxe 在值为空且未声明 `required` 时均跳过判据（vxe 内部 import 了 `eqEmptyValue` 专门处理）。因此"`required:false` 时空值放行、`required:true` 时拦截"无需自写空值分支，只要把 `required` 拆成独立规则、并让自定义 validator 对空值手动短路即可。

**集成点均已就绪，组件无需改动：**

- TmForm：`TmFormItem.rules` 原样透传给 ant `FormItem`。
- TmTable：列级 `column.rules` 是 vxe 原生能力（`hook.js`：`column.rules ?? editRules[field]`）；批量校验实例方法为 `validate / fullValidate / validateField / fullValidateField / clearValidate`（`hook.js` 的 `tableValidatorMethodKeys`），且 TmTable 已用 `useForwardRef` 的 Proxy **全量转发** vxe 实例方法，业务 `tableRef.value.fullValidate()` 开箱可用。
  - **Spike 已验证（1.1）**：`VxeColumnProps` 原生声明 `rules?: VxeColumnPropTypes.Rules<D>`（vxe-pc-ui `column.d.ts:568`），vue-tsc 零错误，无需 `editRules` 退路。
  - **两个易错点（实测自 `ValidatorRule` 定义）**：① 提示字段是 **`content`**——`message` 已 `@deprecated`，适配器必须产 `content`；② 自定义 `validator` 的返回类型是 `void | Error | Promise<void>`——**返回 `Error` 即判失败**，且其 `.message` 会覆盖 `content` 作为提示文案（`hook.js` 485–492），所以计算类的错误文案放进 `Error` 即可。
  - **列级 `rules` 有两道门禁（`hook.js` 实测，实施时发现）**：① `validCellRules` 以 `if (field && editRules)` 为总开关；② 行×列遍历以 `XEUtils.has(editRules, field)` 过滤。因此业务用法是：网格给真值 `editRules`（含字段键，空数组即可）作为「参与校验的声明」，规则本体挂列级 `rules`（读取时优先于 `editRules` 同名字段）。文档站必须写明这一用法。
- vxe 的全局注册表 `VxeUI.validators` 实测**默认为空**（vxe-table / vxe-pc-ui 均未注册内置项），是纯扩展点；其 `add` 对同名 key 是 **merge** 语义（`VXStore.add` 遇同名先 `log.warn` 再合并）。

## Goals / Non-Goals

**Goals:**

- 一份判据内核，两个适配器，覆盖"ant 规则（TmForm）"与"vxe 规则（TmTable 单元格编辑）"两个消费面
- 正则可表达 / 声明式可表达的类型，两份产出**判据等价**；仅计算类分叉
- 判据内核为纯函数，可独立单测，且不依赖任何 UI 库
- 业务可注册自定义判据扩展，且扩展**不产生全局副作用**
- 零新增外部依赖

**Non-Goals:**

- 不做声明式"整个表单一次性配置规则"（TmForm 保持薄封装，不做 schema 化）
- 不改 TmForm / TmTable 组件源码、不新增组件级校验属性
- 不做异步校验（服务端唯一性等）——本期只做本地判据
- 不做 vxe 搜索表单（`search`）的校验（本期定位为单元格编辑）
- 不做跨字段校验（如"两次密码一致"）——留给业务以自定义判据实现

## Decisions

### D1：对外以「配置对象一步出规则」，谓词内核退居内部

对外只暴露 `toAntRule(config)` / `toVxeRule(config)`，`config` 以 `type` 为判别字段，格式参数与文案同处一个对象（贴近 ant/vxe 原生 rule 的书写习惯，一步到位）。

*备选*：柯里化谓词内核（`inRange(1,100)` 直接对外）——纯函数手感好，但要求调用方分"配置 / 判定"两步，且与 ant/vxe 的规则对象生态不贴。**采纳理由**：业务是"写一条规则绑上去"，配置对象最贴合该心智。

谓词内核（正则与校验位算法）仍然实现为纯函数并独立单测，只是不作为主要调用面暴露。

### D2：只在「正则与声明式都表达不了」时才产出自定义校验函数

- 正则类（`ipv4`/`ipv6`/`mac`/`port`/`phone`/`email`/`url`）→ 产出 `pattern`
- 比较类（`range`/`length`）→ 产出 `type` + `min`/`max`
- 计算类（`idCard`/`creditCode`）→ 产出自定义 `validator`

*备选*：一律用自定义 `validator` 统一实现。**否决理由**：那样两份产物必然全量分叉（签名不同），且丢掉 ant/vxe 声明式校验的原生错误提示与短路行为。**采纳理由**：把分叉面收敛到 2 个类型，其余 9 种"两份一字不差"，适配层极薄、漂移风险最小。

### D3：两个适配器各自独立，而非单一函数的 `mode` 参数

对外是 `toAntRule` / `toVxeRule` 两个具名函数。

*备选*：`toRule(config, { mode: 'ant' | 'vxe' })`。**否决理由**：需求方明确要"两份、按场景各自调用"；两个具名函数在依赖图谱与 tree-shaking 上更明确，且避免调用点出现字符串模式参数。

### D4：`required` 独立成条 + 空值短路，不自写空值分支

`required: true` 时产出两条规则（必填一条 + 判据一条）；计算类的自定义 validator 对空值手动返回通过。文案相应拆两条（格式文案 / 必填文案）。

*备选*：自写"空值先判 required 再判格式"的单条校验函数。**否决理由**：会与 ant/vxe 原生的空值短路重复博弈，容易出现"空值时同时报必填与格式错"。**采纳理由**：借原生行为，语义与两个 UI 库的默认一致。

### D5：扩展只写自有登记表，不桥接 vxe 全局注册表

`registerValidator(name, predicate)` 只写模块内的登记表；产出规则时在**生成期**把类型名解析为函数，规则里的 `validator` 恒为函数、不产字符串名。

*备选*：注册时同时 `VxeUI.validators.add(...)`，让业务可在 vxe 配置里写字符串名。**否决理由**：引入全局单例副作用、注册时机与清理责任、且 ant 侧无对等机制（单向不对称），并形成"两张表可能不一致"的状态。**采纳理由**：字符串名只是 vxe 专属的书写糖，收益不抵复杂度。若将来确有需要，再以**显式开关**开启，而非默认污染全局。

### D6：组件零改动

TmForm / TmTable 源码不动。集成靠既有透传：FormItem 的 `rules`、列的 `rules`、实例方法透传。

*备选*：TmTable 新增 `editRules` 扩展键统一收口列规则。**否决理由**：vxe 列级 `rules` 原生可用，加扩展键属重复建设，违背薄封装原则。

### D7：模块落位 `packages/ui/src/validation/`

独立目录（不放 `utils/`，因为它是多文件、含适配层的能力模块；也不放 `composables/`，因其无响应式状态）。

结构与导出：谓词内核、两个适配器、登记表、类型各自成文件；从包主入口 `src/index.ts` 的导出清单追加导出（该文件是手工维护的单一导出清单，需同步）。

### D8：校验位算法自实现，零外部依赖

`idCard`（GB 11643 加权 + ISO 7064 MOD 11-2 校验位）与 `creditCode`（GB 32100 校验码）自行实现，不引第三方校验库。

*备选*：引入 `validator.js` / `async-validator` 的扩展。**否决理由**：与"最小依赖"原则冲突，且这两个国标算法实现量很小。**采纳理由**：算法是纯函数，易测且可给出标准测试向量。

## Risks / Trade-offs

- **`columns[].rules` 的 TS 声明缺失** → 落地第一步做 spike：验证 `TmTableProps['columns']` 能否声明 `rules` 并通过 vue-tsc。若不能，退到网格级 `editRules`（按 field 索引，vxe 原生同样支持），此时才可能需要给 TmTable 类型补一处扩展（届时需评估是否触及 TmTable 的规格）。
- **两份产出漂移** → 对每个 type 用同一组输入同时驱动两个适配器，断言判定结论一致（spec 中"两份判据等价"的场景落为测试）。
- **IPv6 正则复杂度高、易漏边界**（压缩形式、IPv4 映射地址等） → 以标准测试向量覆盖；明确本期范围（标准文本表示 + `::` 压缩），IPv4 映射等边界在 spec 中已界定为实现范围外，避免隐性承诺。
- **校验位算法写错且测试自证** → 用公开的权威测试向量（含正例与"仅校验位错误"的反例），而非自造数据。
- **正则拒收合法值（假阴性）** → 对手机号段、端口边界、IP 边界等易错点写边界测试。

## Migration Plan

纯新增，无迁移。业务按需在 FormItem 的 `rules` 或列的 `rules` 上引入，未引入者行为不变。回滚即移除导出与模块，无数据/配置影响。

## Open Questions

- 文档页的示例取哪几个 type（倾向：手机号 + 身份证放表单、IP 放表格列编辑，各覆盖一类）。
- 是否为常用类型补"业务别名"（如 `mobile` 指向 `phone`）——可延后，不影响本设计与任务拆分。
