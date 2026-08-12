# Upload 文件上传

基于 [ant-design-vue](https://www.antdv.com/components/upload) Upload 的薄封装，保留全部 ant 原生 props / slots / events，支持受控 `file-list`（v-model 双向）与 `before-upload` 上传前校验拦截。公司不假设具体上传服务，`action` / `custom-request` 等由业务配置。

## 基础用法

受控文件列表 + 上传前大小校验。

<script setup>
import UploadDemo from '../../../packages/ui/src/components/upload/demos/basic.vue'
import UploadDemoCode from '../../../packages/ui/src/components/upload/demos/basic.vue?raw'

const uploadProps = [
  { prop: 'fileList', desc: '受控文件列表（`v-model:file-list` 双向）', type: 'UploadFile[]', default: '-' },
  { prop: 'beforeUpload', desc: '上传前校验：返回 false / 拒绝 Promise 则文件不入列表、不发起上传', type: '(file, fileList) => boolean | Promise', default: '-' },
  { prop: 'action', desc: '上传请求地址', type: 'string', default: '-' },
  { prop: 'accept', desc: '接受的文件类型（如 `.png,.jpg`）', type: 'string', default: '-' },
  { prop: 'multiple', desc: '是否支持多选文件', type: 'boolean', default: 'false' },
  { prop: 'listType', desc: '列表展示类型（`text` / `picture` / `picture-card`）', type: 'string', default: 'text' },
  { prop: 'maxCount', desc: '最大上传数量', type: 'number', default: '-' },
  { prop: 'showUploadList', desc: '是否显示文件列表（也可传对象配置）', type: 'boolean | object', default: 'true' },
  { prop: 'onChange', desc: '上传状态变化回调', type: '(info: UploadChangeParam) => void', default: '-' },
  { prop: 'customRequest', desc: '自定义上传实现', type: '(options) => void', default: '-' },
]
</script>

<DemoBlock :code="UploadDemoCode">
  <UploadDemo />
</DemoBlock>

## API

### TmUpload Props

<TmPropsTable :data="uploadProps" />
