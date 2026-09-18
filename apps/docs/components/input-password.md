# InputPassword 密码输入框

基于 [ant-design-vue](https://www.antdv.com/components/input) Input.Password 的薄封装。与 `TmInput` 同一套 v-model 契约、公司默认值（`allowClear` / `size` / `bordered`）与 TmForm 级联，开箱即得密码可见性切换。

## 何时使用

- 密码类敏感输入的表单字段（登录、改密、令牌确认等）。
- 希望与 `TmInput` 行为完全一致（公司默认值、TmForm 禁用/只读级联），零学习成本替换。
- 需要自定义可见性切换图标（`iconRender` 插槽）。

## 基础用法

标准 `v-model` 受控用法，点击眼睛图标在密文/明文间切换，已输入内容不丢失。第二个示例演示 `iconRender` 自定义切换图标：作用域为 `{ visible }`，点击切换行为由组件注入，业务无需绑定事件。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import InputPasswordDemo from '../../../packages/ui/src/components/input-password/demos/basic.vue'
import InputPasswordDemoCode from '../../../packages/ui/src/components/input-password/demos/basic.vue?raw'

// TmPropsTable 数据：TmInputPassword Props 表格（数据驱动渲染）
const inputPasswordProps = [
  {
    prop: 'modelValue',
    desc: '业务侧 `v-model` 绑定值；内部 computed 桥接到 ant InputPassword 的 `value`；清空时 emit 空字符串（不 emit `undefined`）',
    type: 'string | number',
    default: '-',
  },
  {
    prop: 'visibilityToggle',
    desc: '是否显示可见性切换控件；公司默认 `true` 兜底，显式传 `false` 关闭（恒密文）',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'visible',
    desc: '受控显隐：未传走 ant 内部非受控；传了即受控（配合 `update:visible`）',
    type: 'boolean',
    default: '-',
  },
  {
    prop: 'allowClear',
    desc: '一键清空（公司默认，与 TmInput 同源）',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'size',
    desc: '控件尺寸（公司默认 middle，与 TmInput 同源）',
    type: "'small' | 'middle' | 'large'",
    default: "'middle'",
  },
  {
    prop: 'disabled / readonly',
    desc: '未显式传时级联祖先 `TmForm` 同名状态；级联生效时可见性切换控件同步不可交互',
    type: 'boolean',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Input.Password 全部 props / events（如 `placeholder` / `maxlength` / `status` / `@change`）',
    type: 'InputProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="InputPasswordDemoCode">
  <InputPasswordDemo />
</DemoBlock>

## API

### TmInputPassword Props

<TmPropsTable :data="inputPasswordProps" />

### TmInputPassword Slots

| 插槽 | 说明 | 作用域 |
| --- | --- | --- |
| `iconRender` | 自定义可见性切换图标；点击切换由组件注入，无需绑事件 | `{ visible: boolean }` |
| `prefix` / `addonBefore` / `addonAfter` | 同 ant Input 对应插槽 | `-` |

> **ant 原生限制（如实记录，非库缺陷）**
>
> - `suffix` 插槽不可用：ant Password 内部恒以自身 suffix（眼睛图标或 false）覆盖，任何可见性配置下业务 suffix 插槽都不渲染；需要后缀内容时用 `addonAfter` 替代。
> - ant Password 仅暴露 `focus` / `blur` 两个实例方法，不提供 `select`。

### TmInputPassword Methods

业务侧通过 `ref` 可调用以下 ant Input.Password 实例方法（经 `useForwardRef` 透传）：

- `focus()` / `blur()`

### TmInputPassword Types

```ts
import type { TmInputPasswordProps, TmInputPasswordExtProps, InputProps } from '@trustmo/tm-ui'
```
