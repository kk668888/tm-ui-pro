# Spin 加载中

基于 [ant-design-vue](https://www.antdv.com/components/spin) Spin 的薄封装，保留全部 ant 原生 props / slots / events，并显式兜底 `spinning` 默认值（Boolean 陷阱）以还原 ant 默认加载态语义。

## 基础用法

加载态切换 + 包裹内容区域。

<script setup>
import SpinDemo from '../../../packages/ui/src/components/spin/demos/basic.vue'
import SpinDemoCode from '../../../packages/ui/src/components/spin/demos/basic.vue?raw'

const spinProps = [
  { prop: 'spinning', desc: '是否显示加载态（默认 true，传入 false 关闭）', type: 'boolean', default: 'true' },
  { prop: 'tip', desc: '加载提示文案', type: 'VueNode', default: '-' },
  { prop: 'size', desc: '尺寸（`small` / `default` / `large`）', type: 'string', default: 'default' },
  { prop: 'delay', desc: '延迟显示加载态的时间（ms），避免闪烁', type: 'number', default: '-' },
  { prop: 'indicator', desc: '自定义加载指示器', type: 'VueNode', default: '-' },
  { prop: 'wrapperClassName', desc: '包裹层自定义类名', type: 'string', default: '' },
]
</script>

<DemoBlock :code="SpinDemoCode">
  <SpinDemo />
</DemoBlock>

## API

### TmSpin Props

<TmPropsTable :data="spinProps" />
