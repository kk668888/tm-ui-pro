// packages/ui/src/validation/types.ts
// 校验工具的公共类型（纯类型文件：零运行时依赖、零 UI 库依赖）
//
// 设计要点（见 openspec change: add-validation-rules / design D1、D4）：
// - 对外 API 是「配置对象一步出规则」：调用方只描述“校验什么”，不感知 ant / vxe 差异
// - 以 type 为判别字段的可辨识联合（discriminated union），编译期即约束各类型该带的参数
// - 文案拆两条：message（格式错）/ requiredMessage（空值），见 spec「提示文案拆分」

/** 正则可表达的校验类型：判据为一段正则，两份适配器产出完全一致的声明式规则 */
export type RegexRuleType = 'ipv4' | 'ipv6' | 'mac' | 'port' | 'phone' | 'email' | 'url'

/** 计算类校验类型：判据含校验位算法，产出自定义校验函数（两份适配器唯一分叉处） */
export type ChecksumRuleType = 'idCard' | 'creditCode'

/** 配置对象公共字段：必填语义 + 双文案 */
export interface BaseRuleConfig {
  /**
   * 是否必填（驱动空值语义，见 spec「空值语义由 required 驱动」）
   * - true：空值不通过，提示 requiredMessage
   * - false / 省略：空值直接通过（由 ant / vxe 原生空值短路行为保证）
   */
  required?: boolean
  /** 格式错误文案；省略时按 type 给默认值 */
  message?: string
  /** 必填（空值）文案；省略时默认「请输入」 */
  requiredMessage?: string
}

/** 正则类配置：无额外参数 */
export interface RegexRuleConfig extends BaseRuleConfig {
  type: RegexRuleType
}

/** 计算类配置：无额外参数（校验位算法内建） */
export interface ChecksumRuleConfig extends BaseRuleConfig {
  type: ChecksumRuleType
}

/** 数值区间配置：闭区间 [min, max]，值须为数值（配 TmInputNumber 等数值控件） */
export interface RangeRuleConfig extends BaseRuleConfig {
  type: 'range'
  min: number
  max: number
}

/** 长度区间配置：字符串长度闭区间 [min, max] */
export interface LengthRuleConfig extends BaseRuleConfig {
  type: 'length'
  min: number
  max: number
}

/** 内置校验配置的判别联合（闭集，编译期约束各类型参数） */
export type ValidationRuleConfig =
  | RegexRuleConfig
  | ChecksumRuleConfig
  | RangeRuleConfig
  | LengthRuleConfig

/**
 * 自定义判据配置：type 为 registerValidator 注册的名字
 * 编译期开放为 string（自定义名无法穷举），运行期由适配器校验“是否已注册”
 */
export interface CustomRuleConfig extends BaseRuleConfig {
  type: string
}

/** 适配器实际接受的入参：内置类型（严格联合）+ 自定义名（开放） */
export type AnyValidationRuleConfig = ValidationRuleConfig | CustomRuleConfig
