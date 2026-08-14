// packages/ui/src/components/modal/index.ts
// TmModal 出口：组件式 + 命令式静态方法（Object.assign 合并）
// - 组件式：<TmModal v-model="open">（withInstall 注册）
// - 命令式：TmModal.confirm/info/success/error/warning（读 feedbackHolder，降级 ant 全局）
import type { App, Component } from 'vue'
import Modal from './src/Modal.vue'
import { withInstall } from '../../utils/withInstall'
import { TmModalConfirm, type ModalFuncs } from './src/confirm'

/** TmModal = 组件（可 app.use / 模板用）+ 命令式静态方法（任意位置调用） */
export const TmModal = Object.assign(withInstall(Modal, 'TmModal'), TmModalConfirm) as Component & {
  install: (app: App) => void
} & ModalFuncs
// 类型再导出：业务方可直接 import { TmModalProps, ModalProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export { TmModalConfirm } from './src/confirm'
export default TmModal
