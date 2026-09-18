# UploadDragger 拖拽上传区

基于 [ant-design-vue](https://www.antdv.com/components/upload-cn) Upload.Dragger 的薄封装。与 `TmUpload` 同一套契约：`v-model:file-list` 受控文件列表、`showUploadList` 公司默认兜底、`beforeUpload` 等原生能力全量透传，区别只在于**呈现形态**——整块可拖拽的虚线区域，而不是一个按钮。

## 何时使用

- 需要大面积拖拽入口的场景（附件、素材、批量导入文件）。
- 附件区希望「拖进来就行」，同时保留点击选择文件的能力。
- 与 `TmUpload` 混用的界面里，希望两者的受控与校验行为完全一致。

## 基础用法

`v-model:file-list` 让父组件持有文件列表（受控）；`action` 是上传地址；默认插槽是拖拽区内的提示内容。上传前校验要在 `beforeUpload` 里做，**超限文件必须返回 `Upload.LIST_IGNORE` 哨兵**——只 `return false` 只能拦掉 POST 请求，文件仍会以无状态条目进入列表。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import UploadDraggerDemo from '../../../packages/ui/src/components/upload-dragger/demos/basic.vue'
import UploadDraggerDemoCode from '../../../packages/ui/src/components/upload-dragger/demos/basic.vue?raw'

// TmPropsTable 数据：TmUploadDragger Props 表格（数据驱动渲染）
const uploadDraggerProps = [
  {
    prop: 'fileList',
    desc: '受控文件列表（`v-model:file-list`）；父组件持有时即为受控模式，上传过程的状态变更经 `update:fileList` 回写',
    type: 'UploadFile[]',
    default: '-',
  },
  {
    prop: 'showUploadList',
    desc: '是否展示文件列表；**公司默认 `true` 兜底**（ant 该属性为 Boolean/Object 复合类型，类型化 defineProps 未传时可能被解析为 `false`，导致已上传文件不展示）',
    type: 'boolean | ShowUploadListInterface',
    default: 'true',
  },
  {
    prop: 'beforeUpload',
    desc: '上传前校验；返回 `false` 仅拦 POST 请求，需同时「不进列表 + 不发请求」时返回 `Upload.LIST_IGNORE`',
    type: '(file, fileList) => boolean | Promise | string',
    default: '-',
  },
  {
    prop: 'action / accept / multiple / maxCount',
    desc: '透传 ant Upload.Dragger 原生上传能力（上传地址 / 文件类型限制 / 多选 / 数量上限）',
    type: 'UploadProps',
    default: "-",
  },
  {
    prop: 'disabled',
    desc: '整体禁用（不可点击、不可拖拽）',
    type: 'boolean',
    default: 'false',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Upload.Dragger 全部 props / events（如 `data` / `headers` / `withCredentials` / `@change` / `@remove`）',
    type: 'UploadProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="UploadDraggerDemoCode">
  <UploadDraggerDemo />
</DemoBlock>

## API

### TmUploadDragger Props

<TmPropsTable :data="uploadDraggerProps" />

### TmUploadDragger Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:fileList` | `v-model:file-list` 更新事件；内部由模板显式绑定转发自 ant 的 `update:fileList` | `(fileList: UploadFile[]) => void` |
| 其余事件 | 透传 ant Upload 全部 events（如 `@change` / `@remove` / `@success` / `@error` / `@progress` / `@drop`） | `-` |

### TmUploadDragger Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 拖拽区内容（提示文案、图标等） |
| `listItem` | 自定义文件列表项的渲染 |

### TmUploadDragger Methods

业务侧通过 `ref` 可访问内部 ant Upload.Dragger 实例（经 `useForwardRef` 透传）。

### TmUploadDragger Types

`UploadDragger` 不自带类型定义，直接复用 upload 模块的公开类型：

```ts
import type { UploadProps, UploadFile } from '@trustmo/tm-ui'
```

## 与 TmUpload 的差异

| 维度 | TmUpload | TmUploadDragger |
| --- | --- | --- |
| 底层 ant 组件 | Upload | Upload.Dragger |
| 形态 | 触发器 + 文件列表（点按钮选文件） | 整块虚线拖拽区 + 文件列表 |
| 受控契约 | `v-model:file-list` | 同（一致） |
| `showUploadList` 默认 | `true` 兜底 | 同（一致） |
| 上传前校验 | `beforeUpload` | 同（一致） |

## 实现要点

- **`onUpdate:fileList` 单通道**：该监听器从透传对象中剔除，只保留模板上的显式绑定。若同时经 `$attrs` 透传，Vue 会把两个监听器合并成数组，ant 内部 `.call` 调用会崩溃。
- **真实上传需要服务端**：文档演示的 `action="/api/upload"` 是占位地址，请求会失败（不影响交互与列表状态）；接入业务时替换为真实上传接口，或改用 `customRequest` 自行处理。
