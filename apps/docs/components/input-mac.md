# InputMac MAC 地址输入框

**自研交互组件（segment 系第二位）**：六段式 MAC 地址输入，六个短输入段以 `:`（或 `-`）分隔，段内只接受十六进制字符并**实时转大写**；失焦时单字符段自动补前导 `0` 并统一大写，产出规范值。与 `TmInputIp` 共用同一分段输入内核 `useSegmentedInput`，因此在交互体验（跳段 / 退格回跳 / 方向键跨段 / 粘贴分发）上完全一致。

## 何时使用

- 需要填写 MAC 地址的表单字段（网卡绑定、DHCP 静态分配、流量白名单等），通常与 IP 地址成对出现。
- 希望用户只需键入十六进制字符、免输入规范格式的要求——大小写、前导零由组件在输入与失焦时自动收敛为 `AA:BB:CC:DD:EE:FF` 规范形式。
- 希望表单拿到的值「要么空串、要么完整规范的 MAC 串」，必填与否交给 form rule。

## 与 InputIp 的核心差异

| 维度 | InputIp | InputMac |
| --- | --- | --- |
| 段数 / 每段位数 | 4 段 × 3 位十进制 0–255 | 6 段 × 2 位十六进制 00–FF |
| 字符集 | `0-9` | `0-9 A-F`（输入 `a-f` 实时转大写） |
| 分隔符 | `.`（固定） | `:`（默认）或 `-`（prop 可配置） |
| 归一化 | 无（前导零按原文保留） | 失焦时补前导 `0` + 统一大写（blur 归一化） |
| v-model | 四段齐且合法即 emit | 六段均已是规范形（2 位大写）才 emit |

输入过程中段值实时转大写（如打 `a` 显示 `A`）、但不补零；**失焦时**才把所有单字符段补 `0`（`A` → `0A`）并 emit 规范串。因此「所见即所得」的语义是：聚焦时是输入态，失焦后是规范态。

## 基础用法

用户只需键入十六进制字符，段满 2 位自动跳下一段，打 `:` 或 `-`（当前配置的分隔符）也可跳段；段首退格回跳上一段；`←` / `→` 跨段移动；粘贴 `1A:2B:3C:4D:5E:6F` 或纯数字串 `AABBCCDDEEFF` 均自动分发。

<script setup>
import InputMacDemo from '../../../packages/ui/src/components/input-mac/demos/basic.vue'
import InputMacDemoCode from '../../../packages/ui/src/components/input-mac/demos/basic.vue?raw'

const inputMacProps = [
  {
    prop: 'modelValue',
    desc: '`v-model` 绑定值：六段均补齐为 2 位大写十六进制（规范形）时为核心串（如 `0A:1B:2C:3D:4E:5F`）；任一段为空或未达规范形时为 `""`——表单侧要么空要么完整规范',
    type: 'string',
    default: "''",
  },
  {
    prop: 'separator',
    desc: '段分隔符：`:`（IEEE 标准）或 `-`（隔行线）。保存 / 组装 / 粘贴解析均用该符号，不支持双格式容错（`:` 模式粘 `-` 串会被整串拒绝）',
    type: "':' | '-'",
    default: "':'",
  },
  {
    prop: 'size',
    desc: '控件尺寸（与 ant 表单控件同体系）',
    type: "'small' | 'middle' | 'large'",
    default: "'middle'",
  },
  {
    prop: 'disabled',
    desc: '禁用：整体置灰不可交互；未显式传时级联 `TmForm` 的 `disabled`',
    type: 'boolean',
    default: '-',
  },
  {
    prop: 'readonly',
    desc: '只读：段值可见不可编辑（不置灰）；未显式传时级联 `TmForm` 的 `readonly`',
    type: 'boolean',
    default: '-',
  },
]
</script>

<DemoBlock :code="InputMacDemoCode">
  <InputMacDemo />
</DemoBlock>

## 校验与归一化

- **键入层**：keydown 拦截非十六进制字符，input 事件兜底 IME / 自动填充路径；输入的同时实时转大写。
- **blur 归一化**：失焦时所有单字符段补前导 `0`（`A` → `0A`）并统一大写——补齐后六段均达规范形，`update:modelValue` 携带规范串。
- **完成度**：六段均已是规范形（2 位大写）才 emit；半成品（哪怕只缺一段）失焦后仍 emit `''`，段未缺失的空段不补零。
- **程序设值**：含非法段（如 `GG:12:34:56:78:9A`，注意 `G` 不是十六进制）按原文展示并标红 error 态，不静默修正；是否必填交给 `TmForm` rule（`''` 触发 `required`）。

## API

### TmInputMac Props

<TmPropsTable :data="inputMacProps" />

### TmInputMac Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件；六段均补齐为规范形时携带完整大写串，否则携带 `''` | `(value: string) => void` |

### TmInputMac Methods

业务侧通过 `ref` 调用（自有实现，非 ant 实例透传）：

| 方法 | 说明 |
| --- | --- |
| `focus()` | 聚焦第一个空段（全部已填时聚焦末段） |
| `blur()` | 使当前聚焦段失焦 |

### TmInputMac Types

- `TmInputMacProps`、`TmInputMacSeparator`（`':' | '-'`）可直接从 `@kibus/tm-ui-plus` 导入。