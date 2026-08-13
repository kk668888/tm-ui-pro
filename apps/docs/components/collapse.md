# Collapse 折叠面板

基于 [ant-design-vue](https://www.antdv.com/components/collapse-cn) Collapse 的薄封装。保留 ant 全部能力（含 `TmCollapsePanel` 子组件），无公司默认。

## 何时使用

- 对复杂区域进行分组折叠展示，节省垂直空间。
- 手风琴模式单开面板。

## 基础用法

<script setup>
import CollapseDemo from '../../../packages/ui/src/components/collapse/demos/basic.vue'
import CollapseDemoCode from '../../../packages/ui/src/components/collapse/demos/basic.vue?raw'

const props = [
  { prop: 'activeKey / defaultActiveKey', desc: '受控 / 非受控展开面板 keys（v-model:active-key）', type: "string[] | number[] | string | number", default: '-' },
  { prop: 'accordion', desc: '手风琴模式：同时仅展开一个面板', type: 'boolean', default: 'false' },
  { prop: 'bordered / ghost', desc: '边框 / 幽灵模式（ant 原生）', type: 'boolean', default: 'true / false' },
  { prop: 'TmCollapsePanel', desc: '子组件：`header` / `extra` / `disabled` / `collapsible` / `show-arrow`', type: 'CollapsePanelProps', default: '-' },
]
</script>

<DemoBlock :code="CollapseDemoCode">
  <CollapseDemo />
</DemoBlock>

> 注：TmCollapse 使用 render function 转发 default slot，ant 能正确识别 `TmCollapsePanel`（含 vnode key 转发），避免模板 `<slot />` 虚拟节点导致面板丢失。

## API

### TmCollapse Props

<TmPropsTable :data="props" />

### TmCollapsePanel Props

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `header` | 面板标题 | `string \| number \| VNode` |
| `extra` | 面板右上角内容 | `string \| number \| VNode` |
| `disabled` | 是否禁用面板 | `boolean` |
| `collapsible` | 折叠行为：header / icon / disabled | `string` |
| `showArrow` | 是否显示箭头 | `boolean` |

### Methods

业务侧通过 `ref` 可访问内部 ant Collapse / CollapsePanel 实例（经 `useForwardRef` 透传）。
