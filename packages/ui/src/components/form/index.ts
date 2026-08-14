// packages/ui/src/components/form/index.ts
// TmForm / TmFormItem 出口：通过 withInstall 附加 Vue 插件 install 方法
// 既可 app.use(TmForm) / app.use(TmFormItem) 分别注册，也可直接当组件用
//
// 设计要点（plan-bug #5）：
// - 本模块含两个组件（Form + FormItem），与单组件模块（Button/Input/Select）不同。
// - 命名导出 TmForm / TmFormItem：src/index.ts 聚合时分别注册，确保 app.use(@kibus/tm-ui-plus) 后两者均可用。
// - default export 提供对象形态 { TmForm, TmFormItem }，便于直接 import form from '.../form' 后
//   解构使用；与单组件模块的 `export default TmXxx` 形态不同，但符合多组件模块的自然形态。
import Form from './src/Form.vue'
import FormItem from './src/FormItem.vue'
import { withInstall } from '../../utils/withInstall'

export const TmForm = withInstall(Form, 'TmForm')
export const TmFormItem = withInstall(FormItem, 'TmFormItem')

// 类型透传：业务方可直接 import { FormProps, FormInstance, FormItemProps, TmFormProps } from '@kibus/tm-ui-plus'
export type { FormProps, FormInstance, FormItemProps, FormItemInstance } from 'ant-design-vue'
export type { TmFormProps, TmFormExtProps } from './src/props'

export default { TmForm, TmFormItem }
