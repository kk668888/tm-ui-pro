## Purpose

定义 TmUploadDragger 拖拽上传区的公开行为：ant Upload.Dragger 的库内薄封装，提供拖拽/点击两种选文件入口，与 TmUpload 共享上传契约。

## Requirements

### Requirement: 拖拽区渲染与文件选择

TmUploadDragger SHALL 渲染为大面积拖拽上传区：支持拖入文件与点击触发文件选择，插槽内容作为提示区展示；拖拽悬停 SHALL 呈现高亮反馈。

#### Scenario: 拖入文件
- **WHEN** 业务拖入文件到上传区
- **THEN** 文件进入上传流程，上传区展示悬停高亮后恢复

### Requirement: 文件列表契约与原生透传

TmUploadDragger SHALL 以 `v-model:fileList` 双向绑定文件列表（映射 ant `fileList` / `update:fileList`）；`beforeUpload`、`accept`、`multiple`、`action` 等原生能力透传，行为与 TmUpload 一致。

#### Scenario: 列表回写
- **WHEN** 上传成功后 ant 内部更新 fileList
- **THEN** 业务侧 `v-model:fileList` 绑定值同步更新
