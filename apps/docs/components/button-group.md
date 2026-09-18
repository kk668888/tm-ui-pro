# ButtonGroup 按钮组

Button 按钮的库内别名：把多个按钮渲染为相邻边框合并的按钮组。与原生 `<a-button-group>` **完全等价**——`withInstall` 别名复用让两者是同一个组件对象，行为与原生写法一致。

## 何时使用

- 一组语义并列的操作按钮（左/中/右、按日/按周/按月）。
- 希望相邻按钮边框合并、由容器统一 `size`。

## 基础用法

容器只管排布与尺寸；组内按钮仍是独立的 `TmButton`（各自 `type` / `danger` / `@click`）。组内按钮的圆角由容器按位置自动处理：首尾保留外侧圆角，中间按钮左右皆平。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import ButtonGroupDemo from '../../../packages/ui/src/components/button/demos/group.vue'
import ButtonGroupDemoCode from '../../../packages/ui/src/components/button/demos/group.vue?raw'

// TmPropsTable 数据：TmButtonGroup Props 表格（ant 原生 API）
const buttonGroupProps = [
  {
    prop: 'size',
    desc: '统一尺寸，作用于组内全部子按钮',
    type: "'small' | 'middle' | 'large'",
    default: '-',
  },
  {
    prop: '默认插槽',
    desc: '组内按钮（多个 TmButton）',
    type: 'slot',
    default: '-',
  },
]
</script>

<DemoBlock :code="ButtonGroupDemoCode">
  <ButtonGroupDemo />
</DemoBlock>

## API

### TmButtonGroup Props

<TmPropsTable :data="buttonGroupProps" />

### TmButtonGroup Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 组内按钮内容 |

### 其余能力

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值；完整清单见 [ant-design-vue Button 文档](https://www.antdv.com/components/button-cn)。
