# InputGroup 输入框组合

Input 输入框的库内别名：把多个输入控件排布为共享边框的紧凑组合。与原生 `<a-input-group>` **完全等价**——`withInstall` 别名复用让两者是同一个组件对象，行为与原生写法一致。

## 何时使用

- 一组语义相关、需要首尾相接的输入控件（起止值、主机/端口/路径三段式）。
- 希望由容器统一接管子控件的圆角与边框（中间控件自动去掉左右圆角）。

## 基础用法

`TmInputGroup` 只负责排布，子控件仍是独立的 `TmInput`（各自 `v-model` 受控）。注意分组容器不合并值，业务侧按子控件分别取值。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import InputGroupDemo from '../../../packages/ui/src/components/input/demos/group.vue'
import InputGroupDemoCode from '../../../packages/ui/src/components/input/demos/group.vue?raw'

// TmPropsTable 数据：TmInputGroup Props 表格（ant 原生 API）
const inputGroupProps = [
  {
    prop: 'compact',
    desc: '紧凑模式：子控件去间隙、圆角相接（未传时不加紧凑类）',
    type: 'boolean',
    default: '-',
  },
  {
    prop: 'size',
    desc: '统一尺寸，作用于组内全部子控件',
    type: "'small' | 'middle' | 'large'",
    default: "'middle'",
  },
  {
    prop: '默认插槽',
    desc: '组内控件（多个 TmInput 或其它表单控件）',
    type: 'slot',
    default: '-',
  },
]
</script>

<DemoBlock :code="InputGroupDemoCode">
  <InputGroupDemo />
</DemoBlock>

## API

### TmInputGroup Props

<TmPropsTable :data="inputGroupProps" />

### TmInputGroup Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 组内控件内容 |

### 与 TmCompact 的分工

| 组件 | 定位 |
| --- | --- |
| `TmInputGroup` | **输入控件**之间共享边框（同属输入语义，如起止值） |
| `TmCompact`（Space.Compact） | **任意控件**之间的紧凑排布（输入框 + 选择器 + 按钮混合） |

### 其余能力

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值；完整清单见 [ant-design-vue Input.Group 文档](https://www.antdv.com/components/input-cn)。
