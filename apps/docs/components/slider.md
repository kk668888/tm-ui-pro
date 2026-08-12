# Slider 滑块

基于 [ant-design-vue](https://www.antdv.com/components/slider-cn) Slider 的薄封装。保留 ant 全部能力，无公司扩展键。

## 何时使用

- 数值范围 / 步长输入，拖动选择。
- 需要范围（range）、刻度（marks）、tooltip 值提示。

## 基础用法

单滑块 + 范围滑块 + 步长标记。

<script setup>
import SliderDemo from '../../../packages/ui/src/components/slider/demos/basic.vue'
import SliderDemoCode from '../../../packages/ui/src/components/slider/demos/basic.vue?raw'

const props = [
  { prop: 'value', desc: '当前值（v-model:value）', type: 'number | [number, number]', default: '-' },
  { prop: 'min / max / step', desc: '范围与步长（ant 原生）', type: 'number', default: '0 / 100 / 1' },
  { prop: 'range / marks / tipFormatter', desc: '范围模式 / 刻度 / tooltip 格式化（ant 原生）', type: 'SliderProps', default: '-' },
]
</script>

<DemoBlock :code="SliderDemoCode">
  <SliderDemo />
</DemoBlock>

## API

### TmSlider Props

<TmPropsTable :data="props" />

### TmSlider Events

| 事件 | 说明 |
| --- | --- |
| `change` / `afterChange` | 拖动中 / 拖动结束（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant Slider 实例（经 `useForwardRef` 透传）。
