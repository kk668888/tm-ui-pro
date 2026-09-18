// packages/ui/src/components/auto-complete/src/options.ts
// TmAutoCompleteOption / TmAutoCompleteOptGroup：ant 顶层导出的别名复用（design D2，同 select/src/options.ts）
import { AutoCompleteOption, AutoCompleteOptGroup } from 'ant-design-vue'
import { withInstall } from '../../../utils/withInstall'

export const TmAutoCompleteOption = withInstall(AutoCompleteOption, 'TmAutoCompleteOption')
export const TmAutoCompleteOptGroup = withInstall(AutoCompleteOptGroup, 'TmAutoCompleteOptGroup')

export default { TmAutoCompleteOption, TmAutoCompleteOptGroup }
