# Image 图片

基于 [ant-design-vue](https://www.antdv.com/components/image-cn) Image 的薄封装。保留 ant 全部能力（含 `TmImagePreviewGroup` 子组件），无公司默认。

## 何时使用

- 图片展示与点击预览（缩放 / 旋转 / 切换）。
- 多图预览组（PreviewGroup 左右切换）。

## 基础用法

<script setup>
import ImageDemo from '../../../packages/ui/src/components/image/demos/basic.vue'
import ImageDemoCode from '../../../packages/ui/src/components/image/demos/basic.vue?raw'

const props = [
  { prop: 'src', desc: '图片地址', type: 'string', default: '-' },
  { prop: 'width / height', desc: '图片尺寸', type: 'number | string', default: '-' },
  { prop: 'preview', desc: '预览配置：true 启用 / false 禁用 / 对象配置', type: 'boolean | object', default: 'true' },
  { prop: 'placeholder / fallback', desc: '加载占位 / 失败回退图', type: 'VueNode', default: '-' },
  { prop: 'TmImagePreviewGroup', desc: '子组件：包裹多个 TmImage 形成预览组', type: 'TmImagePreviewGroupProps', default: '-' },
]
</script>

<DemoBlock :code="ImageDemoCode">
  <ImageDemo />
</DemoBlock>

## API

### TmImage Props

<TmPropsTable :data="props" />

### TmImagePreviewGroup Props

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `preview` | 预览配置：false 禁用，对象时按 ant Image preview 配置 | `boolean \| object` |

### Methods

业务侧通过 `ref` 可访问内部 ant Image 实例（经 `useForwardRef` 透传）。
