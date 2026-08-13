# Carousel 轮播

基于 [ant-design-vue](https://www.antdv.com/components/carousel-cn) Carousel 的薄封装。保留 ant 全部能力，无公司默认。

## 何时使用

- 一组内容循环展示（Banner、产品图集）。
- 需要自动播放、切换控制（next / prev / goTo）。

## 基础用法

<script setup>
import CarouselDemo from '../../../packages/ui/src/components/carousel/demos/basic.vue'
import CarouselDemoCode from '../../../packages/ui/src/components/carousel/demos/basic.vue?raw'

const props = [
  { prop: 'autoplay', desc: '自动播放（缺省不覆盖 ant 默认）', type: 'boolean', default: 'false' },
  { prop: 'dots', desc: '是否显示指示点', type: 'boolean', default: 'true' },
  { prop: 'effect', desc: '切换效果：scrollx / fade', type: "'scrollx' | 'fade'", default: "'scrollx'" },
  { prop: 'dotPosition', desc: '指示点位置：top / bottom / left / right', type: 'string', default: "'bottom'" },
  { prop: 'arrows / prevArrow / nextArrow', desc: '箭头切换 / 自定义箭头插槽（ant 原生）', type: 'CarouselProps', default: '-' },
]
</script>

<DemoBlock :code="CarouselDemoCode">
  <CarouselDemo />
</DemoBlock>

## API

### TmCarousel Props

<TmPropsTable :data="props" />

### Methods（CarouselRef）

业务侧通过 `ref` 访问 `CarouselRef` 实例，可调用：

| 方法 | 说明 |
| --- | --- |
| `next()` | 下一张 |
| `prev()` | 上一张 |
| `goTo(slideNumber, dontAnimate)` | 跳转到指定页 |

> 注：方法经 `useForwardRef<CarouselRef>()` 透传 ant 官方公开接口。
