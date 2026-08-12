## Purpose

Defines TmUpload, a file-upload component that provides a controlled `fileList` (v-model) and upload-before validation interception while transparently passing through the remaining ant Upload props, slots, and events.

## Requirements

### Requirement: 受控文件列表

TmUpload SHALL 支持受控 `fileList` 双向绑定（`v-model`），业务可读取/更新当前文件列表；未受控时 SHALL 内部维护文件列表。

#### Scenario: v-model 读写列表

- **WHEN** 业务绑定 `v-model:fileList` 并选择文件
- **THEN** 列表更新反映所选文件，业务侧同步拿到最新 fileList

### Requirement: 上传前校验拦截

TmUpload SHALL 暴露 `beforeUpload` 上传前校验钩子（透传 ant 语义）。钩子返回 `false` / 拒绝 Promise 时 SHALL 拦截实际上传请求；同时阻止文件进入列表时 SHALL 返回 `Upload.LIST_IGNORE` 哨兵（ant 4.2.6 实测：仅返回 `false` 只拦请求，文件仍会以无状态条目进入列表）。

#### Scenario: 校验拦截上传

- **WHEN** `beforeUpload` 返回 `false` 拒绝某个文件（如超出大小）
- **THEN** 该文件不发起上传请求，但会以无状态条目出现在列表；如需完全排除须返回 `LIST_IGNORE`

#### Scenario: LIST_IGNORE 完全排除

- **WHEN** `beforeUpload` 返回 `Upload.LIST_IGNORE`（如超出大小）
- **THEN** 该文件既不入列表也不触发上传，其余文件正常处理

### Requirement: ant 属性 / 插槽 / 事件透传

TmUpload SHALL 透传 ant Upload 全部原生 props / slots / events（如 `action` / `accept` / `multiple` / `listType` / `maxCount` / `onChange` / `onRemove` / `customRequest`），公司不假设具体上传服务。

#### Scenario: 上传配置透传

- **WHEN** 业务传 `action`、`accept`、`multiple` 与 `@change`
- **THEN** 上传按配置发起，变更事件透传给业务
