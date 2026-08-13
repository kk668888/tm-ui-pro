# Progress 进度条

基于 [ant-design-vue](https://www.antdv.com/components/progress-cn) Progress 的薄封装。支持业务 `status` 语义映射（`success` / `processing` / `failed` / `warning`），业务无需手写 ant 状态值；显式 `strokeColor` 优先于映射兜底。

## 何时使用

- 任务进度、加载和完成度展示。
- 需要统一状态色语义的进度反馈。

## 基础用法

<script setup>
import ProgressDemo from '../../../packages/ui/src/components/progress/demos/basic.vue'
import ProgressDemoCode from '../../../packages/ui/src/components/progress/demos/basic.vue?raw'

const props = [
  { prop: 'percent', desc: '进度百分比（0-100）', type: 'number', default: '0' },
  { prop: 'status', desc: '业务状态（success / processing / failed / warning）或 ant 原生值（normal / active / exception），映射见下表', type: 'string', default: '-' },
  { prop: 'strokeColor', desc: '进度条颜色（显式传值优先于 status 映射兜底）', type: 'string | string[] | object', default: '-' },
  { prop: 'type / size / showInfo', desc: '进度类型（line / circle / dashboard）、尺寸、是否显示文案（ant 原生）', type: 'ProgressProps', default: '-' },
]
</script>

<DemoBlock :code="ProgressDemoCode">
  <ProgressDemo />
</DemoBlock>

### status 映射表

业务 `status` 与 ant 原生值域不一致，TmProgress 建立映射（参照 `TmTag` / `TmAlert` 的统一业务语义）：

| 业务 status | 映射为 ant |
| --- | --- |
| `success` | `status='success'` |
| `processing` | `status='active'`（活跃流动动画） |
| `failed` | `status='exception'` |
| `warning` | `status='normal'` + `strokeColor` 兜底 `#faad14` |

ant 原生值（`active` / `normal` / `exception`）不在映射表，原样透传。

## API

### TmProgress Props

<TmPropsTable :data="props" />

### Methods

业务侧通过 `ref` 可访问内部 ant Progress 实例（经 `useForwardRef` 透传）。
