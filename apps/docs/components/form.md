# Form 表单

基于 [ant-design-vue](https://www.antdv.com/components/form) Form / FormItem 的薄封装。`TmForm` 与 `TmFormItem` 不引入新 props，目的是：

- 与组件库内 `TmInput` / `TmSelect` 等表单控件配套，命名风格统一（`TmXxx`）。
- 业务侧 `ref` 拿到的就是 ant Form 实例（经 `useForwardRef` 透传），可调用 `validate` / `resetFields` / `scrollToField` 等全部 ant Form 方法。
- 预留联动通道（后续可在 `TmForm` 注入 `provide`，让子组件无需逐层 `inject`）。

## 何时使用

- 需要校验、布局、联动reset 的表单场景。
- 表单字段使用本组件库 `TmInput` / `TmSelect` 等控件，希望视觉与校验链路统一。

## 基础用法

含必填校验的提交 + 重置 demo。点击「提交」触发 `validate`，校验通过弹 JSON；点击「重置」调用 `resetFields`。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import FormDemo from '../../../packages/ui/src/components/form/demos/basic.vue'
</script>

<DemoBlock>
  <FormDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/form/demos/basic.vue

## API

### TmForm Props

`TmForm` 不引入额外 props，全部透传 ant Form：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象（与 ant `FormProps.model` 一致） | `Record<string, any>` | `-` |
| 其余属性 | 透传 ant Form 全部 props / slots / events（如 `rules` / `layout` / `label-col` / `wrapper-col` / `colon` / `disabled`） | `FormProps` | `-` |

### TmForm Methods

业务侧通过 `ref` 可调用以下 ant Form 实例方法（经 `useForwardRef` 透传）：

- `validate(nameList?)` — 触发全表单（或指定字段）校验，返回 Promise
- `validateFields(nameList?)` — 同 `validate` 但不校验未声明 rules 的字段
- `resetFields(nameList?)` — 重置字段值与校验状态
- `clearValidate(nameList?)` — 清空校验状态
- `scrollToField(name)` — 滚动到指定字段

```ts
import type { FormInstance } from '@tm/ui'
const formRef = ref<FormInstance>()
await formRef.value?.validate()
```

### TmFormItem Props

`TmFormItem` 同样不引入额外 props，全部透传 ant FormItem：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 字段名（与父级 `TmForm` 的 `model` 字段对齐，校验时取值路径） | `NamePath` | `-` |
| label | 标签文案 | `string \| VNode` | `-` |
| rules | 字段级校验规则（与父级 `TmForm.rules` 二选一，字段级优先） | `Rule[]` | `-` |
| 其余属性 | 透传 ant FormItem 全部 props / slots（如 `wrapper-col` / `required` / `extra` / `tooltip`） | `FormItemProps` | `-` |

### TmForm / TmFormItem Types

```ts
import type {
  FormProps,
  FormInstance,
  FormItemProps,
  FormItemInstance,
} from '@tm/ui'
```

## 扩展机制

- **方法透传**：`useForwardRef` 把内部 ant Form / FormItem 实例的方法逐个 `defineExpose`，业务侧 `formRef.value?.validate()` 等价 `formRef.value?.validate()` 直接调用 ant 实例。
- **零摩擦透传**：`$attrs` 全量透传，保留 ant Form 全部能力（`rules` / `layout` / 自定义 `validateStatus` 等）。
- **配套性**：与 `TmInput` / `TmSelect` 等组件库表单控件配套使用时，字段校验与 ant Form 完全等价（`v-model` 桥接不影响 `name` 路径解析）。
