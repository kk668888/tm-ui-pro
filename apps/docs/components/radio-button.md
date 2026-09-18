# RadioButton 按钮态单选

基于 [ant-design-vue](https://www.antdv.com/components/radio-cn) Radio.Button 的薄封装，语义是**值单元**：自身没有 `v-model`，单选值由承载它的单选组统一管理。相比 `TmRadio` 多了一层 `TmForm` 的 `disabled` 级联（`TmForm` 置禁用时，组内按钮同步不可选）。

## 何时使用

- 按钮态单选组：视图切换（列表 / 卡片）、周期切换（年 / 季 / 月）等分段控件式交互。
- 希望整组单选在表单级别的禁用状态下自动失效，而不必逐个传 `disabled`。

## ⚠️ 组合限制（Vue slot 语义固有限制，非库缺陷）

`TmRadioButton` 必须放在**原生 `RadioGroup`** 里使用：

```vue
<!-- ✅ 正确：原生 RadioGroup 承载 -->
<a-radio-group v-model:value="v">
  <TmRadioButton value="a">按年</TmRadioButton>
</a-radio-group>

<!-- ❌ 错误：经 TmRadioGroup 的子节点写法，按钮会失去单选组联动 -->
<t-m-radio-group v-model="v">
  <TmRadioButton value="a">按年</TmRadioButton>
</t-m-radio-group>
```

原因：ant 的 RadioGroup 通过 **provide/inject** 识别子按钮（注入 Symbol 上下文，子组件沿 `parent` 链查找）。而 Vue 中**插槽内容的 `parent` 指向转发组件（`withCtx` 绑定），不是它最终挂载的位置**——经 `TmRadioGroup` 这一层转发，`parent` 链断在转发组件上，子按钮拿不到 Group 的上下文，于是退化成「各自独立的假按钮」。任何一层 wrapper 都会断链（已用极简纯转发组件复现验证）。

**替代写法**：需要 `TmRadioGroup` 时，用它的 `options` prop 表达选项（配置驱动，不依赖插槽）：

```vue
<TmRadioGroup v-model="v" :options="[{ label: '按年', value: 'a' }, { label: '按季', value: 'b' }]" />
```

## 基础用法

原生 `RadioGroup` 负责选值（`v-model:value`），`TmRadioButton` 负责呈现与 `disabled` 级联；`buttonStyle="solid"`、`size` 等样式属性由 Group 统一下发。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import RadioButtonDemo from '../../../packages/ui/src/components/radio-button/demos/basic.vue'
import RadioButtonDemoCode from '../../../packages/ui/src/components/radio-button/demos/basic.vue?raw'

// TmPropsTable 数据：TmRadioButton Props 表格（数据驱动渲染）
const radioButtonProps = [
  {
    prop: 'value',
    desc: '该按钮的取值；由外层 RadioGroup 的 `v-model:value` 比对决定选中态',
    type: 'string | number | boolean',
    default: '-',
  },
  {
    prop: 'disabled',
    desc: '自身禁用；**未显式传时级联祖先 `TmForm` 的 `disabled`**（显式传值优先级更高）',
    type: 'boolean',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Radio.Button 全部 props（如 `class` / `style`）；按钮形态相关属性（`buttonStyle` / `size`）由外层 RadioGroup 统一下发',
    type: 'RadioProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="RadioButtonDemoCode">
  <RadioButtonDemo />
</DemoBlock>

## API

### TmRadioButton Props

<TmPropsTable :data="radioButtonProps" />

### TmRadioButton Events

| 事件 | 说明 |
| --- | --- |
| 原生事件 | 透传 ant Radio.Button 事件；选中态变更的 `change` 由外层 RadioGroup 统一抛出，通常只需处理 Group 的事件 |

### TmRadioButton Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 按钮文案 |

### TmRadioButton Methods

业务侧通过 `ref` 可访问内部 ant Radio.Button 实例（经 `useForwardRef` 透传）。

### TmRadioButton Types

```ts
import type { TmRadioButtonProps, RadioProps } from '@trustmo/tm-ui'
```

## 与相关组件的分工

| 组件 | 角色 | 值通道 |
| --- | --- | --- |
| `TmRadio` | 圆形单选值单元 | 无（由组管理） |
| `TmRadioButton` | 按钮态单选值单元 | 无（由组管理） |
| `TmRadioGroup` | 单选组（容器） | `v-model`，选项走 `options` prop |
