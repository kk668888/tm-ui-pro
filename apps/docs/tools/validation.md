# Validation 校验工具

一份判据内核，产出 **ant / vxe 两份规则**的工具函数：`toAntRule` 喂给 `TmForm` 表单项，`toVxeRule` 挂到 `TmTable` 列编辑，批量校验用表格实例的 `fullValidate`。业务不再为同一格式（手机号 / IP / 身份证 …）在两套规则格式里各写一遍。

## 何时使用

- TmForm 表单字段需要格式校验（手机号、邮箱、身份证、区间 …），不想手写 async-validator 规则。
- TmTable 行编辑的单元格需要校验，且提交前要**一键批量校验**全部行。
- 内置 11 种类型不够用，希望注册自己的判据（如工单号、内部编号）后同样两地复用。

## 在 TmForm 中使用（toAntRule）

`toAntRule` 恒返回**规则数组**，两种绑定位置任选，效果完全一致：

- **绑在 `TmForm` 的 `rules`**（字段多时推荐）：以字段名为 key 聚合成对象，`TmFormItem` 只声明 `name` 按名取用；
- **绑在 `TmFormItem` 的 `rules`**：字段少、规则就地可读时逐字段绑定。

### 写法一：绑定在 TmForm 的 rules（Form 级聚合）

演示三种典型：必填双文案（手机号）、非必填空值直通（邮箱）、计算类校验位（身份证——试试把末位 `X` 改成别的数字，会被校验位算法拦下）：

<DemoBlock :code="FormValidationDemoCode">
  <FormValidationDemo />
</DemoBlock>

### 写法二：绑定在 TmFormItem 的 rules（逐字段就地绑定）

同样的三条规则，改为逐字段写在各自 `TmFormItem` 的 `rules` 上：

<DemoBlock :code="FormItemValidationDemoCode">
  <FormItemValidationDemo />
</DemoBlock>

<script setup>
import FormValidationDemo from '../../../packages/ui/src/validation/demos/form.vue'
import FormValidationDemoCode from '../../../packages/ui/src/validation/demos/form.vue?raw'
import FormItemValidationDemo from '../../../packages/ui/src/validation/demos/form-item.vue'
import FormItemValidationDemoCode from '../../../packages/ui/src/validation/demos/form-item.vue?raw'
import TableValidationDemo from '../../../packages/ui/src/validation/demos/table.vue'
import TableValidationDemoCode from '../../../packages/ui/src/validation/demos/table.vue?raw'
</script>

<DemoBlock :code="FormValidationDemoCode">
  <FormValidationDemo />
</DemoBlock>

## 在 TmTable 中使用（toVxeRule + 批量校验）

规则挂到列的 `rules` 字段；点击「提交前批量校验」用 `tableRef.fullValidate(true)` 一次性校验全部行（失败时 resolve 出以字段名为 key 的错误表）。第 2 行预置了非法 IP 与端口，可直接体验：

<DemoBlock :code="TableValidationDemoCode">
  <TableValidationDemo />
</DemoBlock>

::: warning 必读：vxe 的 `edit-rules` 门禁
vxe 校验器内部以「网格 `editRules` 是否含该字段」决定该列是否参与校验。因此即便规则写在**列的 `rules`** 上，也必须同时给一个**含字段键**的 `edit-rules`（值可为空数组）：

```ts
// 列上有 rules 时，edit-rules 只承担「声明哪些字段参与校验」的门禁职责
const editRules = { ip: [], port: [] }
```

也可以不用列级 `rules`，直接把规则写进 `edit-rules` 映射（二者同时存在时列级优先）：

```ts
const editRules = { ip: toVxeRule({ type: 'ipv4', required: true }) }
```
:::

## 全部校验类型

| type | 判据 | 参数 | 默认格式文案 |
| --- | --- | --- | --- |
| `ipv4` | 点分四段，每段 0–255（容忍前导零） | — | 请输入正确的 IPv4 地址 |
| `ipv6` | 标准 IPv6 文本（含 `::` 压缩；不含 IPv4 内嵌形式） | — | 请输入正确的 IPv6 地址 |
| `mac` | 六组两位十六进制，`:` 或 `-` 分隔（不可混用） | — | 请输入正确的 MAC 地址 |
| `port` | 整数 0–65535 | — | 请输入正确的端口号（0-65535） |
| `phone` | 中国大陆手机号（1 + 第二位 3–9，共 11 位） | — | 请输入正确的手机号 |
| `email` | 常规邮箱格式 | — | 请输入正确的邮箱地址 |
| `url` | http / https 地址 | — | 请输入正确的 URL 地址 |
| `range` | 数值闭区间 | `min`、`max` | 请输入 {min}~{max} 之间的数值 |
| `length` | 字符串长度闭区间 | `min`、`max` | 长度需在 {min}~{max} 位之间 |
| `idCard` | 18 位身份证，**含 GB 11643 校验位** | — | 请输入正确的身份证号码 |
| `creditCode` | 18 位统一社会信用代码，**含 GB 32100 校验码** | — | 请输入正确的统一社会信用代码 |

> `range` 期望数值型值（配 `TmInputNumber` 等数值控件）；`length` 仅对字符串生效。

## 空值语义与双文案

空值是否拦截由 `required` 决定，与 ant / vxe 原生行为一致：

- `required: false`（默认）：空值**直接通过**，格式判据不参与。
- `required: true`：空值不通过，提示 `requiredMessage`（默认「请输入」）。

`required: true` 时产出**两条规则**（必填在前、判据在后），因此两条文案互不干扰：

```ts
toAntRule({ type: 'ipv4', required: true })
// → [
//     { required: true, message: '请输入' },
//     { pattern: /…/, message: '请输入正确的 IPv4 地址' },
//   ]
```

## 扩展：注册自定义判据

```ts
import { registerValidator, toAntRule, toVxeRule } from '@kibus/tm-ui-plus'

registerValidator('ticketNo', (value) => /^TD-\d{6}$/.test(String(value)))

// 之后 type 直接用注册名，两个适配器均可：
toAntRule({ type: 'ticketNo', message: '工单号格式不正确' })
toVxeRule({ type: 'ticketNo' })
```

- 内置类型名（`ipv4` / `range` / `idCard` …）**禁止覆盖**，注册同名会抛错。
- 判据只写入本库内部登记表，**不写 vxe 全局注册表**，无全局副作用；未注册的类型名会直接抛错而非静默产出无效规则。

## 注意事项

- `toVxeRule` 产出的提示字段是 vxe 的 `content`（`message` 已被 vxe 废弃），计算类校验失败时以返回 `Error` 的 message 为准。
- 挂列级 `rules` 时记得配 `edit-rules` 门禁（见上方 warning）。
- 批量校验 `fullValidate(true)` 中 `true` 表示校验表格全部行；也可传行数组只校验指定行。
