# TimelineItem 时间线条目

Timeline 时间轴的库内别名：在 `<TmTimeline>` 中以模板子组件写法声明条目。与原生 `<a-timeline-item>` **完全等价**——`withInstall` 别名复用让两者是同一个组件对象，`vnode.type` 全等，ant 对模板子组件的识别不受包裹影响。

## 何时使用

- 在 `<TmTimeline>` 中用模板子组件写法声明条目（条目内容需要与 `dot` / `label` 插槽自由混排时）。
- 条目内容差异大、用数组配置不顺手时，模板写法可读性更好。
- 数据驱动场景仍推荐 `<TmTimeline>` 的 `items` 配置。

## 基础用法

条目内容写在默认插槽；`color` 控制节点颜色，`label` 显示时间标签（配合 `mode` 生效），`dot` 插槽自定义节点，`pending` 在末尾追加进行中条目。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import TimelineItemDemo from '../../../packages/ui/src/components/timeline/demos/item-children.vue'
import TimelineItemDemoCode from '../../../packages/ui/src/components/timeline/demos/item-children.vue?raw'

// TmPropsTable 数据：TmTimelineItem Props 表格（ant 原生 API）
const timelineItemProps = [
  {
    prop: 'color',
    desc: '节点颜色：预设色名（`blue` / `red` / `green` / `gray`）或自定义色值',
    type: 'string',
    default: "'blue'",
  },
  {
    prop: 'label',
    desc: '时间标签（节点旁的时间/说明文字），也可用 `#label` 插槽；仅在 `<TmTimeline mode="left">` 等带标签模式下显示',
    type: 'string | VNode',
    default: '-',
  },
  {
    prop: 'dot',
    desc: '自定义节点内容（替代默认圆点），也可用 `#dot` 插槽',
    type: 'VNode',
    default: '-',
  },
  {
    prop: 'pending',
    desc: '是否为「进行中」条目（节点显示为加载态）',
    type: 'boolean',
    default: 'false',
  },
  {
    prop: 'position',
    desc: '条目相对中轴的位置（配合 `<TmTimeline mode="alternate">` 交替排布）',
    type: "'left' | 'right' | ''",
    default: "''",
  },
  {
    prop: '默认插槽',
    desc: '条目正文内容',
    type: 'slot',
    default: '-',
  },
]
</script>

<DemoBlock :code="TimelineItemDemoCode">
  <TimelineItemDemo />
</DemoBlock>

## API

### TmTimelineItem Props

<TmPropsTable :data="timelineItemProps" />

### TmTimelineItem Slots

| 插槽 | 说明 | 作用域 |
| --- | --- | --- |
| `default` | 条目正文 | `-` |
| `dot` | 自定义节点图标（替代默认圆点） | `-` |
| `label` | 时间标签节点（与 `label` prop 二选一） | `-` |

### 其余能力

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值；完整清单见 [ant-design-vue Timeline 文档](https://www.antdv.com/components/timeline-cn)。

### TmTimelineItem Types

```ts
import { TmTimelineItem } from '@trustmo/tm-ui'
// 类型与 ant TimelineItem 完全一致（别名复用），可按需从 ant-design-vue 导入对应 Props 类型
```
