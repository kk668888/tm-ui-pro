# Statistic 统计数值

基于 [ant-design-vue](https://www.antdv.com/components/statistic-cn) Statistic 的薄封装。保留 ant 全部能力（含 `TmCountdown` 子组件），无公司默认。

## 何时使用

- 展示关键指标数值（销售额、用户数等），支持千分位、前后缀、自定义格式化。
- 倒计时（Countdown）用于活动 / 抢购剩余时间。

## 基础用法

<script setup>
import StatisticDemo from '../../../packages/ui/src/components/statistic/demos/basic.vue'
import StatisticDemoCode from '../../../packages/ui/src/components/statistic/demos/basic.vue?raw'

const props = [
  { prop: 'title', desc: '数值标题', type: 'VueNode', default: '-' },
  { prop: 'value', desc: '数值', type: 'number | string', default: '0' },
  { prop: 'precision', desc: '小数精度', type: 'number', default: '-' },
  { prop: 'formatter', desc: '自定义格式化函数', type: '(value) => string | VNode', default: '-' },
  { prop: 'prefix / suffix', desc: '数值前后缀（prop 或插槽）', type: 'VueNode', default: '-' },
  { prop: 'TmCountdown', desc: '子组件：`value`（时间戳）/ `format` / `onFinish` / `onChange`', type: 'CountdownProps', default: '-' },
]
</script>

<DemoBlock :code="StatisticDemoCode">
  <StatisticDemo />
</DemoBlock>

## API

### TmStatistic Props

<TmPropsTable :data="props" />

### TmCountdown Props

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `value` | 目标时间戳 | `number \| string` |
| `format` | 倒计时格式（默认 HH:mm:ss） | `string` |
| `onFinish` | 倒计时结束回调 | `() => void` |
| `onChange` | 倒计时变化回调 | `(value) => void` |

> 注：ant 顶层将 Countdown 导出为 `StatisticCountdown`，TmCountdown 内部引用该导出。

### Methods

业务侧通过 `ref` 可访问内部 ant Statistic / Countdown 实例（经 `useForwardRef` 透传）。
