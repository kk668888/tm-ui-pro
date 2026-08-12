## 1. 共享基础设施

- [x] 1.1 将 `TAG_STATUS_COLOR` 上提为 `packages/ui/src/constants/status.ts` 共享常量（`STATUS_COLOR` + `StatusValue` 类型），TmTag 改引共享源，跑 tag 既有单测回归

## 2. 反馈组件

- [x] 2.1 实现 **TmAlert**：`status` → 语义色映射（复用共享 `STATUS_COLOR`）+ `type` 显式优先 + ant 透传 + `closable` 等 Boolean 兜底；含 `__tests__`、`demos/basic.vue`、docs 组件页、陈列页 Feedback section
- [x] 2.2 实现 **TmPopconfirm**：默认「确定/取消」文案 + `danger` 危险确认 + ant 透传；含单测/demo/docs/陈列页
- [x] 2.3 实现 **TmSpin**：ant 透传 + `spinning` Boolean 兜底 + 实例方法透传；含单测/demo/docs/陈列页
- [x] 2.4 实现 **TmPopover**：ant 透传 + `open` Boolean 兜底；含单测/demo/docs/陈列页
- [x] 2.5 实现 **TmResult**：ant 透传（status/title/subTitle/extra/插槽）；含单测/demo/docs/陈列页

## 3. 表单组件

- [x] 3.1 实现 **TmTimePicker**：`value-format` 字符串模式 + v-model 双向桥接（参照 TmDatePicker 的 `useValueFormat` 模式），未配置时为 Dayjs 直通；含单测/demo/docs/陈列页
- [x] 3.2 实现 **TmUpload**：受控 `fileList`（v-model）+ `beforeUpload` 校验拦截 + ant 透传（不假设上传服务）；含单测/demo/docs/陈列页

## 4. 聚合导出与文档

- [x] 4.1 `packages/ui/src/index.ts` 导入并用 `withInstall` 导出 7 个组件，`install()` 内 `app.use` 注册
- [x] 4.2 docs 侧边栏接入 7 个新组件页（按 反馈/表单 分组）

## 5. 收尾

- [x] 5.1 全量单测通过（含 tag 回归）+ `@tm/ui` build 成功 + docs build 成功
- [x] 5.2 demo 陈列页 Feedback / Form section 全量冒烟（全部 section 渲染）

