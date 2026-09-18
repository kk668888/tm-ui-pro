// packages/ui/src/components/select/src/options.ts
// TmSelectOption / TmSelectOptGroup：ant 顶层导出的别名复用（design D2）
//
// 为什么是别名而不是 wrapper：ant 父组件（vc-select）识别模板子组件依赖 vnode.type
// 全等或组件内部标记（isSelectOption），任何包裹层都会让识别失效——选项渲染为未知节点。
// withInstall 是「原对象就地附加 install 并返回同一引用」（见 utils/withInstall.ts），
// 别名后 type 全等与内部标记天然保留，行为与原生 <a-select-option> 完全一致。
// 代价：ant 原始组件对象被附加 install 字段（无副作用，ant 组件自身无同名属性）。
import { SelectOption, SelectOptGroup } from 'ant-design-vue'
import { withInstall } from '../../../utils/withInstall'

export const TmSelectOption = withInstall(SelectOption, 'TmSelectOption')
export const TmSelectOptGroup = withInstall(SelectOptGroup, 'TmSelectOptGroup')

export default { TmSelectOption, TmSelectOptGroup }
