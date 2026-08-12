# Steps 步骤条

基于 [ant-design-vue](https://www.antdv.com/components/steps-cn) Steps 的薄封装。导出 `TmSteps` / `TmStep`，保留 ant 全部能力，无公司扩展键。

## 何时使用

- 分步流程（注册、认证、提交等）。
- 需要状态（process / finish / error / wait）与方向控制。

## 基础用法

横向步骤条 + 上一步 / 下一步交互控制（`current` 受控 + 按钮操作）。

<script setup>
import StepsDemo from '../../../packages/ui/src/components/steps/demos/basic.vue'
import StepsDemoCode from '../../../packages/ui/src/components/steps/demos/basic.vue?raw'

const props = [
  {
    prop: 'current',
    desc: '当前步骤索引（从 0 开始）',
    type: 'number',
    default: '0',
  },
  {
    prop: 'type / direction / size / items',
    desc: '类型 / 方向 / 尺寸 / 配置项（ant 原生）',
    type: 'StepsProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="StepsDemoCode">
  <StepsDemo />
</DemoBlock>

## API

### 子组件映射

| Tm 组件 | 对应 ant |
| --- | --- |
| `TmSteps` | Steps |
| `TmStep` | Steps.Step |

### TmSteps Props

<TmPropsTable :data="props" />

### TmStep Props

| 属性 | 说明 |
| --- | --- |
| `title` / `description` / `status` / `icon` | 步骤标题 / 描述 / 状态 / 图标（ant 原生） |

### Methods

业务侧通过 `ref` 可访问内部 ant Steps 实例（经 `useForwardRef` 透传）。
