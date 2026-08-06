# Select 选择器

基于 [ant-design-vue](https://www.antdv.com/components/select) Select 的薄封装。保留全部 ant 原生 props / slots / events，新增几个公司级扩展：

- `modelValue`：让业务侧用标准 `v-model`（同 TmInput 思路，桥接 ant 的 `value`）。
- `remote`：远程搜索函数。传入后 TmSelect 自动监听用户输入、经防抖 + minLength 门槛后调用 remote、填充 options 并维护 loading。
- `api`：挂载加载函数。传入后挂载时调用一次获取初始列表，响应自动映射为 options（"获取数据"模式，与 remote 的"搜索"语义独立，可共存）。

## 何时使用

- 选项数据来自后端的下拉选择（部门、用户、商品等），需远程搜索。
- 挂载即需加载完整列表（字典、角色、状态枚举），且希望下拉在输入时还能搜索兜底。
- 表单中的枚举选择，需与 ant Form 联动校验。

## 基础用法

三种典型用法：本地 `options` + 标准 `v-model`、`remote` 远程搜索（在输入框中键入关键字查看效果）、`api` 挂载加载。

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
| remote | 远程搜索函数；传入则启用远程模式，输入经 `debounce` / `minLength` 过滤后调用，自动维护 options / loading | `(query: string) => Promise<TmSelectOption[]>` | `-` |
| api | 挂载加载函数；传入则挂载时调用一次 `api({})` 获取初始列表，响应自动映射为 options | `(params: Record<string, unknown>) => Promise<unknown>` | `-` |
| debounce | 远程搜索防抖毫秒（仅 `remote` 生效） | `number` | `300` |
| minLength | 远程搜索最小输入长度（仅 `remote` 生效，低于则不发起请求） | `number` | `1` |
| fieldNames | 响应数组字段名映射（取 label / value 的字段），透传 ant 原生 fieldNames | `{ label?, value?, options? }` | `{ label: 'label', value: 'value' }` |
| resultMap | 完全自定义响应 → 选项映射，优先级最高；未提供时按常见格式智能识别 | `(res: unknown) => TmSelectOption[]` | `-` |
| 其余属性 | 透传 ant Select 全部 props / slots / events（如 `options` / `placeholder` / `allowClear` / `mode` / `labelInValue`） | `SelectProps` | `-` |

> `api` 与 `remote` 可共存：`api` 提供常驻初始列表，输入搜索时 `remote` 结果临时覆盖，清空输入回退到初始列表。二者写入互不覆盖，loading 合并。

### TmSelectOption / TmSelectApi

```ts
/** 远程选项数据结构（label/value 两字段最小契约，业务可按需扩展） */
export interface TmSelectOption {
  label: string
  value: string | number
}

/** 远程搜索函数签名（search 模式） */
export type TmSelectRemote = (query: string) => Promise<TmSelectOption[]>

/** api 请求函数签名（获取数据模式）：挂载时调用，返回原始响应由组件映射 */
export type TmSelectApi = (params: Record<string, unknown>) => Promise<unknown>
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
  TmSelectApi,
  SelectProps,
} from '@tm/ui'
```

## 扩展机制

- **v-model 桥接**：与 TmInput 同构，`computed` 双向桥接 `modelValue` ↔ ant `value`。
- **api 获取数据**：挂载时调用 `api({})`，响应经 `resultMap` > `fieldNames` > 智能识别（顶层数组 / `data[]` / `data.records[]` / `data.list[]`）映射为选项；固定参数（如租户 ID）由业务在 `api` 闭包中捕获。
- **remote 远程搜索**：`remote` 函数由业务方提供（返回 `Promise<{ label, value }[]>`），TmSelect 内部：
  1. 监听 ant Select 的 `@search` 事件，取用户输入 query
  2. `minLength` 门槛：输入过短不发请求
  3. `debounce` 防抖：静默窗口内连续输入合并，仅最终词发起请求
  4. 调用 `props.remote(query)` 拿到 options 并切 `loading` 状态
  5. race condition 用 token 守卫，快速输入下乱序响应被丢弃
- **共存（api + remote）**：`api` 写入常驻 baseOptions，`remote` 写入搜索临时结果；输入搜索时渲染搜索结果，清空回退 baseOptions。
- **透传**：`modelValue` / `remote` / `api` / `resultMap` / `debounce` / `minLength` 之外的 `$attrs` 全量透传给内部 ant Select。
