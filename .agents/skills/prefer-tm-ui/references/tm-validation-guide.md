# 校验工具使用指南（toAntRule / toVxeRule / registerValidator）

> 本文件是 `prefer-tm-ui` skill 的参考资料。业务项目里写表单校验、表格单元格校验时，**不要手写** async-validator / vxe 规则，用组件库的校验工具函数。

## 心智模型

一份判据内核，两个适配器，产出**两份框架各自的规则**：

```text
toAntRule(config) → ant 规则数组     → 绑 TmForm / TmFormItem 的 rules
toVxeRule(config) → vxe 规则数组     → 挂 TmTable 列 rules（单元格编辑校验）
registerValidator(name, predicate)   → 注册自定义判据，两个适配器通用
```

- 配置对象以 `type` 为判别字段，参数与文案同处一个对象
- **恒返回规则数组**（可直接绑 `:rules`）
- 判据同源：同一 type 的两份产物对同一输入结论一致

## 何时用

- TmForm 表单字段要格式校验（手机号 / 邮箱 / 身份证 / 区间 …）——不要手写 `{ pattern: ..., message: ... }`
- TmTable 行编辑单元格要校验，提交前要**批量校验**全部行
- 需要 IP / MAC / 端口 / 身份证（含校验位）/ 统一社会信用代码（含校验码）这类格式判据——组件库已内建，不要自己写正则

## 全部校验类型（11 种）

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

- `range` 期望数值型值（配 `TmInputNumber`）；`length` 仅对字符串生效
- `idCard` / `creditCode` 不只查格式——校验位/校验码错误同样拦下

## TmForm 用法（toAntRule）

两种绑定位置任选，效果一致：

**绑在 `TmForm` 的 `rules`**（字段多时推荐，以字段名为 key 聚合）：

```ts
import { TmForm, TmFormItem, toAntRule } from '@kibus/tm-ui-plus'

const rules = {
  phone: toAntRule({ type: 'phone', required: true, requiredMessage: '请输入手机号', message: '手机号格式不正确' }),
  email: toAntRule({ type: 'email' }),
  idCard: toAntRule({ type: 'idCard', required: true }),
}
```

```vue
<TmForm ref="formRef" :model="formState" :rules="rules">
  <TmFormItem label="手机号" name="phone">  <!-- 只声明 name，按名取用 -->
    <TmInput v-model="formState.phone" />
  </TmFormItem>
</TmForm>
```

**绑在 `TmFormItem` 的 `rules`**（字段少、就地可读）：

```vue
<TmFormItem label="手机号" name="phone" :rules="toAntRule({ type: 'phone', required: true })">
```

## TmTable 用法（toVxeRule + 批量校验）

规则挂**列级 `rules`**；提交前 `fullValidate(true)` 批量校验全部行：

```ts
import { TmTable, toVxeRule } from '@kibus/tm-ui-plus'

const columns: TmTableProps['columns'] = [
  { field: 'ip', title: '服务器 IP', editRender: { name: 'VxeInput' }, rules: toVxeRule({ type: 'ipv4', required: true }) },
  { field: 'port', title: '端口', editRender: { name: 'VxeInput' }, rules: toVxeRule({ type: 'port' }) },
]

// ⚠ 门禁：网格 editRules 必须含参与校验的字段键（空数组即可），列级 rules 才会被读取
const editRules = { ip: [], port: [] }

// 提交前批量校验：通过 resolve undefined；失败 resolve 以字段名为 key 的 errMap
const errMap = await tableRef.value?.fullValidate(true)
if (errMap) { /* 提示问题字段：Object.keys(errMap) */ }
```

模板：`<TmTable ref="tableRef" :data="rows" :columns="columns" :edit-rules="editRules" :edit-config="{ trigger: 'click', mode: 'row' }" />`

也可不用列级 `rules`，直接把规则写进 `edit-rules` 映射（两者同时存在时列级优先）：

```ts
const editRules = { ip: toVxeRule({ type: 'ipv4', required: true }) }
```

## 空值语义与双文案

空值是否拦截由 `required` 决定（与 ant / vxe 原生一致）：

- `required: false`（默认）：空值**直接通过**，格式判据不参与
- `required: true`：空值不通过，提示 `requiredMessage`（默认「请输入」）

`required: true` 产出**两条规则**（必填在前、判据在后），文案拆两条互不干扰：

```ts
toAntRule({ type: 'ipv4', required: true })
// → [
//     { required: true, message: '请输入' },
//     { pattern: /…/, message: '请输入正确的 IPv4 地址' },
//   ]
```

## 扩展：registerValidator

```ts
import { registerValidator, toAntRule, toVxeRule } from '@kibus/tm-ui-plus'

registerValidator('ticketNo', (value) => /^TD-\d{6}$/.test(String(value)))

// 之后 type 直接用注册名，两个适配器均可：
toAntRule({ type: 'ticketNo', message: '工单号格式不正确' })
toVxeRule({ type: 'ticketNo' })
```

- 内置类型名（`ipv4` / `range` / `idCard` …）**禁止覆盖**，注册同名会抛错
- 未注册的类型名**直接抛错**（不静默产出无效规则）
- 判据只写本库内部登记表，**不写 vxe 全局注册表** `VxeUI.validators`，无全局副作用

## 常见坑

1. **手写规则**：写 `{ pattern: /1[3-9]\d{9}/ }` 之前先查上表——内置类型一律用 `toAntRule` / `toVxeRule`
2. **vxe 列 rules 不生效**：网格 `edit-rules` 未含该字段键（必须为真值且含 key，空数组即可），两道门禁缺一不可
3. **vxe 提示字段**：`toVxeRule` 产出的是 `content`（`message` 已被 vxe 废弃）；计算类失败以返回 `Error` 的 message 为准
4. **`range` 绑文本框**：range 期望数值型值，配 `TmInputNumber`；绑文本输入框会收到类型不符提示
5. **必填文案与格式文案混淆**：两条文案独立（`requiredMessage` / `message`），不要指望一条通吃
