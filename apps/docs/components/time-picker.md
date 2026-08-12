# TimePicker 时间选择

基于 [ant-design-vue](https://www.antdv.com/components/time-picker) TimePicker 的薄封装，在保留全部 ant 原生 props / slots / events 的基础上，新增 `value-format`（字符串模式，与 TmDatePicker 对齐）与 `readonly`（只读锁）。

## 基础用法

`value-format` 字符串模式 + 分钟步进。

<script setup>
import TimePickerDemo from '../../../packages/ui/src/components/time-picker/demos/basic.vue'
import TimePickerDemoCode from '../../../packages/ui/src/components/time-picker/demos/basic.vue?raw'

const timePickerProps = [
  { prop: 'modelValue', desc: '业务 `v-model` 绑定值。默认 Dayjs；配置 `value-format` 后为格式化字符串', type: 'Dayjs | string', default: '-' },
  { prop: 'valueFormat', desc: '可选值格式（如 `HH:mm:ss`）。配置后业务拿字符串，组件内部 string↔Dayjs 双向转换；未配置则 Dayjs 直通', type: 'string', default: '-' },
  { prop: 'readonly', desc: '只读语义：ant TimePicker 无原生 readonly，为真时锁死弹层面板', type: 'boolean', default: '-' },
  { prop: 'format', desc: '展示格式', type: 'string', default: '-' },
  { prop: 'minuteStep', desc: '分钟选项步进', type: 'number', default: '1' },
  { prop: 'hourStep', desc: '小时选项步进', type: 'number', default: '1' },
  { prop: 'secondStep', desc: '秒选项步进', type: 'number', default: '1' },
  { prop: 'disabled', desc: '是否禁用', type: 'boolean', default: 'false' },
  { prop: 'allowClear', desc: '是否允许一键清空', type: 'boolean', default: 'true' },
]
</script>

<DemoBlock :code="TimePickerDemoCode">
  <TimePickerDemo />
</DemoBlock>

## API

### TmTimePicker Props

<TmPropsTable :data="timePickerProps" />
