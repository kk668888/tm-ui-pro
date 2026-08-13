# Calendar 日历

基于 [ant-design-vue](https://www.antdv.com/components/calendar-cn) Calendar 的薄封装。保留 ant 全部能力，无公司默认（以 dayjs 版本为默认导出）。

## 何时使用

- 月 / 年视图日历展示，用于排期、日程标记。
- 需要日期格子自定义渲染（dateCellRender 等）。

## 基础用法

<script setup>
import CalendarDemo from '../../../packages/ui/src/components/calendar/demos/basic.vue'
import CalendarDemoCode from '../../../packages/ui/src/components/calendar/demos/basic.vue?raw'

const props = [
  { prop: 'value', desc: '受控日期（v-model:value，dayjs 对象）', type: 'Dayjs', default: '-' },
  { prop: 'mode', desc: '面板模式：month / year', type: "'month' | 'year'", default: "'month'" },
  { prop: 'fullscreen', desc: '是否全屏（false 为卡片式）', type: 'boolean', default: 'true' },
  { prop: 'validRange / disabledDate', desc: '可选范围 / 禁用日期（ant 原生）', type: 'CalendarProps', default: '-' },
  { prop: 'dateCellRender / monthCellRender / headerRender', desc: '日期格 / 月格 / 头部自定义渲染插槽', type: 'slot', default: '-' },
]
</script>

<DemoBlock :code="CalendarDemoCode">
  <CalendarDemo />
</DemoBlock>

> 注：ant 的 `CalendarProps` 是泛型类型（CalendarProps\<DateType\>），TmCalendar 具体化为 `CalendarProps<Dayjs>`；组件用 render function 声明 props 以规避 compiler-sfc 展开深层泛型。

## API

### TmCalendar Props

<TmPropsTable :data="props" />

### Events

| 事件 | 说明 |
| --- | --- |
| `change` | 日期变化（透传 ant，参数为 dayjs） |
| `panelChange` | 面板切换（透传 ant） |
| `select` | 选择日期（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant Calendar 实例（经 `useForwardRef` 透传）。
