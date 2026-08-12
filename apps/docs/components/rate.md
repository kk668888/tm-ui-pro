# Rate 评分

基于 [ant-design-vue](https://www.antdv.com/components/rate-cn) Rate 的薄封装。保留 ant 全部能力，无公司扩展键。

## 何时使用

- 星级评分，支持半星、可清除、自定义字符。

## 基础用法

基础评分 + 半星 + 自定义字符。

<script setup>
import RateDemo from '../../../packages/ui/src/components/rate/demos/basic.vue'
import RateDemoCode from '../../../packages/ui/src/components/rate/demos/basic.vue?raw'

const props = [
  { prop: 'value', desc: '当前评分（v-model:value）', type: 'number', default: '0' },
  { prop: 'count / allowHalf / allowClear', desc: '星数 / 半星 / 可清除（ant 原生）', type: 'RateProps', default: '5 / false / true' },
  { prop: 'character / tooltips', desc: '自定义字符 / 提示文案（ant 原生）', type: 'RateProps', default: '-' },
]
</script>

<DemoBlock :code="RateDemoCode">
  <RateDemo />
</DemoBlock>

## API

### TmRate Props

<TmPropsTable :data="props" />

### TmRate Events

| 事件 | 说明 |
| --- | --- |
| `change` | 评分变化时触发（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant Rate 实例（经 `useForwardRef` 透传）。
