# CheckboxGroup 复选组

基于 [ant-design-vue](https://www.antdv.com/components/checkbox-cn) Checkbox.Group 的薄封装。保留全部 ant 原生 props / slots / events，仅新增 `modelValue` 与 `readonly` 两个扩展键：业务侧用标准 `v-model` 绑定**数组**，同时自动接入 `TmForm` 的 `readonly` / `disabled` 级联。

## 何时使用

- 从多个选项中选择任意项（结果为一组值）。
- 希望选项由 `options` 数组驱动，且表单统一使用标准 `v-model`。

## 基础用法

`options` 数组驱动，`v-model` 绑定选中值的数组。

<script setup>
import CheckboxDemo from '../../../packages/ui/src/components/checkbox-group/demos/basic.vue'
import CheckboxDemoCode from '../../../packages/ui/src/components/checkbox-group/demos/basic.vue?raw'

const checkboxProps = [
  {
    prop: 'modelValue',
    desc: '业务侧 `v-model` 绑定值（数组）；内部 computed 桥接到 ant Checkbox.Group 的 `value`',
    type: 'Array<string | number | boolean>',
    default: '-',
  },
  {
    prop: 'readonly',
    desc: '只读语义（ant Checkbox.Group 无原生 readonly，为真时映射为禁用态）；未传时级联 TmForm readonly',
    type: 'boolean',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Checkbox.Group 全部 props / slots / events（如 `options` / `name` / `disabled`）',
    type: 'CheckboxGroupProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="CheckboxDemoCode">
  <CheckboxDemo />
</DemoBlock>

## API

### TmCheckboxGroup Props

<TmPropsTable :data="checkboxProps" />

### TmCheckboxGroup Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件，内部自动桥接自 ant 的 `update:value` | `(value: Array<string \| number \| boolean>) => void` |
| 其余事件 | 透传 ant Checkbox.Group 全部 events（如 `@change`） | `-` |

### TmCheckboxGroup Methods

业务侧通过 `ref` 可访问内部 ant Checkbox.Group 实例（经 `useForwardRef` 透传）。ant Checkbox.Group 未暴露公共方法时，访问安全返回 `undefined` 不抛错。

### TmCheckboxGroup Types

- `TmCheckboxGroupProps = CheckboxGroupProps & { modelValue?: CheckboxGroupProps['value']; readonly?: boolean }`
- `CheckboxGroupProps`（ant 原生）可直接从 `@kibus/tm-ui-plus` 导入。
