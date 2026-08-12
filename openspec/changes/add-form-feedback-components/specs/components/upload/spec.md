## Purpose

Defines TmUpload, a file-upload component that provides a controlled `fileList` (v-model) and upload-before validation interception while transparently passing through the remaining ant Upload props, slots, and events.

## ADDED Requirements

### Requirement: 受控文件列表

TmUpload SHALL 支持受控 `fileList` 双向绑定（`v-model`），业务可读取/更新当前文件列表；未受控时 SHALL 内部维护文件列表。

#### Scenario: v-model 读写列表

- **WHEN** 业务绑定 `v-model:fileList` 并选择文件
- **THEN** 列表更新反映所选文件，业务侧同步拿到最新 fileList

### Requirement: 上传前校验拦截

TmUpload SHALL 暴露 `beforeUpload` 上传前校验钩子（透传 ant 语义），返回 false / 拒绝 Promise 时 SHALL 不进入文件列表，不发起上传。

#### Scenario: 校验拒绝文件

- **WHEN** `beforeUpload` 拒绝某个文件（如超出大小）
- **THEN** 该文件不入列表、不触发上传，其余文件正常处理

### Requirement: ant 属性 / 插槽 / 事件透传

TmUpload SHALL 透传 ant Upload 全部原生 props / slots / events（如 `action` / `accept` / `multiple` / `listType` / `maxCount` / `onChange` / `onRemove` / `customRequest`），公司不假设具体上传服务。

#### Scenario: 上传配置透传

- **WHEN** 业务传 `action`、`accept`、`multiple` 与 `@change`
- **THEN** 上传按配置发起，变更事件透传给业务
