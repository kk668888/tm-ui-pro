# Message 全局消息

`TmMessage` 是全局消息**命令式 API**（非组件），在任意位置（组件内外）调用即显示全局消息提示。有 `<TmApp>` 包裹时自动绑定 ConfigProvider 上下文（主题跟随），无则降级 ant 全局。

## 基础用法

点击按钮触发各类型消息（demo 依赖 `<TmApp>` 包裹绑定 ConfigProvider 上下文）。

<script setup>
import MessageDemo from '../../../packages/ui/src/components/message/demos/basic.vue'
import MessageDemoCode from '../../../packages/ui/src/components/message/demos/basic.vue?raw'

// 命令式调用示例（CodeBlock 默认折叠展示）
const messageCode = `import { TmMessage } from '@tm/ui'

TmMessage.success('保存成功')
TmMessage.error('操作失败')
TmMessage.warning('请注意')
TmMessage.info('提示信息')
TmMessage.loading('加载中...')`
</script>

<DemoBlock :code="MessageDemoCode">
  <MessageDemo />
</DemoBlock>

<CodeBlock :code="messageCode" />

## 配置与销毁

方法签名与 ant Message 一致：`success(content, config)`，`config` 支持 `duration` 等；各方法返回销毁函数，可提前关闭（调用 `close()`）。

## API

### TmMessage 方法

| 方法 | 说明 | 返回 |
| --- | --- | --- |
| `success(content, config?)` | 成功提示 | `close: () => void` |
| `info(content, config?)` | 信息提示 | `close: () => void` |
| `warning(content, config?)` | 警告提示 | `close: () => void` |
| `error(content, config?)` | 错误提示 | `close: () => void` |
| `loading(content, config?)` | 加载提示 | `close: () => void` |

### 行为

- 有 `<TmApp>`：用绑定 ConfigProvider 上下文的实例（主题 / locale 跟随）
- 无 `<TmApp>`：降级 ant 全局 message（功能可用、主题不跟随、不抛错）
