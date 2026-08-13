// packages/ui/src/components/float-button/src/props.ts
// TmFloatButton 类型定义：ant 原生 FloatButtonProps / FloatButtonGroupProps / BackTopProps
// 类型从模块级深层导入（ant 无 exports map，路径稳定），与运行时命名空间子组件注册对齐
import type {
  FloatButtonProps,
  FloatButtonGroupProps,
  BackTopProps,
} from 'ant-design-vue/es/float-button'

/** TmFloatButton = ant 原生 FloatButtonProps */
export type TmFloatButtonProps = FloatButtonProps
/** TmFloatButtonGroup = ant 原生 FloatButtonGroupProps */
export type TmFloatButtonGroupProps = FloatButtonGroupProps
/** TmFloatButtonBackTop = ant 原生 BackTopProps（承接 ant 移除的独立 BackTop 能力） */
export type TmFloatButtonBackTopProps = BackTopProps

// 类型透传：业务方可直接 import 上述 Tm*Props / ant 原生类型
export type {
  FloatButtonProps,
  FloatButtonGroupProps,
  BackTopProps,
} from 'ant-design-vue/es/float-button'
