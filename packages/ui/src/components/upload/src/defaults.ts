// packages/ui/src/components/upload/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 注：不用 `Partial<UploadProps>` 标注（showUploadList 复合类型会展开成
// boolean | ShowUploadListInterface，withDefaults 的 InferDefault 不接受），改用 as const 精确字面量。
export const tmUploadDefaults = {
  /**
   * showUploadList 默认 true（Boolean/Object 复合类型陷阱兜底）：
   * ant Upload 的 showUploadList 类型是 Boolean|Object，默认显示文件列表；
   * 类型化 defineProps 对含 Boolean 的复合类型未传时可能解析为 false，
   * 导致已上传文件列表不展示。显式兜底 true 还原「显示列表」默认语义。
   */
  showUploadList: true,
} as const
