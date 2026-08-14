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
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import FormDemo from '../../../packages/ui/src/components/form/demos/basic.vue'
import FormDemoCode from '../../../packages/ui/src/components/form/demos/basic.vue?raw'
import FormReadonlyDemo from '../../../packages/ui/src/components/form/demos/readonly.vue'
import FormReadonlyDemoCode from '../../../packages/ui/src/components/form/demos/readonly.vue?raw'
import FormSubmittingDemo from '../../../packages/ui/src/components/form/demos/submitting.vue'
import FormSubmittingDemoCode from '../../../packages/ui/src/components/form/demos/submitting.vue?raw'
import FormDirtyDemo from '../../../packages/ui/src/components/form/demos/dirty.vue'
import FormDirtyDemoCode from '../../../packages/ui/src/components/form/demos/dirty.vue?raw'

// TmPropsTable 数据：TmForm / TmFormItem Props 表格（数据驱动渲染）
const formProps = [
  {
    prop: 'model',
    desc: '表单数据对象（与 ant `FormProps.model` 一致）',
    type: 'Record<string, any>',
    default: '-',
  },
  {
    prop: 'submitting',
    desc: '提交 loading 态。经 FormContext 下发，`TmFormItem` 的 slot props 可拿到（业务按钮区可据此禁用/loading）',
    type: 'boolean',
    default: 'false',
  },
  {
    prop: 'readonly',
    desc: '全局只读模式。经 FormContext 级联：`TmInput` 只读不可编辑（业务显式传同名 prop 优先）；`TmSelect` 因 ant 原生无 readonly prop，改为受控 `open:false` 锁死下拉 + 关闭清除按钮实现只读',
    type: 'boolean',
    default: 'false',
  },
  {
    prop: 'disabled',
    desc: '全局禁用模式。透传 ant Form 原生 `disabled`（整表禁用）+ 级联到 `TmInput`/`TmSelect`',
    type: 'boolean',
    default: 'false',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Form 全部 props / slots / events（如 `rules` / `layout` / `label-col` / `wrapper-col` / `colon`）',
    type: 'FormProps',
    default: '-',
  },
]

const formItemProps = [
  {
    prop: 'name',
    desc: '字段名（与父级 `TmForm` 的 `model` 字段对齐，校验时取值路径）',
    type: 'NamePath',
    default: '-',
  },
  {
    prop: 'label',
    desc: '标签文案',
    type: 'string | VNode',
    default: '-',
  },
  {
    prop: 'rules',
    desc: '字段级校验规则（与父级 `TmForm.rules` 二选一，字段级优先）',
    type: 'Rule[]',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant FormItem 全部 props / slots（如 `wrapper-col` / `required` / `extra` / `tooltip`）',
    type: 'FormItemProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="FormDemoCode">
  <FormDemo />
</DemoBlock>

## 只读 / 禁用

`readonly` 与 `disabled` 两种全局级联模式：点击按钮在「编辑 / 只读 / 禁用」间切换。`readonly` 级联到 `TmInput`（可选中但不可编辑，保留文字与底色），`TmSelect` 锁死下拉不可选择；`disabled` 透传 ant Form 原生整表禁用 + 级联到 `TmInput`/`TmSelect`（灰底不可操作）。

<DemoBlock :code="FormReadonlyDemoCode">
  <FormReadonlyDemo />
</DemoBlock>

## 提交 loading

`submitting` 经 FormContext 下发到 `TmFormItem` 的 slot props。表单触发点不在表单内时（弹窗 / 抽屉 footer 按钮），业务在调用处自行控制 `submitting`；本 demo 用表单内按钮演示：提交期间按钮自动 `loading` + 禁用，防止重复提交。

<DemoBlock :code="FormSubmittingDemoCode">
  <FormSubmittingDemo />
</DemoBlock>

## 变更追踪

`isDirty` / `getDirtyFields` / `resetToInitial` / `markInitial` 四个方法基于 `onMounted` 的 model 快照。典型场景：离开页面前确认未保存修改、「模拟保存」后调用 `markInitial` 复位脏标记、一键恢复初始值。

<DemoBlock :code="FormDirtyDemoCode">
  <FormDirtyDemo />
</DemoBlock>

## API

### TmForm Props

`TmForm` 透传 ant Form 全部 props，另增三个公司扩展键：

<TmPropsTable :data="formProps" />

### TmForm Methods

业务侧通过 `ref` 可调用以下方法（ant Form 实例方法经 `useForwardRef` 透传 + 公司级变更追踪方法）：

**ant Form 方法透传：**

- `validate(nameList?)` — 触发全表单（或指定字段）校验，返回 Promise
- `validateFields(nameList?)` — 同 `validate` 但不校验未声明 rules 的字段
- `resetFields(nameList?)` — 重置字段值与校验状态
- `clearValidate(nameList?)` — 清空校验状态
- `scrollToField(name)` — 滚动到指定字段

**变更追踪（v2 新增）：**

- `isDirty()` — 当前 model 是否有字段值与 `onMounted` 快照不同（浅比较），返回 `boolean`
- `getDirtyFields()` — 返回所有已变更字段名数组
- `resetToInitial()` — 重置 model 全部字段到初始快照 + 清除校验状态（等价「恢复到刚挂载时」）
- `markInitial()` — 手动把当前 model 标记为新的初始快照（编辑场景异步加载完数据后调用，使 `isDirty()` 复位）

```ts
import type { FormInstance } from '@kibus/tm-ui-plus'
const formRef = ref<FormInstance>()
await formRef.value?.validate()
const dirty = formRef.value?.isDirty()         // 离开页面前确认
const fields = formRef.value?.getDirtyFields() // 需要展示哪些字段变了
formRef.value?.markInitial()                   // 提交成功后复位脏标记
```

### TmFormItem Props

`TmFormItem` 同样不引入额外 props，全部透传 ant FormItem：

<TmPropsTable :data="formItemProps" />

**Default slot props（v2 新增）**：`TmFormItem` 的默认插槽会把 FormContext 的 `submitting` / `readonly` / `disabled` 透传给子控件，便于第三方控件（非 `@kibus/tm-ui-plus`）消费级联状态：

```vue
<TmFormItem label="名称" name="name" v-slot="{ readonly, disabled, submitting }">
  <input :readonly="readonly" :disabled="disabled" />
</TmFormItem>
```

### TmForm / TmFormItem Types

```ts
import type {
  FormProps,
  FormInstance,
  FormItemProps,
  FormItemInstance,
} from '@kibus/tm-ui-plus'
```

## 扩展机制

- **方法透传**：`useForwardRef` 把内部 ant Form / FormItem 实例的方法逐个 `defineExpose`，业务侧 `formRef.value?.validate()` 等价直接调用 ant 实例。
- **FormContext 级联（v2）**：`TmForm` 经 `provide/inject` 下发 `submitting` / `readonly` / `disabled` 计算属性。`TmFormItem` 通过 slot props 暴露给子控件；`TmInput` / `TmSelect` 直接 inject 自动级联（业务显式传同名 prop 优先于 context）。`disabled` 同时透传 ant Form 原生 prop，保留 ant 整表禁用能力；`readonly` 对 `TmInput` 走原生只读、对 `TmSelect` 用受控 `open:false` 锁死下拉（ant Select 无 readonly prop）。
- **变更追踪（v2）**：`onMounted` 自动快照 `model` 为初始值，暴露 `isDirty()` / `getDirtyFields()` / `resetToInitial()` / `markInitial()`，适用于「离开前确认保存」「提交后复位脏标记」等场景。
- **零摩擦透传**：`$attrs` 全量透传，保留 ant Form 全部能力（`rules` / `layout` / 自定义 `validateStatus` 等）。
- **配套性**：与 `TmInput` / `TmSelect` 等组件库表单控件配套使用时，字段校验与 ant Form 完全等价（`v-model` 桥接不影响 `name` 路径解析）。
