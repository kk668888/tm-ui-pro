# Compact 紧凑排布容器

Space 间距的库内别名：把子控件排布为无间隙、圆角相接的紧凑块。与原生 `<a-space-compact>`（即 ant `Space.Compact`）**完全等价**——`withInstall` 别名复用让两者是同一个组件对象，行为与原生写法一致。

## 何时使用

- 多个**异构**控件需要视觉上「长在一起」（下拉 + 输入框 + 按钮的查询条）。
- 需要 `block` 占满整行，或 `direction="vertical"` 纵向紧凑堆叠。

## 基础用法

容器只负责排布与圆角衔接，不合并子控件的值：每个子控件各自 `v-model`。跨组件组合（`TmSelect` / `TmInput` / `TmButton`）与单一组件组合用法完全一致。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import CompactDemo from '../../../packages/ui/src/components/space/demos/compact.vue'
import CompactDemoCode from '../../../packages/ui/src/components/space/demos/compact.vue?raw'

// TmPropsTable 数据：TmCompact Props 表格（ant 原生 API）
const compactProps = [
  {
    prop: 'direction',
    desc: '排布方向：默认横向（左到右），`vertical` 为纵向紧凑堆叠',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
  },
  {
    prop: 'block',
    desc: '是否占满整行宽度（子控件按比例拉伸）',
    type: 'boolean',
    default: 'false',
  },
  {
    prop: 'size',
    desc: '统一尺寸，作用于块内子控件（ant 未设默认值，未传时各子控件用自己的默认尺寸）',
    type: "'small' | 'middle' | 'large'",
    default: '-',
  },
  {
    prop: 'align',
    desc: '交叉轴对齐方式（`direction="horizontal"` 时生效）',
    type: "'start' | 'end' | 'center' | 'baseline'",
    default: '-',
  },
  {
    prop: '默认插槽',
    desc: '紧凑块内的控件（可混合多种组件）',
    type: 'slot',
    default: '-',
  },
]
</script>

<DemoBlock :code="CompactDemoCode">
  <CompactDemo />
</DemoBlock>

## API

### TmCompact Props

<TmPropsTable :data="compactProps" />

### TmCompact Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 紧凑块内的控件内容 |

### 与 TmSpace / TmInputGroup 的分工

| 组件 | 定位 | 间隙 |
| --- | --- | --- |
| `TmSpace` | 通用间距排布（任意元素，含间距调节） | 有（`size` 控制） |
| `TmCompact` | 紧凑排布（异构控件圆角相接） | 无 |
| `TmInputGroup` | 仅限输入控件之间共享边框 | 无 |

### 其余能力

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值；完整清单见 [ant-design-vue Space.Compact 文档](https://www.antdv.com/components/space-cn)。
