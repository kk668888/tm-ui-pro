# QRCode 二维码

基于 [ant-design-vue](https://www.antdv.com/components/qrcode-cn) QRCode 的薄封装。保留 ant 全部能力，无公司默认。

## 何时使用

- 展示链接 / 文本的二维码，用于扫码跳转。
- 需要图标、状态（active / expired）、刷新场景。

## 基础用法

<script setup>
import QRCodeDemo from '../../../packages/ui/src/components/qrcode/demos/basic.vue'
import QRCodeDemoCode from '../../../packages/ui/src/components/qrcode/demos/basic.vue?raw'

const props = [
  { prop: 'value', desc: '二维码内容（链接 / 文本）', type: 'string', default: '-' },
  { prop: 'size', desc: '二维码尺寸', type: 'number', default: '160' },
  { prop: 'color / bgColor', desc: '前景 / 背景色', type: 'string', default: '-' },
  { prop: 'icon / iconSize', desc: '中心图标及其尺寸', type: 'string | VNode / number', default: '-' },
  { prop: 'status', desc: '状态：active / expired / loading / error', type: 'string', default: "'active'" },
  { prop: 'errorLevel', desc: '容错率：L / M / Q / H', type: 'string', default: "'M'" },
]
</script>

<DemoBlock :code="QRCodeDemoCode">
  <QRCodeDemo />
</DemoBlock>

## API

### TmQRCode Props

<TmPropsTable :data="props" />

### Events

| 事件 | 说明 |
| --- | --- |
| `refresh` | 二维码刷新时触发（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant QRCode 实例（经 `useForwardRef` 透传）。
