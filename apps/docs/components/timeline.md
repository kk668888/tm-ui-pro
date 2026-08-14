# Timeline 时间轴

基于 [ant-design-vue](https://www.antdv.com/components/timeline-cn) Timeline 的薄封装。保留 ant 全部能力，无公司默认。

## 何时使用

- 垂直展示时间流事件、流程步骤。
- 需要 pending（待处理）、reverse（倒序）、alternate（交替）布局。

## 基础用法

<script setup>
import TimelineDemo from '../../../packages/ui/src/components/timeline/demos/basic.vue'
import TimelineDemoCode from '../../../packages/ui/src/components/timeline/demos/basic.vue?raw'

const props = [
  { prop: 'mode', desc: '布局：left / alternate / right', type: "'left' | 'alternate' | 'right' | ''", default: "''" },
  { prop: 'reverse', desc: '倒序排列', type: 'boolean', default: 'false' },
  { prop: 'pending / pendingDot', desc: '待处理内容 / 待处理圆点', type: 'VueNode', default: '-' },
  { prop: '其余属性', desc: '透传 ant Timeline 全部 props / events', type: 'TimelineProps', default: '-' },
]
</script>

<DemoBlock :code="TimelineDemoCode">
  <TimelineDemo />
</DemoBlock>

> 注：TmTimeline 使用 render function 转发 default slot。子项未在 @kibus/tm-ui-plus 注册（设计 Non-Goals），children 使用 ant 原生 `TimelineItem` 组件。

## API

### TmTimeline Props

<TmPropsTable :data="props" />

### Methods

业务侧通过 `ref` 可访问内部 ant Timeline 实例（经 `useForwardRef` 透传）。
