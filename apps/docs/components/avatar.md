# Avatar 头像

基于 [ant-design-vue](https://www.antdv.com/components/avatar-cn) Avatar 的薄封装。保留 ant 全部能力（含 `TmAvatarGroup` 子组件），无公司默认。

## 何时使用

- 用户头像展示（图片 / 图标 / 文字）。
- 头像组溢出折叠（maxCount）。

## 基础用法

<script setup>
import AvatarDemo from '../../../packages/ui/src/components/avatar/demos/basic.vue'
import AvatarDemoCode from '../../../packages/ui/src/components/avatar/demos/basic.vue?raw'

const props = [
  { prop: 'src', desc: '图片地址（加载失败自动回退 icon / 文字）', type: 'string', default: '-' },
  { prop: 'shape', desc: '形状：circle / square', type: "'circle' | 'square'", default: "'circle'" },
  { prop: 'size', desc: '尺寸：number / small / default / large / 响应式对象', type: 'number | string | object', default: '32' },
  { prop: 'icon', desc: '图标（ant 原生）', type: 'VueNode', default: '-' },
  { prop: 'TmAvatarGroup', desc: '子组件：`maxCount` / `maxStyle` / `maxPopoverPlacement` / `maxPopoverTrigger`', type: 'AvatarGroupProps', default: '-' },
]
</script>

<DemoBlock :code="AvatarDemoCode">
  <AvatarDemo />
</DemoBlock>

> 注：TmAvatarGroup 使用 render function 转发 default slot，ant 能正确 cloneElement 遍历子头像（maxCount 溢出折叠）。

## API

### TmAvatar Props

<TmPropsTable :data="props" />

### TmAvatarGroup Props

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `maxCount` | 最多显示头像数量，超出折叠 | `number` |
| `maxStyle` | 折叠头像样式 | `CSSProperties` |
| `maxPopoverPlacement` | 折叠提示浮层位置 | `string` |
| `maxPopoverTrigger` | 折叠提示触发方式 | `string` |
| `size` / `shape` | 统一头像尺寸 / 形状 | `number \| string \| object` |

### Methods

业务侧通过 `ref` 可访问内部 ant Avatar / Avatar.Group 实例（经 `useForwardRef` 透传）。
