// packages/ui/src/components/checkable-tag/src/props.ts
// TmCheckableTag 类型定义：选中态是唯一核心 prop（ant CheckableTagProps 未从主入口导出，自声明）
// 样式类等其余属性经 $attrs 透传

/** TmCheckableTag 的受检选中契约 */
export interface TmCheckableTagProps {
  /** 业务侧 v-model:checked 绑定值；点击切换经 update:checked 事件回写 */
  checked?: boolean
}
