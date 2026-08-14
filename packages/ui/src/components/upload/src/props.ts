// packages/ui/src/components/upload/src/props.ts
// TmUpload 类型定义：ant 原生 UploadProps（含受控 fileList / beforeUpload），当前无公司扩展键
import type { UploadProps } from 'ant-design-vue/es/upload'

/**
 * TmUpload = ant 原生 UploadProps
 * - fileList 受控列表（v-model:file-list 双向，ant 原生支持）
 * - beforeUpload 上传前校验（返回 false / 拒绝 Promise 即拦截，ant 原生语义）
 * 公司默认 showUploadList 在 defaults.ts 提供。
 */
export type TmUploadProps = UploadProps

// 类型透传：业务方可直接 import TmUploadProps / UploadProps / UploadFile / UploadChangeParam
export type { UploadProps, UploadListProps, UploadChangeParam, UploadFile } from 'ant-design-vue/es/upload'
