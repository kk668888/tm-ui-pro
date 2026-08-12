# Divider 分割线

基于 [ant-design-vue](https://www.antdv.com/components/divider-cn) Divider 的薄封装。保留全部 ant 原生 props / slots / events，公司默认 `type=horizontal` + `orientation=center` 兜底。

## 何时使用

- 内容块之间需要分隔线统一视觉。
- 希望团队遵循公司分割线规范（水平 + 居中文案）。

## 基础用法

公司默认形态 + `orientation` / `dashed` / `type=vertical` 覆盖。

<script setup>
import DividerDemo from '../../../packages/ui/src/components/divider/demos/basic.vue'
import DividerDemoCode from '../../../packages/ui/src/components/divider/demos/basic.vue?raw'

const dividerProps = [
  {
    prop: 'type',
    desc: '分割方向：公司默认 `horizontal`，业务传 `vertical` 覆盖',
    type: 'horizontal | vertical',
    default: 'horizontal',
  },
  {
    prop: 'orientation',
    desc: '文案位置：公司默认 `center`，业务传 `left` / `right` 覆盖',
    type: 'left | right | center',
    default: 'center',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Divider 全部 props / slots / events（如 `dashed` / `plain` / `orientationMargin`）',
    type: 'DividerProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="DividerDemoCode">
  <DividerDemo />
</DemoBlock>

## API

### TmDivider Props

<TmPropsTable :data="dividerProps" />

### TmDivider Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 分割线文案（透传 ant） |

### TmDivider Methods

业务侧通过 `ref` 可访问内部 ant Divider 实例（经 `useForwardRef` 透传）。
