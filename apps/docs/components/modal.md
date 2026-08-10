# Modal 对话框

`TmModal` 双形态：**组件式** `<TmModal v-model>`（薄封装 + 标准 v-model）+ **命令式** `TmModal.confirm()` 等（任意位置弹出）。有 `<TmApp>` 包裹时命令式自动绑定 ConfigProvider 上下文。

## 组件式用法

`v-model` 控制开关，ant 原生 props / slots / events 全透传。

<script setup>
import ModalDemo from '../../../packages/ui/src/components/modal/demos/basic.vue'
import ModalDemoCode from '../../../packages/ui/src/components/modal/demos/basic.vue?raw'
import ConfirmDemo from '../../../packages/ui/src/components/modal/demos/confirm.vue'
import ConfirmDemoCode from '../../../packages/ui/src/components/modal/demos/confirm.vue?raw'

const modalProps = [
  {
    prop: 'modelValue',
    desc: '业务 `v-model` 开关状态；内部桥接到 ant Modal 的 `open`',
    type: 'boolean',
    default: 'false',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Modal 全部 props / slots / events（如 `title` / `width` / `footer` / `confirmLoading` / `@ok` / `@cancel`）',
    type: 'ModalProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="ModalDemoCode">
  <ModalDemo />
</DemoBlock>

## 命令式用法

点击按钮弹出确认对话框（demo 依赖 `<TmApp>` 包裹绑定 ConfigProvider 上下文）。

<DemoBlock :code="ConfirmDemoCode">
  <ConfirmDemo />
</DemoBlock>

```ts
import { TmModal } from '@tm/ui'

TmModal.confirm({
  title: '确认删除',
  content: '删除后不可恢复，是否继续？',
  onOk() { /* 确认逻辑 */ },
})
```

支持 `confirm` / `info` / `success` / `error` / `warning` 五种，配置对象沿用 ant Modal `confirm` 形态。

## API

### TmModal 组件 Props

<TmPropsTable :data="modalProps" />

### TmModal 命令式方法

| 方法 | 说明 |
| --- | --- |
| `confirm(config)` | 确认对话框 |
| `info(config)` | 信息对话框 |
| `success(config)` | 成功对话框 |
| `error(config)` | 错误对话框 |
| `warning(config)` | 警告对话框 |

### 行为

- 命令式有 `<TmApp>`：用绑定 ConfigProvider 上下文的 modal 实例（主题 / locale 跟随）
- 命令式无 `<TmApp>`：降级 ant 全局 Modal（功能可用、主题不跟随、不抛错）

### TmModal Types

- `TmModalProps = ModalProps & { modelValue?: boolean }`
- `ModalProps`（ant 原生）可直接从 `@tm/ui` 导入。
