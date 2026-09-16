## 1. Spike 与模块骨架

- [x] 1.1 Spike：验证 `TmTableProps['columns']` 能否声明 `rules` 并通过 vue-tsc（运行时已确定支持，缺的是类型声明）。通过则走列级 `rules`；不通过则退到网格级 `editRules`（按 field 索引），并记录该退路对 TmTable 类型的影响
  - **结论（已验证）**：`VxeColumnProps` 原生声明 `rules?: VxeColumnPropTypes.Rules<D>`（vxe-pc-ui `column.d.ts:568`），探针含 `required`/`pattern`/`validator` 三种规则 vue-tsc 零错误。**走列级 `rules`，无需 `editRules` 退路，TmTable 类型零改动**
- [x] 1.2 建立 `packages/ui/src/validation/` 骨架：谓词内核、两个适配器、登记表、类型各自独立文件（遵循"按组件/能力分文件"惯例）
- [x] 1.3 定义公共类型：以 `type` 为判别字段的配置对象联合类型、规则数组类型别名、双文案字段

## 2. 谓词内核（纯函数，独立可测）

- [x] 2.1 正则类判据 + 单测：`ipv4`（点分四段、每段 0–255）、`ipv6`（标准文本 + `::` 压缩）、`mac`（冒号/连字符）、`port`（0–65535）、`phone`（第二位 3–9）、`email`、`url`（http/https）
- [x] 2.2 比较类判据 + 单测：`range`（数值闭区间）、`length`（长度闭区间），含边界值用例
- [x] 2.3 计算类判据 + 单测：`idCard`（GB 11643 加权 + MOD 11-2 校验位）、`creditCode`（GB 32100 校验码）；使用权威测试向量，含"仅校验位错误"的反例

## 3. 双适配器

- [x] 3.1 实现 `toAntRule`：正则可表达 → `pattern`；比较类 → `type` + `min`/`max`；计算类 → 自定义 `validator`（对空值手动短路）；`required` 独立成条；双文案各自默认值；恒返回规则数组
- [x] 3.2 实现 `toVxeRule`：与 `toAntRule` 同构，差异仅在自定义 `validator` 的签名适配（读取 `{ cellValue }`）
- [x] 3.3 适配器单测：各 type 的产出字段正确；`required` 拆条；文案默认与覆盖；**跨适配器等价性**——同一输入对两份产出判定结论一致

## 4. 扩展能力

- [x] 4.1 实现 `registerValidator(name, predicate)`：只写模块内登记表；产出规则时在生成期把类型名解析为函数；未注册类型名给出明确错误
- [x] 4.2 扩展性单测：注册后 `toAntRule` / `toVxeRule` 均按自定义判据产出规则；断言 vxe 全局注册表未被写入；断言调用顺序不影响结论

## 5. 导出与集成

- [x] 5.1 在 `packages/ui/src/index.ts` 的导出清单追加：两个适配器、注册接口、配置与规则类型
- [x] 5.2 集成冒烟（TmForm）：`TmFormItem` 的 `rules` 绑定适配器产出，表单校验按判据与文案生效
- [x] 5.3 集成冒烟（TmTable）：列级规则拦截非法输入并展示提示；`tableRef.value.fullValidate()` 在提交前返回失败结果并标识未通过行列

## 6. 文档站

- [x] 6.1 `apps/docs` 新增"校验工具"页面：覆盖 11 种类型的用法，并给出「表单（FormItem.rules）」与「表格（列 rules + 批量校验）」两个场景示例
- [x] 6.2 在 `apps/docs` 的 sidebar 登记新页面（遵循组件交付清单惯例）

## 7. 收口验证

- [x] 7.1 `vue-tsc` 类型检查通过（含 1.1 spike 结论的落地）
- [x] 7.2 单测全绿 + 覆盖率达标（内核与适配器均被覆盖）
- [x] 7.3 `pnpm --filter @kibus/tm-ui-plus build` 成功，产物与 dts 含新导出且路径可移植
