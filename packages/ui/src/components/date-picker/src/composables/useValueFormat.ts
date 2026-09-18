// packages/ui/src/components/date-picker/src/composables/useValueFormat.ts
// useValueFormat / useRangeValueFormat：Dayjs ↔ string 双向桥接（design.md 决策 2）
//
// 未配置 valueFormat：modelValue 为 Dayjs（单）/ [Dayjs,Dayjs]（区间），零转换直通。
// 配置 valueFormat：业务 modelValue 为字符串（单）/ [string,string]（区间），
// get 用 dayjs(v, valueFormat) 转 Dayjs 交给 ant，set 用 Dayjs.format(valueFormat) 转回字符串 emit。
//
// ── 关于 dayjs 插件依赖（2026-09-18 复核记录，勿「顺手删注释」）─────────────
// 「按格式解析」dayjs(str, format) 与部分 token 的输出依赖 dayjs 插件：
//   · customParseFormat —— 非 ISO 串的按格式解析（如 '09:00' + HH:mm）
//   · advancedFormat + weekOfYear —— `Q`（季度）/ `wo`（周序号）等 token 的格式化输出
// 本文件不自行 extend，依赖的是 ant-design-vue 模块加载时的副作用已完成扩展。
// 实测（node，packages/ui 内）：未加载 ant 时 dayjs('09:00','HH:mm').isValid() === false、
// dayjs('2026-09-01').format('YYYY-wo') === '2026-wo'（token 退化为字面量）；仅 require
// 'ant-design-vue' 后分别变为 true 与 '2026-36th' —— 即 ant 已扩展所需插件。
// 组件侧安全：Tm 日期组件都从 'ant-design-vue' 导入，其模块体先于任何日期解析执行。
// 风险边界：在不加载 ant-design-vue 的纯 node 脚本里直接调本 composable 解析/格式化，
// 插件未扩展会静默降级——那种场景需在入口自行 dayjs.extend(customParseFormat) 等。
// 回归防线：WeekPicker/QuarterPicker/TimeRangePicker 的 spec 断言**真实往返值**（不能只断言
// dayjs.isDayjs —— Invalid Date 同样是 Dayjs 对象，那样断言会漏掉本问题）。
import { computed, type ComputedRef } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'

/** ant DatePicker 受控值类型（Dayjs | string），inner 与 ant v-model:value 对齐 */
type PickerValue = Dayjs | string

/**
 * 单日期 Dayjs ↔ string 桥接（TmDatePicker 用）
 *
 * @param props 含 modelValue / valueFormat 的组件 props
 * @param emit  值更新回调：接收转换后的 modelValue（调用方负责包装成 update:modelValue 事件）
 * @returns inner computed，直接绑定到 ant DatePicker 的 v-model:value
 */
export function useValueFormat(
  props: { modelValue?: Dayjs | string | null; valueFormat?: string },
  emit: (v: Dayjs | string | null) => void,
): ComputedRef<PickerValue | undefined> {
  return computed<PickerValue | undefined>({
    // parent→child：业务字符串（valueFormat）转 Dayjs；null/空 → undefined 让 ant 显示空
    get: () => {
      const v = props.modelValue
      if (props.valueFormat && typeof v === 'string') {
        if (!v) return undefined
        // 非法日期字符串（isValid=false）返回 undefined 而非 "Invalid Date"，避免渲染乱码
        const parsed = dayjs(v, props.valueFormat)
        return parsed.isValid() ? parsed : undefined
      }
      return (v ?? undefined) as PickerValue | undefined
    },
    // child→parent：ant Dayjs 转业务字符串（valueFormat）；清空 → null
    set: (d: PickerValue | undefined) => {
      if (props.valueFormat) {
        const day = typeof d === 'string' ? (d ? dayjs(d, props.valueFormat) : null) : (d ?? null)
        emit(day ? day.format(props.valueFormat) : null)
      } else {
        emit((d ?? null) as Dayjs | string | null)
      }
    },
  })
}

/** ant RangePicker 受控值类型（[Dayjs,Dayjs] | [string,string]） */
type RangePickerValue = [Dayjs, Dayjs] | [string, string]

/**
 * 区间日期 Dayjs ↔ string 成对桥接（TmRangePicker 用）
 * 任一端为空容错：get 时空端转 undefined 让 ant 显示空；set 时空端 emit null
 *
 * @param props 含 modelValue / valueFormat 的组件 props
 * @param emit  值更新回调：接收转换后的 modelValue（调用方负责包装成 update:modelValue 事件）
 * @returns inner computed，直接绑定到 ant RangePicker 的 v-model:value
 */
export function useRangeValueFormat(
  props: { modelValue?: [Dayjs, Dayjs] | [string, string] | null; valueFormat?: string },
  emit: (v: [Dayjs, Dayjs] | [string, string] | null) => void,
): ComputedRef<RangePickerValue | undefined> {
  const toDay = (v: PickerValue): Dayjs | undefined => {
    if (props.valueFormat && typeof v === 'string') {
      if (!v) return undefined
      // 非法日期字符串（isValid=false）返回 undefined 而非 "Invalid Date"，避免渲染乱码
      const parsed = dayjs(v, props.valueFormat)
      return parsed.isValid() ? parsed : undefined
    }
    return (v as Dayjs | undefined) ?? undefined
  }
  return computed<RangePickerValue | undefined>({
    // parent→child：业务 [string,string] 转 [Dayjs,Dayjs]；null/空对 → undefined
    get: () => {
      const v = props.modelValue
      if (!v) return undefined
      return [toDay(v[0] as PickerValue), toDay(v[1] as PickerValue)] as RangePickerValue
    },
    // child→parent：ant [Dayjs,Dayjs] 转业务 [string,string]；任一端空 emit null（design 容错）
    set: (d: RangePickerValue | undefined) => {
      if (!d) {
        emit(null)
        return
      }
      if (props.valueFormat) {
        const toStr = (x: PickerValue): string | null => {
          const day = typeof x === 'string' ? (x ? dayjs(x, props.valueFormat) : null) : (x ?? null)
          return day ? day.format(props.valueFormat) : null
        }
        emit([toStr(d[0]), toStr(d[1])] as [string, string])
      } else {
        emit([d[0] ?? null, d[1] ?? null] as [Dayjs, Dayjs])
      }
    },
  })
}
