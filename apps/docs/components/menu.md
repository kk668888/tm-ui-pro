# Menu 导航菜单

基于 [ant-design-vue](https://www.antdv.com/components/menu-cn) Menu 的薄封装。导出 `TmMenu` / `TmMenuItem` / `TmSubMenu` / `TmMenuItemGroup` / `TmMenuDivider`，保留 ant 全部能力，无公司扩展键。

## 何时使用

- 页面横向 / 纵向导航菜单。
- 需要选中态、暗色主题、内联折叠等能力。

## 基础用法

横向菜单（items 配置）+ 纵向子组件形式。

<script setup>
import MenuDemo from '../../../packages/ui/src/components/menu/demos/basic.vue'
import MenuDemoCode from '../../../packages/ui/src/components/menu/demos/basic.vue?raw'

const props = [
  {
    prop: 'items',
    desc: '菜单项配置（ant 原生，含 label / key / children / type）',
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

## API

### 子组件映射

| Tm 组件 | 对应 ant |
| --- | --- |
| `TmMenu` | Menu |
| `TmMenuItem` | Menu.Item |
| `TmSubMenu` | Menu.SubMenu |
| `TmMenuItemGroup` | Menu.ItemGroup |
| `TmMenuDivider` | Menu.Divider |

### TmMenu Props

<TmPropsTable :data="props" />

### Methods

业务侧通过 `ref` 可访问内部 ant Menu 实例（经 `useForwardRef` 透传）。
