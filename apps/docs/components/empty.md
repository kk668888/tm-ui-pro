# Empty 空状态

基于 [ant-design-vue](https://www.antdv.com/components/empty-cn) Empty 的薄封装。保留全部 ant 原生 props / slots / events，`description` 默认公司文案「暂无数据」，业务传值覆盖。

## 何时使用

- 列表无数据、搜索无结果等空态场景，希望统一「暂无数据」提示文案。

## 基础用法

公司默认文案 + 业务覆盖。

<script setup>
import EmptyDemo from '../../../packages/ui/src/components/empty/demos/basic.vue'
import EmptyDemoCode from '../../../packages/ui/src/components/empty/demos/basic.vue?raw'

const emptyProps = [
  {
    prop: 'description',
    desc: '空态描述；未传时使用公司默认「暂无数据」，传值覆盖',
    type: 'string | VNode',
    default: '暂无数据',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Empty 全部 props / slots / events（如 `image` / `imageStyle` / default 插槽）',
    type: 'EmptyProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="EmptyDemoCode">
  <EmptyDemo />
</DemoBlock>

## API

### TmEmpty Props

<TmPropsTable :data="emptyProps" />

### TmEmpty Types

- `TmEmptyProps = EmptyProps`（ant 原生）
- `EmptyProps` 可直接从 `@kibus/tm-ui-plus` 导入。
