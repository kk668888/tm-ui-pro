# Tag 标签

基于 [ant-design-vue](https://www.antdv.com/components/tag-cn) Tag 的薄封装。保留全部 ant 原生 props / slots / events，新增 `status` 扩展键：把业务状态枚举自动映射为公司统一的语义色，业务无需手写颜色值。

## 何时使用

- 表格状态列、分类标签等需要语义色标注的场景。
- 希望团队统一状态色规范（未来改主题只改一处映射）。

## 基础用法

`status` 状态映射 + 显式 `color` 覆盖。

<script setup>
import TagDemo from '../../../packages/ui/src/components/tag/demos/basic.vue'
import TagDemoCode from '../../../packages/ui/src/components/tag/demos/basic.vue?raw'

const tagProps = [
  {
    prop: 'status',
    desc: '状态枚举，映射为公司语义色：`success`→绿 / `processing`→蓝 / `failed`→红 / `warning`→橙黄；未知值回退默认色',
    type: 'success | processing | failed | warning',
    default: '-',
  },
  {
    prop: 'color',
    desc: 'ant 原生颜色；显式传值时优先于 `status` 映射',
    type: 'string',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Tag 全部 props / slots / events（如 `closable` / `onClose` / `icon` / `bordered`）',
    type: 'TagProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="TagDemoCode">
  <TagDemo />
</DemoBlock>

## API

### TmTag Props

<TmPropsTable :data="tagProps" />

### TmTag Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `close` | 点击关闭图标时触发（透传 ant） | `(e: MouseEvent) => void` |
| 其余事件 | 透传 ant Tag 全部 events（如 `@click`） | `-` |

### TmTag Methods

业务侧通过 `ref` 可访问内部 ant Tag 实例（经 `useForwardRef` 透传）。

### TmTag Types

- `TmTagProps = TagBaseProps & { status?: 'success' | 'processing' | 'failed' | 'warning' }`
- `TagProps`（ant 完整类型，含 DOM 属性）可直接从 `@tm/ui` 导入。
