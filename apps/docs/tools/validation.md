# Validation 校验工具

一份判据内核，产出 **ant / vxe 两份规则**的工具函数：`toAntRule` 喂给 `TmForm` 表单项，`toVxeRule` 挂到 `TmTable` 列编辑，批量校验用表格实例的 `fullValidate`。业务不再为同一格式（手机号 / IP / 身份证 …）在两套规则格式里各写一遍。

## 何时使用

- TmForm 表单字段需要格式校验（手机号、邮箱、身份证、区间 …），不想手写 async-validator 规则。
- TmTable 行编辑的单元格需要校验，且提交前要**一键批量校验**全部行。
- 内置 11 种类型不够用，希望注册自己的判据（如工单号、内部编号）后同样两地复用。
- 判据依赖外部数据源（如编号唯一性要问服务端），需要**异步校验**——自定义判据返回 Promise 即可，见「异步校验」。

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
import FormAsyncDemo from '../../../packages/ui/src/validation/demos/form-async.vue'
import FormAsyncDemoCode from '../../../packages/ui/src/validation/demos/form-async.vue?raw'
import TableValidationDemo from '../../../packages/ui/src/validation/demos/table.vue'
import TableValidationDemoCode from '../../../packages/ui/src/validation/demos/table.vue?raw'
</script>

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
import { registerValidator, toAntRule, toVxeRule } from '@trustmo/tm-ui'

registerValidator('ticketNo', (value) => /^TD-\d{6}$/.test(String(value)))

// 之后 type 直接用注册名，两个适配器均可：
toAntRule({ type: 'ticketNo', message: '工单号格式不正确' })
toVxeRule({ type: 'ticketNo' })
```

- 内置类型名（`ipv4` / `range` / `idCard` …）**禁止覆盖**，注册同名会抛错。
- 判据只写入本库内部登记表，**不写 vxe 全局注册表**，无全局副作用；未注册的类型名会直接抛错而非静默产出无效规则。

## 异步校验

本地正则表达不了的判据——最典型的是**判据依赖外部数据源**，比如「编号/名称唯一性」必须在提交时问服务端——可以让自定义判据**返回 Promise**。异步能力只从 `registerValidator` 这个入口进入，**配置对象不加任何字段**。

下面这个例子注册了一个模拟远程唯一性检查的判据（`DEV-0001` / `DEV-0002` 视为已被占用），点提交体验异步校验：

<DemoBlock :code="FormAsyncDemoCode">
  <FormAsyncDemo />
</DemoBlock>

用法与同步判据完全一致，只是判据函数返回 Promise：

```ts
import { registerValidator, toAntRule } from '@trustmo/tm-ui'

// 异步判据：返回 Promise —— 兑现为 true 即通过，false 即不通过
registerValidator('deviceNoUnique', async (value) => {
  const { available } = await api.checkDeviceNo({ deviceNo: String(value) })
  return available
})

const rules = {
  deviceNo: toAntRule({
    type: 'deviceNoUnique',
    required: true,
    requiredMessage: '请输入设备编号',
    message: '该编号已被占用，请换一个',
  }),
}
```

同步判据（返回 `boolean`）仍然照旧可用——**类型放宽后向后兼容**，既有代码无需改动。

### 三条约定

**空值不触发判据。** 空值在调用判据**之前**就短路了，所以异步判据不会因为「用户清空输入框」而发起一次远程查询。空值拦不拦仍完全由 `required` 决定。

**判据抛出的异常不吞，原样成为校验失败。** 比如外部请求失败时，字段提示就是那个异常的 `message`（例如 `Network Error`）——这样真实故障不会被伪装成「格式不正确」。若你希望「请求失败即视为不通过」并给出自己的文案，请在判据内自行 `catch` 并返回 `false`：

```ts
registerValidator('deviceNoUnique', async (value) => {
  try {
    const { available } = await api.checkDeviceNo({ deviceNo: String(value) })
    return available
  } catch {
    return false // 失败即判不通过，提示文案用配置里的 message
  }
})
```

**内置类型恒为同步。** 11 种内置类型的判据都是纯计算（正则 / 校验位算法），不受异步能力影响，产出规则与以前完全一致。

### 表格里的异步校验

vxe 的 `fullValidate` 会**等待**异步判据完成后再返回结果，所以「提交前批量校验」的用法不变：

```ts
const errMap = await tableRef.value?.fullValidate(true)
if (errMap) { /* 提示问题字段：Object.keys(errMap) */ }
```

::: warning vxe 异步校验的两个固有特性
1. **同一单元格内多个异步规则是并发的**（vxe 内部 `Promise.all`），错误的先后顺序不确定。
2. **编辑即时触发（`trigger`）的异步校验存在竞态**：快速连续改动时，先发出的请求可能后返回并覆盖最新结果。

因此异步判据**优先在提交前用 `fullValidate` 统一跑**，而不是依赖编辑即时触发。确有即时校验需求的，可在判据内用闭包序号或 `AbortController` 自行丢弃过期结果。
:::

## 注意事项

- `toVxeRule` 产出的提示字段是 vxe 的 `content`（`message` 已被 vxe 废弃），计算类校验失败时以返回 `Error` 的 message 为准。
- 挂列级 `rules` 时记得配 `edit-rules` 门禁（见上方 warning）。
- 批量校验 `fullValidate(true)` 中 `true` 表示校验表格全部行；也可传行数组只校验指定行。
- 自定义判据的 vxe `validator` 恒为异步形态（恒返回 Promise），这是为了兼容「判据返回 Promise」的两可情形；同步判据的判定结论不受影响。
