// packages/ui/src/components/statistic/src/props.ts
// TmStatistic 类型定义：ant 原生 StatisticProps；TmCountdownProps 用 ExtractPropTypes 取原生 props
import type { ExtractPropTypes } from 'vue'
import type { StatisticProps } from 'ant-design-vue'
import type { countdownProps } from 'ant-design-vue/es/statistic/Countdown'

/** TmStatistic = ant 原生 StatisticProps */
export type TmStatisticProps = StatisticProps

/**
 * ant Countdown 原生 props
 * 注：CountdownProps 定义在 ant-design-vue/es/statistic/Countdown 内部，跨包深层类型无法被
 * compiler-sfc 的 defineProps<T> 解析，故用 ExtractPropTypes<ReturnType<typeof countdownProps>>
 * 取原生 props（与 Tag 同模式，成功验证过）
 */
type CountdownBaseProps = Partial<ExtractPropTypes<ReturnType<typeof countdownProps>>>

/** TmCountdown = ant Countdown 原生 props（ExtractPropTypes 部分） */
export type TmCountdownProps = CountdownBaseProps

// 类型透传：业务方可直接 import TmStatisticProps / TmCountdownProps / StatisticProps
export type { StatisticProps } from 'ant-design-vue'
