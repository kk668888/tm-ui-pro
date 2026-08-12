## Why

tm-ui 已覆盖 21 个组件，但业务侧（apps/demo 实证）高频使用的**反馈与表单组件仍缺失**：`Alert`/`Popconfirm`/`Spin`/`Popover`/`Result`（反馈）+ `Upload`/`TimePicker`（表单）。业务不得不在 `<TmXxx>` 与 ant 原生 `<a-xxx>` 之间混用，导致 Tm 前缀、语义色与主题绑定不统一。补齐后可让业务全量走 tm-ui，形成单一组件体系。

## What Changes

- 新增 7 个基于 ant-design-vue 的薄封装组件，遵循既有封装范式（`inheritAttrs:false` + `useForwardRef` 方法透传 + 扩展属性剥离 + Boolean 陷阱兜底 + slots 全透传）：
  - **TmAlert**：`status` → 语义色映射（复用 TmTag 的 STATUS_COLOR 模式）+ 统一图标，`type` 显式优先
  - **TmPopconfirm**：确认/取消按钮文案默认值 + `danger` 危险确认语义（对齐 TmButton 的 confirm 交互）
  - **TmSpin**：薄封装透传（`spinning`/`tip`/`size`），可加"整页加载"包裹语义
  - **TmPopover**：薄封装透传
  - **TmResult**：薄封装（403/404/500 状态页，`status`/`title`/`subTitle`）
  - **TmUpload**：薄封装 + 受控 `fileList` + `beforeUpload` 校验拦截（最复杂，ant 配置繁琐）
  - **TmTimePicker**：与 TmDatePicker 对齐——`value-format` 字符串模式 + `v-model` 桥接
- `packages/ui/src/index.ts` 聚合导出 7 个组件并 `install` 注册（`TmResolver` 无需改动——对 `Tm*` 一律返回主入口，fail-fast）
- `apps/docs` 新增 7 个组件文档页并接入侧边栏
- `apps/demo` tm-components 陈列页 Feedback / Form section 补充对应展示

## Capabilities

### New Capabilities

- `components/alert`: TmAlert 状态提示条——语义色映射与 ant 透传
- `components/popconfirm`: TmPopconfirm 气泡确认框——确认文案默认值与危险语义
- `components/spin`: TmSpin 加载态容器——ant 透传与整页加载包裹
- `components/popover`: TmPopover 气泡卡片——ant 透传
- `components/result`: TmResult 结果页——ant 透传（状态页语义）
- `components/upload`: TmUpload 文件上传——受控 fileList 与上传前校验
- `components/time-picker`: TmTimePicker 时间选择——value-format 字符串模式与 v-model 桥接

### Modified Capabilities

- （无——均为新增组件，不改动既有 spec 行为）

## Impact

- **packages/ui**：新增 7 个组件目录（`components/{alert,popconfirm,spin,popover,result,upload,time-picker}`）、`index.ts` 聚合导出与 install 注册
- **apps/docs**：新增 7 个文档页 + 侧边栏项
- **apps/demo**：陈列页 Feedback / Form section 扩展
- **依赖**：无新增——全部基于 ant-design-vue 现有组件（薄封装，不引入 markdown/上传等第三方）
