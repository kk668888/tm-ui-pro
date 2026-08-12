# Dropdown 下拉菜单

基于 [ant-design-vue](https://www.antdv.com/components/dropdown-cn) Dropdown 的薄封装。导出 `TmDropdown` / `TmDropdownButton`，保留 ant 全部能力，**触发保持非受控**（缺省 `open` 不覆盖 ant 内部默认，hover 即弹出）。

> ⚠️ **菜单内容须用 `#overlay` 插槽**：ant-design-vue 4.2.6 的 Dropdown `menu` prop 是 **no-op**（声明了但未接线到 overlay，实测点击/悬停菜单不渲染）。业务须提供 `#overlay` 插槽，与 DropdownButton 一致。

## 何时使用

- 表格"操作列"等高频菜单场景。
- 按钮组 + 下拉组合操作。

## 基础用法

`#overlay` 插槽（嵌套 `TmMenu`）+ hover 触发 + 按钮组。

<script setup>
import DropdownDemo from '../../../packages/ui/src/components/dropdown/demos/basic.vue'
import DropdownDemoCode from '../../../packages/ui/src/components/dropdown/demos/basic.vue?raw'

const props = [
  {
    prop: 'trigger',
    desc: '触发方式：hover / click / contextmenu（默认 hover）',
    type: 'string | array',
    default: 'hover',
  },
  {
    prop: 'placement / arrow / open',
    desc: '弹层位置 / 箭头 / 受控展开（ant 原生）',
    type: 'DropdownProps',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Dropdown 其余 props / events（`overlayClassName` / `overlayStyle` / `disabled` 等）',
    type: 'DropdownProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="DropdownDemoCode">
  <DropdownDemo />
</DemoBlock>

## API

### 子组件映射

| Tm 组件 | 对应 ant |
| --- | --- |
| `TmDropdown` | Dropdown |
| `TmDropdownButton` | Dropdown.Button |

### TmDropdown Props

<TmPropsTable :data="props" />

### TmDropdown Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 触发元素（直接透传，ant 会克隆并挂触发监听） |
| `overlay` | **菜单内容**（ant 4.2.6 必须用此插槽，`menu` prop 无效） |

> 注：`open` 是受控 prop，业务未显式传时保持 ant 非受控（幻影 false 不覆盖）。

### TmDropdownButton Props

与 TmDropdown 一致，另含按钮形态 props：`size` / `type` / `loading` / `danger`。
> 注：DropdownButton 的 `menu` prop 同样无效（ant 会泄漏为属性），菜单内容一律用 `#overlay` 插槽。

### Methods

业务侧通过 `ref` 可访问内部 ant Dropdown 实例（经 `useForwardRef` 透传）。
