# Select 选择器

基于 [ant-design-vue](https://www.antdv.com/components/select) Select 的薄封装。保留全部 ant 原生 props / slots / events，新增两个公司级扩展：

- `modelValue`：让业务侧用标准 `v-model`（同 TmInput 思路，桥接 ant 的 `value`）。
- `remote`：远程搜索函数。传入该函数后，TmSelect 自动监听用户输入、调用 remote、填充 options 并维护 loading，业务侧无需手写 `@search` + `loading` + `options` 三件套。

## 何时使用

- 选项数据来自后端的下拉选择（部门、用户、商品等），需远程搜索。
- 表单中的枚举选择，需与 ant Form 联动校验。

## 基础用法

两种典型用法：本地 `options` + 标准 `v-model`，以及 `remote` 远程搜索（在输入框中键入关键字查看效果）。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import SelectDemo from '../../../packages/ui/src/components/select/demos/basic.vue'
</script>

<DemoBlock>
  <SelectDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/select/demos/basic.vue

## API

### TmSelect Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 业务侧 `v-model` 绑定值；内部桥接到 ant Select 的 `value`（单选/多选/labelInValue 模式自动跟随 ant `SelectValue` 类型） | `SelectProps['value']` | `-` |
| remote | 远程搜索函数；传入则启用远程模式，由 ant Select 的 `@search` 事件自动驱动取数 + 维护 options / loading | `(query: string) => Promise<TmSelectOption[]>` | `-` |
| 其余属性 | 透传 ant Select 全部 props / slots / events（如 `options` / `placeholder` / `allowClear` / `mode` / `labelInValue` / `fieldNames`） | `SelectProps` | `-` |

### TmSelectOption

```ts
/** 远程选项数据结构（label/value 两字段最小契约，业务可按需扩展） */
export interface TmSelectOption {
  label: string
  value: string | number
}

/** 远程搜索函数签名 */
export type TmSelectRemote = (query: string) => Promise<TmSelectOption[]>
```

### TmSelect Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件，内部自动桥接自 ant 的 `update:value` | `(value: SelectProps['value']) => void` |
| 其余事件 | 透传 ant Select 全部 events（如 `@change` / `@search` / `@deselect`） | `-` |

### TmSelect Methods

业务侧通过 `ref` 可调用以下 ant Select 实例方法（经 `useForwardRef` 透传）：

- `focus()` / `blur()` / `scrollTo()` 等。

### TmSelect Types

```ts
import type {
  TmSelectProps,
  TmSelectExtProps,
  TmSelectOption,
  TmSelectRemote,
  SelectProps,
} from '@tm/ui'
```

## 扩展机制

- **v-model 桥接**：与 TmInput 同构，`computed` 双向桥接 `modelValue` ↔ ant `value`。
- **remote 远程**：`remote` 函数由业务方提供（返回 `Promise<{ label, value }[]>`），TmSelect 内部：
  1. 监听 ant Select 的 `@search` 事件，取用户输入 query
  2. 调用 `props.remote(query)` 拿到 options
  3. 写入内部 `options` ref 并切 `loading` 状态
  4. race condition 用 token 守卫，快速输入下乱序响应被丢弃
- **透传**：`modelValue` / `remote` 之外的 `$attrs` 全量透传给内部 ant Select。
