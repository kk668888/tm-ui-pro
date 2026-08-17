# InputIp IP 地址输入框

库内**首个自研交互组件**（非 ant 薄封装）：四段式 IPv4 地址输入，四个短输入段以 `.` 分隔，视觉复用 ant design token 与其他表单控件一致。分段输入内核沉淀在 `useSegmentedInput` composable，供未来 IPv6 / port-range 复用。

## 何时使用

- 需要填写 IPv4 地址的表单字段（服务器 IP、网关、DNS 等）。
- 希望用户只打数字、免输 `.`，且非法输入（非数字 / 段值 > 255）在键入层就被拦截。
- 希望表单拿到的值「要么空串、要么完整合法 IP」，必填与否交给 form rule。

## 基础用法

用户只需键入数字：段满 3 位自动跳下一段，打 `.` 也可跳段；越界数字（如 `25` 后打 `6`）自动跳段并承载；段首退格回跳上一段；`←` / `→` 跨段移动；粘贴 `192.168.1.1` 或 `19216811` 均自动分发。

<script setup>
import InputIpDemo from '../../../packages/ui/src/components/input-ip/demos/basic.vue'
import InputIpDemoCode from '../../../packages/ui/src/components/input-ip/demos/basic.vue?raw'

const inputIpProps = [
  {
    prop: 'modelValue',
    desc: '`v-model` 绑定值：四段齐且每段 0–255 时为完整点分串（前导零按原文，如 `192.01.1.1`）；任一段为空或越界时为 `""`——表单侧要么空要么完整合法',
    type: 'string',
    default: "''",
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

<DemoBlock :code="InputIpDemoCode">
  <InputIpDemo />
</DemoBlock>

## 校验分层

- **键入层**：keydown 拦截非数字与越界字符（字符根本不出现），input 事件兜底 IME / 自动填充路径，双防线保证不产生脏值。
- **完成度**：四段齐且全部合法才 emit 完整串；blur 保留半成品显示不清空。
- **程序设值**：含非法段（如 `999.1.1.1`）按原文展示并标红 error 态，不静默修正；是否必填交给 `TmForm` rule（`''` 触发 `required`）。

## API

### TmInputIp Props

<TmPropsTable :data="inputIpProps" />

### TmInputIp Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件；四段齐且全合法时携带完整点分串，否则携带 `''` | `(value: string) => void` |

### TmInputIp Methods

业务侧通过 `ref` 调用（自有实现，非 ant 实例透传）：

| 方法 | 说明 |
| --- | --- |
| `focus()` | 聚焦第一个空段（全部已填时聚焦末段） |
| `blur()` | 使当前聚焦段失焦 |

### TmInputIp Types

- `TmInputIpProps`（自有 props 契约）可直接从 `@kibus/tm-ui-plus` 导入。
