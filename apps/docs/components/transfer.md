# Transfer 穿梭框

基于 [ant-design-vue](https://www.antdv.com/components/transfer-cn) Transfer 的薄封装。保留 ant 全部能力，公司默认标题 `源列表 / 目标列表`。

## 何时使用

- 数据在两个列表间穿梭移动。
- 需要搜索、受控 targetKeys、自定义渲染。

## 基础用法

公司默认标题 + 搜索 + 受控穿梭。

<script setup>
import TransferDemo from '../../../packages/ui/src/components/transfer/demos/basic.vue'
import TransferDemoCode from '../../../packages/ui/src/components/transfer/demos/basic.vue?raw'

const props = [
  { prop: 'titles', desc: '两侧标题：公司默认 `源列表 / 目标列表`，业务可覆盖', type: 'string[]', default: "[源列表, 目标列表]" },
  { prop: 'render', desc: '列表项渲染：公司默认显示 `item.title`；业务传函数覆盖', type: '(item) => VNode | string', default: '显示 item.title' },
  { prop: 'dataSource / targetKeys', desc: '数据源 / 目标 keys（v-model:targetKeys，ant 原生）', type: 'TransferProps', default: '-' },
  { prop: '其余属性', desc: '透传 ant Transfer 全部 props / events（如 `showSearch` / `disabled` / `@change` / `listStyle`）', type: 'TransferProps', default: '-' },
]
</script>

<DemoBlock :code="TransferDemoCode">
  <TransferDemo />
</DemoBlock>

> 注：ant Transfer 的 `render` 默认 `null`（列表项不渲染文字）。TmTransfer 提供公司默认 `render` 显示 `item.title`，业务可覆盖。

## API

### TmTransfer Props

<TmPropsTable :data="props" />

### TmTransfer Events

| 事件 | 说明 |
| --- | --- |
| `change` | 穿梭移动时触发（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant Transfer 实例（经 `useForwardRef` 透传）。
