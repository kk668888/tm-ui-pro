// packages/ui/src/components/input-password/src/defaults.ts
// 公司默认 props：复用 TmInput 同源默认（allowClear/size/bordered），追加密码专属兜底
// 仅对有限关键属性做强制默认，其余 ant 默认保持原样
import type { InputProps } from 'ant-design-vue'
import { tmInputDefaults } from '../../input/src/defaults'

/**
 * TmInputPassword 公司默认值集合
 * - allowClear / size / bordered：spread 复用 tmInputDefaults（与 TmInput 单一规范，不复制值）
 * - visibilityToggle: true —— 关键兜底（同 input bordered 2026-08-06 修复的根因）：
 *   类型化 defineProps 生成的 Boolean 运行时 prop 未传时被归一化为 false，
 *   覆盖 ant 内部 `visibilityToggle = true` 解构兜底，可见性切换图标会消失。
 *   必须显式兜底 true；业务显式传 visibilityToggle=false 仍可关闭（useForwardBindings
 *   的 isExplicit 检测父 vnode 原始 props，显式传入优先于公司默认）。
 */
export const tmInputPasswordDefaults: Partial<InputProps & { visibilityToggle?: boolean }> = {
  ...tmInputDefaults,
  visibilityToggle: true,
}
