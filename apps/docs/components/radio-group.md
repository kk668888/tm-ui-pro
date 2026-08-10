# RadioGroup 单选组

基于 [ant-design-vue](https://www.antdv.com/components/radio-cn) Radio.Group 的薄封装。保留全部 ant 原生 props / slots / events，仅新增 `modelValue` 与 `readonly` 两个扩展键：业务侧用标准 `v-model` 即可，无需手动绑定 `v-model:value`；同时自动接入 `TmForm` 的 `readonly` / `disabled` 级联。

## 何时使用

- 在多个互斥选项中选择其一。
- 希望选项由 `options` 数组驱动（无需手写 Radio 插槽），且表单统一使用标准 `v-model`。

## 基础用法

`options` 数组驱动，业务只需绑一个 `v-model`。

<script setup>
import RadioDemo from '../../../packages/ui/src/components/radio-group/demos/basic.vue'
import RadioDemoCode from '../../../packages/ui/src/components/radio-group/demos/basic.vue?raw'

const radioProps = [
  {
    prop: 'modelValue',
    desc: '业务侧 `v-model` 绑定值；内部 computed 桥接到 ant Radio.Group 的 `value`',
    type: 'string | number | boolean',
    default: '-',
  },
  {
    prop: 'readonly',
    desc: '只读语义（ant Radio.Group 无原生 readonly，为真时映射为禁用态）；未传时级联 TmForm readonly',
    type: 'boolean',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Radio.Group 全部 props / slots / events（如 `options` / `size` / `buttonStyle` / `optionType` / `disabled`）',
    type: 'RadioGroupProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="RadioDemoCode">
  <RadioDemo />
</DemoBlock>

## API

### TmRadioGroup Props

<TmPropsTable :data="radioProps" />

### TmRadioGroup Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件，内部自动桥接自 ant 的 `update:value` | `(value: string \| number \| boolean) => void` |
| 其余事件 | 透传 ant Radio.Group 全部 events（如 `@change` / `@focus` / `@blur`） | `-` |

### TmRadioGroup Methods

业务侧通过 `ref` 可访问内部 ant Radio.Group 实例（经 `useForwardRef` 透传）。ant Radio.Group 未暴露 focus/blur 等公共方法时，访问安全返回 `undefined` 不抛错。

### TmRadioGroup Types

- `TmRadioGroupProps = RadioGroupProps & { modelValue?: RadioGroupProps['value']; readonly?: boolean }`
- `RadioGroupProps`（ant 原生）可直接从 `@tm/ui` 导入。
