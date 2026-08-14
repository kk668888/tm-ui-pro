# Drawer 抽屉

`TmDrawer` 是 ant Drawer 的组件式薄封装，`v-model` 控制开关，ant 原生 props / slots / events 全透传。

## 基础用法

`v-model` 控制开关，`placement` / `width` 等原生透传。

<script setup>
import DrawerDemo from '../../../packages/ui/src/components/drawer/demos/basic.vue'
import DrawerDemoCode from '../../../packages/ui/src/components/drawer/demos/basic.vue?raw'

const drawerProps = [
  {
    prop: 'modelValue',
    desc: '业务 `v-model` 开关状态；内部桥接到 ant Drawer 的 `open`',
    type: 'boolean',
    default: 'false',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Drawer 全部 props / slots / events（如 `title` / `width` / `placement` / `closable` / `destroyOnClose`）',
    type: 'DrawerProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="DrawerDemoCode">
  <DrawerDemo />
</DemoBlock>

## API

### TmDrawer Props

<TmPropsTable :data="drawerProps" />

### TmDrawer Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件，内部自动桥接自 ant 的 `update:open` | `(open: boolean) => void` |
| 其余事件 | 透传 ant Drawer 全部 events（如 `@close` / `@afterOpenChange`） | `-` |

### TmDrawer Methods

业务侧通过 `ref` 可调用内部 ant Drawer 实例方法（经 `useForwardRef` 透传）。

### TmDrawer Types

- `TmDrawerProps = DrawerProps & { modelValue?: boolean }`
- `DrawerProps`（ant 原生）可直接从 `@kibus/tm-ui-plus` 导入。
