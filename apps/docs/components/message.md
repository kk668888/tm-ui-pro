# Message 全局消息

`TmMessage` 是全局消息**命令式 API**（非组件），在任意位置（组件内外）调用即显示全局消息提示。有 `<TmApp>` 包裹时自动绑定 ConfigProvider 上下文（主题跟随），无则降级 ant 全局。

## 基础用法

点击按钮触发各类型消息（demo 依赖 `<TmApp>` 包裹绑定 ConfigProvider 上下文）。

<script setup>
import MessageDemo from '../../../packages/ui/src/components/message/demos/basic.vue'
import MessageDemoCode from '../../../packages/ui/src/components/message/demos/basic.vue?raw'

// 命令式 API 方法表格数据（TmMethodsTable 渲染，替代手写 markdown 表格）
const messageMethods = [
  { method: 'success(content, config?)', desc: '成功提示', returns: 'close: () => void' },
  { method: 'info(content, config?)', desc: '信息提示', returns: 'close: () => void' },
  { method: 'warning(content, config?)', desc: '警告提示', returns: 'close: () => void' },
  { method: 'error(content, config?)', desc: '错误提示', returns: 'close: () => void' },
  { method: 'loading(content, config?)', desc: '加载提示', returns: 'close: () => void' },
]
</script>

<DemoBlock :code="MessageDemoCode">
  <MessageDemo />
</DemoBlock>

## 配置与销毁

方法签名与 ant Message 一致：`success(content, config)`，`config` 支持 `duration` 等；各方法返回销毁函数，可提前关闭（调用 `close()`）。

## API

### TmMessage 方法

<TmMethodsTable :data="messageMethods" />

### 行为

- 有 `<TmApp>`：用绑定 ConfigProvider 上下文的实例（主题 / locale 跟随）
- 无 `<TmApp>`：降级 ant 全局 message（功能可用、主题不跟随、不抛错）

