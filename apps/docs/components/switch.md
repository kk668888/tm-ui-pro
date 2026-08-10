# Switch 开关

基于 [ant-design-vue](https://www.antdv.com/components/switch-cn) Switch 的薄封装。保留全部 ant 原生 props / slots / events，仅新增 `modelValue` 与 `readonly` 两个扩展键：业务侧用标准 `v-model` 绑定布尔开合（或自定义开合值），同时自动接入 `TmForm` 的 `readonly` / `disabled` 级联。

## 何时使用

- 需要在「开 / 关」两个状态间切换。
- 需要视觉化的布尔字段，或在表格、表单中展示可切换状态。

## 基础用法

标准 `v-model` 受控用法，`checked-children` / `un-checked-children` 显示开合文案。

<script setup>
import SwitchDemo from '../../../packages/ui/src/components/switch/demos/basic.vue'
import SwitchDemoCode from '../../../packages/ui/src/components/switch/demos/basic.vue?raw'

const switchProps = [
  {
    prop: 'modelValue',
    desc: '业务侧 `v-model` 绑定值；内部 computed 桥接到 ant Switch 的 `checked`',
    type: 'boolean | string | number',
    default: '-',
  },
  {
    prop: 'readonly',
    desc: '只读语义（ant Switch 无原生 readonly，为真时映射为禁用态）；未传时级联 TmForm readonly',
    type: 'boolean',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Switch 全部 props / slots / events（如 `checkedValue` / `unCheckedValue` / `checked-children` / `loading` / `disabled`）',
    type: 'SwitchProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="SwitchDemoCode">
  <SwitchDemo />
</DemoBlock>

## API

### TmSwitch Props

<TmPropsTable :data="switchProps" />

### TmSwitch Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件，内部自动桥接自 ant 的 `update:checked` | `(checked: boolean \| string \| number) => void` |
| 其余事件 | 透传 ant Switch 全部 events（如 `@change` / `@click`） | `-` |

### TmSwitch Methods

业务侧通过 `ref` 可调用内部 ant Switch 实例方法（经 `useForwardRef` 透传），如 `focus()` / `blur()`。

### TmSwitch Types

- `TmSwitchProps = SwitchProps & { modelValue?: SwitchProps['checked']; readonly?: boolean }`
- `SwitchProps`（ant 原生）可直接从 `@tm/ui` 导入。
