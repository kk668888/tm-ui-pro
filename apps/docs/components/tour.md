# Tour 引导

基于 [ant-design-vue](https://www.antdv.com/components/tour-cn) Tour 的薄封装。支持多步骤引导、锚定元素、遮罩与箭头配置，`open` 受控透传且缺省不形成幻影 `false`。无公司默认。

> 关闭桥接：ant Tour 关闭/完成只触发 `onClose` / `onFinish` 回调、不发射 `update:open` 事件（业务需手动置 `open=false` 才能闭合）。TmTour 已内部桥接，**业务仅需 `v-model:open` 即可正常开合**。

## 何时使用

- 新功能引导、首次体验说明。
- 需要分步引导用户操作核心功能的场景。

## 基础用法

<script setup>
import TourDemo from '../../../packages/ui/src/components/tour/demos/basic.vue'
import TourDemoCode from '../../../packages/ui/src/components/tour/demos/basic.vue?raw'

const props = [
  { prop: 'open', desc: '受控打开状态（v-model:open；关闭 / 完成自动置 false，无需额外 @close）', type: 'boolean', default: '-' },
  { prop: 'current', desc: '当前步骤索引（受控）', type: 'number', default: '0' },
  { prop: 'steps', desc: '步骤配置数组（title / description / target 等）', type: 'TourStepProps[]', default: '[]' },
  { prop: 'mask / placement / arrow', desc: '遮罩、浮层位置、箭头配置（ant 原生）', type: 'TourProps', default: '-' },
  { prop: 'onClose / onFinish / onChange', desc: '关闭 / 完成 / 步骤切换事件（ant 原生）', type: 'event', default: '-' },
]
</script>

<DemoBlock :code="TourDemoCode">
  <TourDemo />
</DemoBlock>

> 注：Tour 依赖真实 DOM 锚点与遮罩层，jsdom 单测聚焦 wrapper 透传，交互路径请在浏览器中查看 demo。

## API

### TmTour Props

<TmPropsTable :data="props" />

### Events

| 事件 | 说明 |
| --- | --- |
| `update:open` | 开合状态变化（v-model:open 双向通道，关闭 / 完成时自动触发 `false`） |
| `close` | 关闭引导（参数为关闭时的当前步骤索引） |
| `finish` | 引导完成（透传 ant） |
| `change` | 步骤切换（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant Tour 实例（经 `useForwardRef` 透传）。
