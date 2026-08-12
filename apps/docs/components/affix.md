# Affix 固钉

基于 [ant-design-vue](https://www.antdv.com/components/affix-cn) Affix 的薄封装。保留 ant 全部能力，无公司扩展键。

## 何时使用

- 操作区 / 工具栏随滚动固定在视口。
- 需要 offsetTop / offsetBottom / 自定义 target。

## 基础用法

顶部固定操作区。

<script setup>
import AffixDemo from '../../../packages/ui/src/components/affix/demos/basic.vue'
import AffixDemoCode from '../../../packages/ui/src/components/affix/demos/basic.vue?raw'

const props = [
  {
    prop: 'offsetTop / offsetBottom',
    desc: '距视口顶部 / 底部偏移（触发固定）',
    type: 'number',
    default: '0',
  },
  {
    prop: 'target / onChange',
    desc: '滚动容器 / 固定状态变化回调（ant 原生）',
    type: 'AffixProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="AffixDemoCode">
  <AffixDemo />
</DemoBlock>

## API

### TmAffix Props

<TmPropsTable :data="props" />

### TmAffix Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `change` | 固定状态变化时触发（透传 ant） | `(affixed: boolean) => void` |

### Methods

业务侧通过 `ref` 可访问内部 ant Affix 实例（经 `useForwardRef` 透传）。
