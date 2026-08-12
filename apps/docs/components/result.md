# Result 结果页

基于 [ant-design-vue](https://www.antdv.com/components/result) Result 的薄封装，保留全部 ant 原生 props / slots / events，用于成功 / 失败 / 403 / 404 / 500 等结果状态页。

## 基础用法

成功结果页 + 404 状态页。

<script setup>
import ResultDemo from '../../../packages/ui/src/components/result/demos/basic.vue'
import ResultDemoCode from '../../../packages/ui/src/components/result/demos/basic.vue?raw'

const resultProps = [
  { prop: 'status', desc: '结果状态（`success` / `error` / `info` / `warning` / `404` / `403` / `500`）', type: 'string', default: 'info' },
  { prop: 'title', desc: '结果标题', type: 'VueNode', default: '-' },
  { prop: 'subTitle', desc: '结果副标题', type: 'VueNode', default: '-' },
  { prop: 'extra', desc: '操作区内容（也可用 `extra` 插槽）', type: 'VueNode', default: '-' },
  { prop: 'icon', desc: '自定义图标（也可用 `icon` 插槽）', type: 'VueNode', default: '-' },
]
</script>

<DemoBlock :code="ResultDemoCode">
  <ResultDemo />
</DemoBlock>

## API

### TmResult Props

<TmPropsTable :data="resultProps" />
