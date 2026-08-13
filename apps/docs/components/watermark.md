# Watermark 水印

基于 [ant-design-vue](https://www.antdv.com/components/watermark-cn) Watermark 的薄封装。保留 ant 全部能力，无公司默认。

## 何时使用

- 保护敏感页面 / 图片，防止截图盗用。
- 需要文字 / 图片水印，多行平铺、偏移、旋转。

## 基础用法

<script setup>
import WatermarkDemo from '../../../packages/ui/src/components/watermark/demos/basic.vue'
import WatermarkDemoCode from '../../../packages/ui/src/components/watermark/demos/basic.vue?raw'

const props = [
  { prop: 'content', desc: '水印文字（string | string[]）或 #default 内容为图片水印', type: 'string | string[]', default: '-' },
  { prop: 'image / imageWidth / imageHeight', desc: '图片水印及其尺寸', type: 'string / number', default: '-' },
  { prop: 'font', desc: '文字样式：color / fontSize / fontWeight / fontStyle', type: 'object', default: '-' },
  { prop: 'gap', desc: '水印间距 [x, y]', type: 'number[]', default: '[100, 100]' },
  { prop: 'offset / rotate / zIndex / opacity', desc: '偏移 / 旋转 / 层级 / 透明度（ant 原生）', type: 'WatermarkProps', default: '-' },
]
</script>

<DemoBlock :code="WatermarkDemoCode">
  <WatermarkDemo />
</DemoBlock>

## API

### TmWatermark Props

<TmPropsTable :data="props" />

### Methods

业务侧通过 `ref` 可访问内部 ant Watermark 实例（经 `useForwardRef` 透传）。
