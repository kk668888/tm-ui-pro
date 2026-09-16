// packages/ui/src/validation/predicates/index.ts
// 判据内核出口：正则类 / 比较类 / 计算类统一汇总
// 本目录是纯函数内核——禁止 import ant / vxe（design「Goals」：内核零 UI 库耦合）
export * from './regex'
export * from './compare'
export * from './checksum'
