# Menu 导航菜单

基于 [ant-design-vue](https://www.antdv.com/components/menu-cn) Menu 的薄封装。导出 `TmMenu` / `TmMenuItem` / `TmSubMenu` / `TmMenuItemGroup` / `TmMenuDivider`，保留 ant 全部能力，无公司扩展键。

## 何时使用

- 页面横向 / 纵向导航菜单。
- 需要选中态、暗色主题、内联折叠等能力。
- 需要多级子菜单、分组标题或分割线（模板子组件写法）。

## 基础用法

横向菜单（items 配置）+ 纵向子组件形式。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import MenuDemo from '../../../packages/ui/src/components/menu/demos/basic.vue'
import MenuDemoCode from '../../../packages/ui/src/components/menu/demos/basic.vue?raw'
import MenuChildrenDemo from '../../../packages/ui/src/components/menu/demos/children-mode.vue'
import MenuChildrenDemoCode from '../../../packages/ui/src/components/menu/demos/children-mode.vue?raw'

// TmPropsTable 数据：TmMenu Props 表格（数据驱动渲染）
const props = [
  {
    prop: 'items',
    desc: '菜单项配置（ant 原生，含 label / key / children / type）；**与模板子组件二选一**——传了 items 后子组件会被整体忽略',
    type: 'MenuItemType[]',
    default: '-',
  },
  {
    prop: 'mode',
    desc: '菜单模式：horizontal / vertical / inline',
    type: 'string',
    default: 'vertical',
  },
  {
    prop: 'theme / selectable / selectedKeys / openKeys',
    desc: '主题 / 可选 / 受控选中 / 展开（ant 原生）',
    type: 'MenuProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="MenuDemoCode">
  <MenuDemo />
</DemoBlock>

## 子组件写法（SubMenu / ItemGroup / Divider）

配置驱动（`items` 的 `children`）能表达多级菜单，但当需要分组标题、分割线或逐项定制内容时，模板子组件写法更直观：

- `TmSubMenu`：可展开的子菜单，可继续嵌套。
- `TmMenuItemGroup`：带标题的分组（`title` 为组标题）。
- `TmMenuDivider`：分组之间的分割线。

> **两个必须注意的点**
>
> - **`items` 与子组件二选一**：ant Menu 内部是 `itemsNodes || flattenChildren(slots.default)`——传了 `items` 后子组件不会报错、但完全不渲染。
> - **每个子项必须给唯一 `key`**：选中态与展开态都按 `key` 匹配；`TmMenu` 已在封装层用 render 函数直接转发 default 插槽，子项 key 的关联不会被 `<slot>` 虚拟节点打断（这是 Tree / Menu 一类 ant 组件的共性坑）。

<DemoBlock :code="MenuChildrenDemoCode">
  <MenuChildrenDemo />
</DemoBlock>

## API

### 子组件映射

| Tm 组件 | 对应 ant | 说明 |
| --- | --- | --- |
| `TmMenu` | Menu | 容器：`items` / `mode` / `theme` / 受控选中 |
| `TmMenuItem` | Menu.Item | 叶子菜单项（`key` 必填） |
| `TmSubMenu` | Menu.SubMenu | 可展开子菜单（`title` 为标题，可嵌套） |
| `TmMenuItemGroup` | Menu.ItemGroup | 分组容器（`title` 为组标题） |
| `TmMenuDivider` | Menu.Divider | 分组间分割线 |

### TmMenu Props

<TmPropsTable :data="props" />

### Methods

业务侧通过 `ref` 可访问内部 ant Menu 实例（经 `useForwardRef` 透传）。
